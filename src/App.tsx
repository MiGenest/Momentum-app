import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';

import Dashboard from '../src/pages/Dashboard';
// import TaskCreate from '../pages/TaskCreate';

import Navbar from '../src/components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* { <Route path="/create" element={<TaskCreate />} />} */}
        {/* { <Route path="/edit/:id" element={<TaskCreate />} /> } */}
      </Routes>
    </Router>
  );
}

export default App;
