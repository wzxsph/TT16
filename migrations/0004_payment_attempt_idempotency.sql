CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_attempt_provider_payment
ON payment_attempts(provider, provider_payment_id)
WHERE provider_payment_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payment_attempt_order_time
ON payment_attempts(order_id, created_at);
