import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyProfile } from './entities/company-profile.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyProfile)
    private companyProfileRepository: Repository<CompanyProfile>,
  ) {}

  async create(userId: string, companyData: Partial<CompanyProfile>): Promise<CompanyProfile> {
    const companyProfile = this.companyProfileRepository.create({
      userId,
      ...companyData,
    });
    return this.companyProfileRepository.save(companyProfile);
  }

  async findByUserId(userId: string): Promise<CompanyProfile> {
    const profile = await this.companyProfileRepository.findOne({
      where: { userId },
      relations: ['user', 'jobs'],
    });
    if (!profile) {
      throw new NotFoundException('Company profile not found');
    }
    return profile;
  }

  async findAll(): Promise<CompanyProfile[]> {
    return this.companyProfileRepository.find({
      relations: ['user', 'jobs'],
    });
  }

  async findById(id: string): Promise<CompanyProfile> {
    const profile = await this.companyProfileRepository.findOne({
      where: { id },
      relations: ['user', 'jobs'],
    });
    if (!profile) {
      throw new NotFoundException('Company profile not found');
    }
    return profile;
  }

  async update(id: string, updateData: Partial<CompanyProfile>): Promise<CompanyProfile> {
    await this.companyProfileRepository.update(id, updateData);
    return this.findById(id);
  }

  async approve(id: string): Promise<CompanyProfile> {
    return this.update(id, { isApproved: true });
  }

  async reject(id: string): Promise<CompanyProfile> {
    return this.update(id, { isApproved: false });
  }

  async delete(id: string): Promise<void> {
    const result = await this.companyProfileRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Company profile not found');
    }
  }

  async getPendingApprovals(): Promise<CompanyProfile[]> {
    return this.companyProfileRepository.find({
      where: { isApproved: false, isActive: true },
      relations: ['user'],
    });
  }

  async getApprovedCompanies(): Promise<CompanyProfile[]> {
    return this.companyProfileRepository.find({
      where: { isApproved: true, isActive: true },
      relations: ['user'],
    });
  }
}