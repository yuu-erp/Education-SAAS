import { CurrentUser } from '@/common/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as storageProviderInterface from '../../files/interfaces/storage-provider.interface';
import { GetProfileService } from '../services/get-profile.service';
import { UpdateProfileService } from '../services/update-profile.service';
import { RemoveAvatarService } from '../services/remove-avatar.service';
import { ChangeAvatarService } from '../services/change-avatar.service';
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
    private readonly changeAvatarService: ChangeAvatarService,
  ) {}

  @Get()
  getProfile(@CurrentUser() user: RequestUser) {
    console.log('user', user);
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

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  changeAvatar(
    @CurrentUser() user: RequestUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: storageProviderInterface.MulterFile,
  ) {
    return this.changeAvatarService.execute(user.id as string, file);
  }
}
