import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, User } from '../users/entities/user.entity';
import { ApplicationStatus } from './entities/application.entity';

@ApiTags('Applications')
@Controller('applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({ summary: 'Apply for a job' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully' })
  async create(
    @CurrentUser() user: User,
    @Body() applicationData: { jobId: string; coverLetter?: string },
  ) {
    return this.applicationsService.create(
      user.id,
      applicationData.jobId,
      applicationData.coverLetter,
    );
  }

  @Get('candidate/my-applications')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({ summary: 'Get candidate applications' })
  @ApiResponse({ status: 200, description: 'Applications retrieved successfully' })
  async getCandidateApplications(@CurrentUser() user: User) {
    return this.applicationsService.findByCandidateUser(user.id);
  }

  @Get('company/my-applications')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMPANY)
  @ApiOperation({ summary: 'Get applications for company jobs' })
  @ApiResponse({ status: 200, description: 'Applications retrieved successfully' })
  async getCompanyApplications(@CurrentUser() user: User) {
    return this.applicationsService.findByCompany(user.id);
  }

  @Get('job/:jobId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMPANY)
  @ApiOperation({ summary: 'Get applications for a specific job' })
  @ApiResponse({ status: 200, description: 'Applications retrieved successfully' })
  async getJobApplications(@Param('jobId') jobId: string) {
    return this.applicationsService.findByJob(jobId);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMPANY)
  @ApiOperation({ summary: 'Update application status' })
  @ApiResponse({ status: 200, description: 'Application status updated successfully' })
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateData: { status: ApplicationStatus; notes?: string },
  ) {
    return this.applicationsService.updateStatus(
      id,
      updateData.status,
      user.id,
      updateData.notes,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiResponse({ status: 200, description: 'Application retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.applicationsService.findById(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({ summary: 'Delete application' })
  @ApiResponse({ status: 200, description: 'Application deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.applicationsService.delete(id, user.id);
    return { message: 'Application deleted successfully' };
  }
}