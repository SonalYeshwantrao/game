import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Question.css';

function Quiz() {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:5200/quiz/qa')
      .then(response => {
        response.data.options = JSON.parse(response.data.options);
        setQuestion(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setQuestionCount(count => count + 1);

    if (option === question.correct_answer) {
      setAnswerStatus(`Correct! The answer is ${question.options[option]}.`);
      setScore(score => score + 1);
    } else {
      setAnswerStatus(`Wrong! The answer is ${question.options[question.correct_answer]}.`);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setAnswerStatus(null);

    if (questionCount === 10) {
      setIsQuizFinished(true);
    } else {
      axios.get('http://127.0.0.1:5200/quiz/qa')
        .then(response => {
          response.data.options = JSON.parse(response.data.options);
          setQuestion(response.data);
        })
        .catch(error => console.error(error));
    }
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  if (isQuizFinished) {
    return (
      <div className="quiz-container">
        <h2 className="quiz-heading">Quiz finished!</h2>
        <p className="quiz-score">Your score is: {score}/{questionCount}</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2 className="quiz-heading">{question.text}</h2>
      <ul className="quiz-options">
        {question.options.map((option, index) => (
          <li key={index}>
            <button className={`quiz-option-btn ${selectedOption === index ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(index)}
              disabled={selectedOption !== null}>
              {option}
            </button>
          </li>
        ))}
      </ul>
      {answerStatus && <p className="quiz-answer-status">{answerStatus}</p>}
      {selectedOption !== null && (
        <button className="quiz-next-btn"
          onClick={handleNextQuestion}>
          {questionCount === 10 ? 'Finish Quiz' : 'Next Question'}
        </button>
      )}
    </div>
  );
}

export default Quiz;

