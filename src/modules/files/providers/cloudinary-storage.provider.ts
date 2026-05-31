import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import type {
  StorageProvider,
  UploadedFile,
  MulterFile,
} from '../interfaces/storage-provider.interface';

@Injectable()
export class CloudinaryStorageProvider implements StorageProvider {
  private readonly logger = new Logger(CloudinaryStorageProvider.name);

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async upload(file: MulterFile, folder = 'general'): Promise<UploadedFile> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          format: this.getPreferredFormat(file.mimetype), // Optional: force format based on mimetype
        },
        (error, result) => {
          if (error) {
            const err: Error =
              error instanceof Error
                ? error
                : new Error(error?.message || 'Cloudinary upload failed');
            this.logger.error(`Cloudinary upload failed: ${err.message}`);
            return reject(err);
          }
          if (!result) {
            return reject(new Error('Cloudinary upload returned no result'));
          }

          resolve({
            url: result.secure_url,
            key: result.public_id,
            filename: result.original_filename || file.originalname,
            mimeType: result.format ? `image/${result.format}` : file.mimetype,
            size: result.bytes,
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async delete(key: string): Promise<boolean> {
    try {
      const result = (await cloudinary.uploader.destroy(key)) as {
        result: string;
      };
      if (result.result === 'ok') {
        return true;
      }
      this.logger.warn(
        `Cloudinary delete returned unexpected result: ${JSON.stringify(result)}`,
      );
      return false;
    } catch (error) {
      this.logger.error(
        `Failed to delete file ${key} from Cloudinary: ${(error as Error).message}`,
      );
      return false;
    }
  }

  private getPreferredFormat(mimetype: string): string | undefined {
    // Return specific formats for cloudinary if needed, or undefined to let cloudinary decide or keep original.
    if (mimetype === 'image/jpeg') return 'jpg';
    if (mimetype === 'image/png') return 'png';
    return undefined;
  }
}
