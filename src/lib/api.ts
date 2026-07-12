import type { CommercialQuestion } from '../data/commercialQuestions'
import type { CommercialAssessmentScore, CommercialQuality } from './commercialScoring'

export type CommercialQuestionView = Pick<
  CommercialQuestion,
  'id' | 'kind' | 'prompt' | 'leftText' | 'rightText' | 'tag' | 'allowNA'
>

export interface ApiSession {
  sessionId: string
  recoveryToken: string
  assessmentVersion: string
  questionnaireVersion: string
  questions: CommercialQuestionView[]
}

export interface RestoredSession {
  sessionId: string
  status: string
  questionnaireVersion: string
  questions: CommercialQuestionView[]
  answers: { questionId: string; value: number | null; answeredAt: string }[]
}

export interface PaywallPayload {
  assessmentId: string
  status: 'paywalled'
  quality: 'eligible'
  product: {
    sku: string
    priceFen: number
    displayPrice: string
    currency: string
    noSubscription: boolean
  }
  priceVersion: string
  paywallVersion: string
  reportOutline: string[]
}

export interface NeedsReviewPayload {
  status: 'needs_review'
  quality: CommercialQuality
}

export interface OrderPayload {
  orderId: string
  status: string
  amountFen: number
  displayAmount: string
  currency: string
  provider: string
  checkout: null | {
    mode: 'sandbox'
    confirmPath: string
    warning: string
  }
  reportToken?: string
}

interface ApiErrorBody {
  error?: {
    code?: string
    message?: string
    requestId?: string
    details?: unknown
  }
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly requestId?: string,
    readonly details?: unknown,
  ) {
    super(message)
  }
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })

  const data = (await response.json().catch(() => ({}))) as T & ApiErrorBody
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error?.code ?? 'request_failed',
      data.error?.message ?? '请求失败，请稍后再试。',
      data.error?.requestId,
      data.error?.details ?? data,
    )
  }
  return data
}

function authHeaders(recoveryToken: string): HeadersInit {
  return { Authorization: `Bearer ${recoveryToken}` }
}

export function createCommercialSession(sourceChannel?: string): Promise<ApiSession> {
  return apiFetch('/api/v1/sessions', {
    method: 'POST',
    body: JSON.stringify({ sourceChannel }),
  })
}

export function restoreCommercialSession(
  sessionId: string,
  recoveryToken: string,
): Promise<RestoredSession> {
  return apiFetch(`/api/v1/sessions/${encodeURIComponent(sessionId)}`, {
    headers: authHeaders(recoveryToken),
  })
}

export function saveCommercialAnswer(
  sessionId: string,
  recoveryToken: string,
  questionId: string,
  value: number | null,
): Promise<{ saved: true; questionId: string; answeredAt: string }> {
  return apiFetch(
    `/api/v1/sessions/${encodeURIComponent(sessionId)}/answers/${encodeURIComponent(questionId)}`,
    {
      method: 'PUT',
      headers: authHeaders(recoveryToken),
      body: JSON.stringify({ value }),
    },
  )
}

export function completeCommercialSession(
  sessionId: string,
  recoveryToken: string,
): Promise<PaywallPayload | NeedsReviewPayload> {
  return apiFetch(`/api/v1/sessions/${encodeURIComponent(sessionId)}/complete`, {
    method: 'POST',
    headers: authHeaders(recoveryToken),
    body: '{}',
  })
}

export function createCommercialOrder(
  sessionId: string,
  recoveryToken: string,
): Promise<OrderPayload> {
  return apiFetch('/api/v1/orders', {
    method: 'POST',
    headers: authHeaders(recoveryToken),
    body: JSON.stringify({ sessionId }),
  })
}

export function getCommercialOrder(
  orderId: string,
  recoveryToken: string,
): Promise<OrderPayload> {
  return apiFetch(`/api/v1/orders/${encodeURIComponent(orderId)}`, {
    headers: authHeaders(recoveryToken),
  })
}

export function confirmSandboxOrder(
  orderId: string,
  recoveryToken: string,
): Promise<{ orderId: string; status: 'fulfilled'; reportToken: string; sandbox: true }> {
  return apiFetch(`/api/v1/orders/${encodeURIComponent(orderId)}/mock-confirm`, {
    method: 'POST',
    headers: authHeaders(recoveryToken),
    body: '{}',
  })
}

export function getCommercialReport(
  reportToken: string,
): Promise<{ entitlementId: string; report: CommercialAssessmentScore }> {
  return apiFetch(`/api/v1/reports/${encodeURIComponent(reportToken)}`)
}

export function getSampleReport(): Promise<{ report: CommercialAssessmentScore; sample: true }> {
  return apiFetch('/api/v1/sample-report')
}

export function recoverCommercialReport(
  orderId: string,
  recoveryToken: string,
): Promise<{ orderId: string; status: string; reportToken?: string }> {
  return apiFetch('/api/v1/reports/recover', {
    method: 'POST',
    body: JSON.stringify({ orderId, recoveryToken }),
  })
}

export function sendCommercialFeedback(
  reportToken: string,
  value: 'like' | 'neutral' | 'unlike',
): Promise<{ accepted: true }> {
  return apiFetch('/api/v1/feedback', {
    method: 'POST',
    body: JSON.stringify({ reportToken, value }),
  })
}

export type SupportCaseKind =
  | 'delivery_problem'
  | 'duplicate_payment'
  | 'refund_request'
  | 'privacy_request'
  | 'other'

export function createCommercialSupportCase(input: {
  kind: SupportCaseKind
  message: string
  contact?: string
  orderId?: string
  recoveryToken?: string
}): Promise<{ caseId: string; status: 'open'; receivedAt: string }> {
  return apiFetch('/api/v1/support-cases', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function requestCommercialRefund(
  orderId: string,
  recoveryToken: string,
  input: { reasonCode?: string; message: string; contact?: string },
): Promise<{
  caseId: string | null
  orderId: string
  status: string
  orderStatus: 'refund_pending' | 'refunded'
}> {
  return apiFetch(`/api/v1/orders/${encodeURIComponent(orderId)}/refund-request`, {
    method: 'POST',
    headers: authHeaders(recoveryToken),
    body: JSON.stringify(input),
  })
}
