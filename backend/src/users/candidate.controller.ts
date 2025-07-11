import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, User } from './entities/user.entity';
import { CandidateProfile } from './entities/candidate-profile.entity';

@ApiTags('Candidate')
@Controller('candidate')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CANDIDATE)
@ApiBearerAuth()
export class CandidateController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get candidate profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.getCandidateProfile(user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update candidate profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateData: Partial<CandidateProfile>,
  ) {
    return this.usersService.updateCandidateProfile(user.id, updateData);
  }
}