export type CommercialEventName =
  | 'landing_view'
  | 'test_start'
  | 'question_answer'
  | 'test_complete'
  | 'paywall_view'
  | 'payment_start'
  | 'payment_success'
  | 'report_view'
  | 'card_generate'
  | 'share_click'
  | 'refund_request'
  | 'delivery_error'

type EventContext = {
  sessionId?: string
  orderId?: string
  channel?: string
  questionnaireVersion?: string
  priceVersion?: string
  paywallVersion?: string
  reportVersion?: string
  properties?: Record<string, string | number | boolean | null>
}

const VISITOR_KEY = 'tt16:visitor:v1'
const PAGE_VERSION = 'commercial-web-1.1.0'

function randomId(prefix: string): string {
  const random = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `${prefix}_${random}`
}

function visitorId(): string {
  const existing = localStorage.getItem(VISITOR_KEY)
  if (existing) return existing
  const created = randomId('visitor')
  localStorage.setItem(VISITOR_KEY, created)
  return created
}

export function acquisitionChannel(): string | undefined {
  const params = new URLSearchParams(window.location.search)
  return params.get('utm_source') ?? params.get('channel') ?? undefined
}

export function trackCommercialEvent(
  eventName: CommercialEventName,
  context: EventContext = {},
): void {
  const event = {
    eventId: randomId('event'),
    eventName,
    visitorId: visitorId(),
    sessionId: context.sessionId,
    orderId: context.orderId,
    channel: context.channel ?? acquisitionChannel(),
    pageVersion: PAGE_VERSION,
    questionnaireVersion: context.questionnaireVersion,
    priceVersion: context.priceVersion,
    paywallVersion: context.paywallVersion,
    reportVersion: context.reportVersion,
    properties: context.properties ?? {},
  }

  void fetch('/api/v1/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: [event] }),
    keepalive: true,
  }).catch(() => {
    // Analytics must never block the assessment or report delivery path.
  })
}
