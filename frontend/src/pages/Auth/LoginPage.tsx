import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, Briefcase } from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-blue-100">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-300">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-white" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-300">{errors.password}</p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-300 hover:text-white transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-blue-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/* Demo accounts */}
            <div className="mt-6 border-t border-white/20 pt-6">
              <p className="text-sm text-white/80 text-center mb-4">Demo Accounts:</p>
              <div className="space-y-2 text-xs text-white/70">
                <div className="flex justify-between">
                  <span>Candidate:</span>
                  <span>priya.sharma@gmail.com / SecurePass123!</span>
                </div>
                <div className="flex justify-between">
                  <span>Company:</span>
                  <span>techcorp.hr@techcorp.com / CompanyPass456!</span>
                </div>
                <div className="flex justify-between">
                  <span>Admin:</span>
                  <span>admin@cmoindia.com / AdminPass789!</span>
                </div>
              </div>
            </div>
          </form>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-300 hover:text-white transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;