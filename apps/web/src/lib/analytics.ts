export const ANALYTICS_EVENTS = [
  'assessment_start',
  'assessment_complete',
  'share_open',
  'share_save',
  'compare_open',
  'print_open',
] as const

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number]
export type AnalyticsPreference = 'accepted' | 'declined'

const STORAGE_KEY = 'tt16:analytics:v1'
const ENDPOINT = import.meta.env.TT16_ANALYTICS_ENDPOINT?.trim() ?? ''

function doNotTrackEnabled(): boolean {
  if (typeof navigator === 'undefined') return true
  return navigator.doNotTrack === '1' || String((window as Window & { doNotTrack?: string }).doNotTrack) === '1'
}

export function getAnalyticsPreference(): AnalyticsPreference | null {
  try {
    if (typeof localStorage === 'undefined') return null
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'accepted' || value === 'declined' ? value : null
  } catch {
    return null
  }
}

export function setAnalyticsPreference(value: AnalyticsPreference): void {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Storage restrictions keep analytics disabled and never block the product.
  }
}

function isEnabled(): boolean {
  return Boolean(ENDPOINT) && !doNotTrackEnabled() && getAnalyticsPreference() === 'accepted'
}

function sourceOrigin(): string {
  try {
    return document.referrer ? new URL(document.referrer).origin : ''
  } catch {
    return ''
  }
}

function count(path: string, title: string): void {
  if (!isEnabled()) return
  try {
    const url = new URL(ENDPOINT)
    url.searchParams.set('p', path)
    url.searchParams.set('t', title)
    const source = sourceOrigin()
    if (source) url.searchParams.set('r', source)
    const pixel = new Image()
    pixel.referrerPolicy = 'no-referrer'
    pixel.src = url.toString()
  } catch {
    // Misconfiguration must never affect content or assessment use.
  }
}

export function trackPageView(path: string, title: string): void {
  count(path, title)
}

export function trackEvent(event: AnalyticsEvent): void {
  if (!ANALYTICS_EVENTS.includes(event)) return
  count(`event:${event}`, event)
}

export function analyticsUnavailableByPolicy(): boolean {
  return doNotTrackEnabled()
}
