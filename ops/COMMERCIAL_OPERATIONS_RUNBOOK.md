# TT16 商业版运维手册

## 1. 当前发布状态

商业版当前仅允许本地沙盒内测。`wrangler.commercial.production.example.jsonc` 的生产支付默认值是 `disabled`；真实支付适配器、回调验签和主动查询完成前，不得改为 `wechat` 或 `alipay`，也不得对外宣称可以真实购买。

## 2. 生产前硬性前提

- 明确经营主体、支付商户、商品类目、正式域名和备案路线；
- 确认客服渠道、服务时间、退款规则和数据保留期限；
- 完成真实支付回调验签、重放防护、主动查询和对账；
- 30—50 人全链路内测无 P0 阻断；
- 负责人签署 Go/No-Go 结论。

缺少任一项时只允许 `PAYMENT_MODE=disabled` 或隔离沙盒。

## 3. 首次建立生产环境

1. 创建独立 D1：`npx wrangler d1 create tt16-commercial-production`。
2. 复制生产配置模板到不含占位符的受控配置，填写 D1 ID 和 HTTPS 正式域名。
3. 保持 `PAYMENT_MODE=disabled`，运行所有质量门。
4. 远端迁移：`npx wrangler d1 migrations apply tt16-commercial-production --remote --config <production-config>`。
5. dry-run：`npx wrangler deploy --dry-run --config <production-config>`。
6. 部署后检查 `/api/health`，确认 `status=ok`、`database=ok`、`environment=production`、`paymentMode=disabled`。
7. 从不同网络验证首页、样例报告、创建会话和跨 session 拒绝。

生产配置和密钥不得提交仓库。支付密钥只进入 Cloudflare Secret；不得使用 `VITE_*`。

## 4. 每次发布

```bash
npm ci
npm run build
npm run typecheck:worker
npm test -- --run
npm run test:api:commercial
npm audit --audit-level=high
npx wrangler deploy --dry-run --config <production-config>
```

发布前导出 D1，并记录当前 deployment/version ID：

```bash
npx wrangler deployments list --config <production-config>
npx wrangler d1 export tt16-commercial-production --remote --output backups/tt16-YYYYMMDD-HHMM.sql --config <production-config> --skip-confirmation
```

备份文件含业务数据，不得提交 Git；应加密保存并按保留策略删除。

## 5. 监控与巡检

- 外部每分钟探测 `/api/health`；连续 3 次失败触发告警；
- Cloudflare Worker 5xx 比例、p95、CPU 和 D1 错误率；
- `paid` 超过 5 分钟仍未 `fulfilled` 的订单立即告警；
- 任何 `paid/fulfilled` 但没有 active entitlement 的记录立即告警；
- 报告打开失败、回调验签失败和退款失败单独计数；
- 每日检查 open/in_progress 工单和数据库容量；
- 每周运行 `ops/commercial-metrics.sql` 并归档快照。

只读巡检示例：

```bash
npx wrangler d1 execute tt16-commercial-production --remote --file ops/commercial-metrics.sql --config <production-config>
npx wrangler tail tt16-commercial-production --config <production-config>
```

## 6. 故障处置

### 支付成功但未交付

1. 立即停止新的支付入口或将支付模式切回 `disabled`；
2. 核对支付商户权威账单、订单、payment_attempt 和 entitlement；
3. 不根据前端 `payment_success` 事件手工发权益；
4. 验证真实支付后再补发唯一 entitlement 和新 report token；
5. 记录工单、原因、修复和对账结果。

### 结果或报告疑似泄露

1. 关闭支付和分享入口；
2. 撤销受影响 report token；
3. 保留最小审计证据，不复制逐题答案到聊天或工单；
4. 评估影响范围并按适用要求通知；
5. 完成回归与安全复核后再恢复。

### 回滚

```bash
npx wrangler deployments list --config <production-config>
npx wrangler rollback <known-good-version-id> --config <production-config> --message "rollback: <incident-id>" --yes
```

代码回滚不会自动回滚 D1 schema。破坏性迁移必须先设计向后兼容和单独恢复步骤；需要恢复数据时优先使用 D1 Time Travel 或经审查的导出文件。

## 7. 工单最小 SOP

- 交付失败：核验订单与支付权威状态，恢复或补发报告；
- 重复支付：核对商户交易号，只对确认重复的交易退款；
- 退款咨询：按公开数字内容规则处理并记录决定；
- 数据权利：核验合法凭证，完成查询、更正、删除或说明保留例外；
- 所有处理都保存 case ID、操作者、时间和结果，不在工单中保存恢复凭证明文。
