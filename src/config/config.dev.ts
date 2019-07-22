import { globalConfig } from './config.global';
import { IConfig } from './config.interface';

export const config: IConfig = {
  ...globalConfig,

  corsOptions: {
    origin: ['localhost:8080'],
  },
  prometheusOptions: {
    autoregister: false,
    customLabels: { app: 'osrs-tracker-api-dev' },
  },
};
