import cluster from 'cluster';
import * as express from 'express';
import { clusterMetrics } from 'express-prom-bundle';
import { App } from './app/app';
import { Logger } from './app/common/logger';
import { config } from './config/config';

if (cluster.isMaster) {
  // Setup metrics master
  const metricsApp = express();
  metricsApp.use('/metrics', clusterMetrics());
  metricsApp.listen(config.portMetrics);

  cluster.on('exit', worker => {
    Logger.log(`WORKER ${worker.id} DIED - CREATING NEW WORKER`);
    cluster.fork();
  });

  for (let i = 0; i < config.workerCount; i++) {
    cluster.fork();
  }
} else {
  App.run(cluster.worker);
}
