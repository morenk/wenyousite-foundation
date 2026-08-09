# 温油站 Foundation 协作约定

- `contracts/foundation.v1.json` 是审美与跨端体验的机器事实源；文档和生成产物不得反向定义第二套数值。
- `docs/foundation.md` 描述共享意图，`docs/images.md` 描述跨端图片呈现语义，`docs/platforms/` 只描述必要的平台差异。不得用“统一”削弱 Web 的信息密度或 Flutter 的 48dp 触控、安全区和单列布局。
- 字体只能来自已记录的官方上游，必须同时提交许可证、来源 revision 与 SHA-256；禁止运行时下载字体。
- 修改契约后运行 `pnpm generate`，交付前运行 `pnpm check`。不得手改 `dist/`、`web/tokens.css`、Flutter 生成常量来绕过契约。
- Release tag 与根 package、Flutter package、契约版本必须一致。客户端只升级 tag，不跟随主分支。
