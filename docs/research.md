# Research Notes

## Rekordbox Safety Boundary

- Rekordbox supports XML playlist/library interoperability through its Bridge/imported library flow.
- Public XML format material describes track attributes such as comments, color, rating, BPM, key/tonality, location, and position marks.
- Community experience indicates that My Tag data is not consistently present in Rekordbox XML, so v1 should not depend on My Tag extraction.
- Direct database mutation is out of scope for the MVP. The first product is read-only and report-first.

## DJOID Signals

DJOID's public docs and marketing point toward:

- Import Center as the hub for Rekordbox XML, Serato folders, Traktor NML, Apple Music/iTunes XML, M3U playlists, and folders.
- A preview-before-import flow showing new tracks, already imported tracks, missing files, included playlists, and BPM filters.
- Post-import work in a Recently Imported view with BPM, key, energy, danceability, ratings, tags, and summaries.
- Automatic analysis for cover image, BPM, key, energy, danceability, emotion, genre, and sub-genre.
- Product language around music curation, graph playlists, chapter builder, matching tracks, genre detection, journeys, and signature sound.

User-provided DJOID email excerpts add three practical signals:

- Genre classification is still hard and community-shaped.
- House and Techno are high-priority error areas when popularity and error rate meet.
- DJ growth is framed as a maturity ladder: organized DJ, intentional curator, storytelling DJ, signature artist.

## Opportunity

Artificial Monks can build a complementary CLI-first workflow:

- Start safer than a full library platform.
- Use the Rekordbox XML as a bridge.
- Make tedious library prep conversational and creative.
- Turn audits into subscriber acquisition: free browser-local report, paid tagging packs, future AI assistant.
- Compete less on "library fixer" and more on conversational taxonomy, set narrative, and privacy-first creative guidance.

## Competitive Takeaway

Library audits are useful but not enough as a standalone business. Open-source tools and mature desktop products already cover parts of missing-file, duplicate, and metadata cleanup. Rekordbox Amigo should use audit output as the diagnostic moment, then differentiate through Amigo-guided tagging, personal taxonomy, and set-journey work.
