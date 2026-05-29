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

export interface DatabaseConfig {
  url: string;
}

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
};
