import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from "./pages/Dashboard";
import TaskCreate from './pages/TaskCreate';
import CommentsPage from './pages/CommentsPage';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<TaskCreate />} />
          <Route path="/edit/:id" element={<TaskCreate />} />
          <Route path="/tasks/:taskId" element={<CommentsPage />} />
          <Route path="/task/:taskId/comments" element={<CommentsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
