import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CandidateProfile } from '../../users/entities/candidate-profile.entity';
import { Job } from '../../jobs/entities/job.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  jobId: string;

  @ManyToOne(() => Job, (job) => job.applications)
  @JoinColumn()
  job: Job;

  @Column()
  candidateId: string;

  @ManyToOne(() => CandidateProfile, (candidate) => candidate.applications)
  @JoinColumn()
  candidate: CandidateProfile;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  coverLetter: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  appliedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}