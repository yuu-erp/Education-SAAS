import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '@/integrations/mail/mail.module';
import { AuthController } from './controllers/auth.controller';
import { RegisterService } from './services/register.service';
import { LoginService } from './services/login.service';
import { TokenService } from './services/token.service';
import { PasswordService } from './services/password.service';
import { OtpService } from './services/otp.service';
import { VerifyOtpService } from './services/verify-otp.service';
import { ResendOtpService } from './services/resend-otp.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AllConfigType } from '@/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        secret: configService.get('auth.jwtSecret', { infer: true }),
        signOptions: {
          expiresIn: configService.get('auth.jwtExpiresIn', { infer: true }),
        },
      }),
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    RegisterService,
    LoginService,
    TokenService,
    PasswordService,
    OtpService,
    VerifyOtpService,
    ResendOtpService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [
    RegisterService,
    LoginService,
    TokenService,
    PasswordService,
    OtpService,
    VerifyOtpService,
    ResendOtpService,
  ],
})
export class AuthModule {}
