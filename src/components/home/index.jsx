import React from 'react'
import './index.css';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/index";

const Home = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = async (e) => {
      e.preventDefault();
     
     
        
     
            dispatch(
              setLogin({
                user:email,
              }),
            );
      
            console.log("loged in")
            navigate("/quiz");
      
          
       
    };
  
  return (
    <div>
      <div className="white__box">
      <div className="col3">
      <form onSubmit={handleSubmit}>
      <div className='col4'>
            <div className='headline'>QuizMaster : Test Your Knowledge!</div>
            <input className="effect" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text" placeholder="Email"/>
            <button className='submit' type="submit">Enter ✨</button>
            </div>
        </form>
         </div>
      </div>
    </div>
  )
}

export default Home
