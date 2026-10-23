# 字体后台上传与列表管理

本文固定 Backend `1ce559b42be9ac04c4fd09137ee30f482facbfe2`（HTTP `5.44.0-dev.20261024.2`）的[管理员契约](https://github.com/morenk/wenyousite-backend/blob/1ce559b42be9ac04c4fd09137ee30f482facbfe2/docs/admin-font-management.md)、[OpenAPI](https://github.com/morenk/wenyousite-backend/blob/1ce559b42be9ac04c4fd09137ee30f482facbfe2/contracts/openapi.json)和[共享夹具](https://github.com/morenk/wenyousite-backend/blob/1ce559b42be9ac04c4fd09137ee30f482facbfe2/contracts/admin-font-management-v1-fixtures.json)。三份原字节镜像的路径、长度和 SHA-256 见[来源记录](../tests/fixtures/admin-font-management/source.json)；Backend 唯一拥有 HTTP 与业务语义，Foundation 不另造接口、默认样张或运行目录。

**此 SHA 是恢复契约 pin，不是可部署运行时**。其生产者文档保留新增五个操作及带 `submissionId` 源上传为 `503/50301` 的契约阶段说明；该固定快照不代表后续运行实现状态。业务实现和隔离 E2E 仍在进行，须另行提交验收证据。本文与[动态正文字体规范](thread-fonts-dynamic.md)及既有镜像共同交付，消费者 v2、旧 v1 引用、历史资源和授权记录保留。新管理契约不表示旧运行链路全部不可用，也不代表本轮流程已实现。

## 提交与授权确认

表单仅要求文件、名称、语言，语言为 `zh/ja/en/other`，默认 `other`。新家族默认样张按语言由 Backend 生成，固定文本直接取共享夹具 `specimens`；不要求管理员补填作者、许可、来源、样张或排序，也不在客户端伪造这些字段。名称规范化与校验由生产者负责。已有家族新版保留已保存的作者、来源、许可等补充资料，授权仍由本次服务端确认单独判定；自动样张随语言更新，通过旧配置入口保存过的自定义样张保留。

上传即确认允许分发、转码与分片。靠近提交操作保留一次简短必要提示，不增加重复勾选或许可表单；字体原始许可仍须遵守。首次绑定源时，服务端记录实际上传者、确认时间、源 SHA 及规则版本 `admin-font-upload-v1`，证据持久化到 job，新版本复制并在处理、Worker、发布各阶段核验。既有版本证据不被重写，新 job 保留本次确认；公开 notices 不泄漏账号、IP、请求标识、确认时间或审计对象。

## 阶段与失败恢复

以下路径均以 `/api/v1` 为前缀，复用管理员认证与写请求保护。UUID、修订是内部恢复信息，不增加表单字段。

| 阶段 | 操作与恢复 |
| --- | --- |
| 创建 | `POST /admin/text-fonts/submissions` 提交 `submissionId/name/language?`；为已有家族上传新版时同时提供 `familyId/expectedFamilyRevision`。新家族排到对应语言末尾，已有家族保留顺序。 |
| 上传 | `POST /admin/text-fonts/{familyId}/sources` 继续使用原始 TTF／OTF 二进制、`format/expectedFamilyRevision` 和 64 MiB 上限，新增 `submissionId` 查询参数。 |
| 处理 | `POST /admin/text-fonts/submissions/{submissionId}/process` 提交处理意图 `requestId`。一次上传按钮编排创建、上传、处理，完成后先预览。 |
| 恢复 | `GET /admin/text-fonts/submissions/{submissionId}`；已有 job 直接查询或处理，不重传源。创建响应丢失先 GET，不存在才重放原请求；查询暂未看到仍在上传的 job，可重发同一源。 |
| 发布 | 保持独立确认，调用旧发布端点并提交精确版本、家族和目录修订；ready 不等于已发布，不自动发布。 |

`FontJobDto.submissionId` 是该任务准确绑定的提交，OpenAPI 将其定义为可选、可空 UUID；旧手工任务为 `null`，字段未列入 required 以兼容旧响应。详情、刷新或家族出现更新提交时，恢复必须取 job 自身的绑定，不能拿家族 `latestSubmissionId` 替代历史任务，不能靠扫描管理列表或浏览器会话缓存猜测。绑定非空时使用对应提交恢复／处理；旧手工任务走既有 job 处理路径。匿名恢复与普通用户处理分别保留 401／403 边界，不能因新增恢复字段绕过权限。

`submissionId` 为持久保存的 UUID v4，绑定首次规范化请求、首次修订和创建者。相同请求先查重再检查修订，修订变化后重放仍返回同一家族；换请求或创建者复用同键返回 `409/40930`。其他管理员仍可按契约恢复读取和处理。

首次源绑定原子记录 SHA、长度、格式、job 和授权证据，远端暂存后仍检查家族修订；已绑定源的同字节、同格式重放返回同一 job，不因旧修订失败，换字节或格式返回 `409/40930`。`requestId` 在提交内去重，响应丢失重发同键；失败后重放旧键不会重新执行，只有用户明确重试才生成新键，复用同一源和 job。并发新键只允许一个活动尝试，状态与 Outbox 原子提交。

界面按服务端状态呈现，失败保留名称、语言及可恢复的提交身份。503 应显示暂不可用和恢复入口，不能当成功推进下一阶段，不能悄悄切换到需要完整授权材料的旧流程。

## 原始元数据与版本复用

简化路径使用 `parametersVersion=2` 和独立处理器，旧处理器、参数与缓存保持可重放。构建身份包含源 SHA、参数及授权规则版本、工具链／处理器 SHA 和影响字形输出的参数（含样张），不含管理名称、排序、操作者、确认时间或提交 UUID。

产物与不可变版本分别判定。相同源改名可复用字节，但要得到名称一致的新版本；撤回后相同源提交可复用产物，不能把撤回版本复活为可发布版本。旧配置、授权、撤回记录与正文引用均不覆盖。

沙箱在重命名、默认轴实例化和分片前读取原 name 表 `0/8/9/13/14` 声明。最多检查 256 条目标记录、保留 64 条；单条 UTF-8 最多 8192 字节，总文本最多 65536 字节。严格解码失败、非法控制字符或超限记录整条省略并计数，不截断、补造或改写许可；合法 CR、LF、TAB 和多行原文保留，以纯文本呈现。数值和例子均来自共享夹具 `metadataPolicy/metadataCases`。

缺元数据本身不阻止简化路径处理；旧手工路径仍要求原三项权利和完整材料。`fsType` 的 `0x0002/0x0100/0x0200` 仍拒绝，`failureCode=rights-required`，可选 `failureReason` 依序为 `embedding-restricted/subsetting-restricted/bitmap-only`，同时存在取首项。其他损坏／不支持文件失败沿用旧协议，不能因上传确认绕过显式限制。

## 后台列表与公开顺序

`GET /admin/text-fonts/management` 固定每页 20 条，服务端先对完整家族集筛选，再计算 total、排序和分页。`q` 为 NFC、去首尾空白、不区分大小写的名称包含匹配，`%/_` 按文字匹配；语言、状态分别使用契约枚举。查看排序支持 `createdAt/updatedAt/name/sortOrder`，默认 `createdAt desc`，所有并列项始终按 `familyId asc`。查看排序只控制检索，不写公开顺序；旧 `after/limit` 列表继续保持原语义。

不透明游标绑定规范化查询、排序、固定页长和 `listingRevision`。筛选变化或修订过期返回 `409/40931`，保留筛选从第一页重取，不能混页；格式无效返回 400。任务进度可随页响应刷新，心跳不改变家族排序时间，不承诺冻结任务快照。

展示名称、语言来自最后被设为当前的已发布版本，包括后来撤回的该版本；从未发布才取草稿。状态优先为最后当前版本已撤回、从未发布，再按 enabled 分类。`lastPublishedVersionId` 保留墓碑，不用最大版本号或 publishedAt 猜测最后当前版本。发布 v2、回滚 v1、撤回 v1 后保留 v1 墓碑且 current 为空，历史 publishedAt 不改。存在历史发布但无可靠回填证据时，迁移／预检必须失败并列出受影响家族，不能降为 draft 或恢复公开可选。

公开顺序编辑先加载受影响语言的**完整当前可选集合**，语言取当前已发布版本。Web 本地置顶、上移、下移后，一次 `PUT /admin/text-fonts/order` 提交 `expectedCatalogRevision` 及最多四个不同语言组，每组最多 10000 项，包含该语言全部可选家族与各自 `expectedFamilyRevision`，数组顺序即最终顺序。当前 20 条或搜索结果不能代替完整集合。

服务端在同一状态锁和事务内核验目录修订、各家族修订、完整集合、语言与可选状态。遗漏、重复成员／语言、跨语言、成员新增／退出或修订冲突全部返回 `409/40928`，整批不写。成功变化一次递增目录与列表修订、生成一次审计；相同顺序不写、不增修订、不新增审计。其他语言组、历史版本、描述符、字节与正文不变，不重建字体。成功后刷新；结果未知或冲突时保留意图并重新读取完整集合，不逐条移动补偿或强行覆盖。

列表保持[Web 管理后台](platforms/web.md#管理后台)的信息密度、键盘操作、焦点和窄窗口可达性。字段与按钮可表达的含义不再重复说明；查看排序、公开顺序保存和处理状态各自明确，错误及恢复提示只在需要的位置出现。

## 兼容与验收

[共享夹具](../tests/fixtures/admin-font-management/admin-font-management-v1-fixtures.json)是生产者预期，不是执行记录。八项行为与机器段落关联如下；保留[既有跨仓矩阵](thread-fonts-dynamic.md#跨仓验收用例)，不因管理员改版消除原待验收项。

| 用例 ID | 夹具与必需证据 |
| --- | --- |
| `admin-three-fields` | createCases／specimens：默认值、名称规范化、已有家族成对修订及拒绝客户端伪造字段；真实三字段提交。 |
| `admin-upload-consent` | authorizationRuleVersion／submissionCases：服务端实际上传者和源绑定证据、重放无重复；旧授权保留。 |
| `admin-license-metadata` | sourceCases／metadataPolicy／metadataCases：缺元数据、显式限制、大小边界、多行许可原字节及非法 NUL 省略；沙箱实物验收。 |
| `admin-stage-resume` | submissionCases／jobRecoveryCases：任务准确绑定、旧任务 null、刷新恢复、401／403，以及创建／源响应丢失、同键冲突、明确重试、并发意图及不自动发布；真实持久化与 Outbox。 |
| `admin-global-filter` | listDataset（26 条）／listCases／cursorCases：跨 20 条分页、未加载页筛选、文字通配符、稳定排序与过期游标。 |
| `admin-view-order` | listCases／orderCases：查看排序不写公开顺序，公开保存是独立原子请求。 |
| `admin-language-move` | orderCases：多语言完整集合、目录／家族 CAS、全组拒绝及 no-op；验证无部分成功，历史字节不变。 |
| `admin-history-preserved` | versionReuseCases／publicationHistoryCases：同源改名、撤回后新版本、回滚再撤回及可靠回填失败；旧 v1／v2 与历史资源回归。 |

`pnpm test:font-admin` 校验三份原字节摘要、接口与 DTO 绑定、可由 OpenAPI 表达的结构、夹具跨页和身份关联、各段预期完整性；新增检查验证 job 绑定的可选／可空 UUID 结构、非法类型／格式和历史 job 与最新提交不一致时的预期。它们不生成客户端处理器，也不执行权限或恢复业务；同时进入 `pnpm check`。不复制业务比较器、源解析器或状态机，也不把固定预期断言当作 HTTP 调用。OpenAPI 没有表达名称规范化、额外字段拒绝与成对字段全部运行校验；nullable＋allOf job 也不作为 JSON Schema 的 null 联合处理，列表仅验证标量字段及 job 声明绑定。

orderCases 是独立场景，不能关联 listDataset 推断语言成员；它没有提供完整可选集合快照或每个拒绝案例的请求体。本仓核对多组 DTO、边界及整批拒绝预期，完整集合校验、真实并发锁和事务回滚须由责任仓执行，不能以本仓测试证明通过。

此前治理交接的 Backend 3063 项测试、静态／脚本回归与构建属于初始 832a3989 契约切片证据，不作为此次恢复 pin 的运行验收结论。Foundation 未重复执行后端重型检查。业务实现、迁移、真实画面与隔离写入 E2E 的最终证据仍待责任仓交付，不能把此契约提交当作可部署运行时。Web 提供明暗和窄窗口的授权、错误恢复、筛选及重排画面；写入 E2E 使用本轮登记的独立 PostgreSQL、Redis、上传目录及账号，记录 runId、提交、资源身份和清理结果，失败或清理失败不得记为通过。历史字体镜像、包版本、已发布 Tag、Token 与生成物不变。

## 迁移与回退边界

依生产者迁移约定，新提交／请求账本、授权证据、参数版本、最后当前版本、样张来源和列表修订增量保存，旧版本、许可配置、发布时间、资源与正文保留。可复用版本身份与家族／产物分开，同一家族同产物可有多个不可变版本，撤回释放可复用身份但保留撤回记录。

产生上述多版本或 parametersVersion=2 数据后，不得直接回退不能解释新数据的旧二进制并声称无损。兼容后端与 Worker 先于新 Web，按既有部署入口协调在途任务，不混跑旧参数 Worker。异常优先前滚至理解新 schema／参数的修复提交；暂停简化新提交也须保留兼容二进制，不删除新版本来恢复旧唯一索引。确需恢复备份时遵守独立离线校验、显式切换和新增数据处理门禁，不覆盖活动卷。本次同步仅记录这些边界，不执行迁移、切换或恢复。

## 已发布产物与复现

[`v7.6.0` 正式 Release](https://github.com/morenk/wenyousite-foundation/releases/tag/v7.6.0)于 2026-10-19 发布，无附加二进制资产；注解 Tag 对象为 `9bc7b530103fa1b929f90c6d307263d7bfbfc46b`，指向提交 `1bbd5a5476b50c51d2bba1f2a218f9408a852c4a`。该提交包含根包、Flutter 包、机器契约和生成产物，版本均为 `7.6.0`；[Manifest](https://github.com/morenk/wenyousite-foundation/blob/1bbd5a5476b50c51d2bba1f2a218f9408a852c4a/foundation-manifest.json)记录契约与产物摘要，契约 SHA-256 为 `492230a89dac00a6f54745aff88aa0abbe38dfe9f52fe48cca1bad62914b3a2e`。字体 PR 不在该 Tag 中，不能用包版本相同推断字体文档和测试已经发布。

消费者分别固定正式版本；以下是已提交快照的核验依据，不表示工作区或部署环境实时状态：

| 消费者依据 | 固定方式 |
| --- | --- |
| [Web dbbacc1 的锁定记录](https://github.com/morenk/wenyousite-frontend/blob/dbbacc1f6206150df5f53a05a8b25b1e47ee0953/foundation.lock.json) | package.json 指定 `v7.6.0`；pnpm-lock.yaml 将下载归档固定到 `1bbd5a5476b50c51d2bba1f2a218f9408a852c4a` 并记录 integrity；foundation.lock.json 同时保存版本、Tag、提交及契约摘要。 |
| [Mobile 6f00645 的锁定记录](https://github.com/morenk/wenyousite-mobile/blob/6f0064507a77e2034250ee4fd9f1d382e0a063a9/pubspec.lock) | pubspec.yaml 指定 `v7.5.0` 和 `packages/flutter`；pubspec.lock 的 resolved-ref 为 `fef249d8856f5ed08f55eab69a2a2ed01b2742ce`。不能据 Web 升级推断 Mobile 已升至 7.6.0。 |

复现时检出对应 Tag 并核对其目标提交，使用仓库声明的 pnpm 版本冻结安装，运行 `pnpm check` 和 `pnpm check:package`；生成物由机器契约与生成器验证，不能手改补齐。Web 从 Git Tag 安装根包，Flutter 从同一仓库 Tag 安装子包，不依赖 Release 附件。本轮只更新规范和测试依据，消费者保持各自已发布版本；未来确需运行时升级时另行提交锁定变更，Mobile 仅在 Windows 升级和验证。
