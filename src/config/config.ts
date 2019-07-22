import { globalConfig } from './config.global';
import { IConfig } from './config.interface';

export const config: IConfig = {
  ...globalConfig,

  corsOptions: {},
  prometheusOptions: {
    autoregister: false,
    customLabels: { app: 'osrs-tracker-api' },
    includeMethod: true,
    includePath: true,
  },
};
