import { globalConfig } from './config.global';
import { IConfig } from './config.interface';

export const config: IConfig = {
  ...globalConfig,

  corsOptions: {},
  mongo: {
    url: process.env.MONGO_URL!,
    database: process.env.MONGO_DATABASE!,
    options: {
      auth: {
        user: process.env.MONGO_USER!,
        password: process.env.MONGO_PASSWORD!,
      },
      authSource: process.env.MONGO_AUTH_SOURCE,
      authMechanism: 'SCRAM-SHA-1',
      autoReconnect: true,
      useNewUrlParser: true,
    },
  },
};
