import { Router } from 'express';
import { MongoClient } from 'mongodb';
import { App } from '../app';
import { RouterFactory } from './router-factory.interface';
import { ProxyRepository } from '../repositories/proxy.repository';

export class ProxyRouterFactory implements RouterFactory {

  create({ express, mongo }: App): void {
    const router = Router();

    this.setupRoutes(router, mongo);

    express.use('/proxy', router);
  }

  private setupRoutes(router: Router, mongo: MongoClient): void {
    this.getHiscore(router, mongo);
    this.getItem(router, mongo);
    this.getItemGraph(router, mongo);
    this.getLatestNews(router, mongo);
  }

  private getHiscore(router: Router, mongo: MongoClient): void {
    router.get('/hiscore/:username', async (req, res, next) => {
      try {
        const hiscore = await ProxyRepository.getHiscore({ username: req.params.username, type: req.query.type });
        if (hiscore) res.status(200).json(hiscore);
        else res.sendStatus(404);
      } catch (e) {
        next(e);
      }
    });
  }

  private getItem(router: Router, mongo: MongoClient): void {
    router.get('/item/:id', async (req, res, next) => {
      try {
        const item = await ProxyRepository.getItem(req.params.id);
        if (item) res.status(200).json(item);
        else res.sendStatus(404);
      } catch (e) {
        next(e);
      }
    });
  }

  private getItemGraph(router: Router, mongo: MongoClient): void {
    router.get('/item/:id/graph', async (req, res, next) => {
      try {
        const itemGraph = await ProxyRepository.getItemGraph(req.params.id);
        if (itemGraph) res.status(200).json(itemGraph);
        else res.sendStatus(404);
      } catch (e) {
        next(e);
      }
    });
  }

  private getLatestNews(router: Router, mongo: MongoClient): void {
    router.get('/news', async (req, res, next) => {
      try {
        const news = await ProxyRepository.getLatestNews();
        res.status(200).json(news);
      } catch (e) {
        next(e);
      }
    });
  }

}
