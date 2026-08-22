export type ApiErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'OUT_OF_STOCK'
  | 'PRICE_CHANGED'
  | 'COUPON_INVALID'
  | 'PAYMENT_FAILED'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: number;
  public readonly fields?: Record<string, string>;

  constructor(code: ApiErrorCode, statusCode: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.fields = fields;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message: string, code: ApiErrorCode = 'VALIDATION_ERROR', fields?: Record<string, string>) {
    return new AppError(code, 400, message, fields);
  }

  static unauthenticated(message: string = 'Authentication required') {
    return new AppError('UNAUTHENTICATED', 401, message);
  }

  static forbidden(message: string = 'Access denied') {
    return new AppError('FORBIDDEN', 403, message);
  }

  static notFound(message: string = 'Resource not found') {
    return new AppError('NOT_FOUND', 404, message);
  }

  static conflict(message: string, code: ApiErrorCode = 'CONFLICT') {
    return new AppError(code, 409, message);
  }

  static rateLimited(message: string = 'Too many requests, please try again later') {
    return new AppError('RATE_LIMITED', 429, message);
  }

  static internal(message: string = 'An unexpected error occurred') {
    return new AppError('INTERNAL_ERROR', 500, message);
  }
}
