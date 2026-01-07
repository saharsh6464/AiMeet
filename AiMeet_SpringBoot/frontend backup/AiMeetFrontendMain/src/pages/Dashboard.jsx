import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, List, PlayCircle, Hash } from 'lucide-react'; 
import StartNewCapture from '../components/StartNewCapture';
import TopicManagement from '../components/TopicManagement';
import SubTopics from '../components/SubTopics';

// --- SegmentedControl Component ---
const SegmentedControl = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ease-in-out ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
    }`}
    onClick={onClick}
  >
    <Icon className="w-4 h-4 mr-2" />
    {label}
  </button>
);

// --- Dashboard Component ---
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('new'); 

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth'); 
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'new':
        return <StartNewCapture />;

      case 'topics':
        return <TopicManagement />;
      case 'subtopics': // ✅ fixed: consistent key
        return <SubTopics />;
      default:
        return null;
    }
  };

  const getHeaderTitle = () => {
    switch (activeView) {
      case 'new': return 'Meeting Capture Setup';
      case 'topics': return 'Topics Hosted By You';
      case 'subtopics': return 'Meetings'; // ✅ fixed: consistent key & label
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 transition-colors duration-500 dark:bg-gray-900 dark:text-white">
      {/* 1. Header/Navigation Bar */}
      <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-100 p-4 transition-colors duration-500 dark:bg-gray-800 dark:border-gray-700">
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          {/* Logo/App Name */}
          <h1 className="text-2xl font-extrabold text-blue-600 tracking-wider">
            AI<span className='font-light text-gray-800 dark:text-white'>MEET</span>
          </h1>
          
          {/* Segmented Controls */}
          <div className="flex items-center space-x-6">
            <div className="flex space-x-2">
              <SegmentedControl 
                icon={PlayCircle} 
                label="Start New" 
                isActive={activeView === 'new'} 
                onClick={() => setActiveView('new')}
              />
            
              <SegmentedControl 
                icon={List} 
                label="Topics" 
                isActive={activeView === 'topics'} 
                onClick={() => setActiveView('topics')}
              />
              <SegmentedControl 
                icon={Hash} // ✅ added tab for subtopics
                label="Subtopics"
                isActive={activeView === 'subtopics'}
                onClick={() => setActiveView('subtopics')}
              />
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-blue-600 font-semibold text-xs border border-blue-300 dark:bg-gray-700 dark:border-blue-500 dark:text-blue-400">JD</div>
              <span className="font-medium hidden sm:inline">John Doe</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition duration-150 dark:text-gray-400 dark:hover:bg-red-900/40"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="max-w-7xl mx-auto py-10 px-6 sm:px-8">
        <h1 className="text-3xl font-light text-gray-700 mb-8 pb-4 border-b border-gray-200 dark:text-gray-300 dark:border-gray-700">
          {getHeaderTitle()}
        </h1>
        {renderMainContent()}
      </main>
    </div>
  );
};

export default Dashboard;
