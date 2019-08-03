import { Router } from 'express';
import { MongoClient } from 'mongodb';
import { App } from '../app';
import { RouterFactory } from './router-factory.interface';
import Axios from 'axios';
import { config } from '../../config/config';

export class IconRouterFactory implements RouterFactory {

  create({ express, mongo }: App): void {
    const router = Router();

    this.setupRoutes(router, mongo);

    express.use('/icon', router);
  }

  private setupRoutes(router: Router, mongo: MongoClient): void {
    this.iconProxy(router, mongo);
  }

  /**
   * PROXY TO OLD API FOR BACKCOMP SUPPORT.
   */
  private iconProxy(router: Router, mongo: MongoClient): void {
    router.get('/:id', async (req, res, next) => {

      try {
        const result = await Axios.get<Blob>(config.backCompBaseUrl + req.originalUrl, {
          responseType: 'arraybuffer',
        });
        res.type('image/gif');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.setHeader('Content-Disposition', `inline; filename="${req.params.id}.gif"`);
        res.send(result.data);
      } catch (e) {
        res.status(e.response.status).send(e.response.data);
      }
    });
  }

}
