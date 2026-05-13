# Rekordbox Amigo CLI

A local-first library coach for Rekordbox users and DJs.

`rb-amigo` starts with a safe audit, then helps Rekordbox users decide what to do next: fix broken references, review weak metadata, draft tag suggestions, and shape crates or set arcs. The CLI is the engine; Amigo is the workflow.

The strategic path is **Library Coach**: the audit is the free funnel, and the product is the conversation that turns the audit into a usable cleanup, tagging, and prep system.

Try the browser audit at https://rekordbox-amigo-cli.vercel.app. It runs locally in the browser and does not upload your XML.

## What It Does Today

- Reads Rekordbox XML exports.
- Reports missing files, duplicate file paths, likely duplicate tracks, and weak metadata.
- Flags tagging gaps for genre, label, comments, key, BPM, year, rating, and color.
- Produces Markdown or JSON reports.
- Suggests starter tags and set chapters from the audit result.
- Includes an Amigo-style conversational command for guided library work.
- Builds set-prep prompts with context, vibe, energy curve, and anchor track.

## What It Does Not Do Yet

- It does not edit the Rekordbox database.
- It does not overwrite music files.
- It does not copy DJOID or any proprietary feature implementation.
- It does not pretend genre AI is solved. Suggestions are transparent and editable.

## Install

For most Rekordbox users, the hosted browser audit is the easiest first step. For CLI users, developers, and power users:

```bash
npm install
npm run build:cli
npm link
```

Then run:

```bash
rb-amigo audit --xml ./rekordbox.xml --format markdown --out ./reports/library-audit.md
rb-amigo audit --xml ./rekordbox.xml --format json --out ./reports/library-audit.json
rb-amigo tags --audit ./reports/library-audit.json
rb-amigo set-plan --audit ./reports/library-audit.json --hours 3 --context afterhours --vibe hypnotic --energy wave --anchor "your track" --bridge "deep house to organic"
rb-amigo privacy
rb-amigo amigo
```

## Privacy

Your library is your identity. The first version is local-first:

- The browser audit parses XML in your browser.
- The CLI runs on your machine.
- No direct Rekordbox database writes.
- No automatic cloud backup or silent sync.
- Suggested tags are clearly separate from source metadata.

## Export Rekordbox XML

Use Rekordbox's XML export/import bridge rather than touching internal database files. In Rekordbox, export or configure an XML library, then point `rb-amigo` at that XML file.

## Product Direction

This repo is both:

1. A real CLI MVP for library audit and tagging support.
2. A Vercel-ready product surface for Artificial Monks to validate demand, collect subscribers, and grow into a larger music-intelligence tool.

See [docs/research.md](./docs/research.md), [docs/product-plan.md](./docs/product-plan.md), and [docs/strategy-review.md](./docs/strategy-review.md).
