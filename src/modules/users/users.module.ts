import { PrismaModule } from '@/database';
import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { GetProfileService } from './services/get-profile.service';
import { UpdateProfileService } from './services/update-profile.service';
import { RemoveAvatarService } from './services/remove-avatar.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    GetProfileService,
    UpdateProfileService,
    RemoveAvatarService,
  ],
  exports: [
    UsersService,
    GetProfileService,
    UpdateProfileService,
    RemoveAvatarService,
  ],
})
export class UsersModule {}
