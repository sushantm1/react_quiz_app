import React, { useState } from 'react';
import './SubjectSelection.css';

const SubjectSelection = ({ onSelectSubject }) => {
  const subjects = [
    { id: 1, name: 'Data Structures', icon: '🏗️' },
    { id: 2, name: 'Algorithms', icon: '⚙️' },
    { id: 3, name: 'Database Management', icon: '🗄️' },
    { id: 4, name: 'Operating Systems', icon: '🖥️' },
    { id: 5, name: 'Computer Networks', icon: '🌐' },
    { id: 6, name: 'Web Development', icon: '🌐' },
    { id: 7, name: 'Cloud Computing', icon: '☁️' },
    { id: 8, name: 'DevOps', icon: '🔄' },
  ];

  const [difficulty, setDifficulty] = useState('medium');
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleStart = () => {
    if (selectedSubject) {
      onSelectSubject({ subject: selectedSubject, difficulty });
    }
  };

  return (
    <div className="selection-container">
      <div className="selection-content">
        <h1>Quiz Master</h1>
        <p className="subtitle">Select a subject and difficulty level to begin</p>

        <div className="difficulty-selector">
          <label>Difficulty Level:</label>
          <div className="difficulty-buttons">
            {['easy', 'medium', 'hard'].map((level) => (
              <button
                key={level}
                className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
                onClick={() => setDifficulty(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="subjects-grid">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className={`subject-card ${selectedSubject?.id === subject.id ? 'selected' : ''}`}
              onClick={() => setSelectedSubject(subject)}
            >
              <span className="subject-icon">{subject.icon}</span>
              <h3>{subject.name}</h3>
            </div>
          ))}
        </div>

        <button
          className={`start-button ${selectedSubject ? 'enabled' : 'disabled'}`}
          onClick={handleStart}
          disabled={!selectedSubject}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default SubjectSelection;
