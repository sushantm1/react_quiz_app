import express from 'express';
import Quiz from '../models/Quiz.js';

const router = express.Router();

// GET quiz questions by subject and difficulty
router.get('/questions/:subject/:difficulty', async (req, res) => {
  try {
    const { subject, difficulty } = req.params;

    // Fetch from database
    const quiz = await Quiz.findOne({ subject, difficulty });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: `No quiz found for ${subject} - ${difficulty}`,
      });
    }

    // Return the questions (limit to numberOfQuestions)
    const questions = quiz.questions.slice(0, quiz.numberOfQuestions);

    res.json({
      success: true,
      data: questions,
      subject,
      difficulty,
      total: questions.length,
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
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
    const subjects = [
      'Data Structures',
      'Algorithms',
      'Database Management',
      'Operating Systems',
      'Computer Networks',
      'Web Development',
      'Cloud Computing',
      'DevOps',
    ];

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
