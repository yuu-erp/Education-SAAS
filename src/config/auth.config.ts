import { validateConfig } from '@/common/utils';
import { registerAs } from '@nestjs/config';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { AuthConfig } from './config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  JWT_SECRET?: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN?: string;

  @IsString()
  @IsOptional()
  REFRESH_SECRET?: string;

  @IsString()
  @IsOptional()
  REFRESH_EXPIRES_IN?: string;

  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_ID?: string;

  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_SECRET?: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  GOOGLE_CALLBACK_URL?: string;
}

export default registerAs<AuthConfig>('auth', () => {
  const env = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || undefined,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || undefined,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || undefined,
  };

  validateConfig(env, EnvironmentVariablesValidator);

  return {
    jwtSecret: env.JWT_SECRET || 'secretKey',
    jwtExpiresIn: env.JWT_EXPIRES_IN || '15m',
    refreshSecret: env.REFRESH_SECRET || 'refreshSecretKey',
    refreshExpiresIn: env.REFRESH_EXPIRES_IN || '7d',
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl:
      env.GOOGLE_CALLBACK_URL ||
      'http://localhost:3000/api/auth/google/callback',
  };
});
