# Product Plan

## Positioning

Rekordbox Amigo is a library doctor and creative prep assistant for DJs.

It starts with a safe audit, then helps DJs tag, search, and prepare sets with an Amigo-style CLI conversation.

## MVP

- Parse Rekordbox XML.
- Build an audit report.
- Detect missing files, duplicate file locations, likely duplicate title/artist pairs, and metadata gaps.
- Generate Markdown and JSON outputs.
- Offer local tagging suggestions.
- Offer chapter-based set-prep prompts with context, vibe, energy curve, and anchor track.
- Publish a Vercel product surface with a browser-local XML audit, install instructions, and privacy-first positioning.

## Wedge

The audit is the lead magnet, not the moat. The moat is what happens after the audit:

- Amigo turns findings into the next action.
- Personal taxonomy work makes tags feel like the DJ's own language.
- Set planning uses narrative arcs instead of only utility cleanup.
- Local-first privacy makes library intelligence feel safer than cloud-first competitors.

## v1 Paid Product

- Hosted account history only if the DJ explicitly opts in.
- Persistent local library snapshots.
- Before/after progress tracking.
- DJ-defined taxonomy profiles.
- Exportable comment/tag suggestions.
- Smart playlist ideas by mood, energy, genre, BPM, and context.
- Batch review workflow before applying changes manually.

## Future AI Product

- Audio-feature analysis integrations.
- Conversational library coaching.
- Track-to-track bridge suggestions.
- Set journey builder.
- Personal taxonomy learning loop.
- Team/label library intelligence.

## Safety Rules

- Read-only by default.
- No direct Rekordbox database writes in MVP.
- Reports before edits.
- User approval before any future export/apply workflow.
- Clear distinction between source metadata and suggested metadata.
