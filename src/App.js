// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import ViewPhotos from './components/ViewPhotos';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import { CssBaseline } from '@mui/material';

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route exact path='/upload' element={ <ProtectedRoute/>}/>
        <Route path="/" element={<ViewPhotos />} />
        
      </Routes>
    </Router>
  );
};

export default App;
