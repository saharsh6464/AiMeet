import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import RoomPage from './pages/RoomPage';
import TabAndMicRecorder from './pages/TabAndMicRecorder';
import 
function App() {
  return (
    <>
      {/* <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes> */}
      <TabAndMicRecorder/>
    </>
  );
}

export default App;
