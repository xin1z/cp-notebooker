/**
 * Bundled `cp-notebooker` skill provider.
 *
 * Mirrors the official `@deepseek-ai/dsh-skill-badge` provider: registers a
 * single immutable `bundled` candidate whose body is read on demand from a
 * packaged Markdown asset.
 *
 * @module @xin1z/cp-notebooker-skill
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { Context } from '@deepseek-ai/cordis'
import {
  BUNDLED_SKILL_RANK,
  type SkillCandidate,
  type SkillDefinition,
  type SkillProvider,
} from '@deepseek-ai/dsh-skill'

const PROVIDER_NAME = 'cp-notebooker'
const SKILL_BODY_URL = new URL('../assets/cp-notebooker.md', import.meta.url)
const RESOURCE_BASE = {
  kind: 'directory',
  path: fileURLToPath(new URL('../assets/', import.meta.url)),
} as const
const INVOCATION = { modelInvocable: true, userInvocable: true } as const
const DESCRIPTION =
  'Competitive-programming study companion. Verify every CP/math/contest fact via web search, answer questions, and proactively distill concise LaTeX notes into categorized folders in the current project.'

const CANDIDATE: SkillCandidate = {
  name: 'cp-notebooker',
  description: DESCRIPTION,
  invocation: INVOCATION,
  provider: PROVIDER_NAME,
  source: 'bundled',
  resourceBase: RESOURCE_BASE,
  rank: BUNDLED_SKILL_RANK,
  locator: SKILL_BODY_URL,
}

const provider: SkillProvider = {
  name: PROVIDER_NAME,
  list: () => Promise.resolve([CANDIDATE]),
  async get(): Promise<SkillDefinition> {
    return {
      name: CANDIDATE.name,
      description: CANDIDATE.description,
      invocation: CANDIDATE.invocation,
      provider: CANDIDATE.provider,
      source: CANDIDATE.source,
      resourceBase: RESOURCE_BASE,
      content: await readFile(SKILL_BODY_URL, 'utf8'),
    }
  },
}

/** Cordis plugin name (the row id used in cordis.patch.yml). */
export const name = 'cp-notebooker'
/** Service required by the bundled provider. */
export const inject = ['skills']

/** Register the bundled `cp-notebooker` provider on `ctx.skills`. */
export function apply(ctx: Context): void {
  ctx.skills.registerProvider(() => provider)
}
