import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddExperience from './pages/AddExperience';
import ExperienceDetails from './pages/ExperienceDetails';
import EditExperience from './pages/EditExperience';
import OffCampus from './pages/OffCampus';
import AddOffCampus from './pages/AddOffCampus';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-experience" 
          element={
            <ProtectedRoute>
              <AddExperience />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/experience/:id" 
          element={
            <ProtectedRoute>
              <ExperienceDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-experience/:id" 
          element={
            <ProtectedRoute>
              <EditExperience />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/offcampus" 
          element={
            <ProtectedRoute>
              <OffCampus />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-offcampus" 
          element={
            <ProtectedRoute>
              <AddOffCampus />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to="/login" replace />} 
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;