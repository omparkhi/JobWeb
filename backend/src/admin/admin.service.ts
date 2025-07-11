import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { JobsService } from '../jobs/jobs.service';
import { ApplicationsService } from '../applications/applications.service';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private companiesService: CompaniesService,
    private jobsService: JobsService,
    private applicationsService: ApplicationsService,
  ) {}

  async getAnalytics() {
    const users = await this.usersService.findAll();
    const companies = await this.companiesService.findAll();
    const jobs = await this.jobsService.getAllJobs();
    const applicationStats = await this.applicationsService.getApplicationStats();

    const totalUsers = users.length;
    const totalCandidates = users.filter(user => user.role === 'candidate').length;
    const totalCompanies = companies.length;
    const approvedCompanies = companies.filter(company => company.isApproved).length;
    const pendingCompanies = companies.filter(company => !company.isApproved && company.isActive).length;
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.isActive).length;

    return {
      totalUsers,
      totalCandidates,
      totalCompanies,
      approvedCompanies,
      pendingCompanies,
      totalJobs,
      activeJobs,
      totalApplications: applicationStats.total,
      pendingApplications: applicationStats.pending,
      shortlistedApplications: applicationStats.shortlisted,
      acceptedApplications: applicationStats.accepted,
      rejectedApplications: applicationStats.rejected,
    };
  }

  async getAllUsers() {
    return this.usersService.findAll();
  }

  async getAllCompanies() {
    return this.companiesService.findAll();
  }

  async getPendingCompanies() {
    return this.companiesService.getPendingApprovals();
  }

  async approveCompany(companyId: string) {
    return this.companiesService.approve(companyId);
  }

  async rejectCompany(companyId: string) {
    return this.companiesService.reject(companyId);
  }

  async getAllJobs() {
    return this.jobsService.getAllJobs();
  }

  async getAllApplications() {
    return this.applicationsService.findAll();
  }

  async deleteUser(userId: string) {
    return this.usersService.deleteUser(userId);
  }

  async deleteCompany(companyId: string) {
    return this.companiesService.delete(companyId);
  }
}