import React, { useState, useEffect } from 'react';
import { Users, Building, Briefcase, TrendingUp, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import StatusBadge from '../../components/Common/StatusBadge';
import toast from 'react-hot-toast';

interface Analytics {
  total_users: number;
  total_candidates: number;
  total_companies: number;
  total_jobs: number;
  total_applications: number;
  approved_companies: number;
  pending_companies: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface Company {
  id: string;
  company_name: string;
  description?: string;
  website?: string;
  location?: string;
  is_approved: boolean;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'companies'>('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsResponse, usersResponse, companiesResponse] = await Promise.all([
        apiService.getAnalytics(),
        apiService.getAllUsers(),
        apiService.getAllCompanies()
      ]);
      
      setAnalytics(analyticsResponse.data);
      setUsers(usersResponse.data || []);
      setCompanies(companiesResponse.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCompany = async (companyId: string) => {
    try {
      await apiService.approveCompany(companyId);
      toast.success('Company approved successfully!');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to approve company');
    }
  };

  const handleRejectCompany = async (companyId: string) => {
    try {
      await apiService.rejectCompany(companyId);
      toast.success('Company rejected successfully!');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to reject company');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await apiService.deleteUser(userId);
        toast.success('User deleted successfully!');
        fetchData();
      } catch (error: any) {
        toast.error(error.response?.data?.detail || 'Failed to delete user');
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
            Admin Dashboard 👑
          </h1>
          <p className="text-blue-200">
            Manage the CMO India hiring platform
          </p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-200">Total Users</p>
                  <p className="text-2xl font-bold text-white">{analytics.total_users}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center">
                <div className="p-3 bg-green-600 rounded-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-200">Companies</p>
                  <p className="text-2xl font-bold text-white">{analytics.total_companies}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center">
                <div className="p-3 bg-purple-600 rounded-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-200">Active Jobs</p>
                  <p className="text-2xl font-bold text-white">{analytics.total_jobs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center">
                <div className="p-3 bg-orange-600 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-200">Applications</p>
                  <p className="text-2xl font-bold text-white">{analytics.total_applications}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Stats */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-2">Candidates</h3>
              <p className="text-3xl font-bold text-blue-400">{analytics.total_candidates}</p>
              <p className="text-sm text-gray-400">Active job seekers</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-2">Approved Companies</h3>
              <p className="text-3xl font-bold text-green-400">{analytics.approved_companies}</p>
              <p className="text-sm text-gray-400">Verified employers</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-2">Pending Approvals</h3>
              <p className="text-3xl font-bold text-yellow-400">{analytics.pending_companies}</p>
              <p className="text-sm text-gray-400">Awaiting review</p>
            </div>
          </div>
        )}

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
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'companies'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            Companies
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-white/5 rounded-lg">
                  <div className="p-2 bg-green-600 rounded-lg mr-4">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">New user registered</p>
                    <p className="text-sm text-gray-400">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white/5 rounded-lg">
                  <div className="p-2 bg-blue-600 rounded-lg mr-4">
                    <Building className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Company profile submitted</p>
                    <p className="text-sm text-gray-400">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white/5 rounded-lg">
                  <div className="p-2 bg-purple-600 rounded-lg mr-4">
                    <Briefcase className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">New job posted</p>
                    <p className="text-sm text-gray-400">3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('companies')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Review Pending Companies ({analytics?.pending_companies || 0})
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Manage Users
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                  <Eye className="h-5 w-5 mr-2" />
                  View Reports
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <div className="text-sm text-gray-400">
                Total: {users.length} users
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Joined</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-red-600/20 text-red-300' :
                            user.role === 'company' ? 'bg-blue-600/20 text-blue-300' :
                            'bg-green-600/20 text-green-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={user.is_active ? 'active' : 'inactive'} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
                <p className="text-gray-400">Users will appear here once they register</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'companies' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Company Management</h2>
              <div className="text-sm text-gray-400">
                Total: {companies.length} companies
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {companies.map((company) => (
                <div key={company.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{company.company_name}</h3>
                      {company.description && (
                        <p className="text-gray-300 mb-2 line-clamp-2">{company.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        {company.location && <span>📍 {company.location}</span>}
                        {company.website && (
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                            🌐 Website
                          </a>
                        )}
                        <span>📅 {new Date(company.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <StatusBadge status={company.is_approved ? 'approved' : 'pending'} />
                      {!company.is_approved && (
                        <>
                          <button
                            onClick={() => handleApproveCompany(company.id)}
                            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                            title="Approve Company"
                          >
                            <CheckCircle className="h-4 w-4 text-white" />
                          </button>
                          <button
                            onClick={() => handleRejectCompany(company.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            title="Reject Company"
                          >
                            <XCircle className="h-4 w-4 text-white" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {companies.length === 0 && (
              <div className="text-center py-12">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No companies found</h3>
                <p className="text-gray-400">Companies will appear here once they register</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;