# cp-notebooker

A DeepSeek Harness (DSH) skill that turns competitive-programming conversations into a clean, categorized knowledge base.

## What it does

- Answers CP questions, always verifying math/contest facts against the web first.
- Proactively writes concise Markdown notes with LaTeX math.
- Files notes into `notes/<category>/` folders.
- Tags every note from a controlled vocabulary in `tags.txt`.
- Tracks review status per note (`unreviewed` → `llm-reviewed` → `user-reviewed`).
- Opens advanced topics with a prerequisites table and suggests follow-up directions.

## Layout

```
cp-notebooker/            # this skill
├── SKILL.md              # the prompt the agent follows
└── README.md             # this file
```

Notes and tags live in the **target project's root** — the session workspace root — not inside this skill folder or the skill's source repository:

```
project root/
├── tags.txt              # allowed tags, one per line
└── notes/
    ├── algorithms/
    ├── data-structures/
    ├── dynamic-programming/
    ├── graph-theory/
    ├── math/
    ├── number-theory/
    ├── combinatorics/
    ├── geometry/
    ├── strings/
    ├── probability/
    ├── game-theory/
    ├── problems/
    └── misc/
```

## How to use

Install the bundle with `dsh plugin --profile <name> add @xin1z/cp-notebooker-bundle` (or link this folder into your profile's skills directory), then talk about competitive programming as usual. The agent will verify facts, answer, and maintain the notes in the target project.

## Tags workflow

`tags.txt` is the single source of truth for frontmatter tags. The agent reads it before using any tag and asks you before adding or removing one. You can edit the file yourself, but keep the tags that existing notes already use.

## Status meanings

| Status | Meaning | Who sets it |
| --- | --- | --- |
| `unreviewed` | Just written; not yet through the independent review pass | agent (default) |
| `llm-reviewed` | Agent re-checked claims against sources and recorded them in `## Sources` | agent, after the review pass |
| `user-reviewed` | You have reviewed the note | user only |

`unreviewed` does not mean the writing pass skipped verification; it means the separate review pass has not happened yet.

## Frontmatter

```yaml
---
tags:
  - segment-tree
  - data-structures
date: 2026-11-07
status: unreviewed
category: data-structures
---
```

Sources are recorded in the body under `## Sources` (required for `llm-reviewed` notes), not as a frontmatter key.

## License

MIT — see the repository [`LICENSE`](../LICENSE).
