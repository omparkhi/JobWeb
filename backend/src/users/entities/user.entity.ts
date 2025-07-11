import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { CandidateProfile } from './candidate-profile.entity';
import { CompanyProfile } from '../../companies/entities/company-profile.entity';

export enum UserRole {
  CANDIDATE = 'candidate',
  COMPANY = 'company',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CANDIDATE,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => CandidateProfile, (profile) => profile.user, { cascade: true })
  candidateProfile: CandidateProfile;

  @OneToOne(() => CompanyProfile, (profile) => profile.user, { cascade: true })
  companyProfile: CompanyProfile;
}