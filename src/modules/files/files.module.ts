import { Module } from '@nestjs/common';
import { PrismaModule } from '@/database';
import { FilesController } from './controllers/files.controller';
import { FilesService, STORAGE_PROVIDER } from './services/files.service';
import { LocalStorageProvider } from './providers/local-storage.provider';
import { CloudinaryStorageProvider } from './providers/cloudinary-storage.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [FilesController],
  providers: [
    FilesService,
    LocalStorageProvider,
    CloudinaryStorageProvider,
    {
      provide: STORAGE_PROVIDER,
      useFactory: (
        configService: ConfigService,
        localProvider: LocalStorageProvider,
        cloudinaryProvider: CloudinaryStorageProvider,
      ) => {
        const provider = configService.get<string>('STORAGE_PROVIDER');
        return provider === 'cloudinary' ? cloudinaryProvider : localProvider;
      },
      inject: [ConfigService, LocalStorageProvider, CloudinaryStorageProvider],
    },
  ],
  exports: [FilesService],
})
export class FilesModule {}
