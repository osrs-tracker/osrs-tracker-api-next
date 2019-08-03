import { Router } from 'express';
import { MongoClient } from 'mongodb';
import { App } from '../app';
import { RouterFactory } from './router-factory.interface';
import Axios from 'axios';
import { config } from '../../config/config';

export class PlayerRouterFactory implements RouterFactory {

  create({ express, mongo }: App): void {
    const router = Router();

    this.setupRoutes(router, mongo);

    express.use('/player', router);
  }

  private setupRoutes(router: Router, mongo: MongoClient): void {
    this.playerProxy(router, mongo);
  }

  /**
   * PROXY TO OLD API FOR BACKCOMP SUPPORT.
   */
  private playerProxy(router: Router, mongo: MongoClient): void {
    router.get('*', async (req, res, next) => {
      try {
        const result = await Axios.get(config.backCompBaseUrl + req.originalUrl);
        res.status(result.status).send(result.data);
      } catch (e) {
        res.status(e.response.status).send(e.response.data);
      }
    });
    router.post('*', async (req, res, next) => {
      try {
        const result = await Axios.post(config.backCompBaseUrl + req.originalUrl, req.body);
        res.status(result.status).send(result.data);
      } catch (e) {
        res.status(e.response.status).send(e.response.data);
      }
    });
  }

}
