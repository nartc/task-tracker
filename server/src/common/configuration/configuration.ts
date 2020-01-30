export interface IConfiguration {
  app: {
    host: string;
    port: number;
    domain: string;
    env: 'development' | 'production';
  };
  mongo: {
    uri: string;
  };
  auth: {
    jwtSecret: string;
    jwtExpired: string;
    salt: number;
  };
  arena?: {
    port?: number;
    host?: string;
    basePath?: string;
    disableListen?: boolean;
    useCdn?: boolean;
  };
  redis: {
    isCacheEnabled: boolean;
    host: string;
    port: number;
  };
  isDevelopment: boolean;
}
