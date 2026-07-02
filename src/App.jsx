import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import GalleryPage from './pages/GalleryPage';
import SparePartsPage from './pages/SparePartsPage';
import HomePage from './pages/Homepage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/spare-parts" element={<SparePartsPage />} />
      </Routes>
    </Router>
  );
}

export default App;