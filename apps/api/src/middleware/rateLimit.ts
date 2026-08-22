import rateLimit from 'express-rate-limit';
import { Response } from 'express';
import { ExtendedRequest } from './error';

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: ExtendedRequest, res: Response) => {
    res.status(429).json({
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests from this IP, please try again after 15 minutes.',
        requestId: req.requestId,
      },
    });
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 register/login requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: ExtendedRequest, res: Response) => {
    res.status(429).json({
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many login or registration attempts. Please try again after 15 minutes.',
        requestId: req.requestId,
      },
    });
  },
});
