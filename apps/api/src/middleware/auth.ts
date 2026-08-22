import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../lib/errors';
import { ExtendedRequest } from './error';
import { UserRepository } from '../db/repositories';

interface JwtPayload {
  sub: string;
  role: string;
  email: string;
  sessionId: string;
}

export const authenticate = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(AppError.unauthenticated('Access token is missing'));
  }

  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
    
    const user = await UserRepository.findById(decoded.sub);
    if (!user || user.status === 'blocked') {
      return next(AppError.forbidden('Your account is blocked or no longer exists.'));
    }

    // Set user on request
    req.user = {
      id: decoded.sub,
      role: decoded.role,
      email: decoded.email,
    };
    
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AppError('UNAUTHENTICATED', 401, 'Access token has expired'));
    }
    return next(AppError.unauthenticated('Invalid access token'));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthenticated());
    }

    if (!roles.includes(req.user.role)) {
      return next(AppError.forbidden('You do not have permission to access this resource'));
    }

    next();
  };
};
