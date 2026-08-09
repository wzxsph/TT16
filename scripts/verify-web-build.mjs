import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { DIMENSIONS, GROUPS, GUIDES, PROFILE_CODES, PROFILES } from '../packages/core/dist/index.js'

const output = path.resolve(process.argv[2] || 'dist/web')
const expectedAssetBase = process.argv[3] || '/'
const configuredSite = process.env.TT16_SITE_URL || 'https://wzxsph.github.io/TT16/'
const expectedSite = new URL(configuredSite.endsWith('/') ? configuredSite : `${configuredSite}/`)
const expectedCanonical = (route) => new URL(route.replace(/^\//, ''), expectedSite).toString()

function assert(condition, message) {
  if (!condition) throw new Error(`Web build verification failed: ${message}`)
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const target = path.join(directory, entry.name)
    files.push(...(entry.isDirectory() ? await listFiles(target) : [target]))
  }
  return files
}

const indexable = [
  '/', '/types/', ...PROFILE_CODES.map((code) => `/types/${code}/`),
  ...GROUPS.map((group) => `/groups/${group.slug}/`),
  '/dimensions/', ...DIMENSIONS.map((dimension) => `/dimensions/${dimension.slug}/`),
  '/compare/', '/tools/review/', '/guides/',
  ...GUIDES.map((guide) => `/guides/${guide.slug}/`),
  '/methodology/', '/privacy/', '/about/',
]
const noindex = ['/test/', '/result/', '/guess/', ...PROFILE_CODES.map((code) => `/types/${code}/print/`)]
const routes = [...indexable, ...noindex]
const routeFile = (route) => path.join(output, route === '/' ? 'index.html' : route.slice(1), route === '/' ? '' : 'index.html')
const extract = (html, pattern, label, route) => {
  const match = html.match(pattern)
  assert(match, `${route} is missing ${label}`)
  return match[1]
}

const titles = new Set()
const descriptions = new Set()
const canonicals = new Set()
const canonicalByRoute = new Map()

for (const route of routes) {
  const file = routeFile(route)
  assert((await stat(file)).isFile(), `missing prerendered route ${route}`)
  const html = await readFile(file, 'utf8')
  const title = extract(html, /<title>([^<]+)<\/title>/, 'title', route)
  const description = extract(html, /<meta name="description" content="([^"]+)"\s*\/>/, 'description', route)
  const canonical = extract(html, /<link rel="canonical" href="([^"]+)"\s*\/>/, 'canonical', route)
  const ogTitle = extract(html, /<meta property="og:title" content="([^"]+)"\s*\/>/, 'Open Graph title', route)
  const ogUrl = extract(html, /<meta property="og:url" content="([^"]+)"\s*\/>/, 'Open Graph URL', route)
  const ogImage = extract(html, /<meta property="og:image" content="([^"]+)"\s*\/>/, 'Open Graph image', route)
  const robots = extract(html, /<meta name="robots" content="([^"]+)"\s*\/>/, 'robots directive', route)

  assert(title === ogTitle, `${route} title and Open Graph title differ`)
  assert(canonical === ogUrl, `${route} canonical and Open Graph URL differ`)
  assert(/^https:\/\//.test(canonical), `${route} canonical is not HTTPS`)
  assert(/^https:\/\//.test(ogImage), `${route} Open Graph image is not absolute HTTPS`)
  assert(canonical === expectedCanonical(route), `${route} canonical does not match TT16_SITE_URL`)
  assert(html.includes('data-prerendered="true"'), `${route} has no prerendered body`)

  if (indexable.includes(route)) {
    assert(robots === 'index, follow', `${route} must be indexable`)
    assert(!titles.has(title), `duplicate indexable title: ${title}`)
    assert(!descriptions.has(description), `duplicate indexable description: ${description}`)
    titles.add(title)
    descriptions.add(description)
  } else {
    assert(robots === 'noindex, nofollow', `${route} must be noindex`)
  }
  assert(!canonicals.has(canonical), `duplicate canonical: ${canonical}`)
  canonicals.add(canonical)
  canonicalByRoute.set(route, canonical)
}

for (const code of PROFILE_CODES) {
  const detail = await readFile(routeFile(`/types/${code}/`), 'utf8')
  const printable = await readFile(routeFile(`/types/${code}/print/`), 'utf8')
  assert(detail.includes(PROFILES[code].name), `${code} detail did not prerender its profile copy`)
  assert(printable.includes('A4 PERSONALITY SHEET'), `${code} printable sheet is incomplete`)
  for (const variant of ['personalities-v2', 'og']) {
    const extension = variant === 'og' ? 'png' : 'webp'
    assert((await stat(path.join(output, 'images', variant, `${code}.${extension}`))).isFile(), `missing ${variant}/${code}.${extension}`)
  }
  const metadata = await sharp(path.join(output, 'images', 'og', `${code}.png`)).metadata()
  assert(metadata.width === 1200 && metadata.height === 630, `${code} Open Graph image must be 1200×630`)
}
const siteOg = await sharp(path.join(output, 'images', 'og', 'site.png')).metadata()
assert(siteOg.width === 1200 && siteOg.height === 630, 'site Open Graph image must be 1200×630')

const files = await listFiles(output)
const htmlCount = files.filter((file) => file.endsWith('index.html')).length
assert(htmlCount === routes.length, `expected ${routes.length} prerendered HTML files, found ${htmlCount}`)
const artifactText = (await Promise.all(files.filter((file) => /\.(?:html|js|css|xml|txt)$/.test(file)).map((file) => readFile(file, 'utf8')))).join('\n')
for (const forbidden of ['/api/v1/', 'mock-confirm', 'PAYMENT_MODE', 'createOrder(', 'D1Database', 'reportToken', 'entitlementId']) {
  assert(!artifactText.includes(forbidden), `commercial runtime marker found: ${forbidden}`)
}
assert(artifactText.includes('@media print'), 'print stylesheet is missing')
const rootHtml = await readFile(routeFile('/'), 'utf8')
assert(rootHtml.includes(`${expectedAssetBase}assets/`), `asset URLs do not use ${expectedAssetBase}`)
const guessHtml = await readFile(routeFile('/guess/'), 'utf8')
assert(guessHtml.includes('正在准备本地题库'), 'guess route is missing its local lazy-load shell')
assert(guessHtml.includes('noindex, nofollow'), 'guess route must remain noindex')
assert(!rootHtml.includes('GuessFlow-'), 'adaptive question chunk must not be preloaded by the home page')
assert(files.some((file) => /GuessFlow-[^/]+\.js$/.test(file)), 'adaptive guess route did not produce a lazy JavaScript chunk')

const sitemap = await readFile(path.join(output, 'sitemap.xml'), 'utf8')
for (const route of indexable) assert(sitemap.includes(canonicalByRoute.get(route)), `${route} is missing from sitemap`)
for (const route of noindex) assert(!sitemap.includes(canonicalByRoute.get(route)), `${route} leaked into sitemap`)

console.log(`Web build verified: ${routes.length} routes, ${PROFILE_CODES.length} profile sheets, unique metadata and no commercial runtime.`)
