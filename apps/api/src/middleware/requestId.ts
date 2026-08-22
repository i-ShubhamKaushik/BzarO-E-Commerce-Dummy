import { Response, NextFunction } from 'express';
import { ExtendedRequest } from './error';
import crypto from 'crypto';

export const requestIdMiddleware = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const reqId = crypto.randomUUID();
  req.requestId = reqId;
  res.setHeader('X-Request-ID', reqId);
  next();
};
