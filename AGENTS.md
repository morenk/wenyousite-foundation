# 温油站 Foundation 协作约定

- 本文件继承工作区根 `AGENTS.md` 的环境边界、变更隔离与普通提交规则；Foundation 长期分支为 `main`。
- `contracts/foundation.v1.json` 是审美与跨端体验的机器事实源；文档和生成产物不得反向定义第二套数值。
- `docs/foundation.md` 描述共享意图，`docs/images.md` 描述跨端图片呈现语义，`docs/platforms/` 只描述必要的平台差异。不得用“统一”削弱 Web 的信息密度或 Flutter 的 48dp 触控、安全区和单列布局。
- 字体只能来自已记录的官方上游，必须同时提交许可证、来源 revision 与 SHA-256；禁止运行时下载字体。
- 修改契约后运行 `pnpm generate`，交付前运行 `pnpm check`。不得手改 `dist/`、`web/tokens.css`、Flutter 生成常量来绕过契约。
- 完成切片后显式暂存并复核 staged diff，以 `feat|fix|refactor|test|docs|chore(scope): 中文说明` 创建原子提交；fetch 后默认推送 `origin/main`，用户明确要求不提交或不推送时除外。
- 普通提交与正式发布分离：创建或移动 Tag、GitHub Release、提升契约版本必须由用户明确决定，不得因自动推送 `main` 顺带执行。
- Release tag 与根 package、Flutter package、契约版本必须一致且不可改写。客户端只通过独立升级提交锁定已发布 Tag，不跟随 `main`，也不直接消费未发布提交。
- Foundation 变化先通过检查、提交、推送并按明确决定发布 Tag；Web 可在 VPS 更新，Flutter 消费端只在 Windows 环境升级和验证。
