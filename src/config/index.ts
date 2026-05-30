import appConfig from './app.config';
import databaseConfig from './database.config';
import authConfig from './auth.config';
import mailConfig from '../integrations/mail/core/mail.config';

export type {
  AppConfig,
  DatabaseConfig,
  AllConfigType,
  AuthConfig,
} from './config.type';

export { appConfig, databaseConfig, authConfig, mailConfig };
