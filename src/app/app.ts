import bodyParser from 'body-parser';
import { Worker } from 'cluster';
import cors from 'cors';
import express, { Application } from 'express';
import prometheusMetricsMiddleware from 'express-prom-bundle';
import helmet from 'helmet';
import { config } from '../config/config';
import { Logger } from './common/logger';
import { requestLogger } from './middleware/logger.middleware';
import { MongoClient } from 'mongodb';
import { HealthRouterFactory } from './routers/health.router-factory';

export class App {
  readonly express: Application;
  readonly mongo: MongoClient;

  static async run(worker: Worker): Promise<App> {
    const app = new App();
    await app.start(worker);
    return app;
  }

  private constructor() {
    this.express = express();
    this.mongo = new MongoClient(config.mongo.url, config.mongo.options);

    this.setupMiddleware();
  }

  private async start(worker: Worker): Promise<void> {
    await this.mongo.connect();

    this.express.listen(config.port, () => {
      Logger.log(`WORKER ${worker.id} CREATED ON PORT ${config.port}`);
      this.setupRouters();
    });
  }

  private setupMiddleware(): void {
    this.express.use(helmet({ noCache: true }));
    this.express.use(cors(config.corsOptions));
    this.express.use(prometheusMetricsMiddleware(config.prometheusOptions));
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(bodyParser.json());
    this.express.use(requestLogger(['/health']));
  }

  private setupRouters(): void {
    [new HealthRouterFactory()].forEach(factory => factory.create(this));
  }
}
