import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import quizRoutes from './routes/quiz.js';
import seedData from './seedData.js';

dotenv.config();

const app = express();
// const PORT = process.env.PORT || 5000;
const PORT = 'http://3.110.164.48:5000'
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_TIMEOUT_MS = Number(process.env.MONGODB_TIMEOUT_MS || 30000);

// Middleware
app.use(cors({
  origin: process.env.VITE_FRONTEND_URL ,
  credentials: true,
}));
app.use(express.json());

// Database Connection
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: MONGODB_TIMEOUT_MS,
    connectTimeoutMS: MONGODB_TIMEOUT_MS,
  })
  .then(async () => {
    console.log('✅ MongoDB connected successfully');
    
    // Seed database if Quiz collection is empty
    const Quiz = await import('./models/Quiz.js').then(m => m.default);
    const quizCount = await Quiz.countDocuments();
    if (quizCount === 0) {
      console.log('📝 Seeding database with quiz data...');
      await seedData();
      console.log('✅ Database seeded');
    } else {
      console.log(`📊 Database already has ${quizCount} quiz documents`);
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/quiz', quizRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Start Server

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
//   console.log(`📚 API: http://localhost:${PORT}/api/quiz/questions/[subject]/[difficulty]`);
//   console.log(`📊 Health: http://localhost:${PORT}/api/health`);
// });
