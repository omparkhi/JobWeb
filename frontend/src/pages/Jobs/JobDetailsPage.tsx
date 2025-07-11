import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Building, Users, Briefcase, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
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
  requirements: string;
  created_at: string;
}

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      // For now, we'll simulate fetching job details
      // In a real app, you'd have an API endpoint for this
      const response = await apiService.searchJobs();
      const jobs = response.data || [];
      const foundJob = jobs.find((j: Job) => j.id === id);
      
      if (foundJob) {
        setJob(foundJob);
      } else {
        toast.error('Job not found');
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    if (user?.role !== 'candidate') {
      toast.error('Only candidates can apply for jobs');
      return;
    }

    try {
      setApplying(true);
      await apiService.applyForJob({
        job_id: id!,
        cover_letter: coverLetter
      });
      toast.success('Application submitted successfully!');
      setShowApplicationModal(false);
      setCoverLetter('');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Job not found</h1>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Jobs
        </button>

        {/* Job Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-4">{job.title}</h1>
              <div className="flex items-center text-blue-200 mb-4">
                <Building className="h-5 w-5 mr-2" />
                <span className="text-xl font-medium">{job.company_name}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-gray-300">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  <span>{job.job_type}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{job.experience_level}</span>
                </div>
                {job.salary_range && (
                  <div className="flex items-center">
                    <span className="mr-1">💰</span>
                    <span>{job.salary_range}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3 ml-6">
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Bookmark className="h-5 w-5 text-gray-400" />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Share2 className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium">
              {job.job_type}
            </span>
            <span className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-full text-sm font-medium">
              {job.experience_level}
            </span>
            <span className="px-4 py-2 bg-green-600/20 text-green-300 rounded-full text-sm font-medium">
              <Clock className="h-3 w-3 mr-1 inline" />
              Posted {new Date(job.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Job ID: {job.id}
            </div>
            <button
              onClick={() => setShowApplicationModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium text-lg"
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* Job Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Job Description</h2>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Requirements</h2>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                {job.requirements}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">About {job.company_name}</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Building className="h-4 w-4 mr-2" />
                  <span>Technology Company</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Users className="h-4 w-4 mr-2" />
                  <span>500+ employees</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                View Company Profile
              </button>
            </div>

            {/* Job Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Job Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Applications</span>
                  <span className="text-white font-medium">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Views</span>
                  <span className="text-white font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Posted</span>
                  <span className="text-white font-medium">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Similar Jobs</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                    <h4 className="text-white font-medium text-sm mb-1">
                      Senior Developer Position
                    </h4>
                    <p className="text-gray-400 text-xs">TechCorp Solutions</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Application Modal */}
        {showApplicationModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-4">Apply for {job.title}</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  rows={6}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {applying ? 'Applying...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPage;