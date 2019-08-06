import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Logger } from '../common/logger';

export const responseLogger = (blacklist: string[] = []): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = process.hrtime();

  if (blacklist.some(url => req.originalUrl.startsWith(url))) return next();

  res.on('finish', () => {
    const end = process.hrtime(start);
    const elapsedTime = `${Math.floor(end[0] * 1000 + end[1] / 1000000)}ms`;

    const message = [
      req.method,
      req.originalUrl + ';',
      res.statusCode,
      res.statusMessage + ';',
      'Response time:',
      elapsedTime,
    ];

    if (res.getHeader('x-cache-timestamp')) {
      message.push('from cache');
    }

    Logger.logTask('REQUEST_LOGGER', ...message);
  });

  next();
};
