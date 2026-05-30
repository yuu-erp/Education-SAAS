import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '@/integrations/mail/mail.module';
import { AuthController } from './controllers/auth.controller';
import { GoogleAuthController } from './controllers/google-auth.controller';
import { RegisterService } from './services/register.service';
import { LoginService } from './services/login.service';
import { TokenService } from './services/token.service';
import { PasswordService } from './services/password.service';
import { OtpService } from './services/otp.service';
import { VerifyOtpService } from './services/verify-otp.service';
import { ResendOtpService } from './services/resend-otp.service';
import { GoogleAuthService } from './services/google-auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
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
  controllers: [AuthController, GoogleAuthController],
  providers: [
    RegisterService,
    LoginService,
    TokenService,
    PasswordService,
    OtpService,
    VerifyOtpService,
    ResendOtpService,
    GoogleAuthService,
    JwtStrategy,
    GoogleStrategy,
    JwtAuthGuard,
    GoogleAuthGuard,
  ],
  exports: [
    RegisterService,
    LoginService,
    TokenService,
    PasswordService,
    OtpService,
    VerifyOtpService,
    ResendOtpService,
    GoogleAuthService,
  ],
})
export class AuthModule {}
