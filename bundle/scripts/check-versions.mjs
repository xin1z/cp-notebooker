// Verify that the plugin, bundle, SKILL.md metadata, and bundle dependency
// all declare the same version.
//
// Usage: node bundle/scripts/check-versions.mjs
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))
const plugin = await readJson(resolve(here, '../cp-notebooker-skill/package.json'))
const bundle = await readJson(resolve(here, '../cp-notebooker-bundle/package.json'))
const skill = await readFile(resolve(here, '../../cp-notebooker/SKILL.md'), 'utf8')
const frontmatter = skill.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
const metaVersion = frontmatter.match(/^\s*version:\s*"([^"]+)"/m)?.[1]
const dependency = bundle.dependencies?.['@xin1z/cp-notebooker-skill']

const versions = {
  'cp-notebooker-skill/package.json': plugin.version,
  'cp-notebooker-bundle/package.json': bundle.version,
  'cp-notebooker/SKILL.md metadata.version': metaVersion,
  '@xin1z/cp-notebooker-skill dependency': dependency,
}

const unique = new Set(Object.values(versions))
if (unique.size !== 1 || unique.has(undefined)) {
  console.error('Version mismatch:')
  for (const [where, version] of Object.entries(versions)) console.error(`  ${where}: ${version}`)
  process.exit(1)
}
console.log(`Versions aligned at ${plugin.version}`)
