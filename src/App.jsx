import React, { useState } from 'react'
import SubjectSelection from './Components/SubjectSelection/SubjectSelection'
import QuizDisplay from './Components/QuizDisplay/QuizDisplay'
import Results from './Components/Results/Results'
import { fetchQuizQuestions } from './services/quizService'
import './App.css'

const App = () => {
  const [appState, setAppState] = useState('selection')
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)
  const [selectedNumberOfQuestions, setSelectedNumberOfQuestions] = useState(5)
  const [questions, setQuestions] = useState([])
  const [quizResults, setQuizResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSelectSubject = async (selectionData) => {
    setSelectedSubject(selectionData.subject.name)
    setSelectedDifficulty(selectionData.difficulty)
    setSelectedNumberOfQuestions(selectionData.numberOfQuestions || 5)
    setAppState('loading')
    setError(null)

    try {
      setLoading(true)
      const generatedQuestions = await fetchQuizQuestions(
        selectionData.subject.name,
        selectionData.difficulty,
        selectionData.numberOfQuestions || 5
      )

      setQuestions(generatedQuestions)
      setAppState('quiz')
    } catch (err) {
      setError(err.message || 'Failed to fetch quiz questions')
      setAppState('selection')
    } finally {
      setLoading(false)
    }
  }

  const handleQuizComplete = (results) => {
    setQuizResults(results)
    setAppState('results')
  }

  const handleRetry = () => {
    handleSelectSubject({ subject: { name: selectedSubject }, difficulty: selectedDifficulty, numberOfQuestions: selectedNumberOfQuestions })
  }

  const handleSelectNewSubject = () => {
    setAppState('selection')
    setSelectedSubject(null)
    setSelectedDifficulty(null)
    setSelectedNumberOfQuestions(5)
    setQuestions([])
    setQuizResults(null)
    setError(null)
  }

  return (
    <div className="app">
      {error && (
        <div className="error-banner">
          <div>{error}</div>
          <div style={{marginTop:8}}>
            <button onClick={() => handleSelectSubject({ subject: { name: selectedSubject }, difficulty: selectedDifficulty })}>Retry</button>
            <button onClick={handleSelectNewSubject} style={{marginLeft:8}}>Go Back</button>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading quiz questions...</p>
        </div>
      )}

      {appState === 'selection' && !loading && (
        <SubjectSelection onSelectSubject={handleSelectSubject} />
      )}

      {appState === 'quiz' && !loading && (
        <QuizDisplay
          questions={questions}
          onComplete={handleQuizComplete}
          subject={selectedSubject}
          difficulty={selectedDifficulty}
        />
      )}

      {appState === 'results' && quizResults && (
        <Results
          score={quizResults.score}
          totalQuestions={quizResults.totalQuestions}
          subject={selectedSubject}
          difficulty={selectedDifficulty}
          onRetry={handleRetry}
          onSelectNewSubject={handleSelectNewSubject}
        />
      )}
    </div>
  )
}

export default App