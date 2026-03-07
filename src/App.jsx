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
  const [apiTestResult, setApiTestResult] = useState(null)

  const handleSelectSubject = async (selectionData) => {
    setSelectedSubject(selectionData.subject.name)
    setSelectedDifficulty(selectionData.difficulty)
    setAppState('loading')
    setError(null)
    
    try {
      // Always attempt API call; on failure surface error so user can retry
      setLoading(true)
      const generatedQuestions = await generateQuizQuestions(
        selectionData.subject.name,
        selectionData.difficulty,
        5
      )

      setQuestions(generatedQuestions)
      setAppState('quiz')
    } catch (err) {
      setError(err.message || 'Failed to generate quiz questions')
      setAppState('selection')
    } finally {
      setLoading(false)
    }
  }

  const handleUseMock = () => {
    const mocked = generateMockQuestions(selectedSubject || 'Data Structures', selectedDifficulty || 'easy', 5)
    setQuestions(mocked)
    setAppState('quiz')
  }

  const testApi = async () => {
    setApiTestResult('Testing...')
    try {
      const res = await generateQuizQuestions('Data Structures', 'easy', 1)
      setApiTestResult(`Success: received ${res.length} question`)
    } catch (e) {
      setApiTestResult(`Error: ${e.message}`)
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
          <div>{error}</div>
          <div style={{marginTop:8}}>
            <button onClick={() => handleSelectSubject({ subject: { name: selectedSubject }, difficulty: selectedDifficulty })}>Retry API</button>
            <button onClick={handleUseMock} style={{marginLeft:8}}>Use Mock Questions</button>
            <button onClick={handleSelectNewSubject} style={{marginLeft:8}}>Dismiss</button>
          </div>
        </div>
      )}
      
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Generating quiz questions...</p>
        </div>
      )}

      {appState === 'selection' && !loading && (
        <>
          <SubjectSelection onSelectSubject={handleSelectSubject} />
          <div style={{marginTop:12}}>
            <button onClick={testApi}>Test API</button>
            {apiTestResult && <div style={{marginTop:8}}>{apiTestResult}</div>}
          </div>
        </>
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