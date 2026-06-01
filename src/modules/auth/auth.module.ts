import { AllConfigType } from '@/config';
import { MailModule } from '@/integrations/mail/mail.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { GoogleAuthController } from './controllers/google-auth.controller';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import {
  GoogleAuthService,
  LoginService,
  LogoutService,
  OtpService,
  PasswordService,
  RegisterService,
  ResendOtpService,
  TokenService,
  VerifyOtpService,
} from './services';

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
    LogoutService,
    GoogleAuthService,
    JwtStrategy,
    GoogleStrategy,
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
    LogoutService,
    GoogleAuthService,
  ],
})
export class AuthModule {}
