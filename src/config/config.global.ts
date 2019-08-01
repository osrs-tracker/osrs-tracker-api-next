import os from 'os';
import { Opts } from 'express-prom-bundle/types';

export interface IConfigGlobal {
  port: number;
  portMetrics: number;
  prometheusOptions: Opts;
  workerCount: number;
}

export const globalConfig: IConfigGlobal = {
  port: Number(process.env.PORT) || 8080,
  portMetrics: Number(process.env.PORT_METRICS) || 8088,
  prometheusOptions: {
    autoregister: false,
    customLabels: { app: 'osrs-tracker-api' },
    includeMethod: true,
    includePath: true,
  },
  workerCount: Number(process.env.WORKER_COUNT) || os.cpus().length,
};
