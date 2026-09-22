# Foundation 兼容登记

本文件记录 Foundation 契约的兼容影响；跨仓库旧协议清理继续遵循[治理仓库弃用登记](https://github.com/morenk/wenyousite-workspace/blob/main/docs/deprecation-register.md)。

## 全屏图片图集业务接入

- [图片呈现契约](images.md#全屏图集的业务接入) 补充五类图集分组、出现位置身份、双向加载会话、来源定位、当前图片操作与移动端缩放手势；[Flutter profile](platforms/mobile.md) 引用同一规则。
- 本次仅文档变化，无 Foundation Token、机器契约、公开导出或版本变化；不创建 Tag / Release，不要求消费者依赖未发布提交。既有完整来源、失败保留上下文和动画生命周期继续有效。
- Backend 新增兼容图集查询与正文图片出现索引，接口和迁移以其 [已提交契约](https://github.com/morenk/wenyousite-backend/blob/92b030a81f8957386e324fed477bd1e46faf65ea/docs/image-gallery.md) 为准；正式 Markdown、上传 API 和 `COMPLETED` 不变，旧入口继续可用。
- Web 本轮只同步新增 API 的固定 OpenAPI 与生成类型，现有界面保持原行为；Mobile 在兼容后端迁移、历史回填和校验完成后接入。此文档不代表消费者实现、真机或隔离 E2E 验收已完成。
- 不删除旧查看入口或媒体引用协议；移动端回滚可恢复原消费者提交，新增索引和兼容查询不要求删除。线上回填、合并、部署与后续兼容清理仍遵守治理门禁。

## 后台登录会话与记住设备文档

- [Web 后台登录与会话](platforms/web.md#后台登录与会话) 补充默认未勾选的七天登录选项、统一失效处理、临时故障重试、安全返回和跨标签页核验；仅更新体验文档，不新增 Foundation Token、公开导出、机器契约或包版本，无需消费者依赖升级。
- 接口和安全策略以 [Backend 5.25.0-dev.20260922.2 的账号与安全边界](https://github.com/morenk/wenyousite-backend/blob/1776156ef8234bbc6c6cf362558773cf555e4d8f/docs/modules/admin.md#账号与安全边界) 为准。登录验证省略或不启用记住设备时保持原短会话规则；既有数据库会话迁移为未启用，不延长原期限。固定七天模式不滚动续期，也不改变单会话、角色和账号状态校验、CSRF 或独立的高风险确认边界。
- 先交付兼容后端，再接入 Web；此契约引用不代表完整检查、界面验收、合并或部署已完成。本次不修改普通社区或 Mobile 登录体验，不创建 Tag 或 Release，不删除既有兼容协议。

## 综合管理后台文档

- [Web profile](platforms/web.md#管理后台) 补充后台专属的信息结构、密度、文案和交互验收边界；无 Foundation Token、公开导出、机器契约或版本变化，无需消费者依赖升级。
- 后台继续使用既有 `/station` 入口和页面地址；原举报与申诉流程、独立管理会话及服务端安全规则保留。本次文档不授权删除旧接口或兼容协议。
- 新增管理接口、统计字段、分类标签整理与审计迁移由 Backend 的 OpenAPI、Markdown 契约和弃用登记定义；已提交接口边界见 [Backend 综合内容管理（bc3fd94）](https://github.com/morenk/wenyousite-backend/blob/bc3fd941dab13a985088d024a04d72f8bf484dd6/docs/modules/admin.md#综合内容管理)。该引用用于契约对齐，不代表完整检查或验收已完成；Web 依已提交的兼容契约接入，Foundation 不定义第二套业务协议。
- 交付顺序为兼容后端再到 Web；合并、部署及未来旧协议清理遵守治理门禁。本次不创建 Tag 或 Release，也不改变 Mobile 或社区前台体验。

## 普通内容日期展示（v7.1.0）

- `formatWenyouTime` 保留签名，但普通内容的绝对回退移除时分；新增 `formatWenyouDate` 用于完整日期悬停和读屏。`formatWenyouExactTime` 及安全、审计、温油账务、预约和到期的精确呈现保留，已有秒精度不能降低。
- 消费者升级时必须将普通内容的悬停和 Semantics 从精确时间迁移到完整日期，逐项核对精确记录正文；Foundation 共享用例不替代消费者界面验收。本任务不改 Mobile 或 Web 仓库。
- 无 HTTP API、OpenAPI、数据库或持久化变化；不删除或截断原始时间戳，无数据迁移。不清理旧兼容协议，本条不构成全体消费者迁移证据。
- 根包、Flutter 包、契约和 Manifest 同步至 7.1.0，`schemaVersion` 保持 3；客户端通过独立升级提交锁定正式 `v7.1.0` Tag，不消费 main 或未发布提交。回滚时恢复先前正式 Tag 与配套调用。

## 系统字体（v7.0.0）

- 破坏性变化：Schema 3 要求 `fonts: []`；三个家族角色固定声明系统字体及通用无衬线 fallback。旧具体家族、资源清单、字体 CSS 导出、字体依赖与许可内容不进入 v7。品牌 `displayGlyphFont`/`fontLicense` 字段由 `displayTypographyRole: "display"` 替代。
- Flutter 删除 `WenyouFoundationTypography.body/display/utility/chineseFallback`；`mobileFamilies` 保留语义映射，`mobileSizes/mobileLineHeights/mobileWeights` 保留尺度。TypeScript 保留 `TypographyFamilyRole`、`TYPOGRAPHY_FAMILIES`、`TYPOGRAPHY_USAGE`、`WEB_TYPE_SCALE` 与 `MOBILE_TYPE_SCALE`。
- 旧 v6.x Tag 不可改写，继续保留原资产、许可证和 API，供未迁移消费者与回滚使用。此版本准备不是全体消费者已迁移的证据，也不授权清理其他仓库兼容实现。
- 合并与正式 Tag 发布必须由负责人明确决定。Web 在 VPS、Mobile 在 Windows 各自通过独立提交锁定正式 v7 Tag，迁移字体导入、注册、预加载和家族引用，再完成平台构建与代表性页面验收；不得锁定 main 或未发布提交。
- 验收：`pnpm generate`、`pnpm check` 覆盖 Schema、反向用例、语义角色与尺度同源、Manifest 及生成物；`pnpm check:package` 实际打包并检查完整归档，不接受字体文件、旧字体名称、字体依赖或失效导出。Flutter 真机与 Web 浏览器验收由消费任务完成。
- 风险与回滚：系统字体会改变中文字形、数字宽度和换行；需检查品牌、列表、正文、编辑器、缩放与溢出。回滚必须同时恢复原 v6.x Tag、依赖锁及配套消费实现，不能只降包版本。无 HTTP API、持久化或数据迁移变化；数学字体、系统等宽字体、平台图标字体不在本次范围。

## 右侧纵向阅读快翻（v6.11.0）

- 新增 `experiences.readingQuickScroll.mobile` 和生成的 Flutter/Web 读取常量；对已发布 Tag 无修改，不删除既有导出或图标资产。
- 新版移动快翻以右侧轨道与滑块提供开启反馈，替代 v6.10.0 的底部位置状态与收起反馈。该例外只限本阅读工具，不改变普通 Toggle 规则。
- 消费者必须等待正式 Tag，在独立依赖升级提交后迁移布局；Foundation 检查不代替移动端 Widget、真机交互和性能验收。旧消费者继续使用原 Tag；回滚时恢复旧 Tag 与配套底部工具栏实现。
- 不新增后端契约、持久化或数据迁移；本次不清理其他兼容协议。

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
