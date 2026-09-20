# 温油站设计基础

本仓库是温油站 Web 与 Flutter 的唯一审美和跨端体验事实源。它发布共享品牌语言、分平台 profile、语义 Token、系统排版与编辑器体验契约；客户端仓库只实现并锁定一个明确版本，不再复制规范正文。

- [共享设计基础](docs/foundation.md)
- [品牌标识与应用图标](docs/brand.md)
- [Web profile](docs/platforms/web.md)
- [Flutter profile](docs/platforms/mobile.md)
- [图片呈现契约](docs/images.md)
- [图标目录与治理](docs/icons.md)
- [核心元素系统](docs/elements.md)
- [通知分组契约](docs/notifications.md)
- [反馈、无障碍与浮层契约](docs/interaction.md)
- [控件、内容与格式化呈现](docs/presentation.md)
- [导航与界面语言契约](docs/navigation-language.md)
- [机器契约](contracts/foundation.v1.json)
- [Codex 审美指导 Skill](skills/wenyou-design/SKILL.md)

HTTP API、错误码、Markdown 存储协议和推送协议仍由 `wenyousite-backend` 负责。本仓库不包含密钥、账号、业务数据或私密截图。

## v7.1.0 时间展示

根包、Flutter 包与契约版本为 `7.1.0`，`schemaVersion` 保持 `3`。普通内容不足 72 小时显示相对时间，之后与未来时间显示同年 `MM-dd`、跨年 `yyyy-MM-dd`；新增 `formatWenyouDate` 提供完整日期用于悬停和读屏。安全、审计、温油账务、预约和到期时刻保留精确时间，已有秒精度不降低。

消费者锁定正式 `v7.1.0` Tag，并同步普通内容悬停与读屏调用、精确记录正文。JavaScript 回归已纳入 `pnpm check`；Dart 使用同一组用例，运行方式与 SDK 要求见 [格式化回归](tests/README.md)。

## v7 系统字体迁移

系统字体迁移从 `v7.0.0` 起生效，`schemaVersion` 为 `3`。`body`、`display`、`utility` 均声明 `system-ui`，fallback 为 `sans-serif`；角色、字重、字号、行高与使用场景继续由契约定义。Foundation 不分发字体文件、字体依赖或字体 CSS 入口。品牌文字消费 `displayTypographyRole`，具体字形由系统决定。

TypeScript 保留 `TypographyFamilyRole`、`TYPOGRAPHY_FAMILIES`、`TYPOGRAPHY_USAGE` 和两端类型尺度。Flutter 保留 `WenyouFoundationTypography.mobileFamilies/mobileSizes/mobileLineHeights/mobileWeights`，其中 `mobileFamilies` 返回语义角色，不能传给 `TextStyle.fontFamily`；已删除旧家族名和中文 fallback 常量。平台接入与验收见对应 profile 和[兼容登记](docs/deprecation-register.md)。

系统字体属于 v7 的破坏性升级。合并、Tag 与正式发布须由负责人明确决定；消费者通过独立提交锁定已发布 Tag 升级。旧 `v6.x` Tag 不可变，继续作为未迁移消费者与回滚来源。

## 使用

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm check:package
```

Web 通过 Git tag 安装根 npm package；Flutter 通过同一 tag 安装 `packages/flutter`。主题消费者使用生成的 Web Token、`@wenyousite/foundation/theme` 或 Flutter 主题合同，不复制调色板。发布遵循 SemVer：语义删除或改变为 Major，兼容新增为 Minor，文字修正为 Patch。

Codex 可将 `skills/wenyou-design` 以符号链接或技能安装器接入本地。Skill 只定义审美工作流，每次使用时读取本仓库契约和对应平台 profile，不复制 Token 数值。
