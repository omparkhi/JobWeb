import React, { useState, useEffect } from 'react';
import { Plus, Users, Briefcase, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import StatusBadge from '../../components/Common/StatusBadge';
import toast from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  experience_level: string;
  salary_range?: string;
  job_type: string;
  is_active: boolean;
  created_at: string;
}

interface Application {
  id: string;
  candidate_name: string;
  candidate_email: string;
  job_title: string;
  status: string;
  applied_at: string;
  cover_letter?: string;
}

const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications'>('overview');
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    experience_level: '',
    salary_range: '',
    job_type: 'full-time'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsResponse, applicationsResponse] = await Promise.all([
        apiService.getCompanyJobs(),
        apiService.getCompanyApplications() // This would need to be implemented
      ]);
      setJobs(jobsResponse.data || []);
      // For now, we'll use a placeholder for applications
      setApplications([]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createJob(jobForm);
      toast.success('Job posted successfully!');
      setShowJobForm(false);
      setJobForm({
        title: '',
        description: '',
        requirements: '',
        location: '',
        experience_level: '',
        salary_range: '',
        job_type: 'full-time'
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create job');
    }
  };

  const handleUpdateJob = async (jobId: string, updates: Partial<Job>) => {
    try {
      await apiService.updateJob(jobId, updates);
      toast.success('Job updated successfully!');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update job');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await apiService.updateJob(jobId, { is_active: false });
        toast.success('Job deleted successfully!');
        fetchData();
      } catch (error: any) {
        toast.error(error.response?.data?.detail || 'Failed to delete job');
      }
    }
  };

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
            Company Dashboard 🏢
          </h1>
          <p className="text-blue-200">
            Manage your job postings and applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-200">Active Jobs</p>
                <p className="text-2xl font-bold text-white">{jobs.filter(j => j.is_active).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-green-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
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
                <p className="text-2xl font-bold text-white">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <div className="p-3 bg-orange-600 rounded-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-200">Hired</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'jobs'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            My Jobs
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'applications'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            Applications
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Jobs */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Job Posts</h3>
              <div className="space-y-4">
                {jobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">{job.title}</h4>
                      <p className="text-sm text-gray-400">{job.location}</p>
                    </div>
                    <StatusBadge status={job.is_active ? 'active' : 'inactive'} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowJobForm(true)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Post New Job
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  <Users className="h-5 w-5 mr-2" />
                  View Applications
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Company Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Job Postings</h2>
              <button
                onClick={() => setShowJobForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Post New Job
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{job.location}</span>
                        <span>{job.job_type}</span>
                        <span>{job.experience_level}</span>
                        {job.salary_range && <span>{job.salary_range}</span>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={job.is_active ? 'active' : 'inactive'} />
                      <button
                        onClick={() => setEditingJob(job)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      View Applications (0)
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {jobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No jobs posted yet</h3>
                <p className="text-gray-400 mb-6">Start by posting your first job opening</p>
                <button
                  onClick={() => setShowJobForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Post Your First Job
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Applications</h2>
            
            {applications.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No applications yet</h3>
                <p className="text-gray-400">Applications will appear here once candidates apply to your jobs</p>
              </div>
            )}
          </div>
        )}

        {/* Job Form Modal */}
        {showJobForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Post New Job</h2>
              
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Job Title</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Location</label>
                  <input
                    type="text"
                    required
                    value={jobForm.location}
                    onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Mumbai, Maharashtra"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Experience Level</label>
                    <select
                      required
                      value={jobForm.experience_level}
                      onChange={(e) => setJobForm({...jobForm, experience_level: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Experience</option>
                      <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
                      <option value="Mid Level (2-5 years)">Mid Level (2-5 years)</option>
                      <option value="Senior Level (5+ years)">Senior Level (5+ years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Job Type</label>
                    <select
                      required
                      value={jobForm.job_type}
                      onChange={(e) => setJobForm({...jobForm, job_type: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Salary Range (Optional)</label>
                  <input
                    type="text"
                    value={jobForm.salary_range}
                    onChange={(e) => setJobForm({...jobForm, salary_range: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. ₹8-15 LPA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Job Description</label>
                  <textarea
                    required
                    rows={4}
                    value={jobForm.description}
                    onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Requirements</label>
                  <textarea
                    required
                    rows={4}
                    value={jobForm.requirements}
                    onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="List the required skills, qualifications, and experience..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowJobForm(false)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Post Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;