import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './entities/application.entity';
import { JobsService } from '../jobs/jobs.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    private jobsService: JobsService,
    private usersService: UsersService,
  ) {}

  async create(userId: string, jobId: string, coverLetter?: string): Promise<Application> {
    // Check if job exists
    const job = await this.jobsService.findById(jobId);
    
    // Get candidate profile
    const candidateProfile = await this.usersService.getCandidateProfile(userId);

    // Check if user already applied for this job
    const existingApplication = await this.applicationsRepository.findOne({
      where: { jobId, candidateId: candidateProfile.id },
    });

    if (existingApplication) {
      throw new ConflictException('You have already applied for this job');
    }

    const application = this.applicationsRepository.create({
      jobId,
      candidateId: candidateProfile.id,
      coverLetter,
    });

    return this.applicationsRepository.save(application);
  }

  async findById(id: string): Promise<Application> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
      relations: ['job', 'job.company', 'candidate', 'candidate.user'],
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return application;
  }

  async findByCandidate(candidateId: string): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { candidateId },
      relations: ['job', 'job.company', 'job.company.user'],
      order: { appliedAt: 'DESC' },
    });
  }

  async findByCandidateUser(userId: string): Promise<Application[]> {
    const candidateProfile = await this.usersService.getCandidateProfile(userId);
    return this.findByCandidate(candidateProfile.id);
  }

  async findByJob(jobId: string): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { jobId },
      relations: ['candidate', 'candidate.user'],
      order: { appliedAt: 'DESC' },
    });
  }

  async findByCompany(companyUserId: string): Promise<Application[]> {
    const jobs = await this.jobsService.findByUserId(companyUserId);
    const jobIds = jobs.map(job => job.id);

    return this.applicationsRepository.find({
      where: jobIds.map(jobId => ({ jobId })),
      relations: ['job', 'candidate', 'candidate.user'],
      order: { appliedAt: 'DESC' },
    });
  }

  async updateStatus(
    applicationId: string,
    status: ApplicationStatus,
    companyUserId: string,
    notes?: string,
  ): Promise<Application> {
    const application = await this.findById(applicationId);
    
    // Verify that the company owns this job
    const companyJobs = await this.jobsService.findByUserId(companyUserId);
    const jobIds = companyJobs.map(job => job.id);
    
    if (!jobIds.includes(application.jobId)) {
      throw new ForbiddenException('You can only update applications for your jobs');
    }

    await this.applicationsRepository.update(applicationId, { status, notes });
    return this.findById(applicationId);
  }

  async delete(id: string, userId: string): Promise<void> {
    const application = await this.findById(id);
    const candidateProfile = await this.usersService.getCandidateProfile(userId);
    
    if (application.candidateId !== candidateProfile.id) {
      throw new ForbiddenException('You can only delete your own applications');
    }

    await this.applicationsRepository.delete(id);
  }

  async findAll(): Promise<Application[]> {
    return this.applicationsRepository.find({
      relations: ['job', 'job.company', 'candidate', 'candidate.user'],
      order: { appliedAt: 'DESC' },
    });
  }

  async getApplicationStats() {
    const totalApplications = await this.applicationsRepository.count();
    const pendingApplications = await this.applicationsRepository.count({
      where: { status: ApplicationStatus.PENDING },
    });
    const shortlistedApplications = await this.applicationsRepository.count({
      where: { status: ApplicationStatus.SHORTLISTED },
    });
    const acceptedApplications = await this.applicationsRepository.count({
      where: { status: ApplicationStatus.ACCEPTED },
    });
    const rejectedApplications = await this.applicationsRepository.count({
      where: { status: ApplicationStatus.REJECTED },
    });

    return {
      total: totalApplications,
      pending: pendingApplications,
      shortlisted: shortlistedApplications,
      accepted: acceptedApplications,
      rejected: rejectedApplications,
    };
  }
}