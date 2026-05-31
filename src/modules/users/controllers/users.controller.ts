import { CurrentUser } from '@/common/decorators';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetProfileService } from '../services/get-profile.service';
import type { RequestUser } from '@/common/types';
import { JwtAuthGuard } from '@/common/guards';

@Controller('users/me')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly getProfileService: GetProfileService) {}

  @Get()
  getProfile(@CurrentUser() user: RequestUser) {
    return this.getProfileService.execute(user.id as string);
  }
}
