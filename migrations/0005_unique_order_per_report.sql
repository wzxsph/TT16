CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_result_sku_unique
ON orders(result_id, sku);
