import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './env';
import { healthRouter } from './routes/health';
import { tipsRouter } from './routes/tips';
import { accessRouter } from './routes/access';
import { adminRouter } from './routes/admin';
import { configRouter } from './routes/config';
import { errorHandler, notFoundHandler } from './middleware/error';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({
    origin: env.APP_ORIGIN.split(',').map(origin => origin.trim()),
    credentials: true,
  }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(rateLimit({
    windowMs: 60_000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }));

  app.get('/', (_req, res) => {
    res.json({
      name: 'lord-wagali-backend',
      version: '1.0.0',
      docs: '/health',
    });
  });

  app.use('/health', healthRouter);
  app.use('/api/v1/tips', tipsRouter);
  app.use('/api/v1/access', accessRouter);
  app.use('/api/v1/admin', adminRouter);
  app.use('/api/v1/config', configRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
