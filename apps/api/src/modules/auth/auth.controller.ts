import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../../middleware/error';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '@ecom/contracts';
import { UserRepository, SessionRepository } from '../../db/repositories';
import { hashPassword, verifyPassword } from '../../lib/hash';
import { AppError } from '../../lib/errors';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import crypto from 'crypto';

const SHAHA_SECRET = 'token_hash_secret_salt';
const hashToken = (token: string) => {
  return crypto.createHmac('sha256', SHAHA_SECRET).update(token).digest('hex');
};

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: 'lax' as const,
  path: '/',
};

const generateTokensAndSetCookies = async (res: Response, user: any, ip: string, userAgent: string) => {
  // Create an opaque refresh token and its hash
  const rawRefreshToken = crypto.randomBytes(40).toString('hex');
  const refreshTokenHash = hashToken(rawRefreshToken);
  
  // Calculate expiration dates
  const accessExpiresIn = 15 * 60 * 1000; // 15m
  const refreshExpiresIn = 7 * 24 * 60 * 60 * 1000; // 7d
  
  const refreshExpiresAt = new Date(Date.now() + refreshExpiresIn);
  
  // Save session to DB
  const session = await SessionRepository.create({
    userId: user.id,
    refreshTokenHash,
    expiresAt: refreshExpiresAt,
    ipHash: crypto.createHash('sha256').update(ip).digest('hex'),
    userAgent,
  });

  // Create JWT Access Token
  const accessToken = jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
      sessionId: session.id,
    },
    env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: env.ACCESS_TOKEN_TTL as any }
  );

  // Set cookies
  res.cookie('accessToken', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: accessExpiresIn,
  });
  
  res.cookie('refreshToken', rawRefreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: refreshExpiresIn,
  });

  return { accessToken, refreshToken: rawRefreshToken };
};

export const AuthController = {
  async register(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const body = registerSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await UserRepository.findByEmail(body.email);
      if (existingUser) {
        return next(AppError.conflict('A user with this email already exists', 'CONFLICT'));
      }

      // Hash password
      const passwordHash = await hashPassword(body.password);

      // Create user
      const user = await UserRepository.create({
        email: body.email,
        name: body.name,
        phone: body.phone,
        role: 'customer', // Default role
        preferences: { marketingEmails: true },
        passwordHash,
      });

      // Create session and set cookies
      await generateTokensAndSetCookies(
        res,
        user,
        req.ip || '127.0.0.1',
        req.headers['user-agent'] || 'unknown'
      );

      res.status(201).json({
        data: {
          user,
        },
        meta: {
          requestId: req.requestId,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const body = loginSchema.parse(req.body);

      // Find user
      const userWithHash = await UserRepository.findByEmail(body.email);
      if (!userWithHash) {
        return next(AppError.unauthenticated('Invalid email or password'));
      }

      // Verify password
      const isValid = await verifyPassword(body.password, userWithHash.passwordHash);
      if (!isValid) {
        return next(AppError.unauthenticated('Invalid email or password'));
      }

      if (userWithHash.status === 'blocked') {
        return next(AppError.forbidden('Your account is blocked. Please contact support.'));
      }

      // Remove password hash from response object
      const { passwordHash, ...user } = userWithHash;

      // Generate session and set cookies
      await generateTokensAndSetCookies(
        res,
        user,
        req.ip || '127.0.0.1',
        req.headers['user-agent'] || 'unknown'
      );

      res.status(200).json({
        data: {
          user,
        },
        meta: {
          requestId: req.requestId,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async logout(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const rawRefreshToken = req.cookies?.refreshToken;
      
      if (rawRefreshToken) {
        const refreshTokenHash = hashToken(rawRefreshToken);
        await SessionRepository.revoke(refreshTokenHash);
      }

      // Clear cookies
      res.clearCookie('accessToken', COOKIE_OPTIONS);
      res.clearCookie('refreshToken', COOKIE_OPTIONS);

      res.status(200).json({
        data: {
          success: true,
        },
        meta: {
          requestId: req.requestId,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const rawRefreshToken = req.cookies?.refreshToken;
      if (!rawRefreshToken) {
        return next(AppError.unauthenticated('Refresh token is missing'));
      }

      const refreshTokenHash = hashToken(rawRefreshToken);
      const session = await SessionRepository.findByTokenHash(refreshTokenHash);

      if (!session || session.revokedAt || new Date(session.expiresAt).getTime() < Date.now()) {
        // Clear tokens on client side if token is invalid or expired
        res.clearCookie('accessToken', COOKIE_OPTIONS);
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        return next(AppError.unauthenticated('Invalid or expired refresh session'));
      }

      // Find user
      const user = await UserRepository.findById(session.userId);
      if (!user) {
        return next(AppError.unauthenticated('User not found'));
      }

      if (user.status === 'blocked') {
        res.clearCookie('accessToken', COOKIE_OPTIONS);
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        return next(AppError.forbidden('Your account is blocked. Please contact support.'));
      }

      // Revoke the old session (Token rotation)
      await SessionRepository.revoke(refreshTokenHash);

      // Generate a new session
      await generateTokensAndSetCookies(
        res,
        user,
        req.ip || '127.0.0.1',
        req.headers['user-agent'] || 'unknown'
      );

      res.status(200).json({
        data: {
          user,
        },
        meta: {
          requestId: req.requestId,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async me(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(AppError.unauthenticated());
      }

      const user = await UserRepository.findById(req.user.id);
      if (!user) {
        return next(AppError.notFound('User profile not found'));
      }

      res.status(200).json({
        data: {
          user,
        },
        meta: {
          requestId: req.requestId,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async forgotPassword(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      forgotPasswordSchema.parse(req.body);
      
      // Amazon/PRD guidelines: Do not leak whether the email exists.
      // So always return success.
      res.status(200).json({
        data: {
          message: 'If the email exists, a password reset link has been dispatched.',
        },
        meta: {
          requestId: req.requestId,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const body = resetPasswordSchema.parse(req.body);

      // Dummy implementation: in a real app we would verify token, fetch user, and update password
      // Since it's a dummy app, verify simple mock reset:
      if (body.token === 'invalid-token') {
        return next(AppError.badRequest('The reset link is invalid or has expired'));
      }

      res.status(200).json({
        data: {
          success: true,
          message: 'Password updated successfully. You can now log in.',
        },
        meta: {
          requestId: req.requestId,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async verifyEmail(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const token = req.query.token as string;
      if (!token) {
        return next(AppError.badRequest('Verification token is missing'));
      }

      // Dummy verification
      res.status(200).json({
        data: {
          success: true,
          message: 'Email address verified successfully.',
        },
        meta: {
          requestId: req.requestId,
        },
      });
    } catch (err) {
      next(err);
    }
  }
};
