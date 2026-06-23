# Exambot Structure & Run Guide

This document is the master reference for the folder structure of the Exambot application and how to run it.

## Folder Structure

```text
Exambot/
├── docs/                          # MASTER DOCS FOLDER — the source of truth for all decisions
│   ├── IDEATION.md                # What we build and why (read this first, always)
│   ├── STRUCTURE_AND_RUN.md       # This file — layout + how to run
│   └── IMPLEMENTATION.md          # How to build it, phase by phase
│
├── frontend/                      # React + Vite single-page app
│   ├── src/
│   │   ├── pages/                 # One folder per screen: Login, Home, Chat, Report
│   │   ├── components/            # Reusable UI pieces (chat bubble, math renderer, timer, sidebar)
│   │   ├── services/              # All backend communication (HTTP + WebSocket) — UI never calls APIs directly
│   │   ├── store/                 # Client state (current user, active session, messages)
│   │   └── hooks/                 # Reusable logic (socket connection, timer display)
│   ├── .env.example               # Frontend env template (API URL) — copy to .env, never commit .env
│   └── package.json
│
├── backend/                       # Python FastAPI + LangChain/LangGraph (the ONLY backend)
│   ├── app/
│   │   ├── main.py                # App entry: middleware, startup, route mounting — nothing else
│   │   ├── api/                   # Thin HTTP/WebSocket endpoints — receive, validate, delegate, respond
│   │   ├── agent/                 # The LangGraph agent: state machines, RAG retrieval nodes, MCP tools
│   │   ├── prompts/               # AI-related home: versioned system prompts (the 'tutor' persona lives here)
│   │   ├── services/              # Business logic: scoring math, Elo updates, auth
│   │   ├── models/                # Pydantic request/response models + DB document shapes
│   │   ├── core/                  # Config (env loading), logging setup, error envelope, LLM provider pool
│   │   └── db/                    # Mongo connection + collection access
│   ├── migrations/                # Versioned, ordered scripts: collections, indexes, seed data
│   ├── tests/                     # Tests mirror the app/ layout
│   ├── .env.example               # Backend env template (Mongo URI, LLM keys pool, JWT secret)
│   └── requirements.txt           # Everything the backend needs — pip install, nothing more
│
├── .gitignore                     # Standard ignores for node_modules, venv, pycache, etc.
└── README.md                      # Quickstart guide + run commands
```

## How to Run the Application

You will need two terminal windows running simultaneously.

### 1. The Backend (Python/FastAPI)

In the first terminal, start the Python backend:

```bash
cd backend
# Create and activate your virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies (only needed the first time or when requirements change)
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```
*The backend API is now running at `http://localhost:8000`.*

### 2. The Frontend (React/Vite)

In the second terminal, start the Vite development server:

```bash
cd frontend

# Install dependencies (only needed the first time)
npm install

# Run the UI
npm run dev
```
*The frontend application is now running at `http://localhost:5173`.*
