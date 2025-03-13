import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from "./pages/Dashboard";
import TaskCreate from './pages/TaskCreate';
import Navbar from './components/Navbar';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<TaskCreate />} />
        <Route path="/edit/:id" element={<TaskCreate />} />
      </Routes>
    </>
  );
}


export default App;
