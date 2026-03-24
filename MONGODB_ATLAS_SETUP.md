# MongoDB Atlas Quiz App - Setup & Run Guide

## Quick Start

### 1. Configure MongoDB Atlas Connection
Edit `server/.env`:
```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/quiz_db?retryWrites=true&w=majority
PORT=5000
VITE_FRONTEND_URL=http://localhost:5173
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

### 3. Run the Application

**Option A: Run Both Frontend & Backend Together**
```bash
npm run dev:all
```

**Option B: Run Separately**

Backend (Terminal 1):
```bash
cd server
npm run dev
# Server will run on http://localhost:5000
```

Frontend (Terminal 2):
```bash
npm run dev
# App will run on http://localhost:5173
```

### 4. How It Works
- The app fetches quiz questions directly from MongoDB Atlas via the backend API
- No AI service needed - all questions are stored in your MongoDB database
- The backend automatically seeds the database on first run if it's empty

### 5. Test the API
Backend health check:
```
GET http://localhost:5000/api/health
```

Fetch questions:
```
GET http://localhost:5000/api/quiz/questions/Data%20Structures/easy?count=5
```

Get available subjects:
```
GET http://localhost:5000/api/quiz/subjects
```

## What Changed
✅ Removed AI service dependencies (OpenAI/Gemini)
✅ Created new `quizService.js` for MongoDB API calls
✅ Updated `App.jsx` to use the new service
✅ Simplified error handling and removed mock data options
