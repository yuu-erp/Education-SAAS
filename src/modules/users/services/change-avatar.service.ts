import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { FilesService } from '../../files/services/files.service';
import type { MulterFile } from '../../files/interfaces/storage-provider.interface';

@Injectable()
export class ChangeAvatarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  async execute(userId: string, file: MulterFile) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Upload the new avatar
    const uploadedFile = await this.filesService.uploadFile(
      file,
      userId,
      'avatars',
    );

    // Update user's avatar URL
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: uploadedFile.url,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }
}
