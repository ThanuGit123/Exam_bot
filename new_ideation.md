# Exam_bot — Ideation Log

**Started:** 2026-06-26  
**Owner:** Vamsi / QuantumGandivaAI  
**Purpose:** Capture and pressure-test feature ideas for Exam_bot, one at a time. This is a living doc — ideas are added as they're discussed, refined collaboratively, then promoted to a plan when ready.

---

## Where the product stands today (grounding for ideas)

Exam_bot is an AI tutor for India's competitive exams (JEE, NEET, UPSC, GATE), built on the Interview_Bot production architecture.

**Built & working:** JWT auth, per-user + per-thread isolation, context management (rolling summary + token-budget trimming + auto-title), live WebSocket streaming with a reasoning strip, structured logging, layered backend (`core/db/models/agent/api/prompts`), React frontend.

**Deferred (the "smart" layer — prime ideation territory):** real answer grading/scoring, RAG (grounding in syllabi / past-year questions), adaptive difficulty, Elo/mastery tracking, weak-topic analytics & reports.

**Tech levers available:** LangGraph agent (extensible with nodes + tools), MongoDB, OpenAI-compatible LLMs (Groq/Cerebras/Mistral), the existing streaming event protocol (`status/token/message_complete/...`).

---

## The core problem & the roadmap

**The product problem.** Aspirants for India's most competitive exams (JEE/NEET/UPSC/GATE) need a tutor that is personal, adaptive, and trustworthy — but human tutors are scarce and expensive, and a generic chatbot:
*   **hallucinates** formulas, facts, and exam patterns,
*   **only answers** questions — it doesn't **grade** your attempt, and
*   doesn't **adapt** to what you keep getting wrong.

**Core problem Exam_bot solves:** a 24/7 tutor that **grounds** answers in the real syllabus (no hallucination), **grades** your answers and shows exactly where you went wrong, and **adapts** difficulty while tracking your weak topics.

**Who it's for / market:** students (B2C) — and coaching centers (B2B) who want scalable 1-on-1 adaptive practice + mock testing for thousands of students. India's test-prep market is large and rank-driven (high willingness to pay). → see **Idea 12**.

**Three pillars that turn a chatbot into a tutor:**
1.  **Grounding** — answers tied to real curriculum + past-year questions (RAG). → *Trust*.
2.  **Evaluation** — grade the student's answer, not just produce one (`reflect`). → *Feedback*.
3.  **Adaptation** — adjust difficulty + track mastery/weak topics over time. → *Personalization*.

**Where we are:** the *platform* is production-shaped (auth, isolation, context mgmt, streaming, logging) but the *intelligence* is a single LLM call — **none of the three pillars are built yet**. That gap is the whole game.

### Roadmap (build order):

| Phase | What | Pillar | Status |
| :--- | :--- | :--- | :--- |
| 0 | Production platform (auth, isolation, context, streaming, logging) | — | ✅ done |
| 1 | Agentic scaffold: `plan` → `act` → `reflect` + status events (Idea 3, Step 1) | sets up all 3 | **next** |
| 2 | RAG: vector DB of syllabi + PYQ; `retrieve_curriculum` tool | Grounding | keystone |
| 3 | Grading + mastery in `reflect`; `grades` collection, Elo, adaptive difficulty | Evaluation + Adaptation | after RAG |
| 4 | Reports + analytics (weak-topic dashboard) | Adaptation | after grading |
| 5 | Settings / personalization (prefs feed the prompt — Idea 1) | Personalization | parallel |

---

## How we'll capture each idea

Each idea uses the template below. Status legend: ▫️ captured → 🔍 exploring → ✅ accepted (ready for a plan) → 🅿️ parked → ❌ dropped

```markdown
### Idea N — <short name>  `status`
- **Problem / motivation:** what student pain or product goal this serves
- **Proposal:** what it does, concretely
- **Fit with current architecture:** which layers it touches (agent node? tool? new collection? new endpoint? frontend?)
- **Effort / dependencies:** rough size + what it needs first (e.g. RAG before grading)
- **Open questions:** unknowns to resolve
- **Decision:** outcome once discussed
```

---

## Existing build — status checklist

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Landing page** (`frontend/src/pages/Home.jsx`) | ✅ done | Hero, features, course bar, CTA. Responsive + dark mode. |
| **Signup / Login / Forgot / Reset** | ✅ done | Wired to `/api/auth/*`, real JWT, token stored via `lib/api.js`; reset = hashed single-use token. |
| **Chat page** (`frontend/src/pages/Chat.jsx`) | ✅ done | Interview_Bot layout — **left:** per-user history + isolation + New Session; **right:** chat panel with live streaming + reasoning strip. |
| **Production persona prompt** (`backend/app/prompts/tutor.md`) | ✅ done | Production-grade: identity → 3 hats (teach/quiz/mentor) → grounding → modes → format → tone → never. |
| **Settings page** | 🔍 exploring | New — see Idea 1. |
| **Complete agentic flow** (`plan` → `act` → `reflect`) | 🔍 exploring | See Idea 3. Currently a single `respond` node. |

---

## Ideas

### Idea 1 — Settings / Preferences page 🔍 exploring
*   **Problem / motivation:** Students want to control their experience and have the tutor adapt to *them* (pace, style, level, default exam). Today there's no settings surface and no personalization. Key idea: a **focused** set of learning preferences injected into the prompt **every turn**, so the tutor stays personalized — embodied, never quoted back.

**Sections (kept focused — only what's useful):**

| Section | Items | Affects tutor? |
| :--- | :--- | :--- |
| **Profile** | display name (editable), email, member-since, current + longest streak | no (stats) |
| 🎓 **How Adept teaches you** (Learning Prefs) | **Target exam** (JEE/NEET/UPSC/GATE) · **Default subject** · **Default difficulty** (Basic/Moderate/Exam-level/Advanced) · **Pace** (gentle/balanced/fast) · **Explanation style** (example-first/concept-first/practice-first) · **Level** (foundation/building/advanced) · **Target exam date** · **Default model** (Groq/Cerebras/Mistral) | **YES — fed into the prompt** |
| ⚙️ **App preferences** (toggles) | dark mode · large text · daily study reminders · email progress recap | mostly cosmetic |
| 🔒 **Security** | email (read-only) · change/reset password · 2FA *(later)* | no |
| **Data & privacy** | view/clear "what Adept remembers" (running summaries) · export my chats · delete history / account · Terms & Privacy | no |
| **Account** | current exam/plan · sign out | no |

**Storage — users sub-documents (Mongo):**
```javascript
learning_prefs: {
  target_exam: "JEE",                 // JEE | NEET | UPSC | GATE
  default_subject: "Physics",
  default_difficulty: "exam-level",   // basic | moderate | exam-level | advanced
  pace: "balanced",                   // gentle | balanced | fast
  style: "example-first",             // example-first | concept-first | practice-first
  level: "building",                  // foundation | building | advanced
  exam_date: "2027-05-01",            // enables countdown + planning
  default_model: "groq",
  onboarded: false
}
app_prefs: {
  dark_mode: false, large_text: false,
  daily_reminders: true, email_notifications: true,
  updated_at: "..."
}
```

**Pref → behavior mapping** (drives `tutor.md` "Adapting to the student" + the injected block):
| Pref | Value → behavior (embody, never quote) |
|---|---|
| **pace** | gentle → fewer ideas/turn, confirm before moving on · fast → cover more, fewer hand-holds |
| **style** | example-first → worked example then principle · concept-first → idea then illustrate · practice-first → ask them to try first |
| **level** | foundation → plain language, define terms, scaffold · advanced → skip basics, full terminology, go deep |
| **default_difficulty** | seeds quiz/practice setup default |
| **target_exam / subject** | curriculum framing (already via course/subject) |
| **exam_date** | countdown + tighter study planning |

*   **Fit with current architecture:**
    *   **API:** GET `/api/me` (user + `learning_prefs` + `app_prefs`) · PATCH `/api/me/preferences` (partial, **autosave** — optimistic, no Save button, "✅ Saved" pulse) · POST `/api/me/onboarding` (set prefs + `onboarded=true`). All user-scoped via `get_current_user`.
    *   **Prompt flow:** `build_context` adds a `[Student preferences]` line to `dynamic_context` (e.g. `Pace: balanced · Style: example-first · Level: building · Difficulty: exam-level · Exam: JEE/Physics · Exam date: …`), and `tutor.md` gains an "**Adapting to the student**" section using the mapping above, with the rule: *"Preferences are the default — stay in them every turn; embody, don't quote."*
    *   **Onboarding:** first login (`onboarded=false`) → short wizard (target exam → subject → level → pace → style → exam date) → POST `/api/me/onboarding` → land on dashboard. Capture the **Mission** here too (Idea 14).
    *   **Frontend:** `/settings` route + `pages/Settings.jsx`; dark-mode toggle lives here (persisted) but stays reachable from the header; lives inside the Idea 4 app shell.
*   **Effort / dependencies:** medium. Independent of RAG/grading. Pairs with Idea 3 (prefs seed `plan` difficulty) and Idea 4 (same app shell).
*   **Open questions:** which toggles are server vs `localStorage` (dark mode/large text could be local)? onboarding now or later? streak source (any activity vs quiz attempts)?
*   **Decision:** *exploring* — focused spec above; confirm v1 pref set + onboarding in/out before promoting to a plan.

### Idea 2 — Production-grade tutor persona ✅ accepted (done)
*   **Problem / motivation:** The old prompt was a thin one-paragraph instruction; not production grade.
*   **Proposal:** A production-grade persona for "Adept" — identity, three hats (teacher/examiner/mentor), grounding rules, intent-driven modes (teach · quiz w/ adaptive difficulty · solve · strategy), strict response format, voice, and a "never" list.
*   **Fit:** `backend/app/prompts/tutor.md`, loaded by `api/chat_ws.py`.
*   **Decision:** ✅ implemented 2026-06-26. Future: tighten once retrieval (RAG) lands so grounding can cite real sources.

### Idea 3 — Complete agentic flow: plan → act → reflect 🔍 exploring
*   **Problem / motivation:** Make the tutor a *real* agentic loop (LangChain + LangGraph), not a single LLM call — so it decides intent, retrieves grounded material, answers, then grades and adapts.

**Current architecture (today)**
The agentic layer spans 4 files, but the **graph is a single node:**
```python
api/chat_ws.py (one turn):
 1. persist user msg (DB)
 2. build_context() ←core/context.py
    tutor.md + running_summary + trimmed history + [course/subject] + question
 3. graph.astream_events(state) ←agent/graph.py
    ┌──────────────────────────┐
    │ START → respond → END    │  respond = get_llm(model).ainvoke(msgs)
    └──────────────────────────┘  ←core/llm.py (provider pool + fallbacks)
 4. stream {token}/{status}/{message_complete}
 5. persist assistant msg → background summary + auto-title
```
*   Intelligence today = **context engineering around one streaming LLM call**. No planning, no tools, no grading.
*   Old `plan`/`act`/`reflect` nodes were **stubs** (`reflect` returned "Score: 100") → collapsed into the single `respond` node during the refactor.
*   **No checkpointer** — DB is source of truth, history rebuilt each turn (good for one-shot turns).

**Target graph**
```text
START → plan → act ⇄ tools → reflect → END
               │ (conditional)  │
      intent+difficulty       grade + adapt
```

**Phased build plan (each step ships on its own)**
*   **Step 1 — `plan`→`act`→`reflect` scaffold + per-node status (NO RAG yet).**
    *   `plan`: one structured-output LLM call → `{intent: teach|quiz|solve|strategy|general, difficulty, topic, needs_retrieval}`. status "Planning…".
    *   `act`: branch on intent (explain / generate quiz question / solve step-by-step / strategy); streams. status "Composing…". **Keep current single-call behavior as the `act` fallback** so nothing regresses.
    *   `reflect`: **only on quiz-answer turns** → `{score, mistake, correct_method, next_difficulty}`, persist a grade, set adaptive difficulty. status "Grading…". No-op otherwise.
    *   Edges: `plan` → `act`; `act` → `reflect` (grading turns) → END. Files: `agent/state.py`, `agent/graph.py`, `api/chat_ws.py` (map new node names → status).
*   **Step 2 — tools** (LangChain tools bound to LLM, run via LangGraph `ToolNode`; edge `act ⇄ tools`):
    *   `retrieve_curriculum` → **RAG** over syllabi + past-year questions (*the keystone*).
    *   `web_search` → **Tavily API** for live/external facts (current affairs, exam dates/cutoffs, "latest"); emits `source_found` events. status "Searching the web…". *(see Idea 10)*
    *   `calculator` / safe `python_exec` for numeric checks. status "Retrieving…".
*   **Step 3 — grading + mastery** in `reflect`: `grades` collection (user/thread/topic-scoped), per-topic mastery/Elo, weak-topic aggregation.
*   **Step 4 — reports**: post-session weak-topic report built from `grades`.

**Design decisions / small things**
*   **DB stays source of truth** — graph state is per-turn/ephemeral; no persistent checkpointer needed.
*   **Structured output** for `plan` and `reflect` via Pydantic schema (`llm.with_structured_output`).
*   **`reflect` runs only on grading turns** (quiz answers), not every message — keeps latency/cost down on small models.
*   **Status event names** reuse the existing protocol: `Planning…` → `Retrieving…` → `Composing…` → `Grading…`.
*   Everything stays **user/thread-scoped** — isolation preserved end-to-end.
*   **Effort / dependencies:** Step 1 = small–medium (graph restructure only). **RAG (Step 2) is the keystone** for grounded `act` + trustworthy grading. Order: 1 → 2 → 3 → 4.
*   **Open questions:** exact `plan` schema; quiz-turn detection (how `reflect` knows the user is answering a posed question — likely a flag set when `act` asks a quiz question); multi-node latency on Groq/Cerebras small models.
*   **Decision:** *exploring* — recommend building **Step 1** first (lowest risk, no RAG); promote to a plan on approval.

### Idea 4 — Dashboard-first app shell (sidebar nav + stats dashboard) 🔍 exploring
*   **Problem / motivation:** Today you land directly in Chat after login — no "home," nowhere to see progress/consistency, and Chat is the only destination. As we add practice, tests, and reports, the app needs a proper shell with a motivating home.
*   **Flow:** Landing page → Login → **app shell**. Persistent **left sidebar (app nav)**: Dashboard · Chat · *(later: Practice/Tests · Reports · Settings)*. Post-login lands on **Dashboard**; clicking **Chat** opens the chat view (which keeps its own session-history panel).
*   **What goes on the Dashboard:**
    *   **Consistency:** current streak, longest streak, study-day calendar heatmap (GitHub-style)
    *   📊 **Activity:** sessions this week, questions practised, messages, time studied
    *   **Exam countdown:** days to target exam date + syllabus coverage %
    *   ▶️ **Quick actions:** Continue last session · Start practice · Take a mock test
    *   🕒 **Recent sessions:** resume list
    *   **Mastery:** per-subject/topic mastery bars + strongest/weakest *(needs grading — Phase 3)*
    *   📈 **Performance:** avg quiz score + accuracy + **time-per-question** trend *(needs grading)*
    *   ⚠️ **Focus next:** top weak topics with "practice now" *(needs grading)*
    *   **Mistakes to revise:** count + top misconceptions, "revise now" (from Idea 7) *(needs grading)*
    *   **Knowledge map:** prerequisite gaps / "fix this first" (from Idea 8) *(needs grading)*
*   **Fit with current architecture:**
    *   **Frontend:** an **app-shell layout** (sidebar + `<Outlet/>`); routes `/dashboard`, `/chat`, `/settings`; post-login redirect → `/dashboard`. The current Chat sidebar becomes the chat view's *session panel* (two levels: app rail + chat history).
    *   **Backend:** GET `/api/me/stats` (or `/api/dashboard`) aggregating **user-scoped data** — start with activity stats (counts from `threads`/`messages`, streak from activity dates), enrich with mastery/scores once `grades` exists.
*   **Effort / dependencies:** medium (frontend shell + one stats endpoint). **Phased:** v1 = consistency + activity + quick actions + recent + countdown (real now); v2 = mastery/score/weak-topic widgets (after Phase 3 grading).
*   **Open questions:** one app sidebar + a separate chat-history panel, or merge into one? Settings as a sidebar item vs profile menu? streak from any activity vs only quiz attempts?
*   **My take:** ✅ strong, standard move (app shell + dashboard home). Surfaces the **Adaptation** pillar and boosts retention. Ship v1 now; mastery widgets light up as grading lands. Do it alongside/after Phase 1 and fold **Settings (Idea 1)** into the same shell.
*   **Decision:** *exploring* — agree the v1 widget set + shell before building.

### Idea 5 — Exam-pattern-aware questions 🔍 exploring
*   **Problem / motivation:** Generic Q&A doesn't feel like the real exam. Each exam has its own question types and marking scheme — practice should mirror the actual paper.
*   **Proposal:** Quiz/question generation in each exam's real format + scoring: **JEE** (MCQ + numerical), **NEET** (MCQ, +4/−1 negative marking), **UPSC** (descriptive / answer-writing), **GATE** (MCQ + NAT). Quiz mode scores using the real marking scheme (incl. negative marking).
*   **Per-exam evaluation nuances** (from the original vision): **JEE** → grade the multi-step *working*, not just the final value · **NEET** → recall speed + accuracy over high fact volume · **UPSC** → Prelims objective + **Mains essay/answer-writing evaluation (structure + factual/historical accuracy)** · **GATE** → deep conceptual correctness.
*   **MCQ design rule:** all options the **same length** (word/char count) with no formatting tells — distractors must not leak the answer.
*   **Fit:** per-exam format config (in `tutor.md` modes + a small `exam_patterns` map); the `act` node generates to that format; `reflect` applies the marking scheme. Authenticity boosted by PYQ grounding (RAG).
*   **Depends on: prompt-only for the format**; marking-scheme scoring rides on `reflect` (Phase 3); real-paper authenticity ← RAG/PYQ (Phase 2).
*   **Open questions:** where the per-exam config lives; UI for numerical/NAT input + UPSC long-answer.
*   **Decision:** *exploring* — high value, mostly prompt + `reflect`.

### Idea 6 — Step-level solution grading 🔍 exploring
*   **Problem / motivation:** "Wrong" isn't useful. Students need to know **exactly where their method broke**.
*   **Proposal:** Student submits their working (typed or photo); Adept reconstructs the correct method and **diffs it step-by-step**, pinpointing the first divergent step + the misconception, then the fix and (optionally) partial credit.
*   **Fit:** extend the `reflect` node to emit ordered steps + a diff vs the student's steps (structured output); photo input ties to the OCR add-on.
*   **Depends on: `reflect` grading (Phase 3)** — this is the flagship grading feature. Multimodal photo input optional.
*   **Open questions:** eliciting/parsing student steps; partial-credit model; latency on small models.
*   **Decision:** *exploring* — killer feature; build on the grading node.

### Idea 7 — Personal mistake / error bank ▫️ folded into Idea 13
**Folded into the Learner Model (Idea 13):** the mistake bank is the *corrected-misconception* slice of the learner model. Kept here as the concrete sub-feature; implement it as one **record type** of Idea 13.
*   **Proposal:** Every wrong answer is logged with `{topic, misconception_tag, question, their_answer, correct_method}`; a "My Mistakes" view; auto-resurfaced via spaced repetition + the daily quiz; surfaced on the dashboard.
*   **Fit:** written by `reflect` on a wrong grade; feeds spaced repetition + daily streak quiz + dashboard widget.
*   **Depends on:** `reflect` grading (Phase 3).
*   **Decision:** *implement as part of Idea 13's `learning_records`*.

### Idea 8 — Concept prerequisite map 🔍 exploring
*   **Problem / motivation:** A weak topic is often a **missing prerequisite**; linear study order misses this.
*   **Proposal:** Model each exam/subject syllabus as a prerequisite **DAG**; when a student is weak at X, surface the upstream prerequisite they're missing and route practice there. Drives study order + smarter scaffolding; powers a dashboard "knowledge map".
*   **Fit:** a static authored `concept_graph` per exam/subject + per-node mastery (from grading); `plan`/scaffolding consults it; feeds the dashboard map + "fix this first" nudges.
*   **Depends on:** (a) **authored concept graph** (content work — manual or LLM-extracted from the syllabus) + (b) per-node mastery (Phase 3). Medium–large.
*   **Open questions:** who authors the graph; node granularity.
*   **Decision:** *exploring* — powerful but content-heavy; phase after grading.

### Idea 9 — Teach-back / Feynman mode 🔍 exploring
*   **Problem / motivation:** Passive reading ≠ mastery; **explaining** a concept reveals the gaps.
*   **Proposal:** A mode where the **student explains** a concept to Adept; Adept grades the explanation for correctness/completeness, flags gaps/misconceptions, and asks a probing follow-up. Gaps log to the mistake bank.
*   **Fit:** a new `teach_back` intent in `plan` + an `act` prompt that elicits the explanation + a `reflect` grade of it.
*   **Depends on: prompt-driven** (a light version ships now); grading depth rides on `reflect` (Phase 3).
*   **Open questions:** scoring rubric for a free-form explanation; keeping it conversational.
*   **Decision:** *exploring* — cheap, high-impact; light version is prompt-only.

### Idea 10 — Web search & research (Tavily) 🔍 exploring
*   **Problem / motivation:** Some questions need **live/external facts** the model can't reliably know — UPSC **current affairs**, exam notifications/dates/cutoffs, recent science developments, "latest" anything. Without it the tutor guesses or refuses.
*   **Proposal:** A `web_search` agent tool backed by the **Tavily API** that Adept calls when a question needs current or external facts. It returns ranked results + sources; answers are grounded in them and cite the source. UPSC current-affairs leans on this heavily.
*   **Fit with current architecture:**
    *   LangChain tool `web_search(query)` (content_and_artifact), bound to the LLM and run via the `ToolNode` in the agentic graph **(Idea 3, Step 2)**.
    *   **Config:** `TAVILY_API_KEY` env + `core/config.py` constants (`TAVILY_URL`, `TAVILY_MAX_RESULTS`, `TAVILY_TIMEOUT`, `TAVILY_SEARCH_DEPTH`). Add `TAVILY_API_KEY` to `.env.example`.
    *   **Streaming UX:** emit `tool_call` ("Searching the web…") + `source_found` (url/title) events over the existing WS protocol → the reasoning strip shows live sources.
    *   **Resilience:** per-call timeout + graceful degradation (timeout / 429 / auth error → soft message, answer from knowledge, never crash the turn).
    *   **Grounding rule** in `tutor.md`: call it silently, ground the answer in results, **name the source**; never fabricate to fill gaps.
*   **Depends on:** the agentic tools step (Idea 3, Step 2). The tool itself is standalone + quick to add; needs a `TAVILY_API_KEY`.
*   **Open questions:** auto-trigger vs only on explicit "search/latest" (cost control); result caching (`search_cache` collection) to cut repeat calls; per-exam emphasis (UPSC current affairs ≫ JEE).
*   **Decision:** *exploring* — clear value (esp. UPSC current affairs); slots into Phase 2 tools.

### Idea 11 — Math & rich rendering (LaTeX + Markdown) 🔍 exploring
*   **Problem / motivation:** The original vision calls out **LaTeX support** as essential — JEE/NEET/GATE are full of equations + chemistry, and `tutor.md` already outputs **Markdown**. But the chat currently renders raw text (`whitespace-pre-wrap`) — no Markdown, no math. Answers look broken.
*   **Proposal:** Render assistant messages as Markdown with math + chemistry: bullets/tables/code/bold + inline/block **LaTeX** (e.g. `$v=u+at$`, `$$\int_0^1 x\,dx$$`) and chemical equations.
*   **Fit: frontend only** — add `react-markdown` + `remark-math` + `rehype-katex` (KaTeX) to the message renderer in `Chat.jsx`; KaTeX `mhchem` for chemistry; render the growing buffer (streaming-safe); syntax-highlight code blocks.
*   **Depends on:** nothing — **ship now**, independent of the agentic work.
*   **Open questions:** KaTeX vs MathJax (KaTeX is faster); rendering partial LaTeX mid-stream (debounce the final render).
*   **Decision:** *exploring* — high value, low effort, frontend-only; strong early win.

### Idea 12 — B2B coaching-center mode 🅿️ parked
*   **Problem / motivation:** The original vision's biggest monetization lever: **coaching centers** want to give thousands of students 1-on-1 adaptive practice + mock testing. The Indian test-prep market is large and pays for rank improvement.
*   **Proposal:** An institution tier — an **org/admin** account that manages many students: assign practice/mock sets, view cohort + per-student weak-topic analytics, track progress, optional white-label.
*   **Fit:** a new `orgs` collection + `org_id` on `users` (still user-scoped underneath); admin endpoints + an admin dashboard; reuses the same agent / grading / reports. Larger effort.
*   **Depends on:** a solid single-student product first (Phases 1–4 + grading/reports).
*   **Open questions:** roles (student vs admin); pricing/seats; white-label depth.
*   **Decision:** *parked* — strategic; revisit once the single-student experience is strong.

**Ideas 13–18** below come from a stateful-teaching / learning-science model (Mission · Learning Records · Glossary · Resources · Lessons). They form the **memory + pedagogy backbone** that makes `plan` → `act` → `reflect` truly adaptive.

### Idea 13 — Learner Model (Learning Records + ZPD) 🔍 exploring ⭐ backbone
*   **Problem / motivation:** To truly adapt, the tutor needs a **persistent, structured model of what each student knows** — not just chat history.
*   **Proposal:** Per-student/subject **Learning Records** (ADR-style, numbered, append-only). Write one only on *evidence*, of four kinds: (1) **demonstrated understanding** of a non-trivial concept (raises the floor), (2) **disclosed prior knowledge** + depth (don't re-teach), (3) a **corrected misconception** (high-value — predicts future stumbles), (4) a **goal/mission shift**. **Superseded, never deleted** (keeps the evolution trail). Used to compute the student's **Zone of Proximal Development** → `plan` picks "just hard enough" next steps.
*   **Fit:** `learning_records` collection (user/subject-scoped); written by `reflect` on real evidence; read by `plan`/`build_context` to set difficulty + skip mastered material. **Absorbs the mistake bank (Idea 7)** — misconceptions are one record type. Not an activity log; don't duplicate the glossary (Idea 17).
*   **Learning Facts** — management *(answers the "limit / duplicates / replace / evolve / not-blind" doubt)*:
    *   **Schema (per fact):** `{user_id, subject, concept (canonical key, e.g. "rotational-motion/torque"), type: mastered|prior_knowledge|misconception|preference|mission_shift, statement, status: active|superseded, superseded_by, strength 0–1, evidence, created_at, updated_at, last_seen_at}`.
    *   **Avoid duplicates:** **upsert by key** (`user_id`, `subject`, `concept`, `type`); before writing, **semantic-dedup** the `statement` against existing `active` facts for that concept (cosine > threshold ⇒ same fact → update, don't insert).
    *   **Replace / supersede:** new evidence that *contradicts* an active fact → mark the old `status=superseded`, `superseded_by=<new>`, insert the new (**keep history, never blind-overwrite**). Numeric values (mastery, strength) update in place.
    *   **Evolve / decay:** `strength` **decays over time** since `last_seen_at` (forgetting curve), **boosted on reinforcement** → low-strength "mastered" facts resurface for spaced repetition (Idea 15). The floor rises as understanding is demonstrated.
    *   **Limit (context budget):** store **unbounded** in the DB, **inject only a bounded subset** per turn — `active` facts for the **current topic/subject**, ranked by relevance + strength + recency, capped at top-N (≈15–25) / a token budget — plus a compact mastery summary + the mission. *(Selection is the limit, not storage.)*
    *   **Not blind:** `plan` always reads this subset before responding → tailors difficulty, skips known material, references past struggles, and **clarifies vague input** (Idea 19).
    *   **Access pattern (always-pass vs on-demand):** **hybrid** — *always inject* the cheap bounded slice above (mission + mastery summary + top-N topic facts + summary/history); *fetch on-demand via tools* (`recall_facts(concept)`, `retrieve_curriculum`, `web_search`) for depth/history. **Never** inject the whole store; **never** rely on the model to remember to fetch the basics.
*   **Depends on:** `reflect` grading (Phase 3) for the evidence signal; embeddings (RAG infra) for semantic dedup.
*   **Open questions:** record granularity; how `plan` cheaply summarizes records into a difficulty target.
*   **Decision:** *exploring* — backbone of real adaptation; supersedes Idea 7.

### Idea 14 — Mission-driven onboarding (the "why") 🔍 exploring
*   **Problem / motivation:** Without a concrete goal, tutoring drifts abstract and there's no filter for "what next."
*   **Proposal:** Capture a per-student **Mission**: **Why** (concrete — e.g. "JEE 2027, top-5k rank, fix weak Physics"), **Success looks like** (observable — "solve rotational-mechanics in <3 min"), **Constraints** (hours/day, current level), **Out of scope** (skip for now). Concrete > abstract; push back on vagueness; revisable (confirm first). Acts as a **decision filter**: every lesson/quiz must trace back to the mission.
*   **Fit:** a `mission` sub-doc on the user; injected into `dynamic_context` as the steering goal; persona gains *"does this trace back to the mission?"*. Upgrades **Idea 1**'s onboarding wizard.
*   **Depends on:** nothing — prompt + a few fields.
*   **Open questions:** interview vs infer; mission per subject vs per student.
*   **Decision:** *exploring* — cheap, high-leverage; fold into Idea 1 onboarding.

### Idea 15 — Learning-science practice engine 🔍 exploring
*   **Problem / motivation:** Re-reading and "following along" *feel* like learning but don't survive the exam hall. Engineer for **durable recall**.
*   **Proposal:** bake evidence-based principles into the engine:
    *   **Fluency vs storage strength** — test recall from memory (storage), not just recognition; flag the **fluency illusion** (confidently-wrong).
    *   **Desirable difficulty** — **retrieval practice** (quiz from memory) · **spacing** (resurface over days) · **interleaving** (mix related topics in a session, not block-drill).
    *   **Knowledge vs skill** — *teach* mode **minimizes** difficulty (clear, cited, working-memory-friendly); *practice* mode **maximizes** effortful retrieval with tight, immediate feedback.
*   **Fit:** shapes `act` (interleaved quiz sets), `reflect` (storage-strength grading + fluency flag), and the spaced-repetition/daily queue. A principles layer over Ideas 5/6/13.
*   **Depends on:** `reflect` (Phase 3) for the storage signal; **interleaving is selection logic — buildable now**.
*   **Open questions:** spacing schedule (SM-2 vs simple); interleaving topic-mix rules.
*   **Decision:** *exploring* — the "why it works" engine; interleaving is a quick win.

### Idea 16 — Auto-generated micro-lessons 🔍 exploring
*   **Problem / motivation:** Chat is great for Q&A, but students also want focused, **re-readable explainers** for a concept.
*   **Proposal:** On demand (or when a weak topic is found), generate a **short, focused lesson** on one concept — tied to the mission, in the student's ZPD, with a worked example, a tiny check-for-understanding, **citations**, and a recommended primary source. Saved to the student's library to revisit; built from reusable components for a consistent look.
*   **Fit:** a `lessons` collection (user-scoped) + a generation flow (LLM + RAG); rendered via the **Idea 11** Markdown/LaTeX renderer; small shared component/style set.
*   **Depends on:** RAG (Phase 2) for grounded content + citations; renderer (Idea 11).
*   **Open questions:** in-app Markdown pages vs standalone HTML; trigger (on-demand vs auto from weak topics).
*   **Decision:** *exploring* — strong revisitable artifact; after RAG + renderer.

### Idea 17 — Personal reference library: glossary + cheat/formula sheets 🔍 exploring
*   **Problem / motivation:** Lessons/chats are rarely re-read; students **revise from compressed references**. They need a personal, trustworthy reference set.
*   **Proposal:**
    *   **Concept glossary** — canonical, tight definitions, added **only once the student demonstrates understanding** (evidence, not a dictionary); opinionated (best term + aliases to avoid); revised as understanding deepens; flag field-wide ambiguities.
    *   **Cheat / formula sheets** per topic — compressed essence, print-friendly, for quick revision.
*   **Fit:** a `reference` store (user/subject-scoped); glossary entries written by `reflect`/`context` when mastery is shown; feeds revision + dashboard. Supersedes the "formula sheets" add-on.
*   **Depends on:** grading/mastery signal (Phase 3); RAG for accurate formulas.
*   **Open questions:** auto-curate vs student-edited; per-subject glossaries.
*   **Decision:** *exploring* — high revision value; builds on the learner model.

### Idea 18 — Trusted source library + gap tracking (for RAG) 🔍 exploring
*   **Problem / motivation:** *Never trust the model's memory* — answers/lessons must be grounded in **high-trust** sources (NCERT, standard texts, official PYQ). And we must know what's **missing**.
*   **Proposal:** a **curated source registry** per exam/subject (trusted texts, official syllabi, PYQ sets) with annotations ("use for: …") feeding the RAG index; plus an explicit **Gaps** list (areas with no good source) that drives ingestion priority. High-trust only; **prune ruthlessly**.
*   **Fit:** a `sources` collection + the ingestion pipeline (add-on) into the vector DB; citations reference these. Operationalizes Phase 2 RAG.
*   **Depends on:** RAG (Phase 2). Curation effort.
*   **Open questions:** textbook/PYQ licensing; who curates.
*   **Decision:** *exploring* — the trust backbone for RAG; pairs with the content pipeline.

### Idea 19 — Guided progression & adaptive engagement 🔍 exploring
*   **Problem / motivation:** Three gaps that make it feel like a blind Q&A box: (1) on a **vague question** it answers blindly instead of **clarifying**; (2) it can be used like a **general chatbot** with no boundary; (3) it doesn't **drive the student forward** through the course or personalize on progression.
*   **Proposal:**
    *   **Clarify vague input** — **cheap proceeds, expensive confirms:** `plan` emits `confidence` + `path_cost`. **Cheap/fast lookups auto-proceed** (optionally noting a one-line assumption). For a **slow/expensive deep-research / multi-step path on a guessed, low-confidence objective, do NOT fire** — `act` **states its interpretation and waits one turn for confirmation** ("I'll research X — is that right?"); confirm → fire, correct → adjust. *(Only the expensive path gates; never make cheap answers wait.)*
    *   **Scope & redirect** — **escalating off-topic policy:** the **Mission (Idea 14)** is the filter; track `off_topic_count` per thread (incremented when `plan` flags off-mission):
        *   **≤ 2 off-topic** → answer normally.
        *   **3–9** → answer it, **then append a short nudge** to return ("…want to get back to {topic}?").
        *   **≥ 10** → **stop answering off-topic** — reply only with a firm redirect to the course / next topic.
        *   Thresholds configurable (`OFF_TOPIC_SOFT = 2`, `OFF_TOPIC_HARD = 10`).
    *   **Drive progression:** from the concept map (Idea 8) + mastery, recommend the **next topic** ("you've cleared kinematics — next is rotational motion?"); track **course-completion %** (mastered nodes / total) on the dashboard; proactively nudge the next step.
    *   **Personalize on everything:** every turn injects mission + relevant learning facts (Idea 13) + mastery/progression + prefs → difficulty, examples, tone, and *what to do next* all adapt to this student.
*   **Fit:** `plan` flags (`confidence`, `path_cost`, `off_mission`, `next_topic`); `off_topic_count` on the thread doc; a `progress` view (mastered/total per subject) for the dashboard; `tutor.md` gains "**Confirm before expensive research**" + "**Escalating off-topic policy**" sections.
*   **Depends on:** agentic `plan` node (Phase 1) for the flags; concept map (Idea 8) + learner model (Idea 13) for next-topic + personalization.
*   **Open questions:** does `off_topic_count` **reset/decay** when they return on-topic (likely yes)? what counts as "expensive" (deep-research / multi-step) vs cheap (single lookup)? completion metric (topics vs questions answered).
*   **Decision:** *exploring* — core to feeling like a real, engaging tutor; flags land in Phase 1.

---

## Add-ons / future enhancements (backlog)
Grouped; promote any into a numbered Idea when we pick it up.

📚 **Learning depth**
*   Photo / handwriting input — snap a problem or diagram → OCR → solve (Photomath / Doubtnut-style)
*   Full mock tests / past-year papers, timed, auto-scored
*   Spaced-repetition of weak topics (daily practice queue)
*   Auto-generated formula sheets / quick-revision notes per topic
*   "Show me the method" with a calculator / `python_exec` tool for exact numbers

📊 **Evaluation & insight**
*   Mastery heatmap + weak-topic trend dashboard
*   Rank / percentile estimation vs the exam cohort
*   Citations on every grounded answer (source textbook / PYQ) once RAG lands

🎯 **Personalization & planning**
*   Study planner / scheduler to the target exam date
*   First-login onboarding that captures prefs (pace / style / level)
*   Daily goals + streaks / XP / badges (gamification)

♿ **Accessibility & reach**
*   Multilingual (Hindi + regional languages) — big for Indian aspirants
*   Voice mode (ask / answer by speech)
*   PWA / mobile app, offline revision

☁️ **Platform**
*   Email delivery for password reset + weekly progress recaps
*   Push notifications / study reminders
*   Content pipeline to ingest syllabi & PYQ into the vector DB

---

## Parking lot (raw, not yet shaped)
*(quick captures that need more thought)*

## Promoted to plans
*(ideas accepted → linked to their implementation plan under `docs/superpowers/plans/`)*
