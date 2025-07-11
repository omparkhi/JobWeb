import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Upload, Save, Edit } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

interface CandidateProfile {
  resume_url?: string;
  skills: string[];
  experience?: string;
  location?: string;
  phone?: string;
}

interface CompanyProfile {
  company_name: string;
  description?: string;
  website?: string;
  location?: string;
  logo_url?: string;
  is_approved: boolean;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>({
    skills: [],
  });
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    company_name: '',
    is_approved: false,
  });

  useEffect(() => {
    fetchProfile();
  }, [user?.role]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (user?.role === 'candidate') {
        const response = await apiService.getCandidateProfile();
        setCandidateProfile(response.data || { skills: [] });
      } else if (user?.role === 'company') {
        const response = await apiService.getCompanyProfile();
        setCompanyProfile(response.data || { company_name: '', is_approved: false });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      if (user?.role === 'candidate') {
        await apiService.updateCandidateProfile(candidateProfile);
      } else if (user?.role === 'company') {
        await apiService.updateCompanyProfile(companyProfile);
      }
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSkillAdd = (skill: string) => {
    if (skill.trim() && !candidateProfile.skills.includes(skill.trim())) {
      setCandidateProfile({
        ...candidateProfile,
        skills: [...candidateProfile.skills, skill.trim()]
      });
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setCandidateProfile({
      ...candidateProfile,
      skills: candidateProfile.skills.filter(skill => skill !== skillToRemove)
    });
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
                <div className="flex items-center text-blue-200 mb-2">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{user?.email}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.role === 'admin' ? 'bg-red-600/20 text-red-300' :
                  user?.role === 'company' ? 'bg-blue-600/20 text-blue-300' :
                  'bg-green-600/20 text-green-300'
                }`}>
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Content */}
        {user?.role === 'candidate' && (
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={candidateProfile.phone || ''}
                      onChange={(e) => setCandidateProfile({...candidateProfile, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="flex items-center text-gray-300">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{candidateProfile.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Location</label>
                  {editing ? (
                    <input
                      type="text"
                      value={candidateProfile.location || ''}
                      onChange={(e) => setCandidateProfile({...candidateProfile, location: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your location"
                    />
                  ) : (
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{candidateProfile.location || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Experience</h2>
              {editing ? (
                <textarea
                  rows={4}
                  value={candidateProfile.experience || ''}
                  onChange={(e) => setCandidateProfile({...candidateProfile, experience: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your work experience..."
                />
              ) : (
                <div className="text-gray-300">
                  {candidateProfile.experience || 'No experience information provided'}
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Skills</h2>
              {editing ? (
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {candidateProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm flex items-center"
                      >
                        {skill}
                        <button
                          onClick={() => handleSkillRemove(skill)}
                          className="ml-2 text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add a skill and press Enter"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSkillAdd(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {candidateProfile.skills.length > 0 ? (
                    candidateProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">No skills added yet</span>
                  )}
                </div>
              )}
            </div>

            {/* Resume */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Resume</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-300">
                    {candidateProfile.resume_url ? 'Resume uploaded' : 'No resume uploaded'}
                  </span>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resume
                </button>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'company' && (
          <div className="space-y-8">
            {/* Company Information */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Company Information</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  companyProfile.is_approved 
                    ? 'bg-green-600/20 text-green-300' 
                    : 'bg-yellow-600/20 text-yellow-300'
                }`}>
                  {companyProfile.is_approved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Company Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={companyProfile.company_name}
                      onChange={(e) => setCompanyProfile({...companyProfile, company_name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter company name"
                    />
                  ) : (
                    <div className="text-gray-300">{companyProfile.company_name || 'Not provided'}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Website</label>
                  {editing ? (
                    <input
                      type="url"
                      value={companyProfile.website || ''}
                      onChange={(e) => setCompanyProfile({...companyProfile, website: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://company.com"
                    />
                  ) : (
                    <div className="text-gray-300">
                      {companyProfile.website ? (
                        <a href={companyProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                          {companyProfile.website}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2">Location</label>
                  {editing ? (
                    <input
                      type="text"
                      value={companyProfile.location || ''}
                      onChange={(e) => setCompanyProfile({...companyProfile, location: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter company location"
                    />
                  ) : (
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{companyProfile.location || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Company Description */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">About Company</h2>
              {editing ? (
                <textarea
                  rows={6}
                  value={companyProfile.description || ''}
                  onChange={(e) => setCompanyProfile({...companyProfile, description: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your company, culture, and what makes it unique..."
                />
              ) : (
                <div className="text-gray-300">
                  {companyProfile.description || 'No company description provided'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save Button */}
        {editing && (
          <div className="flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;