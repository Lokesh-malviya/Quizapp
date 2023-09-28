import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const UserData = () => {
    const userId = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make an API call to fetch user data
    fetch('http://localhost:3000/email')
      .then((response) => response.json())
      .then((data) => {
        // Find the user data with email "LOKSH"
        /* const userDataWithEmail = data.user.find((item) => item.email === userId); */
        const foundUser = data.find((user) => user.user === userId);
        console.log(foundUser);
        if (foundUser) {
          setUserData(foundUser);
        }
        
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading user data...</p>
      ) : (
        userData ? (
          <div>
            <h2>User Data</h2>
            <p>Email: {userData.email}</p>
            <p>ID: {userData.id}</p>
            {/* You can add additional rendering for other data fields */}
          </div>
        ) : (
          <p>User data not found.{console.log(userId)}</p>
        )
      )}
    </div>
  );
};

export default UserData;
