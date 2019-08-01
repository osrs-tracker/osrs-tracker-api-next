import bodyParser from 'body-parser';
import { Worker } from 'cluster';
import cors from 'cors';
import express, { Application } from 'express';
import prometheusMetricsMiddleware from 'express-prom-bundle';
import helmet from 'helmet';
import { MongoClient } from 'mongodb';
import { config } from '../config/config';
import { Logger } from './common/logger';
import { requestLogger } from './middleware/logger.middleware';
import { HealthRouterFactory } from './routers/health.router-factory';
import { Server } from 'http';

export class App {
  readonly express: Application;
  readonly mongo: MongoClient;

  private _server?: Server;
  private _worker!: Worker;

  static async run(worker: Worker): Promise<App> {
    const app = new App(worker);
    try {
      await app.start();
    } catch (e) {
      app.kill();
    }
    return app;
  }

  public kill(): void {
    this.mongo.close(true);
    if (this._server) this._server.close();
    this._worker.kill();
  }

  private constructor(worker: Worker) {
    this._worker = worker;
    this.express = express();
    this.mongo = new MongoClient(config.mongo.url, config.mongo.options);

    this.setupMiddleware();
  }

  private async start(): Promise<void> {
    await this.mongo.connect();

    this._server = this.express.listen(config.port, () => {
      Logger.log(`WORKER ${this._worker.id} CREATED ON PORT ${config.port}`);
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
