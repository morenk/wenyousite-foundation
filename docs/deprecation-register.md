# Foundation 兼容登记

## RP 帖内身份业务接入

- [共享规范](thread-identities.md)固定每人每主题最多 10 个未归档 RP 身份、每次新发表选择站内／RP 身份、楼主／协作者／玩家资格、当前与历史展示、账号关联的提及和筛选、关闭屏蔽、草稿确认及缓存隔离；[固定场景](../tests/thread-identity-semantics-fixtures.json)供三端实现关联。
- 兼容新增，不删除普通站内资料、旧提及、订阅、筛选或治理协议。HTTP、Markdown、迁移、确认凭据与错误语义由 [Backend 5.34.0-dev.20261005.1（05b27a0）](https://github.com/morenk/wenyousite-backend/blob/05b27a051f76cb4b88379ae0211687d241282bbe/docs/thread-identity.md)唯一负责；Markdown v5 不变，未使用 RP 的普通账号路径保持兼容，不消费未提交生产者源码。
- 旧客户端缺少身份确认能力时，不得静默以 RP 身份发布。新增逐次身份选择保留旧客户端省略模式的兼容边界；明确选择站内身份不受 RP 开关变化影响，选择 RP 不可用或确认失效时保留草稿并提示。明确选择 RP 不可用或 token 无效时返回 409／40011；省略 mode 的旧客户端仍遵守既有确认规则。实际旧版界面表现与测试证据由消费端交付；权限、通知和治理始终关联账号。
- Foundation 不新增 Token、机器契约、公开导出或生成物，不提升包版本或创建 Tag／Release，不要求消费者锁定未发布 Foundation 提交。文档和静态场景不代表界面、视觉或隔离 E2E 已验收。
- 新集合接口使用稳定 identityId 和所选角色 token，旧 single 接口与账号级 @ 保留并锚定明确兼容主身份；主身份归档不自动接管，旧 CLEAR 不清其他角色。清空资料仍占名额，删除归档释放名额但不复用 ID；旧消费者无法管理多角色不代表旧协议被删除。后端多角色迁移不能直接回滚至旧单角色唯一键实现，按固定 Backend 回滚方案前滚修复，不删角色恢复约束。
- 清除资料和关闭功能不删除历史快照，关闭只屏蔽 RP 展示；客户端回滚不得删除新增资料或媒体引用。兼容后端先行，再接入消费者；旧协议清理另开 PR 并满足治理四项证据，本次不授权合并或部署。


## 长讨论编号定位候选

- [长讨论编号定位](discussion-navigation.md) 统一固定编号和精简面板；原 Web 楼中楼当前列表序号改为服务端稳定回复编号，不删除主楼 `floorNumber` 或既有帖子 ID 深链。
- Backend 采用兼容新增字段、历史编号回填与直接窗口接口；旧单向分页接口继续可用。Web／Mobile 在已提交契约稳定后接入，不能把候选视为已经部署或真人验收。
- 本次只补业务体验文档，不修改 Foundation 机器契约、生成物、公开导出或包版本，不创建 Tag／Release，消费者继续固定已发布版本。
- 回退消费者可恢复旧列表，保留 Backend 新增编号及历史迁移；编号分配后不回收重用。兼容清理需另行满足治理四项证据，不能伴随这次性能改造删除旧协议。


本文件记录 Foundation 契约的兼容影响；跨仓库旧协议清理继续遵循[治理仓库弃用登记](https://github.com/morenk/wenyousite-workspace/blob/main/docs/deprecation-register.md)。

## 公开 APP 下载与私有 APK 分发

- [共享下载规范](app-downloads.md)与[固定验收用例](../tests/app-download-semantics-fixtures.json)规定匿名外观菜单直接下载：一次点击查询版本／状态、HEAD 校验后自动交给本站文件原生下载，状态就近呈现，失败显式重试。保留限流恢复、只读缓存及旧 APP 校验；HTTP 字段与精确来源由共享规范所引用的 Backend OpenAPI 拥有，不新增平行 DTO。
- 尚未发布的独立 Web `/download` 页面与二维码候选已取消；原 `qr-page-only` 用例退出当前验收清单，新增 `web-head-preflight` 覆盖点击后的预检与拒绝继续传输，其他用例同步直接入口行为。这不删除既有下载 HTTP 或旧 APP 协议，也不要求扩展运行时版本或发布 Foundation Tag。
- 移动设备首次访问 Web 可关闭提示新增设备判断、会话去重及 iOS 可继续网页用例；提示本身不请求 APK，Android 点击复用直接下载流程。桌面窄窗口不触发，处理／关闭后同一浏览会话不重复；这不新增 Flutter 提示记录或 iOS 安装包。
- `/meta` 字段结构、推荐／强制策略、原制品身份、历史记录和旧 APP 的 HEAD／GET 校验继续保留；存储位置与对外下载地址分离。固定 URL 不绕过撤回、暂停或缓存故障，公众请求不触发回源，也不回退公开桶。
- [每日下载次数](app-downloads.md#每日下载次数)固定 Backend `10b7819ad4a15777490dad5ab9abb7ae961422fc`（`5.32.0-dev.20261003.1`，238 操作），新增北京时间每浏览器标识 3 次、共享 IP 10 次的保护。跨版本累计，获准文件 GET／Range 尝试与字节预算一起持久事务预留，预占后中断／失败不退，HEAD／信息／预占前拒绝不消费次数。`X-Download-Limit-Reason` 与 `Retry-After` 区分次数及其他限流，info 全局状态不受个体次数影响；不复制 DTO 或扩展 Foundation 运行时。
- 第一方 Cookie 由服务端签发，同源浏览器自动携带；生产与隔离预览名称及属性遵循固定契约，不等于物理设备身份。清除／禁用 Cookie 仍由 IP 限额兜底，无 Cookie 旧 APP 不需先访问 Web、调用 info 或增加 Cookie／新响应头支持；路径、operationId、DTO、旧 metadata、`/meta` 与更新策略保留。取消这些兼容仍需独立证据评审。
- 出站账本 v1→v2 显式离线升级保留原字节累计和时钟，次数与签名状态持久化；重复升级、重启或合法密钥轮换不清零。旧 v1 程序拒绝 v2，不能通过删库、恢复旧账本或降版绕过额度；部署及回滚由 Backend／治理门禁决定，本次不执行迁移或清理历史。
- 新建独立只读凭据不再是部署前置条件，显式预热／修复允许复用已有存储凭据，不改原权限而影响上传或图片；公开网关不得持有、读取或继承 S3 凭据。预热配置隔离、限制文件权限并脱敏日志，代码固定 APK 目录且只调用所需读取操作；这是应用限制，不代表云端只读／仅 APK 授权，泄漏仍可能影响原凭据全部授权资源。开发仅用隔离样本，不读取真实密钥、复制生产配置或提前配置服务器。
- 本次只修改共享文档和验收用例，无设计 Token、机器契约、公开导出、生成物或包版本变化，不创建 Tag／Release。Web、Mobile 继续锁定各自现有正式 Foundation 依赖；不要求安装本任务未发布提交。
- 按兼容网关与发布工具、预热、切换 `/meta`／Web、旧 APP 验证、独立评审关闭 APK 公共读推进。仅涉及 APK 目录，不调整图片桶或共享实例开关；源码与隔离测试完成不代表真实云权限、界面、真机、合并或部署已验收。
- 迁移期间保留原制品与兼容协议；客户端可回滚消费者实现，网关故障按治理方案恢复已验证服务，不自动公开桶、清空预算或删除发布记录。兼容清理须另行满足治理证据门禁，本条不授权关闭公共读或删除旧协议。

## 私密主题邀请重复分享

- [私密主题邀请重复分享](interaction.md#私密主题邀请重复分享) 的当前 Web／Mobile 界面只提供“复制邀请链接”，取得并复用当前邀请。移除重复标题、说明、重置操作及 Mobile 邀请 Sheet；仅剪贴板失败时就地展示完整链接供手动复制。
- [Backend 5.29.0-dev.20261001.1 的私帖邀请契约](https://github.com/morenk/wenyousite-backend/blob/4db0cdf2c079fc8b66545c67849053cd74945f8a/docs/api-contract.md#私帖邀请链接重复分享) 的 PUT 继续原子取得或创建，POST、operationId、DTO 和旧客户端重置行为完整保留。移除界面入口不代表无消费者、协议弃用或授权删除；没有数据库迁移、token 轮换、历史链接恢复或成员清理。
- 原方案的“复制＋确认重置”界面在同一未合并反馈批次内改为单一复制；旧兼容端若主动重置，旧链接对所有访问者失效，已加入成员权限保留。当前消费端获取失败不回退 POST，也不显示重置确认。
- Foundation 仅同步共享体验与 Mobile 设置承载说明，无 Token、机器契约、公开导出、包版本或生成物变化，无需升级依赖、不创建 Tag 或 Release。标签和设置的局部排版不改写全局组件契约。
- 交付顺序仍为兼容后端，再接入 Web／Mobile。消费者回滚可恢复原界面与保留接口；已发生的重置不会随客户端回滚撤销。旧链接和历史成员不自动回填或恢复，合并、部署与负责人验收分别遵循治理门禁。

## 更新前与升级后一次性提醒

- [共享更新说明规范](mobile-releases.md)与 [Mobile profile](platforms/mobile.md#更新前与升级后提醒)改为更新前直接显示目标版本完整说明、升级后在合适启动显示实际安装版本说明。App 移除独立“查看更新”按钮、说明／历史页面及设置／游客历史入口；下节原方案记录保留，原“主动历史、升级后不弹窗”的约定由本节替代。
- 推荐按平台与目标构建号一次且可关闭，既有忽略记录继续有效；升级后依据可信安装基线识别升级，无记录的首次迁移也可用有效 Android 安装／更新时间确认覆盖安装并提示当前安装版，不声称知道旧构建。同构建重装可能触发这一次迁移提示；建立记录后按平台与构建号去重，冷启动、重建、登录切换、重装和 revision 修订不重复，跨多版只提示本次安装版。首次安装时间相同或证据不可用时不弹，失败不误记已展示。
- 强制更新先行并持续阻断，应用可用后优先升级后提醒，推荐择后且不叠窗；任何一次性记录或说明失败均不能解除强制策略。旧页面安全回退与旧忽略迁移纳入 Mobile 回归，不以删除本机提示记录来实现界面回滚。
- 此次是 App 交互替换，不是 Backend 协议弃用。保留已部署公开历史／详情 HTTP、历史数据、`/meta` 字段、后台草稿／确认快照、维护入口和发布门禁，旧消费者仍可调用既有接口；不据此宣称“无消费者”或授权清理兼容协议。
- 无 Foundation Token、机器契约、公开导出、生成物、包版本或 HTTP Schema 变化，不创建 Tag／Release，不要求消费者升级 Foundation 依赖。本次新增交互先交付文档提交与 PR 供 Mobile 实现，需另经负责人决定合并及发包；原任务上线授权不自动覆盖本修订。
- 消费者可回滚到旧界面实现并继续使用保留接口与已发布说明；保留可迁移的旧忽略及本机展示记录，不能借回滚改写发布历史或撤回已发布安装包。无新的系统通知／FCM 事件，不新增 iOS 发版。

## 后台预览与移动端更新说明文档

本节保留 [PR #23](https://github.com/morenk/wenyousite-foundation/pull/23) 合入时的原方案；其中主动历史入口与“无升级后自动弹窗”仅作历史记录，现行 App 行为以上节为准。

- [原共享更新说明规范](https://github.com/morenk/wenyousite-foundation/blob/d9001265030a52d5255c7cd52dc841833cc7afbb/docs/mobile-releases.md)补充人工纯文本摘要与条目、平台／版本名／构建号对应、草稿与已确认快照隔离、推荐横幅、完整详情、强制更新及主动版本历史；原 [Web](https://github.com/morenk/wenyousite-foundation/blob/d9001265030a52d5255c7cd52dc841833cc7afbb/docs/platforms/web.md#移动端更新说明管理与预览)与 [Mobile](https://github.com/morenk/wenyousite-foundation/blob/d9001265030a52d5255c7cd52dc841833cc7afbb/docs/platforms/mobile.md#更新说明与版本历史)仅补充平台呈现差异。
- 此项按兼容新增接入，保留既有 `/meta` 字段与推荐／强制升级策略。旧客户端不能展示新说明或新历史入口，仍按原升级流程工作；不将旧客户端无法显示说明误报为新功能已覆盖全部用户。
- 公开历史只收录晋级成功的已发布记录；后台草稿、待发布记录和未确认修正不对用户公开，编辑期间继续展示已确认旧快照。旧历史缺失使用明确空态，不编造文案、发布日期或迁移完成记录；读取失败不能伪装为空态或绕过强制更新。
- 无 Foundation Token、机器契约、公开导出、生成物或版本变更，不创建 Tag／Release，不要求消费者升级 Foundation 依赖。Backend 负责 API、存储、权限与发布事务；本登记不复制其 Schema，也不声明数据库迁移或线上晋级已完成。
- 先交付兼容后端，Web 与 Mobile 依据治理交付的 Backend 精确提交接入、检查并完成负责人验收；此文档可独立评审，不代表消费者、真实画面或发版流程验收已完成。无升级后自动弹窗、无新 FCM／系统推送事件，本次不新增 iOS 发版。
- 无旧协议删除项，不废弃旧下载与升级流程。消费者可回滚到原界面实现，Backend 的新增记录与已确认内容按其回滚方案保留；界面回滚不撤销已发布安装包。合并、正式发布、晋级与部署仍须另行明确授权，未来清理兼容协议另开 PR 并满足治理证据门禁。

## 移动端阅读滑块职责迁出（v7.2.1）

- 职责边界：移动端阅读进度、手动快翻和自适应阅读滑块改由 Mobile `ReadingScrollSpec` 独立拥有。Foundation `v7.2.1` 移除 `experiences.readingQuickScroll`、`experiences.adaptiveReadingScroll`、`READING_QUICK_SCROLL_MOBILE_PROFILE`、`ADAPTIVE_READING_SCROLL_MOBILE_PROFILE`、`AdaptiveReadingScrollMobileProfile`、`WenyouReadingQuickScrollContract`、`WenyouAdaptiveReadingScrollContract`、专属 `action.reading-quick-scroll` 语义／资产及两份现行规范文档；通用主题、动效、普通表单滑块和无障碍基础不受影响。
- 兼容事实：Mobile 当前 `origin/dev` 的 `pubspec.yaml` 仍精确固定 Foundation `v7.2.0`，`reading_quick_scroll.dart` 与 `reading_quick_scroll_overlay.dart` 仍引用 `actionReadingQuickScroll`／`WenyouReadingQuickScrollContract`；PR #66 的后续反馈尚未全部合入。发布 `v7.2.1` 不会自动升级或破坏这个固定消费者，也不代表迁移已完成。
- 交付顺序：Foundation 可按本次负责人明确授权先发布 `v7.2.1`；旧 Mobile 继续固定 `v7.2.0`。Mobile 后续先合入 `ReadingScrollSpec` 并清除两套 Foundation 阅读滑块引用，完成回归与回滚核验后，再通过独立 chore 固定正式 `v7.2.1`。存在旧引用的消费者不得直接升级。
- 版本取舍：公开 API 删除通常应提升主版本；负责人本次明确选择小版本 `7.2.1` 作为职责清理例外，根包、Flutter 包、契约与 Manifest 同步为 `7.2.1`，`schemaVersion` 保持 `3`。此决策不把破坏性删除描述为兼容变化，也不建立未来删除 API 可默认使用 Patch 的先例。
- 回滚与历史：既有 `v6.10.0`、`v6.11.0`、`v7.1.2`、`v7.2.0` Tag 及下方历史登记保持不变，可供旧消费者固定与回滚；已关闭 PR #21 的分支历史仅供追溯，不并入本清理。无 HTTP API、数据库或持久化迁移。

## 资料关注与粉丝计数口径修正

- [资料与列表计数](interaction.md#资料与列表计数)对齐 [Backend 5.27.1-dev.20260928.1 已提交契约](https://github.com/morenk/wenyousite-backend/blob/e807a3aa0cb15a626e5601eedc93f23c72d2e6c4/docs/api-contract.md#本人关注与粉丝管理)：仅统计当前查看者可见且未注销的账号，资料与关系列表口径一致，数值及 HTTP 字段继续由 Backend 定义，客户端不猜测或补数。
- 此次为既有计数口径纠错，字段、类型、接口、权限及双向拉黑语义不变；无字段弃用、关系行删除或数据迁移。游客公开资料保留既有最长五分钟缓存，后端修正部署后旧缓存自然过期，不要求生产清缓存，也不扩展原缓存失效机制。
- Foundation 仅更新共享说明，不改视觉组件、Token、机器契约、生成物或包版本，不创建新 Tag／Release，不要求 Mobile 升级现有 `v7.2.1` 依赖或重装 App。此登记只引用已提交契约，不代表后端修正已合并或部署，也不授权清理兼容协议。

## 本人关注与粉丝管理文档

- [本人关注与粉丝管理](interaction.md#本人关注与粉丝管理) 改为紧凑扁平行、关注／回关主按钮、已关注／互关浅底状态及共享菜单；明确 Mobile 同栏返回与计数页签、底部 Sheet，以及 Web 锚定 Dropdown、键盘和焦点边界。复用已发布的 controls、collections、feedback、overlays 和 accessibility 语义。
- 原候选文档中的“全部中性描边”“Mobile 固定第二操作行”和独立重复关系文字已由本方案取代，不作为消费者实现要求；该替换只涉及未发布页面设计说明，不删除既有 Token、组件 API 或 HTTP 协议。
- 菜单中的取消关注、移除粉丝按双向关系决定，互关时两个页签均可移除；私聊按能力、举报复用既有流程。拉黑与移除确认、共享行锁、结果不明只读核对和会话边界纳入验收；拉黑保持服务端既有关系与可见性语义，不新增自动取消双方关注。
- 无 Foundation Token、机器契约、公开导出、版本或生成物变更，无需升级消费者 Foundation 依赖，也不创建 Tag 或 Release。本文档不替代 Backend 的 OpenAPI、Markdown 契约和关系权限规则。
- 后端兼容接口先行，Web 与 Mobile 依据已提交契约接入并完成各自验收；保留既有列表深链与旧客户端接口，不在本次删除兼容协议。消费者需要回滚时恢复原关系管理页面实现，已发生的关系写入不通过界面回滚恢复。

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

## 全局圆角层级收敛（v7.1.2）

- `profiles.radiusUsage` 新增用途映射，现有 compact/control/card/panel 圆角数值收敛；卡片间距仍为 8px/8dp，圆形头像、图标状态层及语义胶囊等明确例外不变。无 HTTP API、存储或数据迁移。
- 根包、Flutter 包、契约与 Manifest 同步为 7.1.2，`schemaVersion` 保持 3；Web 与 Mobile 分别锁定正式 `v7.1.2` Tag，回归按钮、表单、菜单、弹窗、内容卡片、“我的温油”内部区块、骨架、封面和大小字。旧 `v7.1.1` Tag 保持不变，可作为回滚来源；本次不分发独立安装包或部署产品。

## 内容卡片圆角与间距（v7.1.1）

- 新增 `radii.card = 10` 与 `collections.cardGap = 8`，分别用于浏览内容卡片／列表外框和彼此独立的内容卡片间距；连续列表行仍靠分隔线区分。原有 compact/control/panel 圆角、全局 spacing、页面边距与内部留白不变。
- Web 消费生成的 CSS 与 `COLLECTION_WEB_PROFILE.cardGap`，动态瀑布流的测量、定位和骨架间距须一致；Flutter 消费 `radiusCard` 与 `WenyouCollectionContract.cardGap`，保持 48dp 触控下限。
- `schemaVersion` 保持 3，无字段删除、HTTP API、存储或数据迁移。两端在正式 `v7.1.1` Tag 发布后独立锁定依赖、验证并提交；回滚时恢复 `v7.1.0` Tag 及对应消费实现，不改写历史 Tag。

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

### 自适应阅读滑块（v7.2.0）

- 新增可选 `experiences.adaptiveReadingScroll.mobile`；主题详情、独立楼中楼和动态详情可接入明确快滑自动唤醒，动态信息流排除。新代码使用 `ADAPTIVE_READING_SCROLL_MOBILE_PROFILE`、`AdaptiveReadingScrollMobileProfile` 和 `WenyouAdaptiveReadingScrollContract`。
- 新页面不显示主题帖右上角快翻按钮，不使用居中 360dp 短轨或开头／末尾／重试／收起操作卡。展开滑块短点按由滑块消费但不动作，轨道点按继续透传。
- v7.1.2 的 `experiences.readingQuickScroll.mobile`、`READING_QUICK_SCROLL_MOBILE_PROFILE`、`WenyouReadingQuickScrollContract` 与图标语义／资产完整保留原字段、数值和源码 API；旧组件可稳定升级，不添加 Dart 弃用注解，也不把旧名别名到新形状。
- 普通 pointer-up 先应用最后输入并停止末端跟随，不作为取消清理；取消不应用尚未绘制输入，controller dispose 与其他作用域清理触发器清除排队动作和计时器。
- 根包、Flutter 包与契约以 `7.2.0` 发布，`schemaVersion` 保持 `3`。旧消费者可直接升级并继续使用兼容组件；Mobile 新实现仅在锁定正式 `v7.2.0` 后迁移到自适应 profile。回滚时恢复 `v7.1.2` Tag 与配套消费实现。

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
