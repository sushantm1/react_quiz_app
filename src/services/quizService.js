// Quiz Service - Fetches data from MongoDB via backend API
const API_BASE_URL = 'http://3.110.164.48:5000/api'|| import.meta.env.VITE_API_URL;

export const fetchQuizQuestions = async (subject, difficulty, numberOfQuestions = 5) => {
  if (!subject || !difficulty) {
    throw new Error('Subject and difficulty are required');
  }

  try {
    const url = `${API_BASE_URL}/quiz/questions/${encodeURIComponent(subject)}/${encodeURIComponent(difficulty)}?count=${numberOfQuestions}`;
    console.log('Fetching from URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(`Failed to fetch questions: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('Response data:', data);

    if (!data.success) {
      throw new Error(data.message || 'API returned success: false');
    }

    const questions = data.data || [];
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No questions found for this subject/difficulty');
    }

    return questions.slice(0, numberOfQuestions);
  } catch (error) {
    console.error('Error fetching quiz questions:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('Failed to fetch')) {
      console.error('❌ Cannot connect to backend at', API_BASE_URL);
      console.error('📌 Make sure your server is running: cd server && npm run dev');
    }
    
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

// Default subjects fallback
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
