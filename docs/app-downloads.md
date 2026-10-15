# 公开 APP 下载与兼容更新

## 边界与事实源

新下载入口恢复 RainS3 存储桶直连：Backend 提供推荐版本与制品身份，Web／Mobile 从桶下载 APK，正文不经过自研网关。Foundation 只描述跨端体验与验收语义，不实现下载服务或复制业务 DTO。本规范是待消费者接入、合并与切换验收的交付要求，不表示已经上线。

HTTP 唯一事实源为 [Backend OpenAPI 5.37.0-dev.20261015.1（882889c5d8dc4a47893cb4fe913a0f68e536ce2f）](https://github.com/morenk/wenyousite-backend/blob/882889c5d8dc4a47893cb4fe913a0f68e536ce2f/contracts/openapi.json)，流程见[同提交 Android 存储桶直连下载](https://github.com/morenk/wenyousite-backend/blob/882889c5d8dc4a47893cb4fe913a0f68e536ce2f/docs/android-direct-download.md)。新匿名入口为 `GET /api/v1/mobile-releases/android/download`（`mobileReleasesAndroidDownload`），沿用 `AndroidDownloadInfoDto`，返回标准 envelope、`Cache-Control: no-store`，不签发下载 Cookie。

旧 `/api/v1/app-downloads/*`、Cookie、每日次数、字节账本、预热及审计协议仅保留兼容，原规则完整保存在[旧网关兼容范围](app-downloads-gateway-compatibility.md)。不删除旧协议、不停止网关，也不以新入口代替旧客户端兼容验收。新请求失败不得回退旧网关。

明暗、字体、排版、布局和触控继续消费[机器契约](../contracts/foundation.v1.json)与平台 profile；本次无 Token、公开导出、生成物或包版本变化，不发布 Tag／Release，Web／Mobile 保持原正式 Foundation 依赖。

## 直接入口与触发

- `ThemeMenu` 外观弹层保留主题切换与“下载 APP”，下载位于主题选项之后；桌面、窄屏与登录页复用，游客无需登录。不恢复独立下载页面、二维码、第二次确认或省流量控件，已有封面能力和偏好保留。
- 用户显式点击一次后查询新信息入口，验证可用制品身份与精确桶 URL，再发起 `credentials: omit` 的跨域 HEAD；成功后交给浏览器原生 GET 同一 URL。不得向桶发送本站 Cookie 或认证头，不先下载完整 Blob 来观察 GET 结果。
- 桶地址必须精确为 `https://wenyou-apk.cn-nb1.rains3.com/mobile/android/wenyou-<versionName>-<buildNumber>.apk`，版本名、构建号、文件名与信息属于同一制品。不接受其他主机、查询参数、片段、签名 URL、重定向别名或旧网关地址。说明文字和 UA 不能决定下载目标。
- HEAD 验证成功状态、APK `Content-Type`、`Content-Length`、`Content-Disposition` 文件名，以及 `x-amz-meta-apk-sha256`、`x-amz-meta-application-id`、`x-amz-meta-version-name`、`x-amz-meta-version-code`，均须与信息对应。缺失、不匹配、重定向、CORS 或网络失败即停止，不进入 GET。ETag 不等同 APK SHA-256，HEAD 不证明正文、签名或安装已校验。
- 挂载、菜单打开、悬停、聚焦、框架预取和提示出现不触发查询或文件 HEAD／GET／Range；一次动作期间抑制重复激活。过期／已取消动作的响应不能覆盖新目标或发起下载，新目标不能继承旧 HEAD 结果。
- 查询、预检、失败与显式重试就在原入口附近反馈，复用现有状态及无障碍语义，不新增说明页、常驻副标题或重复文案。浏览器接管仅表示请求已交出，不伪造下载进度、成功、摘要校验或安装结果。

## 移动设备首次访问提示

- 根据移动设备／浏览器的平台信号，在真实移动设备首次访问 Web 时显示可关闭的下载提示；仅缩窄桌面窗口不触发。设备判断只决定提示是否出现，不参与服务端授权或下载校验，也不能仅以视口宽度替代平台判断。
- Android 提示提供“下载 APP”和继续使用网页的入口，支持明确关闭；点击下载复用同一“查询信息 → HEAD 校验 → 原生下载”流程，不新增页面、二维码或第二次下载确认。提示显示、设备检测、挂载和焦点变化都不启动下载流程，不请求 APK HEAD／GET／Range。
- 同一浏览会话在用户选择下载、继续网页或关闭后记录已处理，后续路由切换、刷新或组件重建不再次自动弹出；下载失败也不清除已处理状态来重复提示。多个承载位置共用会话状态与正在进行的下载动作，避免叠窗和重复请求；用户仍可随时从外观菜单显式下载或重试。
- iOS 提示明确当前只提供 Android 安装包，允许继续网页与关闭；不得把 Android 文件显示为可安装的 iOS 包，不提供声称可安装 iOS APP 的动作，也不阻断网页使用。
- 提示消费既有浮层、焦点、主题及无障碍语义，状态与显式重试保留在可见入口附近；关闭恢复可用焦点。不能因提示关闭或原生下载交接而丢失可观察的错误，也不伪造浏览器后续 GET 或安装结果。


## 信息与恢复状态

以下解释既有 DTO 的新入口语义，不导出另一套状态类型。`available` 只表示已提交发布身份匹配，Backend 不为信息请求访问桶、预热、计次或写业务数据；对象实时可用性仍由消费者 HEAD 确认。

| 信息或请求结果 | 共享处理 |
| --- | --- |
| `available` | 当前 `/meta` 推荐策略已指向精确桶地址，存在对应已公开说明与 `SUCCEEDED` 发布记录，版本、大小、摘要和路径一致；返回完整 `release` 后继续 HEAD |
| `no_release` | 当前未配置推荐构建；`release=null`，不从历史记录、缓存或旧地址猜测推荐包，停止 HEAD／GET |
| `unavailable` | 策略仍指向旧网关、URL／成功记录缺失或制品身份无效；`release=null`，就近显示暂不可用并停止，不降级旧入口 |
| 读取失败／`503` | 发布记录读取故障属于请求失败，不伪装成没有版本或继续使用上次地址；保留显式重试 |
| API `429` | 按可观察的 HTTP 状态及有效 `Retry-After` 提示稍后重试，不解释成网关设备／IP 每日次数用尽 |
| 桶 HEAD 失败 | 反馈实际可观察的失败类别并停止 GET；不自动换源、刷新地址、尝试其他构建或跳过预检 |

新入口三个成功信息状态的 `retryAfterSeconds` 均为 `null`；DTO 的 `withdrawn`／`paused` 为旧网关保留，新入口不生成这两个状态。不能用网关缓存／预算或当前访客次数推断新入口的发布状态。

再次查询失败时即使仍显示上次版本，也不能复用旧地址下载。用户显式重试重新执行“查询 → HEAD → 原生 GET”，等待结束、菜单重开或组件重建不构成重试授权。HEAD 与 GET 之间对象和网络仍可能变化，成功 HEAD 不保证后续 GET 成功；原生下载的不可观察结果不能被猜测。

## 存储、缓存与公开 URL 边界

- 桶承担 APK 文件流量、缓存与服务限制，网关设备／IP 每日次数、SQLite 字节账本及 4 Mbps 限制不适用于直连。新信息仍受主 API 的正常限流约束，不能宣称下载完全不限流。
- 桶须允许站点 Origin 的 HEAD 并暴露上述身份头；缺失 CORS 或暴露头时 Web 预检失败。跨域预检不发送本站凭据，不借自研代理绕过校验。本次文档不修改桶权限或云配置。
- 版本与构建号组成固定对象名，发布后不覆盖相同对象。桶响应可使用 `public, max-age=31536000, immutable` 与 Range，实际缓存和范围响应以桶配置为准，不把网关范围计次规则套用到桶。
- 取消推荐或撤回发布仅停止后续推荐，不保证已发出的公开桶 URL 或缓存中的 APK 立即失效，也不能召回已安装包。旧网关对其固定文件的撤回控制不能证明公开对象不可下载。

## Mobile 与发布工具

- Mobile 继续读取 `/meta.mobileCompatibility.android.updateUrl`，字段结构、推荐／强制策略不变；桶 URL 仍指向安装文件，不是网页。无需为本次恢复增加新信息请求、Cookie 支持或强制升级旧 APP。
- 同一更新流程先 HEAD 校验上述 metadata，再 GET 并计算 SHA-256、验证大小和包身份；既有包名、构建号、签名及安装校验不能删减。Web 菜单与更新说明不能产生或解除 APP 强制更新资格。
- 新发布预检与晋级命令移除 `--gateway`，制品 `publicUrl` 恢复原桶 URL；预检仍获取 `confirmedRevision`，晋级仍携带 `--notes-revision`。签名、制品身份、说明确认、晋级事务及失败补偿保留。
- 受限晋级工具验证公开 HEAD 与 `.sha256` 后更新说明／策略／TSV。同构建仅允许从精确历史网关地址恢复桶地址，不改写历史 promotion／TSV 或 `downloadArtifact`。旧 `--gateway` 模式仅保留显式兼容／回滚使用，不能成为新发布默认。

## 切换与旧网关兼容

先合并并通过管理入口部署兼容 Backend，再按原受限流程把推荐策略恢复到桶 URL，核验新信息与 `/meta` 一致后切换已合并 Web。Mobile 在后续读取策略时恢复直连；未切换策略的新 Web 显示不可用，不偷偷使用旧网关。具体命令、事务及回滚以固定 Backend 文档为准。

已缓存旧网关 URL 的消费者继续按[兼容规范](app-downloads-gateway-compatibility.md)工作。旧服务、账本、审计和历史不随新入口删除；退役需独立 PR 提供无消费者、数据已迁移、回归覆盖与回滚路径四项证据。回滚不清空账本、不改写审计或自动调整桶公共读，图片桶与共享开关不随 APK 切换修改。

## 固定验收用例与交付

[共享用例](../tests/app-download-semantics-fixtures.json)保留稳定 ID，并以 `scope` 区分 `current-direct-storage` 与 `legacy-gateway`。旧场景内容完整保留，只适用于兼容网关；当前直连场景覆盖下表，不包含 HTTP 响应样本或另一套 DTO。

| 当前用例分组 | 稳定 ID |
| --- | --- |
| 入口与非交互边界 | `direct-entry-anonymous`、`direct-idle-no-request`、`direct-mobile-visit-prompt` |
| 信息状态与请求故障 | `direct-info-available`、`direct-info-no-release`、`direct-info-unavailable`、`direct-info-read-failure` |
| URL、HEAD 与原生交接 | `direct-url-identity`、`direct-head-preflight`、`direct-head-rejection`、`direct-browser-handoff`、`direct-target-race` |
| 恢复、缓存与安全边界 | `direct-explicit-retry`、`direct-storage-limits-cache`、`direct-public-url-withdrawal` |
| Mobile、发布与迁移 | `direct-mobile-update`、`direct-release-notes-revision`、`direct-migration-compatibility` |
| 共享呈现 | `direct-accessible-layout` |

开发阶段仅做所改 JSON 结构、ID／范围完整性、文档链接等定向验证。用户未明确授权合并前，不运行 `pnpm check`、完整构建、全量测试或门禁，也不借提交、推送、draft PR 自动触发；明确合并后再执行仓库必要完整检查。这一时机遵循[治理开发规范](https://github.com/morenk/wenyousite-workspace/blob/1e1948f103290b1ea9f83f86524845062db3fbbb/AGENTS.md)，不把未运行门禁写成通过。

Foundation 的结构检查不证明下载、CORS、实际缓存、安装或部署已验收。消费者分别提供定向实现证据与受影响界面画面；真实环境自动化仅只读，写入 E2E 必须先核验独立资源并记录清理。合并、部署、发正式包与兼容清理仍由负责人分别授权。
