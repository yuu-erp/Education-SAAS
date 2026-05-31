import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database';
import { FilesService } from '../../files/services/files.service';

@Injectable()
export class RemoveAvatarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  async execute(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.avatarUrl) {
      const oldFile = await this.prisma.file.findFirst({
        where: { url: user.avatarUrl, userId },
      });
      if (oldFile) {
        try {
          await this.filesService.deleteFile(oldFile.id, userId);
        } catch {
          // Ignore delete errors
        }
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: null,
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
