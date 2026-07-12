PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS assessment_sessions (
  id TEXT PRIMARY KEY,
  recovery_hash TEXT NOT NULL,
  questionnaire_version TEXT NOT NULL,
  source_channel TEXT,
  status TEXT NOT NULL CHECK (status IN ('started', 'in_progress', 'needs_review', 'paywalled', 'purchased', 'expired')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS answers (
  session_id TEXT NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  value INTEGER CHECK (value BETWEEN -2 AND 2),
  answered_at TEXT NOT NULL,
  PRIMARY KEY (session_id, question_id)
);

CREATE TABLE IF NOT EXISTS assessment_results (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  type_code TEXT NOT NULL,
  score_json TEXT NOT NULL,
  questionnaire_version TEXT NOT NULL,
  scoring_version TEXT NOT NULL,
  content_version TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS report_snapshots (
  id TEXT PRIMARY KEY,
  result_id TEXT NOT NULL UNIQUE REFERENCES assessment_results(id) ON DELETE CASCADE,
  content_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  sku TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  amount_fen INTEGER NOT NULL CHECK (amount_fen > 0),
  currency TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO products (sku, name, amount_fen, currency, active, created_at, updated_at)
VALUES ('tt16-report-v1', 'TT16 完整交易人格报告', 490, 'CNY', 1, datetime('now'), datetime('now'));

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES assessment_sessions(id),
  result_id TEXT NOT NULL REFERENCES assessment_results(id),
  sku TEXT NOT NULL REFERENCES products(sku),
  amount_fen INTEGER NOT NULL,
  currency TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_order_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('created', 'payment_pending', 'paid', 'fulfilled', 'failed', 'cancelled', 'expired', 'refund_pending', 'refunded', 'refund_failed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  paid_at TEXT,
  fulfilled_at TEXT,
  refunded_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_session ON orders(session_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_provider_order ON orders(provider, provider_order_id) WHERE provider_order_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS payment_attempts (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_payment_id TEXT,
  status TEXT NOT NULL,
  callback_digest TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS entitlements (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE REFERENCES orders(id),
  report_id TEXT NOT NULL REFERENCES report_snapshots(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'revoked')),
  granted_at TEXT NOT NULL,
  revoked_at TEXT
);

CREATE TABLE IF NOT EXISTS report_tokens (
  id TEXT PRIMARY KEY,
  entitlement_id TEXT NOT NULL REFERENCES entitlements(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'revoked')),
  created_at TEXT NOT NULL,
  last_used_at TEXT,
  revoked_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_report_tokens_entitlement ON report_tokens(entitlement_id, created_at DESC);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  visitor_id TEXT,
  session_id TEXT,
  order_id TEXT,
  event_name TEXT NOT NULL,
  channel TEXT,
  page_version TEXT,
  questionnaire_version TEXT,
  price_version TEXT,
  paywall_version TEXT,
  report_version TEXT,
  properties_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_name_time ON events(event_name, created_at);
CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id, created_at);

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  entitlement_id TEXT NOT NULL REFERENCES entitlements(id),
  value TEXT NOT NULL CHECK (value IN ('like', 'neutral', 'unlike')),
  content_version TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS support_cases (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id),
  kind TEXT NOT NULL,
  reason_code TEXT,
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'rejected')),
  resolution TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (key, window_start)
);
