import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import favoritesRouter from './routes/favoritesRoutes.js';
import playersRouter from './routes/players.routes.js';
import realNbaRouter from './routes/realNbaRoutes.js';
import standingsRouter from './routes/standingsRoutes.js';
import statsRouter from './routes/stats.routes.js';
import teamsRouter from './routes/teams.routes.js';

const app = express();
const PORT = process.env.PORT ?? 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
  }),
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'NBA Insight API running' });
});

app.use('/api/teams', teamsRouter);
app.use('/api/players', playersRouter);
app.use('/api/stats', statsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/real', realNbaRouter);
app.use('/api/standings', standingsRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`NBA Insight API running on http://localhost:${PORT}`);
});
