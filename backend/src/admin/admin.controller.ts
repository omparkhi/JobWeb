import { Controller, Get, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('analytics')
  @ApiOperation({ summary: 'Get platform analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('companies')
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({ status: 200, description: 'Companies retrieved successfully' })
  async getAllCompanies() {
    return this.adminService.getAllCompanies();
  }

  @Get('companies/pending')
  @ApiOperation({ summary: 'Get pending company approvals' })
  @ApiResponse({ status: 200, description: 'Pending companies retrieved successfully' })
  async getPendingCompanies() {
    return this.adminService.getPendingCompanies();
  }

  @Put('companies/:id/approve')
  @ApiOperation({ summary: 'Approve company' })
  @ApiResponse({ status: 200, description: 'Company approved successfully' })
  async approveCompany(@Param('id') id: string) {
    return this.adminService.approveCompany(id);
  }

  @Put('companies/:id/reject')
  @ApiOperation({ summary: 'Reject company' })
  @ApiResponse({ status: 200, description: 'Company rejected successfully' })
  async rejectCompany(@Param('id') id: string) {
    return this.adminService.rejectCompany(id);
  }

  @Get('jobs')
  @ApiOperation({ summary: 'Get all jobs' })
  @ApiResponse({ status: 200, description: 'Jobs retrieved successfully' })
  async getAllJobs() {
    return this.adminService.getAllJobs();
  }

  @Get('applications')
  @ApiOperation({ summary: 'Get all applications' })
  @ApiResponse({ status: 200, description: 'Applications retrieved successfully' })
  async getAllApplications() {
    return this.adminService.getAllApplications();
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Param('id') id: string) {
    await this.adminService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }

  @Delete('companies/:id')
  @ApiOperation({ summary: 'Delete company' })
  @ApiResponse({ status: 200, description: 'Company deleted successfully' })
  async deleteCompany(@Param('id') id: string) {
    await this.adminService.deleteCompany(id);
    return { message: 'Company deleted successfully' };
  }
}