import React ,{useEffect} from 'react'
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

    const enterFullscreen = () => {
      const elem = document.documentElement;
  
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    };
  
    useEffect(() => {
      const exitFullscreenHandler = () => {
        // Check if we are currently in fullscreen mode
        if (
          !document.fullscreenElement &&
          !document.mozFullScreenElement &&
          !document.webkitFullscreenElement &&
          !document.msFullscreenElement
        ) {
          // User has exited fullscreen, navigate back to the main screen
          navigate('/');
        }
      };
  
      document.addEventListener('fullscreenchange', exitFullscreenHandler);
      document.addEventListener('mozfullscreenchange', exitFullscreenHandler);
      document.addEventListener('webkitfullscreenchange', exitFullscreenHandler);
      document.addEventListener('msfullscreenchange', exitFullscreenHandler);
  
      // Clean up the event listeners when the component unmounts
      return () => {
        document.removeEventListener('fullscreenchange', exitFullscreenHandler);
        document.removeEventListener('mozfullscreenchange', exitFullscreenHandler);
        document.removeEventListener('webkitfullscreenchange', exitFullscreenHandler);
        document.removeEventListener('msfullscreenchange', exitFullscreenHandler);
      };
    }, [navigate]);
  
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
            <button className='submit' type="submit" onClick={enterFullscreen}>Enter ✨</button>
            </div>
        </form>
         </div>
      </div>
    </div>
  )
}

export default Home
