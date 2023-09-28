import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './index.css'
const UserData = () => {
  const userId = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make an API call to fetch user data
    fetch('https://quiz-leyt.onrender.com/email')
      .then((response) => response.json())
      .then((data) => {
        const foundUser = data.find((user) => user.user === userId);
        if (foundUser) {
          setUserData(foundUser);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, [userId]);

  return (
    <div>
      {loading ? (
        <p>Loading user data...</p>
      ) : (
        userData ? (
          <div>
            {userData.data.map((question) => (
              <div key={question.id} className="question">
                <p className={userData.selectedOptions[question.id - 1] === null ? 'ntatt' : 'att'}>
                  {userData.selectedOptions[question.id - 1] === null
                    ? 'Not Attempted'
                    : 'Attempted'}
                </p>
                <p>{question.question}</p>
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: option === question.correct_answer ? 'green' : option === userData.selectedOptions[question.id - 1] ? 'red' : 'white',
                      padding:'1.2rem'
                    }}
                  >
                    {option}
                  </div>
                ))}

              </div>
            ))}
          </div>
        ) : (
          <p>User data not found.</p>
        )
      )}
    </div>
  );
};

export default UserData;
