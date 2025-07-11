import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';
import { JobsModule } from '../jobs/jobs.module';
import { ApplicationsModule } from '../applications/applications.module';

@Module({
  imports: [UsersModule, CompaniesModule, JobsModule, ApplicationsModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}