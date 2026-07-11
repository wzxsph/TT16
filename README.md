# TT16 · TradeType 16 Demo

一个移动端优先的交易人格测试 Demo。当前版本实现了从落地页、32 道情境题、前端评分、16 型结果报告到分享卡的完整演示闭环。

线上 Demo：[tt16-demo.samsong-1a3.workers.dev](https://tt16-demo.samsong-1a3.workers.dev)

## 本地运行

```bash
npm install
npm run dev
```

生产构建与测试：

```bash
npm test
npm run build
npm run preview
```

## Cloudflare 部署

默认通过 Cloudflare Workers Static Assets 部署，`wrangler.jsonc` 已配置 SPA 回退：

```bash
npx wrangler login
npm run deploy
```

如需使用临时的 Pages Direct Upload 项目：

```bash
npm run deploy:pages
```

构建产物位于 `dist/`。静态 Demo 不需要环境变量，也不要在 `VITE_*` 变量中放置秘密。

## 工程结构

- `src/data/questions.ts`：32 道版本化题库
- `src/data/profiles.ts`：16 型人格内容配置
- `src/lib/scoring.ts`：纯函数评分、徽章与质量判断
- `src/components/Illustrations.tsx`：原创内联 SVG 插画系统
- `design/personality-masters/`：v1 的 16 型人格插画 PNG 母版（保留备份）
- `public/images/personalities/`：v1 页面 WebP 资产（保留备份）
- `design/personality-masters-v2/`：以「复利园丁」为视觉锚点的 v2 PNG 母版
- `public/images/personalities-v2/`：当前结果页和分享卡使用的 v2 WebP 资产
- `design/personality-contact-sheet-v2.jpg`：v2 的 16 型人格视觉总览
- `src/components/LandingPage.tsx`：品牌落地页
- `src/components/QuizPage.tsx`：单题答题与键盘交互
- `src/components/ResultPage.tsx`：完整结果报告与分享卡

## Demo 边界

当前评分和存储都在浏览器中完成，逐题答案只保存在本机 `localStorage`。正式 MVP 仍需增加可信边缘评分、匿名 session API、埋点、题库发布、不可枚举分享 token 与服务端反馈存储。
