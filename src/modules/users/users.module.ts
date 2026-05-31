import { PrismaModule } from '@/database';
import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { GetProfileService } from './services/get-profile.service';
import { UpdateProfileService } from './services/update-profile.service';
import { RemoveAvatarService } from './services/remove-avatar.service';
import { FilesModule } from '../files/files.module';
import { ChangeAvatarService } from './services/change-avatar.service';

@Module({
  imports: [PrismaModule, FilesModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    GetProfileService,
    UpdateProfileService,
    RemoveAvatarService,
    ChangeAvatarService,
  ],
  exports: [
    UsersService,
    GetProfileService,
    UpdateProfileService,
    RemoveAvatarService,
    ChangeAvatarService,
  ],
})
export class UsersModule {}
