import { Router } from 'express';
import { App } from '../app';
import { ProxyRepository } from '../repositories/proxy.repository';
import { RouterFactory } from './router-factory.interface';

export class ProxyRouterFactory implements RouterFactory {

  create({ express }: App): void {
    const router = Router();

    this.setupRoutes(router);

    express.use('/proxy', router);
  }

  private setupRoutes(router: Router): void {
    this.getHiscore(router);
    this.getItem(router);
    this.getItemGraph(router);
    this.getLatestNews(router);
    this.getWikiSearchResults(router);
  }

  private getHiscore(router: Router): void {
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

  private getItem(router: Router): void {
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

  private getItemGraph(router: Router): void {
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

  private getLatestNews(router: Router): void {
    router.get('/news', async (req, res, next) => {
      try {
        const news = await ProxyRepository.getLatestNews();
        res.status(200).json(news);
      } catch (e) {
        next(e);
      }
    });
  }

  private getWikiSearchResults(router: Router): void {
    router.get('/wiki/:query', async (req, res, next) => {
      try {
        const news = await ProxyRepository.getWikiSearchResults(req.params.query, req.query.limit);
        if (news.length > 0) res.status(200).json(news);
        else res.sendStatus(204);
      } catch (e) {
        next(e);
      }
    });
  }

}
