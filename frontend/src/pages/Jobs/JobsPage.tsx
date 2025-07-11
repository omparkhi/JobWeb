import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Briefcase, Clock, Building, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  experience_level: string;
  salary_range?: string;
  job_type: string;
  description: string;
  created_at: string;
}

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await apiService.searchJobs({
        title: searchTerm,
        location: locationFilter,
        experience: experienceFilter
      });
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const filteredJobs = jobs.filter(job => {
    const matchesJobType = !jobTypeFilter || job.job_type.toLowerCase().includes(jobTypeFilter.toLowerCase());
    return matchesJobType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Discover thousands of job opportunities from top companies across India
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Experience</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Search Jobs
            </button>
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Job Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>

            <div className="flex items-center space-x-2 text-white">
              <span className="text-sm">Found {filteredJobs.length} jobs</span>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center text-blue-200 mb-2">
                    <Building className="h-4 w-4 mr-2" />
                    <span className="font-medium">{job.company_name}</span>
                  </div>
                </div>
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
                  {job.job_type}
                </span>
                <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                  {job.experience_level}
                </span>
              </div>

              <div className="flex items-center text-gray-300 text-sm mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="mr-4">{job.location}</span>
                {job.salary_range && (
                  <>
                    <span className="mr-1">💰</span>
                    <span>{job.salary_range}</span>
                  </>
                )}
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {job.description}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-xs text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
                <Link
                  to={`/jobs/${job.id}`}
                  className="flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  View Details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 max-w-md mx-auto">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">No jobs found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search criteria or check back later for new opportunities
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('');
                  setExperienceFilter('');
                  setJobTypeFilter('');
                  fetchJobs();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Featured Companies Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Featured Companies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              'TechCorp', 'InnovateLabs', 'DataSoft', 'CloudTech', 'AI Solutions', 'WebDev Pro'
            ].map((company, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center hover:bg-white/20 transition-all">
                <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-medium text-sm">{company}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;