import app from './app';
import { env } from './config/env';
import { connectDatabase } from './db';

const startServer = async () => {
  // Initialize Database (Atlas or JSON fallback)
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 API server is running in [${env.NODE_ENV}] mode on port ${env.PORT}`);
    console.log(`🔗 Web app origin allowed: ${env.WEB_ORIGIN}`);
    console.log(`🔗 API baseline URL: ${env.API_ORIGIN}/api/v1`);
  });

  // Handle termination signals gracefully
  const shutdown = () => {
    console.log('⚡ Received shutdown signal. Closing server...');
    server.close(() => {
      console.log('✅ Server closed. Exiting process.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer().catch(err => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});
