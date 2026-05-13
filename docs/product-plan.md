# Product Plan

## Positioning

Rekordbox Amigo is a library coach and creative prep assistant for Rekordbox users.

It starts with a safe audit, then helps users tag, search, clean, and prepare music with an Amigo-style CLI conversation.

Default strategic path: **General Library Coach**. The audit is the funnel; Amigo-guided cleanup, taxonomy, and set narrative are the product.

The public story should stay broad: bedroom DJs, mobile and wedding DJs, club residents, radio selectors, collectors, and working pros all have the same basic pain: Rekordbox knows there is structure in the library, but it does not help them act on it quickly enough.

## MVP

- Parse Rekordbox XML.
- Build an audit report.
- Detect missing files, duplicate file locations, likely duplicate title/artist pairs, and metadata gaps.
- Generate Markdown and JSON outputs.
- Offer local tagging suggestions.
- Offer chapter-based set-prep prompts with context, vibe, energy curve, and anchor track.
- Match an incoming folder or crate against an XML export before importing or sorting.
- Publish a Vercel product surface with a browser-local XML audit, install instructions, and privacy-first positioning.

## Wedge

The audit is the lead magnet, not the moat. The moat is what happens after the audit:

- Amigo turns findings into the next action.
- Personal taxonomy work makes tags feel like the DJ's own language.
- Set planning uses narrative arcs instead of only utility cleanup.
- Local-first privacy makes library intelligence feel safer than cloud-first competitors.

## v1 Paid Product

- Pricing default: free Audit Lite, EUR 29 one-time Audit Pro, EUR 19/month Amigo Coach.
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
- Shared crew, school, venue, or label library intelligence.

## Safety Rules

- Read-only by default.
- No direct Rekordbox database writes in MVP.
- Reports before edits.
- User approval before any future export/apply workflow.
- Clear distinction between source metadata and suggested metadata.

## Decisions To Keep Visible

- Public audience: all Rekordbox users who need faster library cleanup, tagging, folder matching, or set prep.
- Early beachheads: users with visible pain, such as messy Downloads folders, broken Dropbox paths, duplicate imports, USB prep pressure, or large multi-year libraries.
- Competitive stance: complement Djoid, Lexicon, and Mixed In Key before competing with them.
- Audio analysis is a post-validation decision, not an MVP dependency.
- Naming still needs a deliberate call: Amigo product family versus separate music brand.
