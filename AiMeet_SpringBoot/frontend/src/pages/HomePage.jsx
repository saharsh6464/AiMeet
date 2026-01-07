import React,{useState} from 'react';
import './HomePage.css'
import { useNavigate } from 'react-router-dom';

function HomePage(){
  const [roomCode,setRoomCode] =useState('');
  const navigate = useNavigate();

  function handleFormSubmit(ev){
    ev.preventDefault();
    navigate(`/room/${roomCode}`);
  }

  return (
    <div className = "home-page">
      <form className="form" onSubmit={handleFormSubmit}>
        <div>
          <label>Enter Room Code</label>
          <input
            placeholder='Enter Room Code'
            type='text' required
            value={roomCode}
            onChange={(e)=>{setRoomCode(e.target.value)}}
          />
        </div>
        <button type="submit">Enter Room</button>
      </form>
    </div>
  );
}

export default HomePage;