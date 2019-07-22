import bodyParser from 'body-parser';
import { Worker } from 'cluster';
import cors from 'cors';
import express, { Application } from 'express';
import prometheusMetricsMiddleware from 'express-prom-bundle';
import helmet from 'helmet';
import { config } from '../config/config';
import { Logger } from './common/logger';
import { requestLogger } from './middleware/logger.middleware';

export class App {
  private _app: Application;

  static run(worker: Worker): App {
    const app = new App();
    app.start(worker);
    return app;
  }

  private constructor() {
    this._app = express();

    this.setupMiddleware();
    this.setupRouters();
  }

  private start(worker: Worker): void {
    this._app.listen(config.port, () => {
      Logger.log(`WORKER ${worker.id} CREATED ON PORT ${config.port}`);
      this.setupRouters();
    });
  }

  private setupMiddleware(): void {
    this._app.use(helmet({ noCache: true }));
    this._app.use(cors(config.corsOptions));
    this._app.use(bodyParser.urlencoded({ extended: true }));
    this._app.use(bodyParser.json());
    this._app.use(requestLogger(['/health', '/metrics']));
    this._app.use(
      prometheusMetricsMiddleware({
        autoregister: false,
        customLabels: { app: 'osrs-tracker-api' },
        includeMethod: true,
        includePath: true,
      }),
    );
  }

  private setupRouters(): void {
    // TODO:
  }
}
