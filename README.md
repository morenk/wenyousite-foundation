# 温油站设计基础

本仓库是温油站 Web 与 Flutter 的唯一审美和跨端体验事实源。它发布共享品牌语言、分平台 profile、语义 Token、字体资产与编辑器体验契约；客户端仓库只实现并锁定一个明确版本，不再复制规范正文。

- [共享设计基础](docs/foundation.md)
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

## 使用

```bash
pnpm install --frozen-lockfile
pnpm check
```

Web 通过 Git tag 安装根 npm package；Flutter 通过同一 tag 安装 `packages/flutter`。发布遵循 SemVer：语义删除或改变为 Major，兼容新增为 Minor，文字修正为 Patch。

Codex 可将 `skills/wenyou-design` 以符号链接或技能安装器接入本地。Skill 只定义审美工作流，每次使用时读取本仓库契约和对应平台 profile，不复制 Token 数值。
