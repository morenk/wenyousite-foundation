# Foundation 兼容登记

本文件记录 Foundation 契约的兼容影响；跨仓库旧协议清理继续遵循[治理仓库弃用登记](https://github.com/morenk/wenyousite-workspace/blob/main/docs/deprecation-register.md)。

## 阅读快翻图标（v6.10.0）

- 兼容新增 `action.reading-quick-scroll`，既有图标语义、图形、公开常量与通用 Toggle 可见反馈规则保持不变；无弃用或删除项。
- Web 与 Flutter 产物同源生成；旧客户端继续锁定原正式 Tag，新入口仅在正式发布后通过独立消费者升级提交接入。该能力自 `v6.10.0` 提供，不属于 `v6.9.0`。
- 本次没有 HTTP API、OpenAPI、持久化或数据迁移变化。移动端按钮位置、tooltip、无障碍与工具栏显隐由消费者任务验证，本任务只交付 Foundation 契约和资产。
- 回归覆盖：`pnpm check` 检查新语义的公开 Web 导出、跨端同源 SVG、无实心变体、生成产物与清单完整性；消费者运行时回归随正式 Tag 升级完成。
- 回滚方式：消费者保持或恢复先前正式 Tag；保留既有图标映射，不删除历史兼容协议。

## 动态帖动态图播放候选规则

- 规则位置：`contracts/foundation.v1.json` 的 `experiences.images.momentPlayback`，说明见 [图片呈现契约](images.md#动态帖动态图播放)。
- 此变更只限定动态列表与详情的呈现、资源选择和生命周期，不增加或删除 API 字段、数据库字段、媒体资产或旧协议。
- Foundation 版本保持不变；候选规则须经 PR 评审，正式发布版本、Tag 和 Release 另由用户明确决定。客户端不得把此候选提交当作已发布 6.9.0 消费。
- 不清理主题帖播放兼容、不回填历史媒体、不删除既有派生图。未来如需协议清理，另开独立 PR，并先取得无消费者、数据已迁移、回归覆盖和回滚路径四项证据。


上述已合入 main 的动态播放规则随 `v6.10.0` 发布；原候选阶段记录保留用于追溯。
