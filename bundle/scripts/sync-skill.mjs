// Sync the canonical skill body into the bundle's packaged asset and check
// that the provider DESCRIPTION matches SKILL.md.
//
// Usage:
//   node bundle/scripts/sync-skill.mjs          # write the asset
//   node bundle/scripts/sync-skill.mjs --check  # verify asset and DESCRIPTION
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const skillPath = resolve(here, '../../cp-notebooker/SKILL.md')
const outPath = resolve(here, '../cp-notebooker-skill/assets/cp-notebooker.md')
const indexPath = resolve(here, '../cp-notebooker-skill/src/index.ts')
const check = process.argv.includes('--check')

const raw = await readFile(skillPath, 'utf8')
const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
if (!frontmatter) throw new Error('No YAML frontmatter found in SKILL.md')
const body = raw.slice(frontmatter[0].length)

const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim()
if (!description) throw new Error('No description field found in SKILL.md frontmatter')

const source = await readFile(indexPath, 'utf8')
const constant = source.match(/const DESCRIPTION\s*=\s*\n?\s*'([^']*)'/s)?.[1]
if (!constant) throw new Error('Could not read DESCRIPTION from src/index.ts')

if (constant !== description) {
  console.error('DESCRIPTION mismatch between SKILL.md and src/index.ts:')
  console.error(`  SKILL.md:     ${description}`)
  console.error(`  src/index.ts: ${constant}`)
  process.exit(1)
}

if (check) {
  const current = await readFile(outPath, 'utf8').catch(() => '')
  if (current !== body) {
    console.error(`Skill asset is out of sync: ${outPath}`)
    console.error('Run `node bundle/scripts/sync-skill.mjs` to update it.')
    process.exit(1)
  }
  console.log('Skill asset and DESCRIPTION are up to date')
} else {
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, body, 'utf8')
  console.log(`Synced skill body -> ${outPath}`)
}
