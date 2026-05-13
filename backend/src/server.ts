import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import { pool } from './db/pool.js';
import authRouter from './routes/auth.js';
import favoritesRouter from './routes/favoritesRoutes.js';
import playersRouter from './routes/players.routes.js';
import realNbaRouter from './routes/realNbaRoutes.js';
import standingsRouter from './routes/standingsRoutes.js';
import statsRouter from './routes/stats.routes.js';
import teamsRouter from './routes/teams.routes.js';
import { logger } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';
const ADDITIONAL_ALLOWED_ORIGINS = process.env.ADDITIONAL_ALLOWED_ORIGINS ?? '';
const allowedOrigins = Array.from(
  new Set(
    [FRONTEND_URL, 'http://localhost:5173', ...ADDITIONAL_ALLOWED_ORIGINS.split(',')]
      .map((origin) => origin.trim())
      .filter(Boolean),
  ),
);

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
  }),
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'nba-insight-api',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health/db', async (_req, res) => {
  try {
    const result = await pool.query<{ now: Date }>('SELECT NOW()');

    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      dbTime: result.rows[0].now,
    });
  } catch (error) {
    logger.error('Database health check failed', error);
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      message: 'Database connection failed',
    });
  }
});

app.use('/api/teams', teamsRouter);
app.use('/api/players', playersRouter);
app.use('/api/stats', statsRouter);
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/real', realNbaRouter);
app.use('/api/standings', standingsRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  logger.info(`NBA Insight API running on port ${PORT}`);
});
