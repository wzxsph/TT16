ALTER TABLE events ADD COLUMN environment TEXT NOT NULL DEFAULT 'unknown';

CREATE INDEX IF NOT EXISTS idx_events_environment_time
ON events(environment, created_at);
