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
  searchJobs: (filters?: JobFilters) => api.get<Job[]>('/jobs', { params: filters }),
  applyForJob: (jobId: string, coverLetter?: string) => api.post<Application>('/applications', { jobId, coverLetter }),
  getApplications: () => api.get<Application[]>('/applications/candidate/my-applications'),
};

// Company API
export const companyAPI = {
  getProfile: () => api.get<CompanyProfile>('/company/profile'),
  createProfile: (data: Partial<CompanyProfile>) => api.post<CompanyProfile>('/company/profile', data),
  updateProfile: (data: Partial<CompanyProfile>) => api.put<CompanyProfile>('/company/profile', data),
  createJob: (jobData: Omit<Job, 'id' | 'companyId' | 'companyName' | 'createdAt' | 'isActive'>) => api.post<Job>('/jobs', jobData),
  getJobs: () => api.get<Job[]>('/jobs/company/my-jobs'),
  updateJob: (jobId: string, jobData: Partial<Job>) => api.put<Job>(`/jobs/${jobId}`, jobData),
  getJobApplications: (jobId: string) => api.get<Application[]>(`/applications/job/${jobId}`),
  updateApplicationStatus: (applicationId: string, status: string, notes?: string) => 
    api.put<Application>(`/applications/${applicationId}/status`, { status, notes }),
  getAllApplications: () => api.get<Application[]>('/applications/company/my-applications'),
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getCompanies: () => api.get('/admin/companies'),
  getPendingCompanies: () => api.get('/admin/companies/pending'),
  approveCompany: (companyId: string) => api.put(`/admin/companies/${companyId}/approve`),
  rejectCompany: (companyId: string) => api.put(`/admin/companies/${companyId}/reject`),
  getJobs: () => api.get('/admin/jobs'),
  getApplications: () => api.get('/admin/applications'),
  getAnalytics: () => api.get<Analytics>('/admin/analytics'),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
  deleteCompany: (companyId: string) => api.delete(`/admin/companies/${companyId}`),
};

// Public API
export const publicAPI = {
  searchJobs: (filters?: JobFilters) => api.get<Job[]>('/jobs', { params: filters }),
  getJob: (jobId: string) => api.get<Job>(`/jobs/${jobId}`),
  getAllCompanies: () => api.get<CompanyProfile[]>('/company/all'),
  getCompany: (companyId: string) => api.get<CompanyProfile>(`/company/${companyId}`),
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
  uploadLogo: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;