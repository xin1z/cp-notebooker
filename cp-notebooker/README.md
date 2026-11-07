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

Notes and tags live in the repository root, not inside this folder:

```
repo root/
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
    └── problems/
```

## How to use

Install this skill in your DSH profile, then talk about competitive programming as usual. The agent will verify facts, answer, and maintain the notes for you.

## Tags workflow

`tags.txt` is the single source of truth for frontmatter tags. The agent reads it before using any tag, and asks you before adding a new one. The file is seeded with a starter vocabulary — edit it freely.

## Status meanings

| Status | Meaning | Who sets it |
| --- | --- | --- |
| `unreviewed` | Just written, not yet verified | agent (default) |
| `llm-reviewed` | Agent re-checked claims against sources | agent, after verification |
| `user-reviewed` | You have reviewed the note | user only |

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

## License

MIT — see the repository [`LICENSE`](../LICENSE).
