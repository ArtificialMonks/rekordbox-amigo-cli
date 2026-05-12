# Rekordbox Amigo CLI

A safe, read-only first step toward a better DJ library workflow.

`rb-amigo` audits Rekordbox XML exports, spots broken library patterns, and turns the result into practical tagging and set-prep prompts. It is built for DJs who want their library to feel searchable, creative, and performance-ready without risky direct edits to Rekordbox internals.

## What It Does Today

- Reads Rekordbox XML exports.
- Reports missing files, duplicate file paths, likely duplicate tracks, and weak metadata.
- Flags tagging gaps for genre, label, comments, key, BPM, year, rating, and color.
- Produces Markdown or JSON reports.
- Suggests starter tags and set chapters from the audit result.
- Includes an Amigo-style conversational command for guided library work.

## What It Does Not Do Yet

- It does not edit the Rekordbox database.
- It does not overwrite music files.
- It does not copy DJOID or any proprietary feature implementation.
- It does not pretend genre AI is solved. Suggestions are transparent and editable.

## Install

```bash
npm install
npm run build:cli
npm link
```

Then run:

```bash
rb-amigo audit --xml ./rekordbox.xml --format markdown --out ./reports/library-audit.md
rb-amigo tags --audit ./reports/library-audit.json
rb-amigo set-plan --audit ./reports/library-audit.json --hours 3 --context afterhours
rb-amigo amigo
```

## Export Rekordbox XML

Use Rekordbox's XML export/import bridge rather than touching internal database files. In Rekordbox, export or configure an XML library, then point `rb-amigo` at that XML file.

## Product Direction

This repo is both:

1. A real CLI MVP for library audit and tagging support.
2. A Vercel-ready product surface for Artificial Monks to validate demand, collect subscribers, and grow into a larger music-intelligence tool.

See [docs/research.md](./docs/research.md) and [docs/product-plan.md](./docs/product-plan.md).
