import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, User } from '../users/entities/user.entity';
import { CompanyProfile } from './entities/company-profile.entity';

@ApiTags('Companies')
@Controller('company')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get('profile')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMPANY)
  @ApiOperation({ summary: 'Get company profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@CurrentUser() user: User) {
    return this.companiesService.findByUserId(user.id);
  }

  @Post('profile')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMPANY)
  @ApiOperation({ summary: 'Create company profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  async createProfile(
    @CurrentUser() user: User,
    @Body() profileData: Partial<CompanyProfile>,
  ) {
    return this.companiesService.create(user.id, profileData);
  }

  @Put('profile')
  @UseGuards(RolesGuard)
  @Roles(UserRole.COMPANY)
  @ApiOperation({ summary: 'Update company profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateData: Partial<CompanyProfile>,
  ) {
    const profile = await this.companiesService.findByUserId(user.id);
    return this.companiesService.update(profile.id, updateData);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all approved companies' })
  @ApiResponse({ status: 200, description: 'Companies retrieved successfully' })
  async findAll() {
    return this.companiesService.getApprovedCompanies();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiResponse({ status: 200, description: 'Company retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }
}