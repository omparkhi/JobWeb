import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CandidateController } from './candidate.controller';
import { User } from './entities/user.entity';
import { CandidateProfile } from './entities/candidate-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CandidateProfile])],
  providers: [UsersService],
  controllers: [UsersController, CandidateController],
  exports: [UsersService],
})
export class UsersModule {}