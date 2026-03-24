# Quiz Master - MongoDB Quiz Application

A React + Vite quiz application that fetches quiz questions from a Node/Express API backed by MongoDB Atlas.

## Features

- Subject-wise quiz selection
- Easy / Medium / Hard difficulty levels
- 5 / 10 / 20 question options
- Instant feedback + explanations
- MongoDB-backed question bank (no AI service)

## Quick Start

### 1) Install dependencies

```bash
npm install
cd server
npm install
```

### 2) Configure environment

Create `server/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/quiz_db?retryWrites=true&w=majority
```

Create `.env.local` in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3) Upload questions to MongoDB (optional but recommended)

This upserts all quiz sets from `server/questions.json` into MongoDB:

```bash
cd server
npm run upload
```

### 4) Run backend + frontend

**Terminal 1 (backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (frontend):**
```bash
npm run dev
```

## API Endpoints

- `GET /api/quiz/questions/:subject/:difficulty?count=20`
- `GET /api/quiz/subjects`
- `GET /api/health`

## Question Format

```json
{
  "question": "The actual question?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Why this is the correct answer"
}
```
