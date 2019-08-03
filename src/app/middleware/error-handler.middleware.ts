import { NextFunction, Request, Response, ErrorRequestHandler } from 'express-serve-static-core';
import { Logger } from '../common/logger';

export const errorHandler = (): ErrorRequestHandler => (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Logger.logTask('ERROR_HANDLER', err.message);
  res.sendStatus(500);
};
