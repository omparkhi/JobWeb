import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import CandidateDashboard from './pages/Dashboard/CandidateDashboard';
import CompanyDashboard from './pages/Dashboard/CompanyDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import JobsPage from './pages/Jobs/JobsPage';
import JobDetailsPage from './pages/Jobs/JobDetailsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import './App.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    // Redirect based on user role
    switch (user.role) {
      case 'candidate':
        return <Navigate to="/candidate/dashboard" replace />;
      case 'company':
        return <Navigate to="/company/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

// Unauthorized Page
const UnauthorizedPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
      <p className="text-gray-300 mb-8">You don't have permission to access this page.</p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <Layout>
                    <LandingPage />
                  </Layout>
                </PublicRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } 
            />

            {/* Public Jobs Page (accessible to all) */}
            <Route 
              path="/jobs" 
              element={
                <Layout>
                  <JobsPage />
                </Layout>
              } 
            />
            <Route 
              path="/jobs/:id" 
              element={
                <Layout>
                  <JobDetailsPage />
                </Layout>
              } 
            />

            {/* Protected Routes - Candidate */}
            <Route 
              path="/candidate/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <Layout>
                    <CandidateDashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/candidate/profile" 
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Protected Routes - Company */}
            <Route 
              path="/company/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <Layout>
                    <CompanyDashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/company/profile" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Protected Routes - Admin */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Error Routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(15, 23, 42, 0.95)',
                color: '#fff',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                backdropFilter: 'blur(10px)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;