import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Application } from '../../applications/entities/application.entity';

@Entity('candidate_profiles')
export class CandidateProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.candidateProfile)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  resumeUrl: string;

  @Column('simple-array', { default: [] })
  skills: string[];

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ nullable: true })
  portfolioUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Application, (application) => application.candidate)
  applications: Application[];
}