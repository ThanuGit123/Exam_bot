# Adaptive Exam-Prep Tutor (Exambot) Implementation Plan

Building an adaptive exam-prep tutor for the Indian market (JEE, NEET, UPSC, GATE), leveraging the architectural foundation and presentation layer of the previous mock-interview bot.

## Technology Stack Confirmed

Based on your input, we will proceed with the following decoupled, advanced architecture:

- **Frontend:** React 19 powered by Vite 8.
- **Styling:** Tailwind CSS for a premium, responsive UI.
- **Backend / API:** Python 3.12 with FastAPI.
- **Database:** MongoDB for storing user progress, Elo scores, and session histories.

## Advanced AI Architecture (LangChain + RAG + MCP)

To push the boundaries beyond simple LLM calls, the backend will leverage a highly advanced agentic architecture:

1. **LangGraph Orchestration:** We will use LangGraph to build a complex, multi-step state machine for the tutoring loop. This allows the agent to iteratively think, search, and grade before responding.
2. **Retrieval-Augmented Generation (RAG):** The bot won't just rely on its base weights. We will implement a RAG pipeline (using a Vector DB like Chroma or Qdrant) to pull in exact syllabus material, past year questions (PYQs) for JEE/NEET, and verified solutions. **Crucially, when the bot asks a question and needs to provide a detailed explanation for the answer, it will retrieve the exact textbook explanation to strictly avoid hallucinations.**
3. **Model Context Protocol (MCP):** We will implement MCP to give the LangChain agent standardized access to external tools (like a Python code execution environment for checking math formulas, or an external exam database API). This bridges the agent to live, dynamic context safely.

## Proposed Architecture

We will build the application mimicking the successful flow of the mock-interview bot, but with a vastly more intelligent backend:

1.  **Frontend (React/Vite):** Handles the Landing Page, Authentication UI, and the Interactive Chat Area. Communicates with the FastAPI backend via REST.
2.  **State Management:** React Context or Zustand to manage the frontend chat session state.
3.  **Math Rendering:** `react-katex` or `react-mathjax` for rendering complex STEM equations in the chat.
4.  **AI Backend (FastAPI + LangGraph + RAG + MCP):** 
    - Exposes endpoints to start sessions and submit answers.
    - LangGraph orchestrates the workflow.
    - RAG retrieves specific exam context.
    - MCP provides tools for the agent to verify answers dynamically.
5.  **Data Storage:** MongoDB collections for `Users` and `Sessions`.

## Proposed Changes

### Project Initialization
- **Frontend Directory (`/frontend`):** Initialize Vite with React 19. Install `tailwindcss`, `lucide-react`, `react-katex`.
- **Backend Directory (`/backend`):** Initialize a Python 3.12 environment (`uv`). Install `fastapi`, `uvicorn`, `langgraph`, `langchain`, `motor` (async MongoDB driver), `pydantic`, `chromadb` (for RAG), and MCP-related SDKs.

---

### Pages and Routing

#### [NEW] Landing Page
- A high-converting premium hero section.
- Clear value proposition for Exam Prep (JEE/NEET/etc.).
- Call to Action to start practice.

#### [NEW] Login/Signup Page
- Authentication UI for tracking progress.

#### [NEW] Practice Chat Area
- The core interface.
- Chat UI mimicking a real-time tutor.
- Renders equations beautifully.

---

### Core Components

#### [NEW] `ChatWindow`
- Manages the message history between the student and the Exambot.

#### [NEW] `MathText`
- A utility component to safely render LaTeX strings returned by the AI into readable math equations.

#### [NEW] `PostSessionReport`
- The visual breakdown displayed after a session concludes, showing the "weak-topic" analytics.

---

### AI Integration

#### [NEW] Prompts configuration
- System prompts tailored for Exambot to act as a **real guide/mentor** for students appearing in JEE, NEET, UPSC, and GATE. It will offer encouragement, strategic exam advice, and conceptual clarity alongside grading, rather than just being a strict grader.
- Logic for `record_answer_grade` tool definition for structured JSON output.

#### [NEW] AI Route Handler
- The backend endpoint communicating with the AI.
- Evaluates the answer, adjusts difficulty, and returns the grade + next question.

## Verification Plan

### Manual Verification
1.  **User Flow:** Ensure seamless navigation from Landing -> Login -> Practice Session.
2.  **Equation Rendering:** Test chat with complex Physics/Math questions to verify LaTeX rendering works perfectly.
3.  **Adaptive Logic:** Intentionally answer questions incorrectly to verify the AI lowers the difficulty and explains concepts. Answer correctly to see difficulty increase.
4.  **Reporting:** Complete a session and verify the Weak-Topic report accurately reflects the session's performance.
