# Quiz App - MongoDB Backend Setup Guide

## ✅ What's Been Done

- Created a **Node.js + Express backend** server in `/server` directory
- Set up **MongoDB Mongoose schemas** for quiz questions
- Created **REST API endpoints** to fetch quiz data
- Updated **React frontend** to call the backend API instead of Gemini
- Configured **CORS** and **environment variables**
- **Auto-seeds database** with mock questions on first run

---

## 🚀 Quick Start (4 Steps)

### Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Sign up** (free tier available)
3. Create a **new project** and **cluster** (M0 Free tier)
4. Get your **connection string** (looks like: `mongodb+srv://username:password@cluster.mongodb.net/quiz_db?retryWrites=true&w=majority`)

### Step 2: Configure Backend

1. Open `server/.env`
2. Replace `MONGODB_URI` with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@your-cluster.mongodb.net/quiz_db?retryWrites=true&w=majority
   ```
3. Save the file

### Step 3: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 4: Run Backend & Frontend

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
Expected output:
```
✅ MongoDB connected successfully
📝 Seeding database with quiz data...
✅ Database seeded
🚀 Server running at http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## 📚 API Endpoints

### Get Quiz Questions
```
GET http://localhost:5000/api/quiz/questions/:subject/:difficulty
```

**Example:**
```bash
curl http://localhost:5000/api/quiz/questions/Data%20Structures/easy
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "question": "Which data structure uses LIFO?",
      "options": ["Queue", "Stack", "Tree", "Graph"],
      "correctAnswer": 1,
      "explanation": "Stack uses Last In First Out principle."
    }
  ],
  "subject": "Data Structures",
  "difficulty": "easy",
  "total": 5
}
```

### Get All Subjects
```
GET http://localhost:5000/api/quiz/subjects
```

---

## 🗄️ MongoDB Atlas Setup Details

### Create Cluster
1. Click **"Create Deployment"** → Choose **M0 Free**
2. Select region closer to you
3. Click **"Create Cluster"** (takes ~5 min)

### Get Connection String
1. Click **"Connect"** button
2. Select **"Drivers"** → **"Node.js"**
3. Copy the connection string
4. Replace `<username>`, `<password>`, and `<cluster-name>` with your actual values

### Network Access
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

---

## 📁 Project Structure

```
my-react-app/
├── src/
│   ├── services/
│   │   └── quizService.js (Calls backend API)
│   ├── Components/
│   └── ...
├── server/
│   ├── models/
│   │   └── Quiz.js (MongoDB schema)
│   ├── routes/
│   │   └── quiz.js (API routes)
│   ├── index.js (Express server)
│   ├── seedData.js (Database seeding)
│   ├── upload.js (Upload/upsert from questions.json)
│   ├── .env (MongoDB connection)
│   └── package.json
└── .env.local (Frontend config with API URL)
```

---

## 🧪 Testing the API

### With cURL
```bash
# Get Data Structures - Easy questions
curl "http://localhost:5000/api/quiz/questions/Data%20Structures/easy"

# Get all subjects
curl "http://localhost:5000/api/quiz/subjects"

# Health check
curl "http://localhost:5000/api/health"
```

### With Frontend
1. Start the quiz app
2. Select any subject and difficulty
3. Questions should load from MongoDB

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check MongoDB Atlas connection string in `server/.env`
- Ensure IP address is whitelisted in MongoDB Atlas
- Verify MongoDB cluster is active

### "Backend not responding"
- Ensure backend is running on port 5000
- Check if `VITE_API_URL=http://localhost:5000/api` in `.env.local`
- Check browser console for CORS errors

### "No questions found"
- Backend should auto-seed database on first run
- Check MongoDB collection `quizzes` has data
- Restart backend server

---

## 📝 Add More Questions to Database

**Option 1: Via API**
```bash
curl -X POST http://localhost:5000/api/quiz/add \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Data Structures",
    "difficulty": "easy",
    "questions": [
      {
        "question": "What is a stack?",
        "options": ["...", "...", "...", "..."],
        "correctAnswer": 0,
        "explanation": "..."
      }
    ]
  }'
```

**Option 2: MongoDB Compass**
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to your cluster
3. Navigate to `quiz_db` → `quizzes` collection
4. Add/edit questions directly

---

## 🎯 Next Steps

- [ ] Update MongoDB connection string
- [ ] Run backend: `cd server && npm start`
- [ ] Run frontend: `npm run dev`
- [ ] Test API endpoints
- [ ] Add more questions if needed
- [ ] Deploy backend (Heroku, Railway, Render, etc.)

---

## 📞 Support

If you encounter issues:
1. Check terminal output for error messages
2. Verify MongoDB Atlas connection
3. Ensure both frontend and backend are running
4. Check network tab in browser developer tools for API calls

Enjoy your MongoDB-powered quiz app! 🎉
