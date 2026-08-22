import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { requestIdMiddleware } from './middleware/requestId';
import { errorHandler } from './middleware/error';
import { apiRateLimiter } from './middleware/rateLimit';

// Import routers
import authRouter from './modules/auth/auth.routes';
import usersRouter from './modules/users/users.routes';
import catalogueRouter from './modules/catalogue/catalogue.routes';
import cartRouter from './modules/cart/cart.routes';
import checkoutRouter from './modules/checkout/checkout.routes';
import adminRouter from './modules/admin/admin.routes';

const app = express();

// Middleware execution order
app.use(requestIdMiddleware);

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: env.WEB_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
app.use('/api/', apiRateLimiter);

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    database: env.MONGODB_URI ? 'mongodb' : 'json-file-fallback',
    timestamp: new Date().toISOString()
  });
});

// Mount module routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1', catalogueRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1', checkoutRouter);
app.use('/api/v1/admin', adminRouter);

// Fallback for wishlist endpoint matching TRD exactly
app.use('/api/v1/wishlist', (req, res, next) => {
  // Redirect internally to /cart/wishlist paths
  req.url = req.url === '/' ? '/wishlist' : `/wishlist${req.url}`;
  cartRouter(req, res, next);
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`,
      requestId: (req as any).requestId
    }
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
