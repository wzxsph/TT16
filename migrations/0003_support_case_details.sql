ALTER TABLE support_cases ADD COLUMN requester_contact TEXT;
ALTER TABLE support_cases ADD COLUMN message TEXT;

CREATE INDEX IF NOT EXISTS idx_support_cases_status_time
ON support_cases(status, created_at);
