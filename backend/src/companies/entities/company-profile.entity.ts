import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';

@Entity('company_profiles')
export class CompanyProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.companyProfile)
  @JoinColumn()
  user: User;

  @Column()
  companyName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  companySize: string;

  @Column({ nullable: true })
  foundedYear: number;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];
}