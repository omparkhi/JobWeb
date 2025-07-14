import axios from 'axios';
import { RegisterData, CandidateProfile, CompanyProfile, Job, Application, JobFilters, Analytics } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: RegisterData) => api.post('/auth/register', userData),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
};

// Candidate API
export const candidateAPI = {
  getProfile: () => api.get<CandidateProfile>('/candidate/profile'),
  updateProfile: (data: Partial<CandidateProfile>) => api.put<CandidateProfile>('/candidate/profile', data),
  searchJobs: (filters?: JobFilters) => api.get<Job[]>('/candidate/jobs', { params: filters }),
  applyForJob: (data: { job_id: string; cover_letter?: string }) => api.post<Application>('/candidate/applications', data),
  getApplications: () => api.get<Application[]>('/candidate/applications'),
};

// Company API
export const companyAPI = {
  getProfile: () => api.get<CompanyProfile>('/company/profile'),
  updateProfile: (data: Partial<CompanyProfile>) => api.put<CompanyProfile>('/company/profile', data),
  createJob: (jobData: any) => api.post<Job>('/company/jobs', jobData),
  getJobs: () => api.get<Job[]>('/company/jobs'),
  updateJob: (jobId: string, jobData: Partial<Job>) => api.put<Job>(`/company/jobs/${jobId}`, jobData),
  getJobApplications: (jobId: string) => api.get<Application[]>(`/company/jobs/${jobId}/applications`),
  updateApplicationStatus: (applicationId: string, status: string) => api.put<Application>(`/company/applications/${applicationId}/status`, { status }),
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getCompanies: () => api.get('/admin/companies'),
  approveCompany: (companyId: string) => api.put(`/admin/companies/${companyId}/approve`),
  rejectCompany: (companyId: string) => api.put(`/admin/companies/${companyId}/reject`),
  getJobs: () => api.get('/admin/jobs'),
  getAnalytics: () => api.get<Analytics>('/admin/analytics'),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
};

// File upload API
export const uploadAPI = {
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Simplified API service for easier use
export const apiService = {
  // Auth
  login: authAPI.login,
  register: authAPI.register,
  
  // Candidate
  getCandidateProfile: candidateAPI.getProfile,
  updateCandidateProfile: candidateAPI.updateProfile,
  searchJobs: candidateAPI.searchJobs,
  applyForJob: candidateAPI.applyForJob,
  getCandidateApplications: candidateAPI.getApplications,
  
  // Company
  getCompanyProfile: companyAPI.getProfile,
  updateCompanyProfile: companyAPI.updateProfile,
  createJob: companyAPI.createJob,
  getCompanyJobs: companyAPI.getJobs,
  updateJob: companyAPI.updateJob,
  getJobApplications: companyAPI.getJobApplications,
  updateApplicationStatus: companyAPI.updateApplicationStatus,
  
  // Admin
  getAllUsers: adminAPI.getUsers,
  getAllCompanies: adminAPI.getCompanies,
  approveCompany: adminAPI.approveCompany,
  rejectCompany: adminAPI.rejectCompany,
  getAllJobs: adminAPI.getJobs,
  getAnalytics: adminAPI.getAnalytics,
  deleteUser: adminAPI.deleteUser,
  
  // File upload
  uploadResume: uploadAPI.uploadResume,
};

export default api;