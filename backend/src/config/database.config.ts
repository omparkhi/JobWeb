import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CandidateProfile } from '../users/entities/candidate-profile.entity';
import { CompanyProfile } from '../companies/entities/company-profile.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', 'password'),
      database: this.configService.get('DB_NAME', 'cmo_hiring_platform'),
      entities: [User, CandidateProfile, CompanyProfile, Job, Application],
      synchronize: this.configService.get('NODE_ENV') !== 'production',
      logging: this.configService.get('NODE_ENV') === 'development',
    };
  }
}