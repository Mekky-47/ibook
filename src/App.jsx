import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProfileUpdate from './pages/ProfileUpdate';
import { initEmailJS } from './utils/emailService';
import { isAuthenticated } from './utils/auth';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/profile" replace />;
};

function App() {
  useEffect(() => {
    // Initialize EmailJS on app load
    initEmailJS();

    // Log environment check (remove in production)
    if (import.meta.env.DEV) {
      console.log('🔐 Security features enabled');
      console.log('📧 EmailJS configured:', {
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ? '✓' : '✗',
        loginTemplate: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_LOGIN ? '✓' : '✗',
        updateTemplate: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_UPDATE ? '✓' : '✗',
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? '✓' : '✗'
      });
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileUpdate />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
