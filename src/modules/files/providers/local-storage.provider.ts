import { Injectable, Logger } from '@nestjs/common';
import type {
  StorageProvider,
  UploadedFile,
  MulterFile,
} from '../interfaces/storage-provider.interface';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private readonly logger = new Logger(LocalStorageProvider.name);
  private readonly uploadDir = path.join(process.cwd(), 'public', 'uploads');
  private readonly backendDomain: string;

  constructor(private readonly configService: ConfigService) {
    this.backendDomain =
      this.configService.get<string>('BACKEND_DOMAIN') ||
      'http://localhost:3000';
    this.ensureUploadDir().catch((err) =>
      this.logger.error('Failed to create upload directory', err),
    );
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: MulterFile, folder = 'general'): Promise<UploadedFile> {
    const fileExtension = path.extname(file.originalname);
    const uniqueFilename = `${crypto.randomUUID()}${fileExtension}`;

    // Create folder specific directory if it doesn't exist
    const targetDir = path.join(this.uploadDir, folder);
    try {
      await fs.access(targetDir);
    } catch {
      await fs.mkdir(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, uniqueFilename);
    const fileKey = `${folder}/${uniqueFilename}`; // This is the relative path/key

    // Write buffer to file system
    await fs.writeFile(filePath, file.buffer);

    return {
      url: `${this.backendDomain}/uploads/${fileKey}`,
      key: fileKey,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async delete(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, key);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to delete file ${key}: ${(error as Error).message}`,
      );
      return false;
    }
  }
}
