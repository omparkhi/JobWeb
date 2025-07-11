import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { RegisterDto } from '../auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(CandidateProfile)
    private candidateProfileRepository: Repository<CandidateProfile>,
  ) {}

  async create(userData: RegisterDto & { password: string }): Promise<User> {
    const user = this.usersRepository.create(userData);
    const savedUser = await this.usersRepository.save(user);

    // Create candidate profile if user is a candidate
    if (userData.role === UserRole.CANDIDATE) {
      const candidateProfile = this.candidateProfileRepository.create({
        userId: savedUser.id,
        skills: [],
      });
      await this.candidateProfileRepository.save(candidateProfile);
    }

    return savedUser;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['candidateProfile', 'companyProfile'],
    });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['candidateProfile', 'companyProfile'],
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['candidateProfile', 'companyProfile'],
    });
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    return this.findById(id);
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async getCandidateProfile(userId: string): Promise<CandidateProfile> {
    const profile = await this.candidateProfileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException('Candidate profile not found');
    }
    return profile;
  }

  async updateCandidateProfile(
    userId: string,
    updateData: Partial<CandidateProfile>,
  ): Promise<CandidateProfile> {
    let profile = await this.candidateProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      profile = this.candidateProfileRepository.create({
        userId,
        ...updateData,
      });
    } else {
      Object.assign(profile, updateData);
    }

    return this.candidateProfileRepository.save(profile);
  }
}