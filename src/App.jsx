import React, { useState } from 'react'
import SubjectSelection from './Components/SubjectSelection/SubjectSelection'
import QuizDisplay from './Components/QuizDisplay/QuizDisplay'
import Results from './Components/Results/Results'
import { generateQuizQuestions, generateMockQuestions } from './services/aiService'
import './App.css'

const App = () => {
  const [appState, setAppState] = useState('selection') // selection, loading, quiz, results
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)
  const [questions, setQuestions] = useState([])
  const [quizResults, setQuizResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSelectSubject = async (selectionData) => {
    setSelectedSubject(selectionData.subject.name)
    setSelectedDifficulty(selectionData.difficulty)
    setAppState('loading')
    setError(null)
    
    try {
      // Try to use AI API, fallback to mock data
      let generatedQuestions
      try {
        setLoading(true)
        generatedQuestions = await generateQuizQuestions(
          selectionData.subject.name,
          selectionData.difficulty,
          5
        )
      } catch (apiError) {
        console.warn('AI API failed, using mock questions:', apiError.message)
        // Fallback to mock questions for testing
        generatedQuestions = generateMockQuestions(
          selectionData.subject.name,
          selectionData.difficulty
        )
      }
      
      setQuestions(generatedQuestions)
      setAppState('quiz')
    } catch (err) {
      setError(err.message || 'Failed to generate quiz questions')
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
    handleSelectSubject({ subject: { name: selectedSubject }, difficulty: selectedDifficulty })
  }

  const handleSelectNewSubject = () => {
    setAppState('selection')
    setSelectedSubject(null)
    setSelectedDifficulty(null)
    setQuestions([])
    setQuizResults(null)
    setError(null)
  }

  return (
    <div className="app">
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={handleSelectNewSubject}>Dismiss</button>
        </div>
      )}
      
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Generating quiz questions...</p>
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