import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, authConfig, databaseConfig, mailConfig } from '@/config';
import { PrismaModule } from '@/database';
import { AuthModule } from '@/modules/auth/auth.module';
import { StudentsModule } from '@/modules/students/students.module';
import { OrganizationModule } from '@/modules/organization/organization.module';
import { MailModule } from '@/integrations/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, mailConfig],
      envFilePath: ['.env'],
    }),
    PrismaModule,
    MailModule,
    AuthModule,
    StudentsModule,
    OrganizationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
