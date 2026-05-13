# Rekordbox Amigo Strategy Review

## Verdict

The MVP is credible, but the audit is not the product. The audit is the free diagnostic and acquisition surface. The product is the conversation after the audit: Amigo as a library coach that helps DJs tag, prepare, and think about their library like a set narrative.

## Positioning Choice

Choose Path B: **General Library Coach**.

- Free audit as the funnel.
- Conversational tagging and set planning as the paid product.
- Artificial Monks voice as the differentiator.
- CLI plus hosted web as the first two surfaces.
- Avoid direct head-to-head with Djoid and Lexicon on full management or full AI set planning.

## Audience Model

Public story: all Rekordbox users who want less library friction.

The first users can be bedroom DJs, mobile and wedding DJs, club residents, radio selectors, collectors, and working pros. The shared pain is not status; it is friction: broken locations, duplicate imports, unknown files, weak tags, scattered folders, and set prep that takes too long.

Power users with roughly 5,000 to 40,000 tracks are still the deepest paid segment, but they should not define the whole story. The broad promise is: make any Rekordbox library easier to trust.

## Pricing Default

Recommended Scenario 2:

- **Audit Lite:** free browser audit.
- **Audit Pro:** EUR 29 one time for full audit, tagging suggestion pack, and set plan starter pack.
- **Amigo Coach:** EUR 19/month for ongoing coaching, personal taxonomy, unlimited re-audits, and priority support.

Do not make subscription the first touch. Let the free audit create trust first.

## Moat

- **Voice and set narrative:** AM can frame set building like chapters and arcs, not only energy blocks.
- **Conversational taxonomy:** ask the DJ how they distinguish genres and moods, then tag in their words.
- **Agent across surfaces:** CLI, hosted web, future Telegram/Slack/MCP surfaces.

## Competitive Stance

Position as complementary:

- Works alongside Djoid, Lexicon, and Mixed In Key.
- Does not replace them.
- Makes the DJ's library easier to understand before using those tools.

## Product Gaps To Ship Next

- `set-plan --energy wave|low-to-high|flat|double-peak`
- `set-plan --bridge "deep house to organic"`
- `set-plan --avoid "anything played in last 30 days"`
- `taxonomy init`
- `taxonomy show`
- `taxonomy refine "organic vs deep house"`
- `tags --use-taxonomy mine`
- `match-folder --xml ./rekordbox.xml --folder ./Downloads/new-crate`
- One-line Mac install path.
- Screenshot-friendly report output.

## 90 Day Focus

1. Ship and polish hosted audit.
2. Ship conversational tag suggestion flow.
3. Publish three cornerstone posts:
   - "The rekordbox library you didn't know you had."
   - "Why I stopped trusting rekordbox's genre tags."
   - "A set arc you can build tonight from your existing library."
4. A/B test EUR 29 Audit Pro versus EUR 19/month Coach.
5. Decide audio analysis path only after real user demand.

## Open Decisions

- Keep `rb-amigo` as part of the Amigo product family or split into a separate music brand.
- Audio analysis: build, buy, partner, or punt.
- Djoid relationship: complement or competitor.
- Plan B if Rekordbox XML export weakens in future versions.
- Whether hosted reports store history or remain explicitly session-only.
