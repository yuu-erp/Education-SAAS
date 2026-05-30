export interface AppConfig {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  frontendDomain: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
}

export type DatabaseConfig = {
  url: string;
};

export type AuthConfig = {
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
  googleClientId?: string;
  googleClientSecret?: string;
  googleCallbackUrl?: string;
};

import { MailConfig } from '../integrations/mail/core/mail.config';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
  mail: MailConfig;
};
