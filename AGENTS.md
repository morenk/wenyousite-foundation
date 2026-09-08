# 温油站 Foundation 协作约定

- 本文件继承工作区根 `AGENTS.md` 的环境边界、变更隔离与普通提交规则；Foundation 长期分支为 `main`。
- `contracts/foundation.v1.json` 是审美与跨端体验的机器事实源；文档和生成产物不得反向定义第二套数值。
- `docs/foundation.md` 描述共享意图，`docs/images.md` 描述跨端图片呈现语义，`docs/platforms/` 只描述必要的平台差异。不得用“统一”削弱 Web 的信息密度或 Flutter 的 48dp 触控、安全区和单列布局。
- 字体只能来自已记录的官方上游，必须同时提交许可证、来源 revision 与 SHA-256；禁止运行时下载字体。
- 修改契约后运行 `pnpm generate`，交付前运行 `pnpm check`。不得手改 `dist/`、`web/tokens.css`、Flutter 生成常量来绕过契约。
- 完成切片后显式暂存并复核 staged diff，以 `feat|fix|refactor|test|docs|chore(scope): 中文说明` 创建原子提交；从最新 `origin/main` 建立并推送 `codex/YYYYMMDD-<目标>`，不得直接更新 `main`。
- Foundation 变化必须通过 PR，由用户明确决定合并；Codex 不得自行合并、创建 Tag、发布 Release 或触发部署。
- 普通提交与正式发布分离：创建或移动 Tag、GitHub Release、提升契约版本必须由用户明确决定，不得因自动推送 `main` 顺带执行。
- Release tag 与根 package、Flutter package、契约版本必须一致且不可改写。客户端只通过独立升级提交锁定已发布 Tag，不跟随 `main`，也不直接消费未发布提交。
- Foundation 变化先通过检查、提交、推送并按明确决定发布 Tag；Web 可在 VPS 更新，Flutter 消费端只在 Windows 环境升级和验证。

## 合并后的任务清理

- 遵循[温油站治理仓库的共用清理规则](https://github.com/morenk/wenyousite-workspace/blob/main/AGENTS.md#合并后的任务清理)：用户授权合并后，完成变更、验收、文件和并发核验，即清理对应任务分支及临时 Worktree，无需重复确认；有待验收、遗漏变更或仍被使用的内容时保留并说明原因。
- 本仓库只在授权的 VPS 工作区执行清理，集成分支为 `main`；主工作目录仅在空闲且干净时切回并 fast-forward 同步 `origin/main`。不得清理主工作目录、永久 Worktree 或其他任务，不自动归档 Codex 任务。
- 此授权不包含其他任务的合并、创建或移动 Tag、发布 Release、晋级或部署，继续遵守本仓库原有门禁。
