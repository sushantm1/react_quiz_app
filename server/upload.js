import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Quiz from './models/Quiz.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;

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

const run = async () => {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing. Add it to server/.env');
    process.exitCode = 1;
    return;
  }

  const questionsFile = path.join(__dirname, 'questions.json');

  let quizSets;
  try {
    const raw = await fs.readFile(questionsFile, 'utf-8');
    quizSets = JSON.parse(raw);
  } catch (e) {
    console.error(`❌ Failed to read/parse questions.json at ${questionsFile}`);
    console.error(e?.message || e);
    process.exitCode = 1;
    return;
  }

  if (!Array.isArray(quizSets) || quizSets.length === 0) {
    console.error('❌ questions.json must be a non-empty JSON array');
    process.exitCode = 1;
    return;
  }

  for (const [i, quizSet] of quizSets.entries()) {
    const err = validateQuizSet(quizSet);
    if (err) {
      console.error(`❌ Validation failed for quizSet[${i}]: ${err}`);
      process.exitCode = 1;
      return;
    }
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

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

    console.log(`✅ Uploaded ${upserted} quiz sets from questions.json`);
  } catch (e) {
    console.error('❌ Upload failed');
    console.error(e?.message || e);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => undefined);
  }
};

// Run when invoked via `node upload.js`
run();
