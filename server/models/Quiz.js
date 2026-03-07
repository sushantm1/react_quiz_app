import mongoose from 'mongoose';

// Schema for individual quiz questions
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length === 4,
      message: 'Must have exactly 4 options',
    },
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  explanation: {
    type: String,
    required: true,
  },
});

// Main Quiz Schema
const quizSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      enum: [
        'Data Structures',
        'Algorithms',
        'Database Management',
        'Operating Systems',
        'Computer Networks',
        'Web Development',
        'Cloud Computing',
        'DevOps',
      ],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard'],
    },
    questions: [questionSchema],
    numberOfQuestions: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
