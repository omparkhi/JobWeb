import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JobsService, JobFilters } from './jobs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, User } from '../users/entities/user.entity';
import { Job } from './entities/job.entity';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'Search jobs with filters' })
  @ApiResponse({ status: 200, description: 'Jobs retrieved successfully' })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'company', required: false })
  @ApiQuery({ name: 'experienceLevel', required: false })
  @ApiQuery({ name: 'jobType', required: false })
  async findAll(@Query() filters: JobFilters) {
    return this.jobsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by ID' })
  @ApiResponse({ status: 200, description: 'Job retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async findOne(@Param('id') id: string) {
    return this.jobsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new job posting' })
  @ApiResponse({ status: 201, description: 'Job created successfully' })
  async create(@CurrentUser() user: User, @Body() jobData: Partial<Job>) {
    return this.jobsService.create(user.id, jobData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update job posting' })
  @ApiResponse({ status: 200, description: 'Job updated successfully' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateData: Partial<Job>,
  ) {
    return this.jobsService.update(id, user.id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete job posting' })
  @ApiResponse({ status: 200, description: 'Job deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.jobsService.delete(id, user.id);
    return { message: 'Job deleted successfully' };
  }

  @Get('company/my-jobs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COMPANY)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get jobs posted by current company' })
  @ApiResponse({ status: 200, description: 'Jobs retrieved successfully' })
  async getMyJobs(@CurrentUser() user: User) {
    return this.jobsService.findByUserId(user.id);
  }
}