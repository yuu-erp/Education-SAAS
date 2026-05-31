import { PrismaModule } from '@/database';
import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { GetProfileService } from './services/get-profile.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, GetProfileService],
  exports: [UsersService, GetProfileService],
})
export class UsersModule {}
