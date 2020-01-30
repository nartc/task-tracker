import { IConfiguration } from './configuration';

export default () =>
  ({
    app: {
      host: 'localhost',
      port: 8080,
      domain: 'http://localhost:8080',
      env: 'development',
    },
    auth: {
      jwtSecret: 'superSecret!',
      jwtExpired: '12h',
      salt: 10,
    },
    mongo: {
      uri: 'mongodb://localhost:27017/task-tracker',
    },
    arena: {
      disableListen: false,
      host: 'localhost',
      port: 8080,
    },
    redis: {
      isCacheEnabled: true,
      host: 'localhost',
      port: 6379,
    },
  } as IConfiguration);
