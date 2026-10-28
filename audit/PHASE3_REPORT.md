# English Success 11 Phase 3 Unit 1 upgrade

The existing Phase 2 source was updated incrementally. This package does not establish that the separate Gemini Canvas copy was changed. No Canvas URL was supplied and no Gemini Canvas connector was available. `GeminiCanvas_App.jsx` is a self-contained export of the same updated components for Canvas, without local module imports.

## Actual imported bank audit

Counts below measure actual app questions, not every question contained in a source paper. Exam pools include the grammar/vocabulary questions: these columns must not be added together.

| Unit | Vocabulary records retained | Unique grammar before → after | Unique vocabulary before → after | Additional exam skills before → after | Unique exam pool before → after | Unique questions added |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 104 | 16 → 50 | 104 → 124 | 0 → 16 | 120 → 190 | 70 |
| 2 | 109 | 16 → 16 | 107 → 107 | 0 → 0 | 123 → 123 | 0 |
| 3 | 120 | 16 → 16 | 120 → 120 | 0 → 0 | 136 → 136 | 0 |
| 4 | 137 | 16 → 16 | 137 → 137 | 0 → 0 | 153 → 153 | 0 |

Unit 2 has 125 question records but 123 unique prompts. The repeated records are preserved; practice selection excludes duplicate content. Its two duplicate prompts are `curfew` (`u2-008`, `u2-088`) and `open-minded` (`u2-009`, `u2-090`). There are no duplicate IDs. No imported question lacks a correct answer or explanation, before or after.

Across all units, eight groups have identical prompt content: the two Unit 2 groups above, plus cross-unit vocabulary prompts `strong`, `strengthen`, `quality`, `culture`, `care about`, `depend on`. These are not counted as new additions. Raw question records: 534 → 604; unique prompt content globally: 526 → 596. Summed unit-specific eligible counts: 532 → 602. Practice is scoped to one unit.

Before this update, the question objects lacked explicit topic, exercise type, difficulty and source-reference metadata. These now exist. Legacy provenance is marked as Phase 2 authored content or a generated meaning prompt based on the supplied vocabulary record; it is not falsely attributed to a numbered DOCX question.

## Unique questions by exercise type

Before: all questions used MCQ answer input; Unit 1 had 16 grammar MCQs and 104 meaning MCQs. Units 2–4 had 16 grammar MCQs each and respectively 107, 120, 137 unique meaning MCQs.

After, the taxonomy describes the exercise skill, with MCQ input except for transformations and arrangements:

| Exercise type | Unit 1 | Unit 2 | Unit 3 | Unit 4 |
| --- | ---: | ---: | ---: | ---: |
| Verb forms | 45 | 16 | 16 | 16 |
| Meaning MCQ | 104 | 107 | 120 | 137 |
| Gap filling | 15 | 0 | 0 | 0 |
| Word formation / part of speech MCQ | 5 | 0 | 0 | 0 |
| Sentence transformation | 5 | 0 | 0 | 0 |
| Sentence arrangement | 3 | 0 | 0 | 0 |
| Cloze test | 6 | 0 | 0 | 0 |
| Reading comprehension | 7 | 0 | 0 | 0 |
| Total unique | 190 | 123 | 136 | 153 |

This first release expands Unit 1 only. Units 2–4 use the shared selection architecture with their original banks; their requested content expansion has not been claimed as complete. Error-correction exercises are not invented where no verified imported item is available.

## Source validation

70 additions come from the original uploaded Unit 1 DOCX materials: 34 grammar, 20 contextual vocabulary, 6 cloze, 3 arrangements, 7 reading questions. Each has a stable ID, actual filename, section/question, zero-based DOCX paragraph indices and Library file identity. Full source hashes and exclusions are in `source-manifest.json`.

`TỜ SỐ 01 UNIT 1 A LONG AND HEALTHY LIFE.docx`: selected exercises 1, 2, 4 and 7. `TỜ SỐ 02 TEST 01 UNIT 1 A LONG AND HEALTHY LIFE.docx`: selected reading questions 33–38 and 40. Tờ 03 and Tờ 04 were inspected but not imported in this release.

Answers and Vietnamese explanations were independently checked; no supplied answer key was available. Ambiguous/incomplete source items were excluded. The sleep passage has one documented grammar correction: “complain for a lack of sleep” → “complain about a lack of sleep”. Its question 32 is excluded. The new questions are source imports, not manufactured variants or reordered-option duplicates. Passage IDs keep reading and cloze questions attached to their own complete text.

Legacy vocabulary-practice distractors now avoid known equivalent meanings such as healthy/fit/in good shape and avoid shared meaningful Vietnamese words. This does not alter vocabulary records or the separate existing Vocab Lab component.

## Practice and persistence

Exam defaults: Unit 1, mixed focus, mixed exercise types, 20 questions, mixed difficulty. Grammar defaults to 10 grammar questions. Quick 10, Standard 20, Intensive 30 and Review Mistakes are available; the existing short 5-question choice is retained.

Selection accepts only structurally validated unique bank questions. It prioritizes never attempted questions, with never displayed questions first within that tier; then uses least-recently-seen order. Unresolved errors are targeted in Review Mistakes and are lower priority in normal practice. It never pads a short filtered bank. It displays the actual available count and caps the session size. Repeats can occur after available fresh content is exhausted.

Question/attempt history uses a new `es11_question_history_v1` key shared by Grammar and Exam. The existing `es11_student_an_progress` key is preserved. No XP, streak, mastered/review words or previous mistakes are reset. Unknown progress fields are preserved, and new history is included in export/import backups. Existing vocabulary mistakes remain reviewable. Browser storage is local to the browser and origin; it does not automatically sync between Gemini Canvas and the hosted demo, devices, or private/incognito sessions. If saving is blocked, the UI reports that cross-session guarantees are unavailable.

Correct answers/explanations appear only after submission; pre-submission downloads contain questions only. Mistakes are added to the existing notebook and successful review removes the corresponding question-error entry. Double submission cannot award XP twice for a session.

## Verification

All 29 automated checks passed, including the original 14 checks. Build passed. `tests/phase3.test.mjs` covers three consecutive submitted 10-question Grammar sessions and three submitted 10-question mixed Exam sessions with history reloaded between each: each produced 30 unique IDs, with no within-session duplicates and correct shuffled answer mapping. It also covers exhaustion, zero results, difficulty/type filters, answer normalization, old mistakes, idempotent submission, unknown progress fields and unavailable storage.

Browser checks passed for the requested Unit 1 mixed/20/mixed defaults and 20 unique questions with no visible answer key. Grammar produced 30 unique questions in three 10-question sessions, including a page reload. Exam produced 30 unique questions in three 10-question sessions. A submission displayed its score, awarded XP once, and added nine actual test errors and their explanations to the notebook. Test history/progress was written only to the local preview origin, not the live app's browser storage. Vocabulary, Grammar, Exam and Games remained accessible; the existing game rendered its full matching activity.

All 470 vocabulary records and all grammar lesson objects compare exactly with the Phase 2 version. Tests also compare the source of NavTab, VocabLabView, FlashcardMode, MultipleChoiceMode, SpellingMode, WordMatchingMode and MiniGamesView against the recovery version; they are unchanged.

## Components modified and recovery

Modified: `PracticeQuiz` (session selection, input types and submission), `GrammarLabView` and `ExamPracticeView` (bank/setup wiring), `MistakesNotebookView` (explanations/source display), progress import/export and `normalizeProgress` (preserve extension fields and question mistakes).

Added: `PracticeSetup.jsx`, `question-bank.mjs`, `unit1-source-bank.json`, `smart-replay.mjs`, targeted tests and audit artifacts. There are no dependency changes or navigation/design rewrites.

Recovery: Phase 2 source commit `29e0598c8d3a1360a1db526946b68ca00e244f4f`, local tag `phase2-working-20261028`, original hosted saved version 1 and `english-11-phase2-backup.zip`. The source was not rebuilt from scratch. Apply the incremental patch only to the matching Phase 2 source; do not overwrite a newer divergent Canvas version without comparing it first.
