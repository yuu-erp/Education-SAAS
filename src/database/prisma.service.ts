import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from 'src/generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    // 1. Lấy connection string từ ConfigService (đã setup ở bước trước)
    const connectionString = configService.getOrThrow<string>('database.url', {
      infer: true,
    });

    // 2. Thiết lập Pool kết nối của pg
    const pool = new Pool({ connectionString });

    // 3. Khởi tạo Adapter cho Prisma v7
    const adapter = new PrismaPg(pool);

    // 4. Truyền adapter vào constructor của PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    // Trong Prisma v7 với Adapter, việc connect sẽ được quản lý tự động tốt hơn,
    // nhưng gọi $connect() vẫn giúp kiểm tra kết nối ngay khi startup.
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
