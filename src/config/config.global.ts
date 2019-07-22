import os from 'os';

export interface IConfigGlobal {
  port: number;
  portMetrics: number;
  workerCount: number;
}

export const globalConfig: IConfigGlobal = {
  port: Number(process.env.PORT) || 8080,
  portMetrics: Number(process.env.PORT_METRICS) || 8088,
  workerCount: Number(process.env.PORT) || os.cpus().length,
};
