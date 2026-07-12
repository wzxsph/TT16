import {
  COMMERCIAL_ASSESSMENT_VERSION,
  COMMERCIAL_CONTENT_VERSION,
  COMMERCIAL_QUESTIONS,
  COMMERCIAL_QUESTIONNAIRE_VERSION,
  type CommercialQuestionId,
} from '../src/data/commercialQuestions'
import {
  isCommercialAnswerValue,
  scoreCommercialAssessment,
  type CommercialAnswers,
} from '../src/lib/commercialScoring'
import { evaluatePaymentConfiguration, type PaymentMode } from '../src/lib/paymentPolicy'

interface Env {
  DB: D1Database
  ASSETS: Fetcher
  APP_ENV: string
  APP_ORIGIN?: string
  PAYMENT_MODE: PaymentMode
}

type JsonRecord = Record<string, unknown>

interface SessionRow {
  id: string
  recovery_hash: string
  questionnaire_version: string
  source_channel: string | null
  status: string
  created_at: string
  updated_at: string
}

interface ResultRow {
  id: string
  session_id: string
  type_code: string
  score_json: string
}

interface OrderRow {
  id: string
  session_id: string
  result_id: string
  sku: string
  amount_fen: number
  currency: string
  provider: string
  status: string
  created_at: string
  updated_at: string
}

interface EntitlementRow {
  id: string
  order_id: string
  report_id: string
  status: string
}

const PRODUCT_SKU = 'tt16-report-v1'
const PRICE_VERSION = 'price-cny-4.9-v1'
const PAYWALL_VERSION = 'paywall-1.0.0'
const API_PREFIX = '/api/v1'
const COMMERCIAL_EVENT_NAMES = new Set([
  'landing_view',
  'test_start',
  'question_answer',
  'test_complete',
  'paywall_view',
  'payment_start',
  'payment_success',
  'report_view',
  'card_generate',
  'share_click',
  'refund_request',
  'delivery_error',
])
const SUPPORT_CASE_KINDS = new Set([
  'delivery_problem',
  'duplicate_payment',
  'refund_request',
  'privacy_request',
  'other',
])

class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message)
  }
}

function securityHeaders(): Headers {
  return new Headers({
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  })
}

function json(data: unknown, status = 200, requestId?: string): Response {
  const headers = securityHeaders()
  if (requestId) headers.set('X-Request-Id', requestId)
  return new Response(JSON.stringify(data), { status, headers })
}

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const cleaned = value.trim().slice(0, maxLength)
  return cleaned || null
}

async function readJson(request: Request): Promise<JsonRecord> {
  const declaredLength = Number(request.headers.get('content-length') ?? '0')
  if (declaredLength > 64 * 1024) {
    throw new ApiError(413, 'payload_too_large', '请求内容过大。')
  }

  try {
    const data: unknown = await request.json()
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('not an object')
    }
    return data as JsonRecord
  } catch {
    throw new ApiError(400, 'invalid_json', '请求格式无效。')
  }
}

function randomToken(bytes = 32): string {
  const values = new Uint8Array(bytes)
  crypto.getRandomValues(values)
  return btoa(String.fromCharCode(...values))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function randomId(prefix: string): string {
  return `${prefix}_${randomToken(18)}`
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function constantTimeEqual(first: string, second: string): boolean {
  if (first.length !== second.length) return false
  let difference = 0
  for (let index = 0; index < first.length; index += 1) {
    difference |= first.charCodeAt(index) ^ second.charCodeAt(index)
  }
  return difference === 0
}

function bearerToken(request: Request): string | null {
  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) return null
  return authorization.slice(7).trim() || null
}

function assertAllowedOrigin(request: Request, env: Env): void {
  const origin = request.headers.get('origin')
  if (!origin || !env.APP_ORIGIN) return
  if (origin !== env.APP_ORIGIN) {
    throw new ApiError(403, 'origin_not_allowed', '请求来源不受信任。')
  }
}

async function requireSession(request: Request, env: Env, sessionId: string): Promise<SessionRow> {
  const token = bearerToken(request)
  if (!token) throw new ApiError(401, 'session_auth_required', '需要测试恢复凭证。')

  const session = await env.DB.prepare(
    'SELECT id, recovery_hash, questionnaire_version, source_channel, status, created_at, updated_at FROM assessment_sessions WHERE id = ?',
  )
    .bind(sessionId)
    .first<SessionRow>()

  if (!session) throw new ApiError(404, 'session_not_found', '未找到测试会话。')
  const suppliedHash = await sha256(token)
  if (!constantTimeEqual(suppliedHash, session.recovery_hash)) {
    throw new ApiError(404, 'session_not_found', '未找到测试会话。')
  }
  return session
}

async function requireOrder(request: Request, env: Env, orderId: string): Promise<OrderRow> {
  const order = await env.DB.prepare(
    'SELECT id, session_id, result_id, sku, amount_fen, currency, provider, status, created_at, updated_at FROM orders WHERE id = ?',
  )
    .bind(orderId)
    .first<OrderRow>()
  if (!order) throw new ApiError(404, 'order_not_found', '未找到订单。')
  await requireSession(request, env, order.session_id)
  return order
}

async function consumeRateLimit(
  env: Env,
  key: string,
  maximum: number,
  windowSeconds: number,
): Promise<void> {
  const windowStart = Math.floor(Date.now() / 1000 / windowSeconds) * windowSeconds
  await env.DB.prepare(
    `INSERT INTO rate_limits (key, window_start, count) VALUES (?, ?, 1)
     ON CONFLICT(key, window_start) DO UPDATE SET count = count + 1`,
  )
    .bind(key, windowStart)
    .run()
  const row = await env.DB.prepare(
    'SELECT count FROM rate_limits WHERE key = ? AND window_start = ?',
  )
    .bind(key, windowStart)
    .first<{ count: number }>()
  if ((row?.count ?? 0) > maximum) {
    throw new ApiError(429, 'rate_limited', '请求过于频繁，请稍后再试。')
  }
}

function publicQuestions() {
  return COMMERCIAL_QUESTIONS.map((question) => ({
    id: question.id,
    kind: question.kind,
    prompt: question.prompt,
    leftText: question.leftText,
    rightText: question.rightText,
    tag: question.tag,
    allowNA: question.allowNA,
  }))
}

async function createSession(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request)
  const sourceChannel = cleanText(body.sourceChannel, 80)
  const sessionId = randomId('ses')
  const recoveryToken = randomToken()
  const now = new Date().toISOString()

  await env.DB.prepare(
    `INSERT INTO assessment_sessions
      (id, recovery_hash, questionnaire_version, source_channel, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'started', ?, ?)`,
  )
    .bind(
      sessionId,
      await sha256(recoveryToken),
      COMMERCIAL_QUESTIONNAIRE_VERSION,
      sourceChannel,
      now,
      now,
    )
    .run()

  return json(
    {
      sessionId,
      recoveryToken,
      assessmentVersion: COMMERCIAL_ASSESSMENT_VERSION,
      questionnaireVersion: COMMERCIAL_QUESTIONNAIRE_VERSION,
      questions: publicQuestions(),
    },
    201,
  )
}

async function getSession(request: Request, env: Env, sessionId: string): Promise<Response> {
  const session = await requireSession(request, env, sessionId)
  const rows = await env.DB.prepare(
    'SELECT question_id, value, answered_at FROM answers WHERE session_id = ? ORDER BY question_id',
  )
    .bind(sessionId)
    .all<{ question_id: CommercialQuestionId; value: number | null; answered_at: string }>()

  return json({
    sessionId,
    status: session.status,
    questionnaireVersion: session.questionnaire_version,
    questions: publicQuestions(),
    answers: rows.results.map((row) => ({
      questionId: row.question_id,
      value: row.value,
      answeredAt: row.answered_at,
    })),
  })
}

async function saveAnswer(
  request: Request,
  env: Env,
  sessionId: string,
  questionId: string,
): Promise<Response> {
  const session = await requireSession(request, env, sessionId)
  if (!['started', 'in_progress', 'needs_review'].includes(session.status)) {
    throw new ApiError(409, 'session_locked', '当前测试已经生成报告，不能继续修改答案。')
  }

  const question = COMMERCIAL_QUESTIONS.find((item) => item.id === questionId)
  if (!question) throw new ApiError(404, 'question_not_found', '未找到题目。')
  const body = await readJson(request)
  const value = body.value
  if (value === null && !question.allowNA) {
    throw new ApiError(422, 'answer_required', '该题需要选择答案。')
  }
  if (value !== null && !isCommercialAnswerValue(value)) {
    throw new ApiError(422, 'invalid_answer', '答案必须是 -2 到 2 的整数。')
  }

  const now = new Date().toISOString()
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO answers (session_id, question_id, value, answered_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(session_id, question_id)
       DO UPDATE SET value = excluded.value, answered_at = excluded.answered_at`,
    ).bind(sessionId, questionId, value, now),
    env.DB.prepare(
      "UPDATE assessment_sessions SET status = 'in_progress', updated_at = ? WHERE id = ?",
    ).bind(now, sessionId),
  ])

  return json({ saved: true, questionId, answeredAt: now })
}

async function loadAnswers(env: Env, sessionId: string): Promise<CommercialAnswers> {
  const rows = await env.DB.prepare(
    'SELECT question_id, value FROM answers WHERE session_id = ?',
  )
    .bind(sessionId)
    .all<{ question_id: string; value: number | null }>()
  return Object.fromEntries(rows.results.map((row) => [row.question_id, row.value]))
}

function paywallPayload(assessmentId: string) {
  return {
    assessmentId,
    status: 'paywalled',
    quality: 'eligible',
    product: {
      sku: PRODUCT_SKU,
      priceFen: 490,
      displayPrice: '¥4.9',
      currency: 'CNY',
      noSubscription: true,
    },
    priceVersion: PRICE_VERSION,
    paywallVersion: PAYWALL_VERSION,
    reportOutline: [
      '四字母人格与专属称号',
      '四维交易倾向',
      '三种行情中的行为',
      '优势、交易 Bug 与行动守则',
      '专属结果卡',
    ],
  }
}

async function completeSession(request: Request, env: Env, sessionId: string): Promise<Response> {
  const session = await requireSession(request, env, sessionId)
  const existing = await env.DB.prepare(
    'SELECT id, session_id, type_code, score_json FROM assessment_results WHERE session_id = ?',
  )
    .bind(sessionId)
    .first<ResultRow>()
  if (existing) return json(paywallPayload(existing.id))

  if (!['started', 'in_progress', 'needs_review'].includes(session.status)) {
    throw new ApiError(409, 'session_locked', '当前测试状态不能生成报告。')
  }

  const score = scoreCommercialAssessment(await loadAnswers(env, sessionId))
  if (score.quality.level !== 'eligible') {
    const now = new Date().toISOString()
    await env.DB.prepare(
      "UPDATE assessment_sessions SET status = 'needs_review', updated_at = ? WHERE id = ?",
    )
      .bind(now, sessionId)
      .run()
    return json({ status: 'needs_review', quality: score.quality })
  }

  const resultId = randomId('asm')
  const reportId = randomId('rpt')
  const now = new Date().toISOString()
  const scoreJson = JSON.stringify(score)

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO assessment_results
        (id, session_id, type_code, score_json, questionnaire_version, scoring_version, content_version, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      resultId,
      sessionId,
      score.typeCode,
      scoreJson,
      score.versions.questionnaire,
      score.versions.scoring,
      score.versions.content,
      now,
    ),
    env.DB.prepare(
      'INSERT INTO report_snapshots (id, result_id, content_json, created_at) VALUES (?, ?, ?, ?)',
    ).bind(reportId, resultId, scoreJson, now),
    env.DB.prepare(
      "UPDATE assessment_sessions SET status = 'paywalled', completed_at = ?, updated_at = ? WHERE id = ?",
    ).bind(now, now, sessionId),
  ])

  return json(paywallPayload(resultId), 201)
}

async function createOrder(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request)
  const sessionId = cleanText(body.sessionId, 100)
  if (!sessionId) throw new ApiError(400, 'session_required', '缺少测试会话。')
  await requireSession(request, env, sessionId)

  const result = await env.DB.prepare(
    'SELECT id, session_id, type_code, score_json FROM assessment_results WHERE session_id = ?',
  )
    .bind(sessionId)
    .first<ResultRow>()
  if (!result) throw new ApiError(409, 'assessment_not_complete', '请先完成测试并生成报告。')

  const existing = await env.DB.prepare(
    `SELECT id, session_id, result_id, sku, amount_fen, currency, provider, status, created_at, updated_at
     FROM orders WHERE result_id = ? AND sku = ?
     ORDER BY created_at DESC LIMIT 1`,
  )
    .bind(result.id, PRODUCT_SKU)
    .first<OrderRow>()
  if (existing) return json(orderPayload(existing, env))

  const payment = evaluatePaymentConfiguration(env.APP_ENV, env.PAYMENT_MODE)
  if (!payment.commerceReady) {
    throw new ApiError(
      503,
      payment.state === 'adapter_required' ? 'payment_adapter_not_configured' : 'payment_unavailable',
      '支付尚未开放，请稍后再试。',
    )
  }

  const product = await env.DB.prepare(
    'SELECT sku, amount_fen, currency FROM products WHERE sku = ? AND active = 1',
  )
    .bind(PRODUCT_SKU)
    .first<{ sku: string; amount_fen: number; currency: string }>()
  if (!product) throw new ApiError(503, 'product_unavailable', '商品暂不可购买。')

  const orderId = randomId('ord')
  const now = new Date().toISOString()
  await env.DB.prepare(
    `INSERT OR IGNORE INTO orders
      (id, session_id, result_id, sku, amount_fen, currency, provider, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'payment_pending', ?, ?)`,
  )
    .bind(
      orderId,
      sessionId,
      result.id,
      product.sku,
      product.amount_fen,
      product.currency,
      env.PAYMENT_MODE,
      now,
      now,
    )
    .run()

  const order = await env.DB.prepare(
    `SELECT id, session_id, result_id, sku, amount_fen, currency, provider, status, created_at, updated_at
     FROM orders WHERE result_id = ? AND sku = ?`,
  )
    .bind(result.id, product.sku)
    .first<OrderRow>()
  if (!order) throw new ApiError(500, 'order_creation_failed', '订单创建失败，请稍后重试。')
  return json(orderPayload(order, env), order.id === orderId ? 201 : 200)
}

function orderPayload(order: OrderRow, env: Env) {
  return {
    orderId: order.id,
    status: order.status,
    amountFen: order.amount_fen,
    displayAmount: `¥${(order.amount_fen / 100).toFixed(1)}`,
    currency: order.currency,
    provider: order.provider,
    checkout:
      order.provider === 'mock' && env.APP_ENV !== 'production' && order.status === 'payment_pending'
        ? {
            mode: 'sandbox',
            confirmPath: `${API_PREFIX}/orders/${order.id}/mock-confirm`,
            warning: '仅供沙盒和内测环境，不代表真实付款，不会产生扣款。',
          }
        : null,
  }
}

async function issueReportToken(env: Env, entitlementId: string): Promise<string> {
  const token = randomToken()
  await env.DB.prepare(
    `INSERT INTO report_tokens
      (id, entitlement_id, token_hash, status, created_at)
     VALUES (?, ?, ?, 'active', ?)`,
  )
    .bind(randomId('rtk'), entitlementId, await sha256(token), new Date().toISOString())
    .run()
  return token
}

async function grantEntitlement(env: Env, order: OrderRow): Promise<{ token: string; entitlementId: string }> {
  const report = await env.DB.prepare(
    'SELECT id FROM report_snapshots WHERE result_id = ?',
  )
    .bind(order.result_id)
    .first<{ id: string }>()
  if (!report) throw new ApiError(500, 'report_missing', '报告生成失败，请联系客服。')

  const now = new Date().toISOString()
  await env.DB.prepare(
    `INSERT OR IGNORE INTO entitlements (id, order_id, report_id, status, granted_at)
     VALUES (?, ?, ?, 'active', ?)`,
  )
    .bind(randomId('ent'), order.id, report.id, now)
    .run()

  const entitlement = await env.DB.prepare(
    "SELECT id, order_id, report_id, status FROM entitlements WHERE order_id = ? AND status = 'active'",
  )
    .bind(order.id)
    .first<EntitlementRow>()
  if (!entitlement) throw new ApiError(409, 'entitlement_unavailable', '当前订单权益不可用。')

  const token = await issueReportToken(env, entitlement.id)
  return { token, entitlementId: entitlement.id }
}

async function mockConfirm(request: Request, env: Env, orderId: string): Promise<Response> {
  if (env.PAYMENT_MODE !== 'mock' || env.APP_ENV === 'production') {
    throw new ApiError(404, 'not_found', '未找到接口。')
  }
  const order = await requireOrder(request, env, orderId)
  const now = new Date().toISOString()

  if (!['payment_pending', 'paid', 'fulfilled'].includes(order.status)) {
    throw new ApiError(409, 'order_not_payable', '订单当前状态不能确认。')
  }

  if (order.status !== 'fulfilled') {
    await env.DB.batch([
      env.DB.prepare(
        "UPDATE orders SET status = 'fulfilled', paid_at = COALESCE(paid_at, ?), fulfilled_at = ?, updated_at = ? WHERE id = ?",
      ).bind(now, now, now, order.id),
      env.DB.prepare(
        "UPDATE assessment_sessions SET status = 'purchased', updated_at = ? WHERE id = ?",
      ).bind(now, order.session_id),
      env.DB.prepare(
        `INSERT OR IGNORE INTO payment_attempts
          (id, order_id, provider, provider_payment_id, status, callback_digest, created_at, updated_at)
         VALUES (?, ?, 'mock', ?, 'succeeded', ?, ?, ?)`,
      ).bind(
        randomId('pay'),
        order.id,
        `mock_${order.id}`,
        await sha256(`mock-confirm:${order.id}`),
        now,
        now,
      ),
    ])
  }

  const { token } = await grantEntitlement(env, order)
  return json({
    orderId: order.id,
    status: 'fulfilled',
    reportToken: token,
    sandbox: true,
  })
}

async function getOrder(request: Request, env: Env, orderId: string): Promise<Response> {
  const order = await requireOrder(request, env, orderId)
  const response: JsonRecord = orderPayload(order, env)

  if (order.status === 'fulfilled') {
    const entitlement = await env.DB.prepare(
      "SELECT id, order_id, report_id, status FROM entitlements WHERE order_id = ? AND status = 'active'",
    )
      .bind(order.id)
      .first<EntitlementRow>()
    if (entitlement) response.reportToken = await issueReportToken(env, entitlement.id)
  }

  return json(response)
}

async function getReport(request: Request, env: Env, token: string): Promise<Response> {
  const tokenHash = await sha256(token)
  const row = await env.DB.prepare(
    `SELECT rt.id AS token_id, e.id AS entitlement_id, rs.content_json AS content_json
     FROM report_tokens rt
     JOIN entitlements e ON e.id = rt.entitlement_id
     JOIN report_snapshots rs ON rs.id = e.report_id
     WHERE rt.token_hash = ? AND rt.status = 'active' AND e.status = 'active'`,
  )
    .bind(tokenHash)
    .first<{ token_id: string; entitlement_id: string; content_json: string }>()

  if (!row) throw new ApiError(404, 'report_not_found', '报告链接无效或已失效。')
  await env.DB.prepare('UPDATE report_tokens SET last_used_at = ? WHERE id = ?')
    .bind(new Date().toISOString(), row.token_id)
    .run()

  return json({
    entitlementId: row.entitlement_id,
    report: JSON.parse(row.content_json),
  })
}

async function recoverReport(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request)
  const orderId = cleanText(body.orderId, 100)
  const recoveryToken = cleanText(body.recoveryToken, 200)
  if (!orderId || !recoveryToken) {
    throw new ApiError(400, 'recovery_fields_required', '请输入订单号和恢复凭证。')
  }

  const syntheticRequest = new Request(request.url, {
    headers: { Authorization: `Bearer ${recoveryToken}` },
  })
  const order = await requireOrder(syntheticRequest, env, orderId)
  if (order.status !== 'fulfilled') {
    return json({ orderId, status: order.status })
  }

  const entitlement = await env.DB.prepare(
    "SELECT id, order_id, report_id, status FROM entitlements WHERE order_id = ? AND status = 'active'",
  )
    .bind(order.id)
    .first<EntitlementRow>()
  if (!entitlement) throw new ApiError(409, 'entitlement_missing', '订单尚未完成报告交付。')
  return json({ orderId, status: 'fulfilled', reportToken: await issueReportToken(env, entitlement.id) })
}

async function saveFeedback(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request)
  const token = cleanText(body.reportToken, 200)
  const value = cleanText(body.value, 20)
  if (!token || !value || !['like', 'neutral', 'unlike'].includes(value)) {
    throw new ApiError(422, 'invalid_feedback', '反馈内容无效。')
  }

  const tokenHash = await sha256(token)
  const entitlement = await env.DB.prepare(
    `SELECT e.id FROM report_tokens rt
     JOIN entitlements e ON e.id = rt.entitlement_id
     WHERE rt.token_hash = ? AND rt.status = 'active' AND e.status = 'active'`,
  )
    .bind(tokenHash)
    .first<{ id: string }>()
  if (!entitlement) throw new ApiError(404, 'report_not_found', '报告链接无效或已失效。')

  await env.DB.prepare(
    'INSERT INTO feedback (id, entitlement_id, value, content_version, created_at) VALUES (?, ?, ?, ?, ?)',
  )
    .bind(randomId('fb'), entitlement.id, value, COMMERCIAL_CONTENT_VERSION, new Date().toISOString())
    .run()
  return json({ accepted: true }, 201)
}

async function createRefundRequest(request: Request, env: Env, orderId: string): Promise<Response> {
  const order = await requireOrder(request, env, orderId)
  if (order.status === 'refund_pending' || order.status === 'refunded') {
    const existing = await env.DB.prepare(
      `SELECT id, status FROM support_cases
       WHERE order_id = ? AND kind = 'refund_request'
       ORDER BY created_at DESC LIMIT 1`,
    )
      .bind(order.id)
      .first<{ id: string; status: string }>()
    return json({
      caseId: existing?.id ?? null,
      orderId: order.id,
      status: existing?.status ?? (order.status === 'refunded' ? 'resolved' : 'open'),
      orderStatus: order.status,
    })
  }
  if (!['paid', 'fulfilled'].includes(order.status)) {
    throw new ApiError(409, 'refund_not_available', '该订单当前不能申请退款。')
  }
  const body = await readJson(request)
  const reasonCode = cleanText(body.reasonCode, 80) ?? 'other'
  const message = cleanText(body.message, 1000)
  const contact = cleanText(body.contact, 200)
  const caseId = randomId('case')
  const now = new Date().toISOString()
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO support_cases
        (id, order_id, kind, reason_code, status, created_at, updated_at,
         requester_contact, message)
       VALUES (?, ?, 'refund_request', ?, 'open', ?, ?, ?, ?)`,
    ).bind(caseId, order.id, reasonCode, now, now, contact, message),
    env.DB.prepare("UPDATE orders SET status = 'refund_pending', updated_at = ? WHERE id = ?").bind(
      now,
      order.id,
    ),
  ])
  return json({ caseId, orderId: order.id, status: 'open', orderStatus: 'refund_pending' }, 201)
}

async function mockRefund(request: Request, env: Env, orderId: string): Promise<Response> {
  if (env.PAYMENT_MODE !== 'mock' || env.APP_ENV === 'production') {
    throw new ApiError(404, 'not_found', '未找到接口。')
  }
  const order = await requireOrder(request, env, orderId)
  if (!['refund_pending', 'refunded'].includes(order.status)) {
    throw new ApiError(409, 'refund_not_pending', '请先提交退款申请。')
  }
  if (order.status === 'refunded') {
    return json({ orderId: order.id, status: 'refunded', sandbox: true })
  }

  const now = new Date().toISOString()
  await env.DB.batch([
    env.DB.prepare(
      "UPDATE orders SET status = 'refunded', refunded_at = ?, updated_at = ? WHERE id = ?",
    ).bind(now, now, order.id),
    env.DB.prepare(
      "UPDATE entitlements SET status = 'revoked', revoked_at = ? WHERE order_id = ? AND status = 'active'",
    ).bind(now, order.id),
    env.DB.prepare(
      `UPDATE report_tokens SET status = 'revoked', revoked_at = ?
       WHERE entitlement_id IN (SELECT id FROM entitlements WHERE order_id = ?)
         AND status = 'active'`,
    ).bind(now, order.id),
    env.DB.prepare(
      `UPDATE support_cases
       SET status = 'resolved', resolution = 'sandbox_refund_confirmed', updated_at = ?
       WHERE order_id = ? AND kind = 'refund_request' AND status IN ('open', 'in_progress')`,
    ).bind(now, order.id),
    env.DB.prepare(
      `UPDATE payment_attempts SET status = 'refunded', updated_at = ?
       WHERE order_id = ? AND provider = 'mock'`,
    ).bind(now, order.id),
  ])

  return json({ orderId: order.id, status: 'refunded', sandbox: true })
}

async function createSupportCase(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request)
  const kind = cleanText(body.kind, 60)
  const message = cleanText(body.message, 1000)
  const contact = cleanText(body.contact, 200)
  const orderId = cleanText(body.orderId, 100)
  const recoveryToken = cleanText(body.recoveryToken, 200)

  if (!kind || !SUPPORT_CASE_KINDS.has(kind) || !message || message.length < 10) {
    throw new ApiError(422, 'invalid_support_case', '请选择问题类型并补充至少 10 个字的说明。')
  }
  if (!orderId && !contact) {
    throw new ApiError(422, 'contact_required', '无订单请求需要提供一种可回复的联系方式。')
  }

  let verifiedOrderId: string | null = null
  if (orderId) {
    if (!recoveryToken) {
      throw new ApiError(400, 'recovery_fields_required', '订单相关请求需要恢复凭证。')
    }
    const syntheticRequest = new Request(request.url, {
      headers: { Authorization: `Bearer ${recoveryToken}` },
    })
    const order = await requireOrder(syntheticRequest, env, orderId)
    verifiedOrderId = order.id
  }

  const caseId = randomId('case')
  const now = new Date().toISOString()
  await env.DB.prepare(
    `INSERT INTO support_cases
      (id, order_id, kind, reason_code, status, resolution, created_at, updated_at,
       requester_contact, message)
     VALUES (?, ?, ?, ?, 'open', NULL, ?, ?, ?, ?)`,
  )
    .bind(caseId, verifiedOrderId, kind, null, now, now, contact, message)
    .run()

  return json({ caseId, status: 'open', receivedAt: now }, 201)
}

async function collectEvents(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request)
  const items = Array.isArray(body.events) ? body.events.slice(0, 20) : []
  if (items.length === 0) throw new ApiError(422, 'events_required', '没有可记录的事件。')
  const statements: D1PreparedStatement[] = []

  for (const item of items) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue
    const event = item as JsonRecord
    const eventId = cleanText(event.eventId, 100)
    const eventName = cleanText(event.eventName, 60)
    if (!eventId || !eventName || !COMMERCIAL_EVENT_NAMES.has(eventName)) continue
    const properties = event.properties
    if (!properties || typeof properties !== 'object' || Array.isArray(properties)) continue
    const propertiesJson = JSON.stringify(properties)
    if (propertiesJson.length > 4096) continue
    statements.push(
      env.DB.prepare(
        `INSERT OR IGNORE INTO events
          (id, visitor_id, session_id, order_id, event_name, channel, page_version,
           questionnaire_version, price_version, paywall_version, report_version,
           properties_json, created_at, environment)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).bind(
        eventId,
        cleanText(event.visitorId, 100),
        cleanText(event.sessionId, 100),
        cleanText(event.orderId, 100),
        eventName,
        cleanText(event.channel, 80),
        cleanText(event.pageVersion, 40),
        cleanText(event.questionnaireVersion, 40),
        cleanText(event.priceVersion, 40),
        cleanText(event.paywallVersion, 40),
        cleanText(event.reportVersion, 40),
        propertiesJson,
        new Date().toISOString(),
        cleanText(env.APP_ENV, 40) ?? 'unknown',
      ),
    )
  }

  if (statements.length > 0) await env.DB.batch(statements)
  return json({ accepted: statements.length, rejected: items.length - statements.length }, 202)
}

async function route(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname
  const method = request.method.toUpperCase()

  if (!path.startsWith('/api/')) return env.ASSETS.fetch(request)
  if (['GET', 'HEAD'].includes(method) && path === '/api/health') {
    const database = await env.DB.prepare('SELECT 1 AS ok').first<{ ok: number }>()
    const payment = evaluatePaymentConfiguration(env.APP_ENV, env.PAYMENT_MODE)
    const healthy = database?.ok === 1 && payment.configurationValid
    const response = json(
      {
        status: healthy ? 'ok' : 'degraded',
        checks: {
          database: database?.ok === 1 ? 'ok' : 'unavailable',
          paymentConfiguration: payment.state,
        },
        capabilities: { commerce: payment.commerceReady },
        environment: env.APP_ENV,
        paymentMode: env.PAYMENT_MODE,
      },
      healthy ? 200 : 503,
    )
    return method === 'HEAD'
      ? new Response(null, { status: response.status, headers: response.headers })
      : response
  }
  if (method === 'GET' && path === `${API_PREFIX}/sample-report`) {
    const sampleAnswers = Object.fromEntries(
      COMMERCIAL_QUESTIONS.map((question) => [
        question.id,
        question.kind === 'pressure' ? 0 : -2,
      ]),
    )
    return json({ report: scoreCommercialAssessment(sampleAnswers), sample: true })
  }

  if (!['GET', 'HEAD'].includes(method) && path !== `${API_PREFIX}/payments/webhook`) {
    assertAllowedOrigin(request, env)
  }

  const clientKey = request.headers.get('CF-Connecting-IP') ?? 'local'
  await consumeRateLimit(env, `api:${clientKey}`, 180, 60)

  if (method === 'POST' && path === `${API_PREFIX}/sessions`) return createSession(request, env)
  if (method === 'POST' && path === `${API_PREFIX}/orders`) return createOrder(request, env)
  if (method === 'POST' && path === `${API_PREFIX}/reports/recover`) return recoverReport(request, env)
  if (method === 'POST' && path === `${API_PREFIX}/feedback`) return saveFeedback(request, env)
  if (method === 'POST' && path === `${API_PREFIX}/events`) return collectEvents(request, env)
  if (method === 'POST' && path === `${API_PREFIX}/support-cases`) return createSupportCase(request, env)
  if (method === 'POST' && path === `${API_PREFIX}/payments/webhook`) {
    throw new ApiError(501, 'provider_not_configured', '真实支付适配器尚未配置。')
  }

  const sessionMatch = path.match(new RegExp(`^${API_PREFIX}/sessions/([^/]+)$`))
  if (sessionMatch && method === 'GET') return getSession(request, env, sessionMatch[1])

  const answerMatch = path.match(new RegExp(`^${API_PREFIX}/sessions/([^/]+)/answers/([^/]+)$`))
  if (answerMatch && method === 'PUT') {
    return saveAnswer(request, env, answerMatch[1], answerMatch[2])
  }

  const completeMatch = path.match(new RegExp(`^${API_PREFIX}/sessions/([^/]+)/complete$`))
  if (completeMatch && method === 'POST') return completeSession(request, env, completeMatch[1])

  const orderMatch = path.match(new RegExp(`^${API_PREFIX}/orders/([^/]+)$`))
  if (orderMatch && method === 'GET') return getOrder(request, env, orderMatch[1])

  const mockConfirmMatch = path.match(new RegExp(`^${API_PREFIX}/orders/([^/]+)/mock-confirm$`))
  if (mockConfirmMatch && method === 'POST') return mockConfirm(request, env, mockConfirmMatch[1])

  const refundMatch = path.match(new RegExp(`^${API_PREFIX}/orders/([^/]+)/refund-request$`))
  if (refundMatch && method === 'POST') return createRefundRequest(request, env, refundMatch[1])

  const mockRefundMatch = path.match(new RegExp(`^${API_PREFIX}/orders/([^/]+)/mock-refund$`))
  if (mockRefundMatch && method === 'POST') return mockRefund(request, env, mockRefundMatch[1])

  const reportMatch = path.match(new RegExp(`^${API_PREFIX}/reports/([^/]+)$`))
  if (reportMatch && method === 'GET') return getReport(request, env, reportMatch[1])

  throw new ApiError(404, 'not_found', '未找到接口。')
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = randomId('req')
    try {
      return await route(request, env)
    } catch (error) {
      if (error instanceof ApiError) {
        return json(
          {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
              requestId,
            },
          },
          error.status,
          requestId,
        )
      }
      console.error('Unhandled API error', requestId, error)
      return json(
        {
          error: {
            code: 'internal_error',
            message: '服务暂时不可用，请稍后再试。',
            requestId,
          },
        },
        500,
        requestId,
      )
    }
  },
} satisfies ExportedHandler<Env>
