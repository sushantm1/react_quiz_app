import React from 'react'
import './Quiz.css'

const Quiz = () => {

  return (
    <div className='container'>
      <h1>Quiz App</h1>
    <hr />
    <h2>1. Which of the foloeig </h2>
    <ul>
      <li>option 1</li>
      <li>option 2</li>
      <li>option 3</li>
      <li>option 4</li>
    </ul>
    <button>Next</button>
    <div className='index'>
      Question 1 of 10
    </div>
    </div>
  )
}

export default Quiz
