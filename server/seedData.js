import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Quiz from './models/Quiz.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const validateQuizSet = (quizSet) => {
  if (!quizSet || typeof quizSet !== 'object') return 'Invalid quiz set (not an object)';
  const { subject, difficulty, questions } = quizSet;
  if (!subject || typeof subject !== 'string') return 'Missing/invalid subject';
  if (!difficulty || typeof difficulty !== 'string') return 'Missing/invalid difficulty';
  if (!Array.isArray(questions) || questions.length === 0) return 'Missing/invalid questions array';

  for (const [index, q] of questions.entries()) {
    if (!q || typeof q !== 'object') return `Question ${index} is invalid`;
    if (typeof q.question !== 'string' || !q.question.trim()) return `Question ${index} missing question text`;
    if (!Array.isArray(q.options) || q.options.length !== 4) return `Question ${index} must have exactly 4 options`;
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
      return `Question ${index} correctAnswer must be 0..3`;
    }
    if (typeof q.explanation !== 'string' || !q.explanation.trim()) return `Question ${index} missing explanation`;
  }

  return null;
};

const seedData = async () => {
  const questionsFile = path.join(__dirname, 'questions.json');

  const raw = await fs.readFile(questionsFile, 'utf-8');
  const quizSets = JSON.parse(raw);

  if (!Array.isArray(quizSets) || quizSets.length === 0) {
    throw new Error('questions.json must be a non-empty JSON array');
  }

  for (const [i, quizSet] of quizSets.entries()) {
    const err = validateQuizSet(quizSet);
    if (err) {
      throw new Error(`Validation failed for quizSet[${i}]: ${err}`);
    }
  }

  let upserted = 0;
  for (const quizSet of quizSets) {
    const { subject, difficulty, questions } = quizSet;
    await Quiz.findOneAndUpdate(
      { subject, difficulty },
      {
        $set: {
          subject,
          difficulty,
          questions,
          numberOfQuestions: questions.length,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    upserted += 1;
  }

  return upserted;
};

export default seedData;