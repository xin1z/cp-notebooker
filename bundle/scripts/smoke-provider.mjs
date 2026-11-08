// Smoke-test the built provider with a minimal fake context.
// Usage: node bundle/scripts/smoke-provider.mjs
import { apply } from '../cp-notebooker-skill/lib/index.js'

let factory
apply({ skills: { registerProvider(f) { factory = f } } })
if (typeof factory !== 'function') throw new Error('provider was not registered')

const definition = await factory().get()
if (definition.name !== 'cp-notebooker') throw new Error(`unexpected skill name: ${definition.name}`)
if (typeof definition.content !== 'string' || definition.content.length < 1000) {
  throw new Error('skill body is missing or too short')
}
if (!definition.content.includes('notes/misc/')) throw new Error('skill body is missing notes/misc/')
if (!definition.content.includes('## Sources')) throw new Error('skill body is missing ## Sources')
console.log(`provider ok: ${definition.content.length} chars`)
