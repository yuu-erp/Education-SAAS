import appConfig from '@/config/app.config';
import databaseConfig from '@/config/database.config';
import { PrismaModule } from '@/database/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
