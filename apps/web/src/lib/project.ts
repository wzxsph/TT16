export const SOURCE_REPOSITORY_URL = 'https://github.com/wzxsph/TT16'

export const SITE_URL = (import.meta.env.TT16_SITE_URL as string | undefined)?.replace(/\/$/, '')
  ?? 'https://wzxsph.github.io/TT16'

export const BASE_PATH = import.meta.env.BASE_URL

export function sitePath(path = ''): string {
  const normalized = path.replace(/^\/+/, '')
  return `${BASE_PATH}${normalized}`
}
