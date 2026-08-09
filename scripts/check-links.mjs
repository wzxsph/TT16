import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', '.wrangler', 'backups'])

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await markdownFiles(target))
    else if (entry.name.endsWith('.md')) files.push(target)
  }
  return files
}

const failures = []
const files = await markdownFiles(root)
for (const file of files) {
  const source = await readFile(file, 'utf8')
  const links = source.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)
  for (const match of links) {
    const raw = match[1].trim().replace(/^<|>$/g, '').split(/\s+["']/)[0]
    if (!raw || raw.startsWith('#') || /^(?:https?:|mailto:)/i.test(raw)) continue
    const local = decodeURIComponent(raw.split('#')[0].split('?')[0])
    if (!local) continue
    const target = path.resolve(path.dirname(file), local)
    try {
      await access(target)
    } catch {
      failures.push(`${path.relative(root, file)} -> ${raw}`)
    }
  }
}

if (failures.length) throw new Error(`Local Markdown link check failed:\n${failures.join('\n')}`)
console.log(`Local Markdown links verified across ${files.length} files.`)
