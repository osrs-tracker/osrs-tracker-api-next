import { CorsOptions } from 'cors';
import { IConfigGlobal } from './config.global';
import { MongoClientOptions } from 'mongodb';

export interface IConfig extends IConfigGlobal {
  corsOptions: CorsOptions;
  mongo: {
    url: string,
    database: string,
    options: MongoClientOptions,
  };
}
