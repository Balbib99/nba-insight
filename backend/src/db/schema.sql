CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  player_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, player_id)
);

CREATE TABLE IF NOT EXISTS standings_cache (
  id SERIAL PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'api-basketball',
  league_id TEXT NOT NULL,
  season TEXT NOT NULL,
  season_type TEXT NOT NULL DEFAULT 'Regular Season',
  payload JSONB NOT NULL,
  fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, league_id, season, season_type)
);
