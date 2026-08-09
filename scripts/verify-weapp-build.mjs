import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const output = path.resolve('apps/weapp/dist')
const profileCodes = ['RHDP', 'RHDF', 'RHAP', 'RHAF', 'RTDP', 'RTDF', 'RTAP', 'RTAF', 'SHDP', 'SHDF', 'SHAP', 'SHAF', 'STDP', 'STDF', 'STAP', 'STAF']

function assert(condition, message) {
  if (!condition) throw new Error(`WeChat build verification failed: ${message}`)
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

const files = await listFiles(output)
const appConfig = JSON.parse(await readFile(path.join(output, 'app.json'), 'utf8'))
const projectConfig = JSON.parse(await readFile(path.join(output, 'project.config.json'), 'utf8'))
assert(appConfig.pages.length === 7, 'expected seven main-package pages')
assert(appConfig.subPackages?.[0]?.root === 'content', 'content subpackage is missing')
assert(appConfig.subPackages[0].pages.length === 2, 'content subpackage must contain profile and method pages')
assert(projectConfig.appid === 'touristappid', 'committed build must use the placeholder AppID')
assert(projectConfig.miniprogramRoot === './', 'compiled project root must point at the output directory')

for (const code of profileCodes) {
  assert(files.includes(path.join(output, 'content', 'assets', 'personalities-v2', `${code}.webp`)), `missing subpackage portrait ${code}`)
}

const firstPartyScripts = files.filter((file) => file.endsWith('.js') && !['taro.js', 'vendors.js', 'runtime.js'].includes(path.basename(file)))
const corpus = (await Promise.all(firstPartyScripts.map((file) => readFile(file, 'utf8')))).join('\n')
assert(corpus.includes('tt16:assessment:v2'), 'local v2 storage key is missing')
for (const pattern of [
  /\/api\/v1\//,
  /adunit-[a-z0-9-]+/i,
  /PAYMENT_MODE|mock-confirm|createOrder|entitlementId|reportToken|D1Database/,
  /sk-(?:proj-)?[a-z0-9_-]{16,}/i,
]) {
  assert(!pattern.test(corpus), `sensitive or commercial marker matched ${pattern}`)
}

let mainPackageBytes = 0
for (const file of files) {
  if (!path.relative(output, file).startsWith(`content${path.sep}`)) mainPackageBytes += (await stat(file)).size
}
assert(mainPackageBytes < 2 * 1024 * 1024, `main package is ${(mainPackageBytes / 1024 / 1024).toFixed(2)} MiB`)

console.log(`WeChat build verified: ${(mainPackageBytes / 1024).toFixed(0)} KiB main package, 16 subpackage portraits, local-only data flow.`)
