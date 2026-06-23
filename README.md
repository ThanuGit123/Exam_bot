# Adaptive Exam-Prep Tutor (Exambot)

Exambot is an intelligent, adaptive tutoring platform tailored for major Indian competitive exams (JEE, NEET, UPSC, GATE). It leverages a highly advanced AI backend (LangGraph + RAG + MCP) to act as a realistic mentor, grading answers turn-by-turn and providing targeted feedback without hallucinations.

> **Note:** For full architectural details, ideation, and the complete folder structure layout, please refer to the `docs/` folder, specifically `docs/STRUCTURE_AND_RUN.md`.

---

## How to Run

To run the application, you need to start the backend and frontend simultaneously in two separate terminal windows.

### Terminal 1: Backend (Python/FastAPI)

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Start the API server
uvicorn app.main:app --reload --port 8000
```
*API is accessible at http://localhost:8000*

### Terminal 2: Frontend (React/Vite)

```bash
cd frontend
npm install

# Start the Vite dev server
npm run dev
```
*Frontend UI is accessible at http://localhost:5173*
