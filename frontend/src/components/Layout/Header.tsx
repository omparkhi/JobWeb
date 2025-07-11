import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, User, LogOut, Briefcase, Search, Bell, Home } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'candidate':
        return '/candidate/dashboard';
      case 'company':
        return '/company/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const getProfileLink = () => {
    switch (user?.role) {
      case 'candidate':
        return '/candidate/profile';
      case 'company':
        return '/company/profile';
      default:
        return '/profile';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">CMO India</span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              <div className="flex items-center space-x-1">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </div>
            </Link>
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              <div className="flex items-center space-x-1">
                <Search className="w-4 h-4" />
                <span>Find Jobs</span>
              </div>
            </Link>
            <Link
              to="/companies"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Companies
            </Link>
            {user?.role === 'company' && (
              <Link
                to="/company/post-job"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Post Job
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                  <Bell className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    
                    <Link
                      to={getDashboardLink()}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Home className="w-4 h-4" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    
                    <Link
                      to={getProfileLink()}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </div>
                    </Link>

                    {user.role === 'candidate' && (
                      <Link
                        to="/candidate/applications"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        My Applications
                      </Link>
                    )}

                    {user.role === 'company' && (
                      <>
                        <Link
                          to="/company/jobs"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          My Jobs
                        </Link>
                        <Link
                          to="/company/applications"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Applications
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <div className="space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Jobs
              </Link>
              <Link
                to="/companies"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Companies
              </Link>
              {user?.role === 'company' && (
                <Link
                  to="/company/post-job"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Post Job
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;