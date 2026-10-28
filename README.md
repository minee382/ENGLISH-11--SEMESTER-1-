# English Success 11

Phase 3 is a targeted Unit 1 update to the existing working application.

- Preserves all 470 vocabulary records, grammar lessons, original activities, navigation and progress key.
- Unit 1: 50 grammar questions, 124 vocabulary questions and 16 reading/cloze/arrangement questions; 190 unique questions in its shared exam pool.
- 70 source-based additions from the original uploaded Unit 1 DOCX materials.
- Practice Setup defaults to mixed focus/types, 20 questions, mixed difficulty.
- Quick 10, Standard 20, Intensive 30, legacy short 5 and Review Mistakes.
- Persistent question/attempt history, unseen-first selection, safe answer shuffling and honest caps for short banks.
- Correct answers after submission; mistakes saved into the existing notebook.

## Run and verify

```sh
npm ci
npm test
npm run build
```

Serve `dist/` with a static HTTP server. `GeminiCanvas_App.jsx` is a self-contained export of the same updated source for a single-file React Canvas environment with React, lucide-react and Tailwind available. No direct edit to Gemini Canvas is claimed.

See `audit/PHASE3_REPORT.md`, `audit/before.json`, `audit/after.json` and `audit/source-manifest.json` for actual counts, duplicate content, source provenance, tests, limits and changed components. Question banks and replay logic remain separate from UI in the modular source.

The 70 imported questions have actual document references. Legacy authored questions are labelled as existing Phase 2 content, and vocabulary-meaning prompts as generated from existing vocabulary records. They are not falsely attributed to numbered DOCX exercises. Unit 2 contains two existing duplicate prompts, preserved in source but excluded from a practice session.

History is browser/origin-local. It does not automatically sync between Gemini Canvas, the hosted demo, browsers or devices. Existing progress is retained; exports/imports include the new replay history. No content is manufactured to reach a requested session size.

Recovery source: Phase 2 commit `29e0598c8d3a1360a1db526946b68ca00e244f4f`, tag `phase2-working-20261028`, saved hosted version 1, or the included Phase 2 backup. Compare a newer Gemini copy before applying the Phase 2 incremental patch.
