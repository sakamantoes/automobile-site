import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import GalleryPage from './pages/GalleryPage';
import SparePartsPage from './pages/SparePartsPage';
import HomePage from './pages/Homepage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';   // ← new
import ProtectedRoute from '../components/ProtectedRoute';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/spare-parts" element={<SparePartsPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;