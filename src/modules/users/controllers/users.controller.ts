import { CurrentUser } from '@/common/decorators';
import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import { GetProfileService } from '../services/get-profile.service';
import { UpdateProfileService } from '../services/update-profile.service';
import { RemoveAvatarService } from '../services/remove-avatar.service';
import type { RequestUser } from '@/common/types';
import { JwtAuthGuard } from '@/common/guards';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Controller('users/me')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly getProfileService: GetProfileService,
    private readonly updateProfileService: UpdateProfileService,
    private readonly removeAvatarService: RemoveAvatarService,
  ) {}

  @Get()
  getProfile(@CurrentUser() user: RequestUser) {
    return this.getProfileService.execute(user.id as string);
  }

  @Put()
  updateProfile(
    @CurrentUser() user: RequestUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.updateProfileService.execute(
      user.id as string,
      updateProfileDto,
    );
  }

  @Delete('avatar')
  removeAvatar(@CurrentUser() user: RequestUser) {
    return this.removeAvatarService.execute(user.id as string);
  }
}
