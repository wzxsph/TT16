-- TT16 commercial operational snapshot. Run read-only against D1.

SELECT 'sessions_by_status' AS metric, status AS dimension, COUNT(*) AS value
FROM assessment_sessions
GROUP BY status;

SELECT 'orders_by_status' AS metric, status AS dimension, COUNT(*) AS value
FROM orders
GROUP BY status;

SELECT 'paid_without_entitlement' AS metric, o.id AS dimension,
       CAST((julianday('now') - julianday(o.updated_at)) * 86400 AS INTEGER) AS value
FROM orders o
LEFT JOIN entitlements e ON e.order_id = o.id AND e.status = 'active'
WHERE o.status IN ('paid', 'fulfilled') AND e.id IS NULL;

SELECT 'stale_paid_orders' AS metric, id AS dimension,
       CAST((julianday('now') - julianday(updated_at)) * 86400 AS INTEGER) AS value
FROM orders
WHERE status = 'paid' AND datetime(updated_at) < datetime('now', '-5 minutes');

SELECT 'open_support_cases' AS metric, kind AS dimension, COUNT(*) AS value
FROM support_cases
WHERE status IN ('open', 'in_progress')
GROUP BY kind;

SELECT 'events_last_24h' AS metric, event_name AS dimension, COUNT(*) AS value
FROM events
WHERE created_at >= datetime('now', '-24 hours')
GROUP BY event_name;

SELECT 'report_delivery_rate' AS metric, 'last_7_days' AS dimension,
       ROUND(
         100.0 * COUNT(DISTINCT CASE WHEN e.id IS NOT NULL THEN o.id END)
         / NULLIF(COUNT(DISTINCT CASE WHEN o.status IN ('paid', 'fulfilled', 'refund_pending', 'refunded') THEN o.id END), 0),
         2
       ) AS value
FROM orders o
LEFT JOIN entitlements e ON e.order_id = o.id
WHERE o.created_at >= datetime('now', '-7 days');
