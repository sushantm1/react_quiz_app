import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rotateRight = (arr, shift) => {
  const n = arr.length;
  const s = ((shift % n) + n) % n;
  if (s === 0) return arr.slice();
  return arr.slice(n - s).concat(arr.slice(0, n - s));
};

const ensureQuestionShape = (q) => {
  if (!q || typeof q !== 'object') return false;
  if (typeof q.question !== 'string' || !q.question.trim()) return false;
  if (!Array.isArray(q.options) || q.options.length !== 4) return false;
  if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) return false;
  if (typeof q.explanation !== 'string' || !q.explanation.trim()) return false;
  return true;
};

const makeVariant = (q, variantNumber) => {
  const shift = (variantNumber % 3) + 1; // 1..3
  const options = rotateRight(q.options, shift);
  const correctAnswer = (q.correctAnswer + shift) % 4;

  const base = q.question.trim().replace(/\s+\(Practice \d+\)\?$/, '').replace(/\?$/, '');
  const question = `${base} (Practice ${variantNumber})?`;
  const explanation = `${q.explanation.trim()} (Practice variant.)`;

  return { question, options, correctAnswer, explanation };
};

const run = async () => {
  const filePath = path.join(__dirname, 'questions.json');
  const raw = await fs.readFile(filePath, 'utf8');
  const quizSets = JSON.parse(raw);

  if (!Array.isArray(quizSets)) {
    throw new Error('questions.json must be a JSON array');
  }

  let changedSets = 0;

  for (const set of quizSets) {
    if (!set || typeof set !== 'object') continue;
    if (!Array.isArray(set.questions)) continue;

    const baseQuestions = set.questions.filter(ensureQuestionShape);
    if (baseQuestions.length === 0) continue;

    const originalCount = set.questions.length;

    // Normalize to exactly 20
    const normalized = baseQuestions.slice(0, 20);

    let variantNumber = 1;
    while (normalized.length < 20) {
      const base = baseQuestions[(variantNumber - 1) % baseQuestions.length];
      normalized.push(makeVariant(base, variantNumber));
      variantNumber += 1;
    }

    set.questions = normalized;

    if (originalCount !== set.questions.length) {
      changedSets += 1;
    }
  }

  await fs.writeFile(filePath, JSON.stringify(quizSets, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated questions.json. Sections changed: ${changedSets}`);
};

run().catch((e) => {
  console.error('❌ Failed to update questions.json');
  console.error(e?.message || e);
  process.exitCode = 1;
});
