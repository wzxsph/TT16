import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import { build } from 'vite'

const appDir = fileURLToPath(new URL('..', import.meta.url))
const repoDir = fileURLToPath(new URL('../../..', import.meta.url))
const requestedMode = process.argv[2] === 'pages' ? 'pages' : 'production'
const outDir = path.join(repoDir, 'dist', requestedMode === 'pages' ? 'pages' : 'web')
const ssrDir = path.join(repoDir, 'dist', 'ssr')
const configFile = path.join(appDir, 'vite.config.ts')

await build({ root: appDir, configFile, mode: requestedMode })
await build({
  root: appDir,
  configFile,
  mode: requestedMode,
  build: {
    ssr: path.join(appDir, 'src', 'entry-server.tsx'),
    outDir: ssrDir,
    emptyOutDir: true,
  },
})

const serverEntry = path.join(ssrDir, 'entry-server.js')
const { render, getPageMeta, PRERENDER_ROUTES } = await import(`${pathToFileURL(serverEntry).href}?v=${Date.now()}`)
const template = await readFile(path.join(outDir, 'index.html'), 'utf8')
const configuredSite = process.env.TT16_SITE_URL || 'https://wzxsph.github.io/TT16/'
const siteBase = new URL(configuredSite.endsWith('/') ? configuredSite : `${configuredSite}/`)

const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const absolute = (route) => new URL(route.replace(/^\//, ''), siteBase).toString()

function renderHead(meta) {
  const canonical = absolute(meta.path)
  const image = absolute(meta.imagePath)
  const robots = meta.noindex ? 'noindex, nofollow' : 'index, follow'
  const breadcrumb = meta.breadcrumbs.length > 1 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: meta.breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  } : null
  return [
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="zh_CN" />`,
    `<meta property="og:site_name" content="TT16" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    breadcrumb ? `<script type="application/ld+json">${JSON.stringify(breadcrumb).replaceAll('<', '\\u003c')}</script>` : '',
  ].filter(Boolean).join('\n    ')
}

for (const route of PRERENDER_ROUTES) {
  const meta = getPageMeta(route)
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(meta.description)}" />`)
    .replace('</head>', `    ${renderHead(meta)}\n  </head>`)
    .replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root" data-prerendered="true">${render(route)}</div>`)
  const relative = route === '/' ? 'index.html' : path.join(route.slice(1), 'index.html')
  const output = path.join(outDir, relative)
  await mkdir(path.dirname(output), { recursive: true })
  await writeFile(output, html)
}

const indexable = PRERENDER_ROUTES.filter((route) => !getPageMeta(route).noindex)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((route) => `  <url><loc>${escapeHtml(absolute(route))}</loc></url>`).join('\n')}\n</urlset>\n`
await writeFile(path.join(outDir, 'sitemap.xml'), sitemap)
await writeFile(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${absolute('/sitemap.xml')}\n`)
