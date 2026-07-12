import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

const root = new URL('../', import.meta.url)
const dist = new URL('../dist/', import.meta.url)

async function listFiles(directory) {
  const entries = await readdir(directory)
  const files = []
  for (const entry of entries) {
    const path = join(directory, entry)
    if ((await stat(path)).isDirectory()) files.push(...await listFiles(path))
    else files.push(path)
  }
  return files
}

function assert(condition, message) {
  if (!condition) throw new Error(`Pages build verification failed: ${message}`)
}

const files = await listFiles(dist.pathname)
const indexPath = join(dist.pathname, 'index.html')
const index = await readFile(indexPath, 'utf8')
const javascript = (
  await Promise.all(
    files.filter((file) => file.endsWith('.js')).map((file) => readFile(file, 'utf8')),
  )
).join('\n')

assert(index.includes('/TT16/assets/'), 'index.html must use the /TT16/ Pages base path')
assert(javascript.includes('free-pages'), 'free runtime marker is missing')
assert(javascript.includes('完整体验免费'), 'free landing-page copy is missing')
assert(javascript.includes('免费完整报告'), 'free report label is missing')
assert(!javascript.includes('/api/v1/'), 'an API endpoint was bundled into the static edition')
assert(!javascript.includes('mock-confirm'), 'Mock payment code was bundled into the static edition')
assert(!javascript.includes('立即解锁 ¥4.9'), 'paywall UI was bundled into the static edition')

for (const code of [
  'RHDP', 'RHDF', 'RHAP', 'RHAF',
  'RTDP', 'RTDF', 'RTAP', 'RTAF',
  'SHDP', 'SHDF', 'SHAP', 'SHAF',
  'STDP', 'STDF', 'STAP', 'STAF',
]) {
  const image = join(dist.pathname, 'images', 'personalities-v2', `${code}.webp`)
  assert(files.includes(image), `missing personality asset ${code}`)
}

console.log(
  `GitHub Pages free build verified: ${files.length} files, no API or payment bundle (${relative(root.pathname, indexPath)}).`,
)
