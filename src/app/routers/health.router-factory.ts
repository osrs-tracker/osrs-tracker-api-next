import { Router } from 'express';
import { MongoClient } from 'mongodb';
import { App } from '../app';
import { RouterFactory } from './router-factory.interface';

export class HealthRouterFactory implements RouterFactory {

  create({ express, mongo }: App): void {
    const router = Router();

    this.setupRoutes(router, mongo);

    express.use('/health', router);
  }

  private setupRoutes(router: Router, mongo: MongoClient): void {
    this.getHealth(router, mongo);
  }

  private getHealth(router: Router, mongo: MongoClient): void {
    router.get('/', async (req, res) => {
      if (mongo.isConnected()) {
        res.status(200).send('HEALTHY');
      }
      return res.status(500).send('UNHEALTHY');
    });
  }

}
