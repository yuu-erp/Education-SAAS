import {
  Injectable,
  Inject,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@/database';
import type {
  StorageProvider,
  MulterFile,
} from '../interfaces/storage-provider.interface';

export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    @Inject(STORAGE_PROVIDER) private readonly storageProvider: StorageProvider,
    private readonly prisma: PrismaService,
  ) {}

  async uploadFile(file: MulterFile, userId?: string, folder = 'general') {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      // 1. Upload file using the injected storage provider
      const uploadedFile = await this.storageProvider.upload(file, folder);

      // 2. Save file metadata to database
      const dbFile = await this.prisma.file.create({
        data: {
          url: uploadedFile.url,
          key: uploadedFile.key,
          filename: uploadedFile.filename,
          mimeType: uploadedFile.mimeType,
          size: uploadedFile.size,
          userId: userId || null,
        },
      });

      this.logger.log(
        `File uploaded successfully: ${dbFile.id} (${dbFile.key})`,
      );
      return dbFile;
    } catch (error) {
      this.logger.error(`Error uploading file: ${(error as Error).message}`);
      throw new BadRequestException('Failed to upload file');
    }
  }

  async deleteFile(fileId: string, userId?: string) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new BadRequestException('File not found');
    }

    // Optional: Check if user owns the file
    if (userId && file.userId && file.userId !== userId) {
      throw new BadRequestException(
        'You do not have permission to delete this file',
      );
    }

    try {
      // 1. Delete from storage provider
      await this.storageProvider.delete(file.key);

      // 2. Delete from database
      await this.prisma.file.delete({
        where: { id: fileId },
      });

      this.logger.log(`File deleted successfully: ${fileId} (${file.key})`);
      return { success: true, message: 'File deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting file: ${(error as Error).message}`);
      throw new BadRequestException('Failed to delete file');
    }
  }
}
