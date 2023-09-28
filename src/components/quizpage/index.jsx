import React, { useEffect, useState } from 'react';
import './index.css';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
const Quiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [visitedQuestions, setVisitedQuestions] = useState(Array(15).fill(false));
  const [selectedOptions, setSelectedOptions] = useState(Array(15).fill(null));
  const [timer, setTimer] = useState(30*60);
  const userId = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    // Define the API endpoint URL
    const apiUrl = 'https://opentdb.com/api.php?amount=15';

    // Fetch data from the API
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const questionsWithId = data.results.map((question, index) => ({
          ...question,
          id: index + 1,
          options: [...question.incorrect_answers, question.correct_answer],
        }));
        setQuizData(questionsWithId);

        // Initialize the first question as visited when data is fetched
        const updatedVisitedQuestions = [...visitedQuestions];
        updatedVisitedQuestions[0] = true;
        setVisitedQuestions(updatedVisitedQuestions);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array to run this effect only once

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);

      // Mark the next question as visited
      const updatedVisitedQuestions = [...visitedQuestions];
      updatedVisitedQuestions[currentQuestion + 1] = true;
      setVisitedQuestions(updatedVisitedQuestions);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleOverviewClick = (index) => {
    // Set the current question to the clicked question
    setCurrentQuestion(index);

    // Mark the clicked question as visited
    const updatedVisitedQuestions = [...visitedQuestions];
    updatedVisitedQuestions[index] = true;
    setVisitedQuestions(updatedVisitedQuestions);
  };

  const currentQuestionData = quizData && quizData[currentQuestion];
  const handleOptionChange = (option) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[currentQuestion] = option;
    setSelectedOptions(updatedSelectedOptions);
  };
  useEffect(() => {
    // Retrieve the timer value from local storage
    const storedTimer = localStorage.getItem('quizTimer');
    if (storedTimer !== null) {
      setTimer(parseInt(storedTimer, 10));
    }

    // Start the timer interval
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        const newTimer = prevTimer - 1;

        // Store the new timer value in local storage
        localStorage.setItem('quizTimer', newTimer.toString());
        if (newTimer === 0) {
          // Timer has reached 0, automatically submit the test
          handleSubmit();
        }
        return newTimer;
      });
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);
  // Format the timer value into minutes and seconds
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  // Calculate the count of attempted questions
  const attemptedQuestionsCount = selectedOptions.filter((visited) => visited).length;
  const handleSubmit = () => {
    // Collect the user's answers
    const answers = selectedOptions;

    // Send a POST request to your server with the answers
    fetch('https://quiz-leyt.onrender.com/email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    user: userId, // Specify the user to update within the request body
    data: quizData,
    selectedOptions: selectedOptions,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    // Handle the response from the server as needed
    console.log('Data updated successfully:', data);
    navigate("/ans");
  })
  .catch((error) => {
    console.error('Error updating data:', error);
  });
  };
  return (
    <div>
    

      {quizData && userId != null ? (
        <div className="white__board">
          <div className="left__ques">
            <div className="surround">
              <div className='head_ques'>Question {currentQuestionData.id}</div>
              <p className='ques'>{currentQuestionData.question}</p>
            </div>
            <ul>
              {currentQuestionData.options.map((option, index) => (
                <div
                  className={`option ${selectedOptions[currentQuestion] === option ? 'selected' : 'notselected'}`}
                  onClick={() => handleOptionChange(option)}
                  key={index}
                >
                  {option}
                </div>
              ))}
            </ul>
            <div className="buttons">
              <button className="prev" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>Previous</button>
              <button className="next" onClick={handleNextQuestion} disabled={currentQuestion === quizData.length - 1}>Next</button>
            </div>
          </div>
          <div className="right__ques">
            <div className="timer">
            Time Left <span className="times">{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</span>
            </div>
            <div className="overview">
              <h3>{`Questions : ${attemptedQuestionsCount}/15`}</h3>
              <div className="question-grid">
                {visitedQuestions.map((visited, index) => (
                  <div
                    key={index}
                    className={`question-number ${visited ? 'visited' : ''} ${selectedOptions[index] ? 'attempted' : ''}`}
                    onClick={() => handleOverviewClick(index)}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
            <div className="submit_test">
            <button className="submit-button" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      ) : (

          userId == null ? 
            navigate("/")
          :
          
            <p>Loading...</p>
          
        
      )}
    </div>
  );
};

export default Quiz;
