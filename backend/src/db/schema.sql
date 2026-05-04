CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  player_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, player_id)
);
