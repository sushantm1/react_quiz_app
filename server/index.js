import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import quizRoutes from './routes/quiz.js';
import seedData from './seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors({
  origin: process.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Database Connection
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected successfully');
    
    // Seed database on first run (if collections are empty)
    const collectionCount = await mongoose.connection.db.listCollections().toArray();
    if (collectionCount.length === 0) {
      console.log('📝 Seeding database with quiz data...');
      await seedData();
      console.log('✅ Database seeded');
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
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api/quiz/questions/[subject]/[difficulty]`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
});
