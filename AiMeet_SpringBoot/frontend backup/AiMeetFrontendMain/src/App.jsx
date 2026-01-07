import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import SubTopics from './components/SubTopics';
import CreateTopic from './components/CreateTopic';
function App() {
  // Check if user data exists in localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Page Route */}
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
        />

        {/* Protected Dashboard Route */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" replace />} 
        />

        {/* Default route — redirect based on login status */}
        <Route 
          path="*" 
          element={<Navigate to={user ? "/dashboard" : "/auth"} replace />} 
        />
        { user &&

        <Route path="/createTopic" element = {<CreateTopic/>} />

        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
