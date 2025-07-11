import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompanyProfile } from '../../companies/entities/company-profile.entity';
import { Application } from '../../applications/entities/application.entity';

export enum JobType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance',
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive',
}

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @ManyToOne(() => CompanyProfile, (company) => company.jobs)
  @JoinColumn()
  company: CompanyProfile;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  requirements: string;

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: ExperienceLevel,
    default: ExperienceLevel.ENTRY,
  })
  experienceLevel: ExperienceLevel;

  @Column({ nullable: true })
  salaryRange: string;

  @Column({
    type: 'enum',
    enum: JobType,
    default: JobType.FULL_TIME,
  })
  jobType: JobType;

  @Column('simple-array', { default: [] })
  skills: string[];

  @Column({ nullable: true })
  applicationDeadline: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];
}