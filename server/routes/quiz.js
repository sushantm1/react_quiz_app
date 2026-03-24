import express from 'express';
import Quiz from '../models/Quiz.js';

const router = express.Router();

// GET quiz questions by subject and difficulty
router.get('/questions/:subject/:difficulty', async (req, res) => {
  try {
    const { subject, difficulty } = req.params;
    const count = Math.min(parseInt(req.query.count) || 5, 20);

    // Decode URL parameters
    const decodedSubject = decodeURIComponent(subject);
    const decodedDifficulty = decodeURIComponent(difficulty);

    console.log(`📝 Fetching: Subject="${decodedSubject}", Difficulty="${decodedDifficulty}", Count=${count}`);

    // Fetch from database
    const quiz = await Quiz.findOne({ 
      subject: decodedSubject, 
      difficulty: decodedDifficulty 
    });

    if (!quiz) {
      console.warn(`⚠️ Quiz not found for ${decodedSubject} - ${decodedDifficulty}`);
      
      // Debug: show what's in the database
      const allQuizzes = await Quiz.find({}, { subject: 1, difficulty: 1 });
      console.log('📊 Available quizzes in DB:', allQuizzes.map(q => `${q.subject} - ${q.difficulty}`));
      
      return res.status(404).json({
        success: false,
        message: `No quiz found for ${decodedSubject} - ${decodedDifficulty}`,
      });
    }

    // Shuffle and slice to requested count
    const shuffled = [...quiz.questions].sort(() => Math.random() - 0.5);
    const questions = shuffled.slice(0, count);

    console.log(`✅ Found ${questions.length} questions`);

    res.json({
      success: true,
      data: questions,
      subject: decodedSubject,
      difficulty: decodedDifficulty,
      total: questions.length,
    });
  } catch (error) {
    console.error('❌ Error fetching quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz questions',
      error: error.message,
    });
  }
});

// GET all available subjects
router.get('/subjects', async (req, res) => {
  try {
    // Pull subjects directly from MongoDB so the UI matches what's actually in the DB
    let subjects = await Quiz.distinct('subject');
    subjects = (subjects || []).filter(Boolean).sort();

    // Fallback (keeps UI usable if DB is empty)
    if (subjects.length === 0) {
      subjects = [
        'Data Structures',
        'Algorithms',
        'Database Management',
        'Operating Systems',
        'Computer Networks',
        'Web Development',
        'Cloud Computing',
        'DevOps',
      ];
    }

    res.json({
      success: true,
      subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subjects',
      error: error.message,
    });
  }
});

// POST - Add quiz questions (admin only)
router.post('/add', async (req, res) => {
  try {
    const { subject, difficulty, questions } = req.body;

    if (!subject || !difficulty || !questions) {
      return res.status(400).json({
        success: false,
        message: 'Subject, difficulty, and questions are required',
      });
    }

    // Check if quiz already exists
    let quiz = await Quiz.findOne({ subject, difficulty });

    if (quiz) {
      // Update existing quiz
      quiz.questions = questions;
      quiz.numberOfQuestions = questions.length;
    } else {
      // Create new quiz
      quiz = new Quiz({
        subject,
        difficulty,
        questions,
        numberOfQuestions: questions.length,
      });
    }

    await quiz.save();

    res.json({
      success: true,
      message: 'Quiz added/updated successfully',
      data: quiz,
    });
  } catch (error) {
    console.error('Error adding quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding quiz',
      error: error.message,
    });
  }
});

export default router;
