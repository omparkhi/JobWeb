import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import LoadingSpinner from './components/Common/LoadingSpinner';
import './App.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Placeholder components for different dashboards
const CandidateDashboard: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Candidate Dashboard</h1>
      <p className="text-gray-600">Welcome to your candidate dashboard. Here you can manage your profile, search for jobs, and track your applications.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Profile Completion</h3>
          <p className="text-blue-700">Complete your profile to get better job matches</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Job Matches</h3>
          <p className="text-green-700">View jobs that match your skills and preferences</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Applications</h3>
          <p className="text-purple-700">Track the status of your job applications</p>
        </div>
      </div>
    </div>
  </div>
);

const CompanyDashboard: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Company Dashboard</h1>
      <p className="text-gray-600">Welcome to your company dashboard. Here you can manage job postings, review applications, and find the best talent.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Active Jobs</h3>
          <p className="text-blue-700">Manage your current job postings</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Applications</h3>
          <p className="text-green-700">Review and manage candidate applications</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Company Profile</h3>
          <p className="text-purple-700">Update your company information and branding</p>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
      <p className="text-gray-600">Welcome to the admin dashboard. Here you can manage users, companies, and platform analytics.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Users</h3>
          <p className="text-2xl font-bold text-blue-700">1,234</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Active Jobs</h3>
          <p className="text-2xl font-bold text-green-700">567</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Companies</h3>
          <p className="text-2xl font-bold text-purple-700">89</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">Applications</h3>
          <p className="text-2xl font-bold text-orange-700">2,345</p>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Routes with layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              
              {/* Protected routes */}
              <Route
                path="/candidate/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <CandidateDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <CompanyDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;