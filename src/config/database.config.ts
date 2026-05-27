import { validateConfig } from '@/common/utils';
import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { DatabaseConfig } from './database-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  DATABASE_URL: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    url: process.env.DATABASE_URL || '',
  };
});
