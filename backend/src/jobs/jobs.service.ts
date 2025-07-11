import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Job } from './entities/job.entity';
import { CompaniesService } from '../companies/companies.service';

export interface JobFilters {
  title?: string;
  location?: string;
  company?: string;
  experienceLevel?: string;
  jobType?: string;
}

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    private companiesService: CompaniesService,
  ) {}

  async create(userId: string, jobData: Partial<Job>): Promise<Job> {
    const companyProfile = await this.companiesService.findByUserId(userId);
    
    if (!companyProfile.isApproved) {
      throw new ForbiddenException('Company must be approved to post jobs');
    }

    const job = this.jobsRepository.create({
      ...jobData,
      companyId: companyProfile.id,
    });
    return this.jobsRepository.save(job);
  }

  async findAll(filters?: JobFilters): Promise<Job[]> {
    const where: any = { isActive: true };

    if (filters) {
      if (filters.title) {
        where.title = Like(`%${filters.title}%`);
      }
      if (filters.location) {
        where.location = Like(`%${filters.location}%`);
      }
      if (filters.experienceLevel) {
        where.experienceLevel = filters.experienceLevel;
      }
      if (filters.jobType) {
        where.jobType = filters.jobType;
      }
    }

    return this.jobsRepository.find({
      where,
      relations: ['company', 'company.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Job> {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['company', 'company.user', 'applications'],
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async findByCompany(companyId: string): Promise<Job[]> {
    return this.jobsRepository.find({
      where: { companyId },
      relations: ['company', 'applications'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(userId: string): Promise<Job[]> {
    const companyProfile = await this.companiesService.findByUserId(userId);
    return this.findByCompany(companyProfile.id);
  }

  async update(id: string, userId: string, updateData: Partial<Job>): Promise<Job> {
    const job = await this.findById(id);
    const companyProfile = await this.companiesService.findByUserId(userId);
    
    if (job.companyId !== companyProfile.id) {
      throw new ForbiddenException('You can only update your own jobs');
    }

    await this.jobsRepository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: string, userId: string): Promise<void> {
    const job = await this.findById(id);
    const companyProfile = await this.companiesService.findByUserId(userId);
    
    if (job.companyId !== companyProfile.id) {
      throw new ForbiddenException('You can only delete your own jobs');
    }

    await this.jobsRepository.update(id, { isActive: false });
  }

  async getAllJobs(): Promise<Job[]> {
    return this.jobsRepository.find({
      relations: ['company', 'company.user'],
      order: { createdAt: 'DESC' },
    });
  }
}