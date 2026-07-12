import { spawn } from 'node:child_process'
import process from 'node:process'

const port = 8790
const externalBaseUrl = process.env.COMMERCIAL_BASE_URL?.replace(/\/$/, '')
const baseUrl = externalBaseUrl ?? `http://127.0.0.1:${port}`
const cwd = process.cwd()

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function request(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const payload = await response.json().catch(() => ({}))
  return { response, payload }
}

function containsForbiddenResultKey(value) {
  const forbidden = new Set(['typeCode', 'profile', 'dimensions', 'pressure', 'report'])
  if (!value || typeof value !== 'object') return false
  if (Array.isArray(value)) return value.some(containsForbiddenResultKey)
  return Object.entries(value).some(([key, nested]) => forbidden.has(key) || containsForbiddenResultKey(nested))
}

async function waitUntilReady(child) {
  let diagnostics = ''
  child.stdout.on('data', (chunk) => { diagnostics = `${diagnostics}${chunk}`.slice(-6000) })
  child.stderr.on('data', (chunk) => { diagnostics = `${diagnostics}${chunk}`.slice(-6000) })

  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Wrangler exited before readiness.\n${diagnostics}`)
    try {
      const health = await request('/api/health')
      if (health.response.ok && health.payload.status === 'ok') return
    } catch {
      // The local Worker is still booting.
    }
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
  throw new Error(`Timed out waiting for the local Worker.\n${diagnostics}`)
}

async function verify() {
  const health = await request('/api/health')
  assert(health.response.status === 200, 'health endpoint should return 200')
  assert(health.payload.checks?.database === 'ok', 'health endpoint should verify D1')

  const created = await request('/api/v1/sessions', {
    method: 'POST',
    body: { sourceChannel: 'automated-acceptance' },
  })
  assert(created.response.status === 201, 'session should be created')
  assert(created.payload.questions?.length === 20, 'commercial questionnaire should contain 20 questions')
  const { sessionId, recoveryToken, questions } = created.payload

  const unauthorizedSave = await request(`/api/v1/sessions/${sessionId}/answers/${questions[0].id}`, {
    method: 'PUT',
    token: 'invalid-token',
    body: { value: -2 },
  })
  assert(unauthorizedSave.response.status === 404, 'cross-session writes should use a non-enumerating 404')

  for (const question of questions) {
    const saved = await request(`/api/v1/sessions/${sessionId}/answers/${question.id}`, {
      method: 'PUT',
      token: recoveryToken,
      body: { value: question.kind === 'pressure' ? 0 : -2 },
    })
    assert(saved.response.ok, `answer ${question.id} should be saved`)
  }

  const [firstComplete, secondComplete] = await Promise.all([
    request(`/api/v1/sessions/${sessionId}/complete`, { method: 'POST', token: recoveryToken, body: {} }),
    request(`/api/v1/sessions/${sessionId}/complete`, { method: 'POST', token: recoveryToken, body: {} }),
  ])
  assert(firstComplete.response.ok && secondComplete.response.ok, 'duplicate completion should be idempotent')
  assert(firstComplete.payload.assessmentId === secondComplete.payload.assessmentId, 'duplicate completion should reuse one assessment')
  assert(!containsForbiddenResultKey(firstComplete.payload), 'paywall payload must not leak result keys')
  assert(!JSON.stringify(firstComplete.payload).includes('RHDP'), 'paywall payload must not leak result code')

  const [firstOrder, secondOrder] = await Promise.all([
    request('/api/v1/orders', {
      method: 'POST',
      token: recoveryToken,
      body: { sessionId },
    }),
    request('/api/v1/orders', {
      method: 'POST',
      token: recoveryToken,
      body: { sessionId },
    }),
  ])
  assert(firstOrder.response.ok && secondOrder.response.ok, 'order creation should succeed')
  assert(firstOrder.payload.orderId === secondOrder.payload.orderId, 'duplicate purchase clicks should reuse one order')
  assert(firstOrder.payload.amountFen === 490, 'price must be determined by the server')
  const orderId = firstOrder.payload.orderId

  const unauthorizedOrder = await request(`/api/v1/orders/${orderId}`, { token: 'invalid-token' })
  assert(unauthorizedOrder.response.status === 404, 'order lookup should require the matching recovery credential')

  const confirmations = await Promise.all([
    request(`/api/v1/orders/${orderId}/mock-confirm`, { method: 'POST', token: recoveryToken, body: {} }),
    request(`/api/v1/orders/${orderId}/mock-confirm`, { method: 'POST', token: recoveryToken, body: {} }),
  ])
  assert(confirmations.every(({ response }) => response.ok), 'concurrent payment confirmations should be idempotent')

  for (const confirmation of confirmations) {
    const report = await request(`/api/v1/reports/${confirmation.payload.reportToken}`)
    assert(report.response.ok, 'issued report token should open a report')
    assert(report.payload.report?.typeCode === 'RHDP', 'report snapshot should contain the expected deterministic type')
  }

  const badRecovery = await request('/api/v1/reports/recover', {
    method: 'POST',
    body: { orderId, recoveryToken: 'invalid-token' },
  })
  assert(badRecovery.response.status === 404, 'invalid recovery should not reveal the order')

  const recovery = await request('/api/v1/reports/recover', {
    method: 'POST',
    body: { orderId, recoveryToken },
  })
  assert(recovery.response.ok && recovery.payload.reportToken, 'valid recovery should issue report access')

  const support = await request('/api/v1/support-cases', {
    method: 'POST',
    body: {
      kind: 'delivery_problem',
      message: '自动化验收：验证订单关联工单可以安全创建。',
      orderId,
      recoveryToken,
    },
  })
  assert(support.response.status === 201 && support.payload.caseId, 'verified users should be able to create a support case')

  const unauthorizedSupport = await request('/api/v1/support-cases', {
    method: 'POST',
    body: {
      kind: 'delivery_problem',
      message: '自动化验收：错误凭证不应创建订单关联工单。',
      orderId,
      recoveryToken: 'invalid-token',
    },
  })
  assert(unauthorizedSupport.response.status === 404, 'support case order linking should require authorization')

  const firstRefund = await request(`/api/v1/orders/${orderId}/refund-request`, {
    method: 'POST',
    token: recoveryToken,
    body: {
      reasonCode: 'acceptance_test',
      message: '自动化验收：验证退款申请进入订单状态机并保持幂等。',
    },
  })
  const secondRefund = await request(`/api/v1/orders/${orderId}/refund-request`, {
    method: 'POST',
    token: recoveryToken,
    body: {
      reasonCode: 'acceptance_test',
      message: '自动化验收：重复提交不应创建第二个退款工单。',
    },
  })
  assert(firstRefund.response.status === 201, 'first refund request should be created')
  assert(secondRefund.response.ok, 'duplicate refund request should be idempotent')
  assert(firstRefund.payload.caseId === secondRefund.payload.caseId, 'duplicate refund should reuse one case')
  assert(secondRefund.payload.orderStatus === 'refund_pending', 'order should remain refund_pending before confirmation')

  const refundConfirmation = await request(`/api/v1/orders/${orderId}/mock-refund`, {
    method: 'POST',
    token: recoveryToken,
    body: {},
  })
  assert(refundConfirmation.response.ok && refundConfirmation.payload.status === 'refunded', 'sandbox refund should complete')

  const revokedReport = await request(`/api/v1/reports/${confirmations[0].payload.reportToken}`)
  assert(revokedReport.response.status === 404, 'refunded report access should be revoked')

  const refundedOrder = await request(`/api/v1/orders/${orderId}`, { token: recoveryToken })
  assert(refundedOrder.payload.status === 'refunded', 'refunded order should be visible in recovery queries')

  return { sessionId, orderId, caseId: support.payload.caseId }
}

const child = externalBaseUrl
  ? null
  : spawn(
      'npx',
      [
        'wrangler',
        'dev',
        '--config',
        'wrangler.commercial.jsonc',
        '--local',
        '--ip',
        '127.0.0.1',
        '--port',
        String(port),
        '--show-interactive-dev-session=false',
      ],
      {
        cwd,
        detached: true,
        env: { ...process.env, CI: '1' },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    )

try {
  if (child) await waitUntilReady(child)
  const result = await verify()
  console.log(`Commercial API acceptance passed at ${baseUrl}: ${JSON.stringify(result)}`)
} finally {
  if (child?.pid && child.exitCode === null) {
    try {
      process.kill(-child.pid, 'SIGTERM')
    } catch {
      // The process group may already have exited after the verification finished.
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 250))
  if (child?.pid && child.exitCode === null) {
    try {
      process.kill(-child.pid, 'SIGKILL')
    } catch {
      // Nothing remains to clean up.
    }
  }
}
