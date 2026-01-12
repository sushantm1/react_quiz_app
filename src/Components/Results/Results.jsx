import React from 'react';
import './Results.css';

const Results = ({ score, totalQuestions, subject, difficulty, onRetry, onSelectNewSubject }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getPerformanceMessage = () => {
    if (percentage === 100) return "Perfect! You're a quiz master! 🏆";
    if (percentage >= 80) return "Excellent performance! Well done! 🎉";
    if (percentage >= 60) return "Good job! Keep practicing! 👍";
    if (percentage >= 40) return "Not bad! Review and try again! 📚";
    return "Keep learning! You'll do better next time! 💪";
  };

  const getPerformanceColor = () => {
    if (percentage === 100) return '#FFD700';
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#2196F3';
    if (percentage >= 40) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="results-container">
      <div className="results-content">
        <div className="results-header">
          <h1>Quiz Completed! 🎊</h1>
          <p className="subject-info">{subject} - {difficulty} Level</p>
        </div>

        <div className="score-circle" style={{ borderColor: getPerformanceColor() }}>
          <div className="score-number" style={{ color: getPerformanceColor() }}>
            {percentage}%
          </div>
          <div className="score-text">Score</div>
        </div>

        <div className="score-details">
          <div className="detail-item">
            <span className="detail-label">Correct Answers:</span>
            <span className="detail-value correct">{score}</span>
          </div>
          <div className="divider"></div>
          <div className="detail-item">
            <span className="detail-label">Total Questions:</span>
            <span className="detail-value">{totalQuestions}</span>
          </div>
          <div className="divider"></div>
          <div className="detail-item">
            <span className="detail-label">Wrong Answers:</span>
            <span className="detail-value incorrect">{totalQuestions - score}</span>
          </div>
        </div>

        <div className="performance-message">
          {getPerformanceMessage()}
        </div>

        <div className="results-buttons">
          <button className="button retry-button" onClick={onRetry}>
            Retry Same Quiz
          </button>
          <button className="button new-subject-button" onClick={onSelectNewSubject}>
            Select Another Subject
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
