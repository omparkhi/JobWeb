import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      const { access_token, user_id, role, name } = response.data;
      
      const userData = { id: user_id, email, name, role };
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const register = async (email, password, name, role) => {
    try {
      const response = await axios.post(`${API}/auth/register`, { email, password, name, role });
      const { access_token, user_id } = response.data;
      
      const userData = { id: user_id, email, name, role };
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// Navigation Component
const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="bg-black border-b border-white/10 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">
            <span className="text-white">CMO India</span>
            <span className="text-blue-400 ml-2">Hiring</span>
          </h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs bg-blue-600 px-2 py-1 rounded-full ml-2 capitalize">
                {user.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

// Landing Page
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">
            CMO India <span className="text-blue-400 animate-pulse">Hiring Platform</span>
          </h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto animate-fade-in-delay">
            Connect top talent with leading companies. Your career journey starts here.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="interactive-card bg-white/5 backdrop-blur-md rounded-xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 border border-white/10">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-blue-400">For Candidates</h3>
                <p className="mb-6 text-gray-300">Find your dream job with top companies</p>
              </div>
              <button
                onClick={() => navigate('/register?role=candidate')}
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Join as Candidate
              </button>
            </div>
            
            <div className="interactive-card bg-white/5 backdrop-blur-md rounded-xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 border border-white/10">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-green-400">For Companies</h3>
                <p className="mb-6 text-gray-300">Hire the best talent for your organization</p>
              </div>
              <button
                onClick={() => navigate('/register?role=company')}
                className="w-full bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Join as Company
              </button>
            </div>
            
            <div className="interactive-card bg-white/5 backdrop-blur-md rounded-xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 border border-white/10">
              <div className="mb-6">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Admin Portal</h3>
                <p className="mb-6 text-gray-300">Manage platform and users</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Admin Login
              </button>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 animate-fade-in-delay-2">
            <button
              onClick={() => navigate('/login')}
              className="bg-transparent border-2 border-white px-8 py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg shadow-blue-600/30"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-particle w-2 h-2 bg-blue-400 rounded-full absolute top-1/4 left-1/5"></div>
        <div className="floating-particle w-1 h-1 bg-white rounded-full absolute top-1/3 right-1/4"></div>
        <div className="floating-particle w-3 h-3 bg-blue-600 rounded-full absolute bottom-1/4 left-1/3"></div>
      </div>
    </div>
  );
};

// Login Page
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'candidate' ? '/candidate' : 
               user.role === 'company' ? '/company' : '/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      const role = JSON.parse(localStorage.getItem('user')).role;
      navigate(role === 'candidate' ? '/candidate' : 
               role === 'company' ? '/company' : '/admin');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 w-full max-w-md border border-white/10 hover:bg-white/10 transition-all duration-300 relative z-10">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Welcome Back
        </h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4 animate-shake">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-white font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-white font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/register')}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
          >
            Don't have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
};

// Register Page
const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('candidate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    if (roleParam) {
      setRole(roleParam);
    }
  }, []);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'candidate' ? '/candidate' : 
               user.role === 'company' ? '/company' : '/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await register(email, password, name, role);
    if (result.success) {
      navigate(role === 'candidate' ? '/candidate' : 
               role === 'company' ? '/company' : '/admin');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-green-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 w-full max-w-md border border-white/10 hover:bg-white/10 transition-all duration-300 relative z-10">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Join CMO India
        </h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4 animate-shake">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-white font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-white font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-white font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-white font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              <option value="candidate" className="bg-gray-800">Candidate</option>
              <option value="company" className="bg-gray-800">Company</option>
              <option value="admin" className="bg-gray-800">Admin</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

// Candidate Dashboard
const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({});
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    title: '',
    location: '',
    company: '',
    experience: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API}/candidate/profile`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams(searchFilters);
      const response = await axios.get(`${API}/candidate/jobs?${params}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${API}/candidate/applications`);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const updateProfile = async (updatedProfile) => {
    try {
      await axios.put(`${API}/candidate/profile`, updatedProfile);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const applyForJob = async (jobId) => {
    try {
      await axios.post(`${API}/candidate/applications`, { job_id: jobId });
      fetchApplications();
      fetchJobs();
    } catch (error) {
      console.error('Error applying for job:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['profile', 'jobs', 'applications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'profile' && (
              <ProfileTab profile={profile} onUpdate={updateProfile} />
            )}
            {activeTab === 'jobs' && (
              <JobsTab 
                jobs={jobs} 
                onApply={applyForJob} 
                searchFilters={searchFilters}
                setSearchFilters={setSearchFilters}
                onSearch={fetchJobs}
                applications={applications}
              />
            )}
            {activeTab === 'applications' && (
              <ApplicationsTab applications={applications} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Tab Component
const ProfileTab = ({ profile, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setEditing(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      
      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
            <input
              type="text"
              value={formData.skills?.join(', ') || ''}
              onChange={(e) => setFormData({...formData, skills: e.target.value.split(', ').filter(s => s)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., JavaScript, React, Node.js"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
            <textarea
              value={formData.experience || ''}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="3"
              placeholder="Describe your experience"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., New York, NY"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., +1 (555) 123-4567"
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Experience</h3>
            <p className="text-gray-600">{profile.experience || 'No experience added'}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Location</h3>
            <p className="text-gray-600">{profile.location || 'No location added'}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600">{profile.phone || 'No phone added'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Jobs Tab Component
const JobsTab = ({ jobs, onApply, searchFilters, setSearchFilters, onSearch, applications }) => {
  const appliedJobIds = applications.map(app => app.job_id);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
      </div>
      
      {/* Search Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Job Title"
            value={searchFilters.title}
            onChange={(e) => setSearchFilters({...searchFilters, title: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Location"
            value={searchFilters.location}
            onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Company"
            value={searchFilters.company}
            onChange={(e) => setSearchFilters({...searchFilters, company: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Experience Level"
            value={searchFilters.experience}
            onChange={(e) => setSearchFilters({...searchFilters, experience: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={onSearch}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Search Jobs
        </button>
      </div>
      
      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                <p className="text-blue-600 font-medium">{job.company_name}</p>
                <p className="text-gray-600">{job.location} • {job.experience_level} • {job.job_type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(job.created_at).toLocaleDateString()}
                </p>
                {job.salary_range && (
                  <p className="text-sm font-medium text-green-600">{job.salary_range}</p>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 mb-2">{job.description}</p>
              <div className="text-sm text-gray-600">
                <strong>Requirements:</strong> {job.requirements}
              </div>
            </div>
            
            <div className="flex justify-end">
              {appliedJobIds.includes(job.id) ? (
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded">
                  Applied
                </span>
              ) : (
                <button
                  onClick={() => onApply(job.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Applications Tab Component
const ApplicationsTab = ({ applications }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h2>
      
      <div className="space-y-4">
        {applications.map((application) => (
          <div key={application.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{application.job_title}</h3>
                <p className="text-gray-600">Applied on {new Date(application.applied_at).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>
            
            {application.cover_letter && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Cover Letter</h4>
                <p className="text-gray-700 text-sm">{application.cover_letter}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Company Dashboard (simplified for space)
const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({});
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchJobs();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API}/company/profile`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/company/jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['profile', 'jobs', 'applications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
                <p className="text-gray-600 mt-2">Manage your company information</p>
              </div>
            )}
            {activeTab === 'jobs' && (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
                <p className="text-gray-600 mt-2">Create and manage your job listings</p>
              </div>
            )}
            {activeTab === 'applications' && (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
                <p className="text-gray-600 mt-2">Review and manage job applications</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard (simplified for space)
const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API}/admin/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Total Users</h3>
              <p className="text-2xl font-bold text-blue-600">{analytics.total_users || 0}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Total Jobs</h3>
              <p className="text-2xl font-bold text-green-600">{analytics.total_jobs || 0}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900">Applications</h3>
              <p className="text-2xl font-bold text-purple-600">{analytics.total_applications || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Unauthorized Page
const UnauthorizedPage = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Unauthorized</h1>
      <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Go Back
      </button>
    </div>
  </div>
);

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            <Route
              path="/candidate/*"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/company/*"
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;