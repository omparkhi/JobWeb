import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Building2, Shield, Briefcase } from 'lucide-react';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') as 'candidate' | 'company' | 'admin' || 'candidate';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: initialRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      value: 'candidate',
      label: 'Job Seeker',
      description: 'Looking for job opportunities',
      icon: User,
    },
    {
      value: 'company',
      label: 'Employer',
      description: 'Hiring talented professionals',
      icon: Building2,
    },
    {
      value: 'admin',
      label: 'Administrator',
      description: 'Platform management',
      icon: Shield,
    },
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role as 'candidate' | 'company' | 'admin',
      });
      navigate(`/${formData.role}/dashboard`);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({ ...prev, role }));
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: '' }));
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-blue-100">
            Join thousands of professionals on CMO India
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-1 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleRoleChange(role.value)}
                      className={`relative flex items-center p-4 rounded-lg border-2 transition-all ${
                        formData.role === role.value
                          ? 'border-white bg-white/20 text-white'
                          : 'border-white/30 bg-white/10 text-white/80 hover:bg-white/15'
                      }`}
                    >
                      <Icon className="w-6 h-6 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{role.label}</div>
                        <div className="text-sm opacity-80">{role.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-300">{errors.role}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                {formData.role === 'company' ? 'Company Name' : 'Full Name'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {formData.role === 'company' ? (
                    <Building2 className="h-5 w-5 text-gray-400" />
                  ) : (
                    <User className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder={formData.role === 'company' ? 'Enter company name' : 'Enter your full name'}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-300">{errors.name}</p>
              )}
            </div>

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
                  value={formData.email}
                  onChange={handleInputChange}
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-10 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-10 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-white" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-white" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-300">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-white">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-300 hover:text-white">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-300 hover:text-white">
                  Privacy Policy
                </Link>
              </label>
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
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-300 hover:text-white transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;