import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Clock, BookmarkPlus, Eye, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import StatusBadge from '../../components/Common/StatusBadge';
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

interface Application {
  id: string;
  job_title: string;
  company_name?: string;
  status: string;
  applied_at: string;
}

const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsResponse, applicationsResponse] = await Promise.all([
        apiService.searchJobs(),
        apiService.getCandidateApplications()
      ]);
      setJobs(jobsResponse.data || []);
      setApplications(applicationsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyJob = async (jobId: string) => {
    try {
      await apiService.applyForJob({
        job_id: jobId,
        cover_letter: 'I am interested in this position and believe my skills align well with the requirements.'
      });
      toast.success('Application submitted successfully!');
      fetchData(); // Refresh data
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to apply for job');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesExperience = !experienceFilter || job.experience_level.toLowerCase().includes(experienceFilter.toLowerCase());
    
    return matchesSearch && matchesLocation && matchesExperience;
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
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-blue-200">
            Discover your next career opportunity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-200">Available Jobs</p>
                <p className="text-2xl font-bold text-white">{jobs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-green-600 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-200">Applications</p>
                <p className="text-2xl font-bold text-white">{applications.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-purple-600 rounded-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-200">Profile Views</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'jobs'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            Browse Jobs
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'applications'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            My Applications
          </button>
        </div>

        {activeTab === 'jobs' ? (
          <div>
            {/* Search and Filters */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs or companies..."
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

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                  Search Jobs
                </button>
              </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                      <p className="text-blue-200 font-medium">{job.company_name}</p>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <BookmarkPlus className="h-5 w-5 text-gray-400" />
                    </button>
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

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleApplyJob(job.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
                <p className="text-gray-400">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Applications List */}
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {application.job_title}
                      </h3>
                      {application.company_name && (
                        <p className="text-blue-200 mb-2">{application.company_name}</p>
                      )}
                      <p className="text-sm text-gray-400">
                        Applied on {new Date(application.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                </div>
              ))}
            </div>

            {applications.length === 0 && (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No applications yet</h3>
                <p className="text-gray-400">Start applying to jobs to see them here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;