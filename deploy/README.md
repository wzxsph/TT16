# 香港静态主站与匿名统计部署

此目录只提供可审查的部署模板，不包含真实域名、IP、AppID、密钥或后台凭证。正式上线等待维护者提供腾讯云中国香港轻量服务器、域名和 GitHub Environment secrets。

## 目标边界

- 入门目标：2 vCPU、2 GB 内存、至少 20 Mbps、每月流量至少 0.5 TB；上线前分别实测移动、联通、电信跨境线路。
- TT16 应用本身只发布 `dist/web` 静态文件，不运行账户、业务 API 或应用数据库。
- Caddy 提供自动 HTTPS、`www` 到 apex 的永久跳转、安全响应头、压缩和静态文件。
- 发布用户只能写 `/srv/tt16/incoming` 与调用预装的 `tt16-release`；不要授予交互式 root 或通配 sudo。
- GoatCounter 是可选、独立的统计服务；TT16 广告与统计默认都关闭。

## 服务器目录

```text
/srv/tt16/incoming/          Actions 上传的临时压缩包
/srv/tt16/releases/<sha>/    不可变版本目录
/srv/tt16/current            Caddy 读取的原子符号链接
/usr/local/bin/tt16-release  由管理员安装的原子发布脚本
/var/lib/goatcounter/        可选的 GoatCounter 数据目录
```

管理员应把 `atomic-release.sh` 安装为 `/usr/local/bin/tt16-release`，归 root 所有且不可由部署用户修改。首次发布前创建上述目录、受限用户和 Caddy 配置，并单独验证回滚：把 `current` 原子切换到上一版本目录即可。

## GitHub Environment secrets

在受保护的 `production-hk` Environment 中配置：

- `TT16_SITE_URL`：形如 `https://example.com/` 的 apex canonical；
- `TT16_SSH_HOST`、`TT16_SSH_PORT`、`TT16_SSH_USER`；
- `TT16_SSH_PRIVATE_KEY`：只属于受限部署用户；
- `TT16_SSH_KNOWN_HOSTS`：预先核对的完整 host-key 行；
- `TT16_ANALYTICS_ENDPOINT`：未启用时留空；启用同源代理后为 `https://example.com/gc/count`。

主站工作流把 `TT16_ADS_ENABLED` 固定为 `false`，因此发布产物始终关闭广告。域名可在正式公开前以 Environment secret 管理，但构建后会进入公开 canonical；服务器 IP 和 SSH 数据始终不得写入仓库或 Actions 日志。

## GoatCounter 最小统计

官方自托管版本可直接 `goatcounter serve`，默认监听 8080 并使用 SQLite；模板改为只监听 `127.0.0.1:8081`，由 Caddy 同源代理 `/gc/count`。安装前核验官方发布签名/校验和，并根据[官方自托管说明](https://github.com/arp242/goatcounter#self-hosting-goatcounter)创建站点和升级迁移。

启用前完成以下人工配置与验证：

1. GoatCounter 站点 vhost 使用主站 apex；管理界面不暴露在 `/gc/count` 代理路径。
2. 关闭单次访问/个人页面明细，以及位置、浏览器、操作系统和屏幕维度收集；只保留页面、来源和 TT16 六个固定事件的聚合。
3. 在 Web 构建中设置同源 `TT16_ANALYTICS_ENDPOINT`，并保持应用自己的首次访问选择和 DNT 检查。
4. 使用浏览器网络面板确认：拒绝或 DNT 时没有 `/gc/count`；同意时请求只含 `p`、`t` 和可选来源域名 `r`。
5. 导出一份测试数据，确认没有答案、人格代码、维度百分比、自由文本、IP、Cookie、跟踪 ID或持久访客标识，再清除测试数据。

GoatCounter 的默认隐私模型与字段说明见[官方隐私说明](https://www.goatcounter.com/help/privacy)。TT16 的边界更窄，因此不能直接沿用所有默认统计维度。

## 上线顺序

1. 先部署并验证 GitHub Pages 镜像；
2. 配置域名、Caddy 和香港主站，检查 canonical、HTTPS、安全头、58 个路由与三网体验；
3. 单独启用匿名统计并完成拒绝/DNT/字段验证；
4. 部署旧商业沙盒退休入口；
5. 验证旧普通页面 308 到免费主站，所有旧 `/api/*` 均为 410；
6. 广告继续关闭，未来另开隐私与平台资格评审。
