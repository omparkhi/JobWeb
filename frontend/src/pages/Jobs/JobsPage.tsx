import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Filter, Briefcase, Building2, Clock, ChevronDown, X } from 'lucide-react';
import { publicAPI } from '../../services/api';
import { Job, JobFilters } from '../../types';

const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<JobFilters>({
    title: searchParams.get('title') || '',
    location: searchParams.get('location') || '',
    company: searchParams.get('company') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    jobType: searchParams.get('jobType') || '',
  });

  const experienceLevels = ['entry', 'mid', 'senior', 'lead', 'executive'];
  const jobTypes = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Remote'];

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await publicAPI.searchJobs(filters);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams();
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      location: '',
      company: '',
      experienceLevel: '',
      jobType: '',
    });
    setSearchParams({});
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Find Jobs</h1>
            <p className="text-gray-600 mt-2">Discover your next career opportunity</p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={filters.title}
                  onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Filters Toggle */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={filters.experienceLevel}
                    onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All levels</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All types</option>
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    placeholder="Company name"
                    value={filters.company}
                    onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {loading ? 'Searching...' : `${jobs.length} jobs found`}
            </h2>
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(filters).map(([key, value]) => value && (
                  <span
                    key={key}
                    className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                  >
                    <span>{key}: {value}</span>
                    <button
                      onClick={() => setFilters({ ...filters, [key]: '' })}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          <Link to={`/jobs/${job.id}`} className="hover:text-blue-600 transition-colors duration-200">
                            {job.title}
                          </Link>
                        </h3>
                        <p className="text-blue-600 font-medium mb-2">{job.companyName}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span className="capitalize">{job.experienceLevel}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{getTimeAgo(job.createdAt)}</span>
                          </div>
                          {job.jobType && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {job.jobType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills.slice(0, 5).map((skill, index) => (
                              <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 5 && (
                              <span className="text-blue-600 text-xs">+{job.skills.length - 5} more</span>
                            )}
                          </div>
                        )}

                        {job.salaryRange && (
                          <p className="text-green-600 font-semibold text-sm mb-2">{job.salaryRange}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 text-center"
                    >
                      View Details
                    </Link>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                      Save Job
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;