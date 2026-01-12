import React, { useState, useEffect } from 'react';
import './QuizDisplay.css';

const QuizDisplay = ({ questions, onComplete, subject, difficulty }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  if (!questions || questions.length === 0) {
    return <div className="loading">Loading questions...</div>;
  }

  const question = questions[currentQuestion];

  const handleAnswerClick = (optionIndex) => {
    if (!selectedAnswers[currentQuestion]) {
      const newAnswers = { ...selectedAnswers, [currentQuestion]: optionIndex };
      setSelectedAnswers(newAnswers);

      // Check if answer is correct
      if (optionIndex === question.correctAnswer) {
        setScore(score + 1);
      }

      setShowResult(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowResult(false);
    } else {
      // Quiz completed
      onComplete({ score, totalQuestions: questions.length });
    }
  };

  const isAnswered = selectedAnswers[currentQuestion] !== undefined;
  const isCorrect = selectedAnswers[currentQuestion] === question.correctAnswer;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-info">
          <h1>{subject}</h1>
          <span className="difficulty-badge">{difficulty}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
        <div className="question-counter">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div className="quiz-content">
        <h2 className="question-text">{question.question}</h2>

        <div className="options">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${
                selectedAnswers[currentQuestion] === index
                  ? isCorrect
                    ? 'correct'
                    : 'incorrect'
                  : ''
              }`}
              onClick={() => handleAnswerClick(index)}
              disabled={isAnswered}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
              {isAnswered && selectedAnswers[currentQuestion] === index && (
                <span className="option-icon">
                  {isCorrect ? '✓' : '✗'}
                </span>
              )}
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`feedback ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
            <p>
              {isCorrect
                ? '🎉 Correct! Great job!'
                : `❌ Wrong! The correct answer is ${String.fromCharCode(65 + question.correctAnswer)}`}
            </p>
            {question.explanation && (
              <p className="explanation">{question.explanation}</p>
            )}
          </div>
        )}
      </div>

      <div className="quiz-footer">
        <div className="score-display">
          Score: {score}/{questions.length}
        </div>
        <button
          className="next-button"
          onClick={handleNext}
          disabled={!isAnswered}
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default QuizDisplay;
