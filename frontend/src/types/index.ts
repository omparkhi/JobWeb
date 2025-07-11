export interface User {
  id: string;
  email: string;
  name: string;
  role: 'candidate' | 'company' | 'admin';
  isActive: boolean;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'candidate' | 'company' | 'admin';
}

export interface CandidateProfile {
  id: string;
  userId: string;
  resumeUrl?: string;
  skills: string[];
  experience?: string;
  location?: string;
  phone?: string;
  createdAt: string;
}

export interface CompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  description?: string;
  website?: string;
  location?: string;
  logoUrl?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  experienceLevel: string;
  salaryRange?: string;
  jobType: string;
  isActive: boolean;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  companyId: string;
  jobTitle: string;
  status: 'pending' | 'shortlisted' | 'rejected' | 'accepted';
  coverLetter?: string;
  appliedAt: string;
}

export interface JobFilters {
  title?: string;
  location?: string;
  company?: string;
  experience?: string;
}

export interface Analytics {
  totalUsers: number;
  totalCandidates: number;
  totalCompanies: number;
  totalJobs: number;
  totalApplications: number;
  approvedCompanies: number;
  pendingCompanies: number;
}