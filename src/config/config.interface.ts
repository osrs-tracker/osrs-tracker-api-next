import { CorsOptions } from 'cors';
import { Opts } from 'express-prom-bundle/types';
import { IConfigGlobal } from './config.global';

export interface IConfig extends IConfigGlobal {
  corsOptions: CorsOptions;
  prometheusOptions: Opts;
}
