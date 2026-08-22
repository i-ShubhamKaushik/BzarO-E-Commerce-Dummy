import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../lib/errors';
import { env } from '../config/env';

export interface ExtendedRequest extends Request {
  requestId?: string;
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

export const errorHandler = (
  err: any,
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.requestId || 'unknown';
  
  // Log the error
  if (env.NODE_ENV !== 'test') {
    console.error(`[Error] RequestID: ${requestId} | Path: ${req.path} | Message: ${err.message}`, err);
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        fields: err.fields,
        requestId,
      },
    });
  }

  // Handle Zod Validation Error
  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    err.errors.forEach((e) => {
      const fieldPath = e.path.join('.');
      fields[fieldPath] = e.message;
    });

    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Please correct the highlighted fields.',
        fields,
        requestId,
      },
    });
  }

  // Handle default server error
  const message = env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message;
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message,
      requestId,
    },
  });
};
