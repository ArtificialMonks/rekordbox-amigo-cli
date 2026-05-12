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
- Offer chapter-based set-prep prompts.
- Publish a Vercel product surface with install instructions and waitlist CTA.

## v1 Paid Product

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
