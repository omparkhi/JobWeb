import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Users, Building2, TrendingUp, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { publicAPI } from '../../services/api';
import { Job, CompanyProfile } from '../../types';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [topCompanies, setTopCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLandingData();
  }, []);

  const fetchLandingData = async () => {
    try {
      const [jobsResponse, companiesResponse] = await Promise.all([
        publicAPI.searchJobs({ title: '', location: '' }),
        publicAPI.getAllCompanies(),
      ]);
      
      setFeaturedJobs(jobsResponse.data.slice(0, 6));
      setTopCompanies(companiesResponse.data.slice(0, 8));
    } catch (error) {
      console.error('Error fetching landing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('title', searchQuery);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const stats = [
    { icon: Briefcase, label: 'Active Jobs', value: '10,000+', color: 'text-blue-600' },
    { icon: Users, label: 'Job Seekers', value: '50,000+', color: 'text-green-600' },
    { icon: Building2, label: 'Companies', value: '2,500+', color: 'text-purple-600' },
    { icon: TrendingUp, label: 'Success Rate', value: '95%', color: 'text-orange-600' },
  ];

  const features = [
    {
      icon: Search,
      title: 'Advanced Job Search',
      description: 'Find jobs that match your skills, experience, and preferences with our powerful search filters.',
    },
    {
      icon: Users,
      title: 'Professional Network',
      description: 'Connect with industry professionals and expand your network to discover new opportunities.',
    },
    {
      icon: CheckCircle,
      title: 'Verified Companies',
      description: 'Apply to jobs from verified companies and trusted employers across various industries.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your
              <span className="text-blue-600"> Dream Job</span>
              <br />
              or <span className="text-purple-600">Hire Top Talent</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connecting ambitious professionals with innovative companies across India. 
              Your next career opportunity is just a search away.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-8">
              <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or company"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="City, state, or remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search Jobs</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-gray-600 mr-2">Popular:</span>
              {['Software Engineer', 'Product Manager', 'Data Scientist', 'UI/UX Designer', 'Sales Manager'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-3 py-1 rounded-full text-sm transition-colors duration-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white shadow-md mb-3 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
            <p className="text-gray-600">Discover exciting opportunities from top companies</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-48 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{job.title}</h3>
                      <p className="text-blue-600 font-medium">{job.companyName}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="capitalize">{job.experienceLevel}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills?.slice(0, 3).map((skill, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/jobs"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              <span>View All Jobs</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CMO India?</h2>
            <p className="text-gray-600">Everything you need to find your next opportunity or hire top talent</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Companies Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Companies Hiring</h2>
            <p className="text-gray-600">Join thousands of professionals working with leading companies</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-24 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {topCompanies.map((company) => (
                <Link
                  key={company.id}
                  to={`/companies/${company.id}`}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 text-center group"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    {company.logoUrl ? (
                      <img src={company.logoUrl} alt={company.companyName} className="w-12 h-12 object-contain" />
                    ) : (
                      <Building2 className="w-8 h-8 text-gray-600" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {company.companyName}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{company.location}</p>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/companies"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              <span>View All Companies</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Take the Next Step?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?role=candidate"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Find Jobs
            </Link>
            <Link
              to="/register?role=company"
              className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Post Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;