// Sync the canonical skill body into the bundle's packaged asset.
// Usage: node bundle/scripts/sync-skill.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const skillPath = resolve(here, '../../cp-notebooker/SKILL.md')
const outPath = resolve(here, '../cp-notebooker-skill/assets/cp-notebooker.md')

const raw = await readFile(skillPath, 'utf8')
const m = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)
if (!m) throw new Error('No YAML frontmatter found in SKILL.md')
const body = raw.slice(m[0].length)

await mkdir(dirname(outPath), { recursive: true })
await writeFile(outPath, body, 'utf8')
console.log(`Synced skill body -> ${outPath}`)
