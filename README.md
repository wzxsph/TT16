# TT16 · TradeType 16

TT16 是一个移动端优先的交易行为人格产品：用户免费完成 20 道真实情境题，服务端进行版本化评分，随后以一次性 ¥4.9 解锁完整人格报告。当前公开版本使用沙盒模拟支付，不会产生真实扣款。

公开商业沙盒：[tt16-commercial-sandbox.samsong-1a3.workers.dev](https://tt16-commercial-sandbox.samsong-1a3.workers.dev)

旧版 32 题静态 Demo 仍可作为视觉与内容参考：[tt16-demo.samsong-1a3.workers.dev](https://tt16-demo.samsong-1a3.workers.dev)。它不是商业生产环境；GitHub 仓库为 Private，GitHub Pages 已关闭，仓库内也不再包含 Pages 部署工作流。

## 当前能力

- 20 道版本化商业题库、四维评分、质量门和 16 型报告快照；
- 匿名服务端 session、逐题同步、刷新恢复和跨 session 授权；
- 中性付费墙，付费前响应不下发人格代码、名称、维度或正文；
- 服务端商品定价、幂等订单、沙盒确认、唯一权益和高熵报告 token；
- 订单号 + 恢复凭证找回报告，恢复失败采用防枚举响应；
- 匿名反馈、白名单漏斗事件、环境隔离、售后和数据权利工单；
- CSP、HSTS、来源校验、输入限制、速率限制和数据库健康检查；
- 自动评分测试与独立 Worker 商业 API 验收。

## 规划文档

- `prd/TT16_TradeType16_Business_Plan_v1.0.md`：原始商业计划；
- `prd/TT16_Current_State_Gap_Assessment_v1.0.md`：证据化缺口评估；
- `prd/TT16_TradeType16_Business_Plan_v1.1.md`：商业规划执行版；
- `prd/TT16_TradeType16_PRD_v1.1.md`：商业产品需求与 P0 验收规格。
- `ops/COMMERCIAL_RELEASE_AUDIT_2026-07-12.md`：逐项 P0 完成证据、缺口和阶段门结论。

## 本地运行商业版

```bash
npm ci
npm run db:migrate:local
npm run dev:commercial
```

默认地址为 `http://127.0.0.1:8787`。`wrangler.commercial.jsonc` 使用本地 D1、`APP_ENV=local` 和 `PAYMENT_MODE=mock`。

## Cloudflare 商业沙盒

公开沙盒使用独立 Worker、独立远端 D1 和 `PAYMENT_MODE=mock`，不会覆盖旧版静态 Demo，也不会调用真实支付渠道：

```bash
npm run db:migrate:sandbox
npm run deploy:sandbox
```

配置位于 `wrangler.sandbox.jsonc`。部署后 `/api/health` 应返回 `environment=sandbox`、`paymentMode=mock`、`commerce=true`。任何生产环境都不得使用 Mock；`paymentPolicy.ts` 会将 `production + mock` 判为无效配置。

## 质量门

```bash
npm run build
npm run typecheck:worker
npm test -- --run
npm run test:api:commercial
npm run test:api:sandbox
npm audit --audit-level=high
```

`test:api:commercial` 会启动隔离端口的本地 Worker；`test:api:sandbox` 对已部署的公开沙盒执行同一套验收。两者都会验证 20 题、授权、防泄露、幂等完成、重复下单、并发确认、报告交付、手动恢复、工单、退款和 Token 撤销。GitHub CI 只运行本地验证，不执行部署。

## 关键结构

- `src/data/commercialQuestions.ts`：20 道商业题库及版本；
- `src/lib/commercialScoring.ts`：可复现的商业评分与质量门；
- `worker/index.ts`：Cloudflare Worker 商业 API；
- `migrations/`：D1 会话、答案、订单、权益、报告、事件和工单迁移；
- `src/lib/api.ts`、`src/lib/analytics.ts`：前端 API 与事件客户端；
- `src/components/PaywallPage.tsx`：无结果泄露的付费墙；
- `src/components/RecoveryDialog.tsx`：报告恢复；
- `src/components/SupportDialog.tsx`：售后与数据权利工单；
- `scripts/verify-commercial-api.mjs`：商业 API 自动验收；
- `public/images/personalities-v2/`：当前 16 型人格 WebP 资产；
- `design/personality-masters-v2/`：对应 PNG 母版和数据资产备份。

## 发布边界

当前版本可以用于公开沙盒演示和受控内测，但尚不可真实收费。生产发布仍需真实经营主体、合规支付商户与回调验签、正式域名/备案路线、客服渠道与服务时间、生产 D1、监控告警、备份恢复，以及 30—50 人全链路内测结论。不得把恢复凭证、支付密钥或其他秘密写入 `VITE_*`、仓库或日志。
