import { Router } from 'express';
import { App } from '../app';
import { IconRepository } from '../repositories/icon.repository';
import { RouterFactory } from './router-factory.interface';

export class IconRouterFactory implements RouterFactory {

  create({ express }: App): void {
    const router = Router();

    this.setupRoutes(router);

    express.use('/icon', router);
  }

  private setupRoutes(router: Router): void {
    this.getIcon(router);
  }

  private getIcon(router: Router): void {
    router.get('/:id', async (req, res, next) => {
      try {
        const id = req.params.id;
        const icon = await IconRepository.getIcon(id);

        if (!icon) return res.sendStatus(404);

        res.type('image/gif');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.setHeader('Content-Disposition', `inline; filename="${id}.gif"`);
        res.status(200).send(icon);
      } catch (e) {
        next(e);
      }
    });
  }

}
