import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, databaseConfig } from '@/config';
import { PrismaModule } from '@/database';
import { AuthModule } from '@/modules/auth/auth.module';
import { StudentsModule } from '@/modules/students/students.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    PrismaModule,
    AuthModule,
    StudentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
