// AI Service for generating quiz questions
// Fetches data from MongoDB via backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const generateQuizQuestions = async (subject, difficulty, numberOfQuestions = 5) => {
  if (!subject || !difficulty) {
    throw new Error('Subject and difficulty are required');
  }

  try {
    // Fetch quiz questions from MongoDB via backend API
    const response = await fetch(`${API_BASE_URL}/quiz/questions/${subject}/${difficulty}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to fetch questions`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch questions');
    }

    const questions = data.data || [];
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No questions found');
    }

    const validatedQuestions = questions.map((q) => ({
      question: q.question.trim(),
      options: q.options.map(opt => opt.trim()),
      correctAnswer: q.correctAnswer,
      explanation: q.explanation.trim(),
    }));

    return validatedQuestions.slice(0, numberOfQuestions);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw error;
  }
};

// Get available subjects
export const getAvailableSubjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz/subjects`);
    if (!response.ok) throw new Error('Failed to fetch subjects');
    const data = await response.json();
    return data.success ? data.subjects : getDefaultSubjects();
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return getDefaultSubjects();
  }
};

// Default subjects list
const getDefaultSubjects = () => [
  'Data Structures',
  'Algorithms',
  'Database Management',
  'Operating Systems',
  'Computer Networks',
  'Web Development',
  'Cloud Computing',
  'DevOps',
];

// Mock fallback for testing/offline mode
export const generateMockQuestions = (subject, difficulty) => {
  const samples = {
    'Data Structures': {
      easy: [{
        question: 'Which data structure uses LIFO?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctAnswer: 1,
        explanation: 'Stack uses Last In First Out principle.',
      }],
    },
  };
  return (samples[subject]?.[difficulty] || samples['Data Structures'].easy).slice(0, 5);
};
