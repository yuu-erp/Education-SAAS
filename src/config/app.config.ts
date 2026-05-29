import { validateConfig } from '@/common/utils';
import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { AppConfig } from './config.type';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV?: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT?: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN?: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN?: string;

  @IsString()
  @IsOptional()
  API_PREFIX?: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE?: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE?: string;
}

export default registerAs<AppConfig>('app', () => {
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    APP_PORT: process.env.APP_PORT,
    FRONTEND_DOMAIN: process.env.FRONTEND_DOMAIN,
    BACKEND_DOMAIN: process.env.BACKEND_DOMAIN,
    API_PREFIX: process.env.API_PREFIX,
    APP_FALLBACK_LANGUAGE: process.env.APP_FALLBACK_LANGUAGE,
    APP_HEADER_LANGUAGE: process.env.APP_HEADER_LANGUAGE,
  };

  validateConfig(env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',

    name: process.env.APP_NAME ?? 'app',

    workingDirectory: process.cwd(),

    frontendDomain: process.env.FRONTEND_DOMAIN ?? 'http://localhost:3000',

    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost:3000',

    port: Number(process.env.APP_PORT) || Number(process.env.PORT) || 3000,

    apiPrefix: process.env.API_PREFIX ?? 'api',

    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE ?? 'en',

    headerLanguage: process.env.APP_HEADER_LANGUAGE ?? 'x-custom-lang',
  };
});
