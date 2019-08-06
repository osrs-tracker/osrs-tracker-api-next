import { NextFunction, Request, RequestHandler, Response } from 'express';
import { OutgoingHttpHeaders } from 'http';

interface WhitelistEntry {
  /** ex. /proxy/news */
  path: string;
  /** In seconds. Default is 60. */
  lifetime?: number;
  /** Safer to keep this off. Otherwise bruteforcing could overflow memory. */
  includeQueryParams?: boolean;
}

interface CachedResponse {
  timestamp: Date;
  status: number;
  headers: OutgoingHttpHeaders;
  payload: any;
}

const DEFAULT_CACHE_LIFETIME = 60;
const REQUEST_CACHE: { [url: string]: CachedResponse } = {};

export const responseCache = (whitelist: WhitelistEntry[] = []): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const whitelistEntry = whitelist.find(entry => req.path.startsWith(entry.path));

  if (whitelistEntry === undefined) {
    return next();
  }

  const path = whitelistEntry.includeQueryParams ? req.originalUrl : req.path;
  const cachedResponse = REQUEST_CACHE[path];

  if (cachedResponse === undefined || isExpired(cachedResponse, whitelistEntry)) {
    const send = res.send;
    res.send = (body?: any) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        cacheResponse(path, res, body);
      }
      return send.bind(res, body)();
    };
    return next();
  }

  res
    .set(cachedResponse.headers)
    .set('x-cache-timestamp', cachedResponse.timestamp.getTime().toString())
    .status(cachedResponse.status)
    .send(cachedResponse.payload);
};

function cacheResponse(path: string, res: Response, body?: any): void {
  REQUEST_CACHE[path] = {
    timestamp: new Date(),
    status: res.statusCode,
    headers: res.getHeaders(),
    payload: body,
  };
}

function isExpired(cachedResponse: CachedResponse, whitelistEntry: WhitelistEntry): boolean {
  const expiryTime = cachedResponse.timestamp.getTime() + (whitelistEntry.lifetime || DEFAULT_CACHE_LIFETIME) * 1000;
  return Date.now() > expiryTime;
}
