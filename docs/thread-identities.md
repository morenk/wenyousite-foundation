# 沉浸式 RP 帖内身份

## 边界与事实源

本规范固定 Web 与 Mobile 的共享呈现及操作语义。每个站内账号在每个主题帖内最多有 10 个未归档 RP 身份，覆盖该主题的全部子贴、楼层和楼中楼；所有 RP 身份平级，每次新发表可选择其中一个有效身份或“站内身份”，不提供主角色设置。楼主本人、协作者、已标记玩家均可自愿设置，不改变发言、订阅、治理与拉黑权限。

[治理一期交付与验收（05d8259）](https://github.com/morenk/wenyousite-workspace/blob/05d8259a8167e9e721ef699b84f431c68b5b3b85/docs/rp-identity-delivery.md)保留为单身份基线。本轮按已确认需求扩展为每人每帖最多 10 个平级发表身份，提及可明确选择站内账号或具体角色；筛选、订阅和通知仍按账号关联。旧 single 映射仅用于内部兼容，不决定新端默认选择、候选或账号目录。

HTTP 事实源为 [Backend OpenAPI 5.36.0-dev.20261005.1（60273e5）](https://github.com/morenk/wenyousite-backend/blob/60273e5576c9837f645245ae2c610ba8a3f81ea1/contracts/openapi.json)。身份集合与发言快照见[同提交身份协议](https://github.com/morenk/wenyousite-backend/blob/60273e5576c9837f645245ae2c610ba8a3f81ea1/docs/thread-identity.md)；平级提及、默认与目录以 [v6 分阶段扩展](https://github.com/morenk/wenyousite-backend/blob/60273e5576c9837f645245ae2c610ba8a3f81ea1/docs/markdown-v6-role-mentions.md)覆盖旧主身份规则，并关联[角色提及固定语料](https://github.com/morenk/wenyousite-backend/blob/60273e5576c9837f645245ae2c610ba8a3f81ea1/contracts/markdown-v6-role-mentions-fixtures.json)及[身份固定语料](https://github.com/morenk/wenyousite-backend/blob/60273e5576c9837f645245ae2c610ba8a3f81ea1/contracts/thread-identity.v1.fixtures.json)。权限、确认凭据、错误码、Markdown 存储和媒体引用由 Backend 拥有，本文件不定义第二套 DTO。全局 Markdown 仍为 5，扩展能力为 6；引用提交不表示已部署、激活或完成端到端验收。

本次只把业务语义映射到既有身份、图片、提及、控件和浮层契约。Foundation 机器契约、Token、公开导出、生成物和包版本不变，不创建 Tag／Release；消费者继续固定各自现有正式 Foundation Tag，不依赖未发布的 Foundation 分支。

## 身份层次与入口

- **站内账号**承担认证、权限、通知、筛选、订阅、举报和拉黑关联；改名、重名、换头像不能生成另一个玩家或绕过原有限制。
- **当前帖内身份**按稳定 identityId 分别用于编辑器选项和同角色资料预览，昵称和头像分别可选；只设置头像也构成有效身份，不能以昵称为空判定“未设置”。主题题头、成员、订阅和筛选目录使用站内资料；@ 候选区分站内账号与各个可用角色，不选择任何 RP 代表账号。
- **发表身份**记录该次 RP 发言实际采用的昵称与头像；未自定义的一项使用发表时的站内资料作为快照。之后修改站内或 RP 资料、编辑旧正文，均不回写历史。未采用 RP 的普通发言沿用站内资料规则，不追溯套用角色。
- **系统角色**来自账号在主题中的真实职责。楼主／站务、协作者、玩家徽标独立于自定义昵称；复用既有 brand、info、neutral tone，昵称中的“楼主”等文字不能产生系统徽标。
- 楼主在“主题管理 → 主题设置”控制“启用帖内身份”。开启不替用户创建资料，也不回写旧楼层。
- 帖内资料设置仅从编辑器身份菜单进入。各身份行主区域用于选择本次发表身份，行尾编辑与新增占位遵循[中央 UI 精简原则与帖内身份示例](foundation.md#优先复用现有结构)，不另加编辑列表项。编辑器按可用身份展示实际头像、昵称和必要的简短模式辨识；已有选择器能够表达时不重复添加“以某某发表”说明。普通身份明确当前账号，不每次发布弹设置窗；每次选择整套身份，不单独组合 RP 昵称与站内头像。
- 身份选择属于本条草稿，与正文一起保存及恢复 mode、identityId 和确认上下文，不修改其他楼层。无草稿的新编辑器始终默认站内身份，即使已有有效 RP；集合刷新、旧兼容映射、创建顺序和其他编辑器的选择都不能覆盖草稿。新建角色成功后可明确选中新角色，编辑另一角色不切换已选身份。
- 写作过程中已选 RP 失效不能自动切成站内后发布。用户主动选择站内身份后，可按原有权限发表，即使同时已有 RP 资料。
- 编辑旧楼层仅修改正文，展示原发表身份但不给身份切换入口；不能通过切换、清除设置或重存正文给旧楼层换装。
- 复用同一资料表单编辑选定角色的昵称、头像、清除及删除，失败保留输入和原身份。清空资料保留角色与名额，删除归档释放名额；不能用一个模糊动作混淆两者。已有行行尾笔只编辑该行，未满 10 个且可创建时才在原菜单显示新增，不另设管理入口或解释卡。保存成功前不创建空占位，连续保存防止乱序覆盖，预览不是已保存结果。
- 头像上传、裁切、失败和不可用状态复用[图片契约](images.md)。快照保留媒体引用不意味着可以继续展示已治理移除的图片。

## 阅读与选人

| 场景 | 主信息与行为 |
| --- | --- |
| 楼层、楼中楼作者 | 该条发表身份；普通发言沿用站内资料；系统角色标记独立 |
| 主题题头、当前成员和订阅目录 | 站内头像与用户名；同一账号只出现一次 |
| @ 候选 | 站内账号及其各个可用 RP 平级；角色名为主、所属站内用户名为辅助，按稳定目标选择 |
| 已发表的结构化 @ | 源保留插入时称呼与稳定账号／角色目标；RP 显示经验证的历史称呼，账号显示当前站内名 |
| 回复对象、结构化引用来源 | 被回复楼层当时的身份；定位同一楼层与账号 |
| 楼层作者筛选 | 站内头像与用户名，一账号一项；聚合该账号全部角色与站内发言 |
| 权限管理、任免与移除 | 站内头像与用户名，操作对象绑定账号 |
| 首页主题卡片、个人主页、关注、私聊 | 沿用站内资料，不覆盖全局账号模型 |
| 全站通知列表、系统推送 | 站内用户名及既有安全文案；授权的站内主题上下文才补充角色信息 |
| 搜索、档案导出 | 帖子搜索结果与档案导出遵守当前开关、访问权限及发表快照；用户搜索结果沿用站内账号资料 |

用户写进正文的名字、普通 Markdown 引用和普通文本不自动替换。只有结构化作者、提及、回复及引用来源参与身份解析；禁止全文替换昵称或从显示标签反推账号。

作者头像／昵称入口由该条可展示的发表身份决定：站内身份发言直接进入真实账号主页；具有 RP 快照且当前允许展示时才打开身份卡，保留阅读位置。作者当前是否设置 RP 不改变站内发言的入口；功能关闭或旧响应缺少 RP 信息时回退账号直接导航。RP 卡遵循[中央精简原则](foundation.md#优先复用现有结构)，以真实账号头像、用户名和右箭头组成主页入口，不另列文案按钮，不提供提及或“只看此人”；卡外原有提及、筛选功能不变，不展示邮箱等私密资料。

RP 卡顶部只呈现一组头像、昵称与独立系统角色；从发言打开时保留该条发表快照，不另加“现为／当前角色”名称或头像对照行，也不添加“本条发言身份”或“当前使用站内资料”等重复说明。清除当前 RP 不抹去历史快照；关闭功能时撤下已展开的 RP 卡片，之后作者入口直接进入账号主页，访问权限失效仍遵循原有遮蔽规则。

允许同帖同一账号的多个角色以及不同账号昵称相同；身份选择按稳定 ID 保留独立行，不按名字合并。候选、筛选与身份卡的站内用户名必须可辨认，不能只在悬停时显示。账号和角色同名时用简短类型辨识；列表键、鼠标／触控选择、键盘焦点和读屏位置都绑定同一稳定目标，不能按账号或名字找到第一项就插入。候选复用[现有身份选择行](foundation.md#帖内身份示例)，头像与昵称为主、下方小字承载账号消歧，去掉重复 @ 与右侧辅助堆叠；紧凑列表可截断长昵称，但保留完整无障碍名称与卡片详情，不依靠头像颜色区分账号。

### 身份资料卡与楼层资料

资料卡遵循[中央精简原则](foundation.md#帖内身份示例)：Mobile 复用底部面板，不保留重复总标题和可见关闭 X；小字“帖内身份”位于昵称下，系统标记邻昵称。正文直接嵌入，底部真实账号行仍负责主页导航；手势、外部点击、返回／Escape、焦点返回及无障碍关闭保持可用，不因移除 X 失去退出路径。

- 每个稳定 identityId 可选绑定本主题的一条楼层作为当前资料，允许来自不同子贴、楼中楼回复及他人代贴；不能跨主题，也不转移原楼层的编辑、阅读或治理权限。
- 只展示原楼层正文，复用原阅读格式与媒体、提及、骰子等既有显示规则；不复制作者区、楼层操作、重复标题或嵌套卡片。未绑定时不留空块；原文位置使用紧凑入口。长正文与卡内其他内容共用单一滚动，窄屏、大字号和媒体不造成横向溢出。
- 绑定属于角色当前资料，不是发表快照。原楼层编辑后在后续有效读取中呈现新正文；历史发言头像／昵称仍是发表快照，同一角色后改绑定则显示当前资料，不冻结当时正文，也不以另一角色资料补位。
- 资料读取独立于身份头部：局部加载与失败重试，不让整张卡消失。原楼层删除、隐藏或当前查看者无权阅读统一呈现不可用，不泄露具体受限原因、正文、媒体或可跳转原文入口。功能关闭、角色归档及主题失权沿用既有遮蔽。
- 编辑表单只在昵称下增加可选楼层链接，沿用原保存与失败保留输入；清空链接表示解绑，不新增管理入口、常驻说明或额外确认。保存失败不提前替换当前资料，链接绑定不代表取得原文编辑权。
- 缓存按账号会话、主题、角色及当前绑定区分；绑定、原文与权限变化失效相应正文，切号或失权撤下旧内容，迟到请求不能回填旧角色或旧账号。旧客户端与不支持的服务继续遵循原身份流程，不把缺少扩展当作解绑，不发送未知字段。

资料引用字段以 [Backend 资料协议](https://github.com/morenk/wenyousite-backend/blob/60273e5576c9837f645245ae2c610ba8a3f81ea1/docs/rp-identity-profile-post.md)及[固定语料](https://github.com/morenk/wenyousite-backend/blob/60273e5576c9837f645245ae2c610ba8a3f81ea1/contracts/rp-identity-profile-post.v1.fixtures.json)为准：

- capabilities.rpIdentityProfileSupported 缺失按 false，此时不发送新增字段；支持时将输入链接解析为本主题稳定 post ID，写 profilePostId，不能把 URL 直接提交。省略保留原绑定，null 或 clearProfilePost=true 解绑；非空 ID 与清除标记不能并用。本人编辑回显读取 identity.profilePostId，不能用展示层的 null 覆盖原绑定。
- profilePostStatus=NONE 不显示资料区域；AVAILABLE 才使用可见 profilePostId 继续授权读正文；UNAVAILABLE 只显示统一不可用，ID 为空。关闭、归档、失去资格或昵称头像均空时为 NONE。资料只是附加信息，不能以仅绑定楼层创建或启用空角色；旧 single clear 只清昵称头像，保留绑定且不再展示资料。
- 保存继续使用指定角色端点与 version；跨主题、不存在、删除或不可读目标统一 404／40403，版本冲突 409／40002，保留输入。仅改绑定增加编辑 version，不改变独立作者版本或发表 token；实际昵称／头像、资格、开关与有效显示变化仍按原规则确认。
- 每次打开卡片先重新读取同角色状态，再复用 postsFindById 取得原正文与阅读所需媒体、提及、骰子及定位；不新增正文端点或存储副本。身份与正文请求遵守 private, no-store；刷新开始先隐藏旧正文，NONE／UNAVAILABLE、403／404、切号与失权清除正文和媒体，不能从旧缓存回退。

### 已提交协议的接入边界

- 账号 id、username、avatar 保持原义；可选 rpIdentity 为 null／缺失时使用账号资料。rpIdentity 存在时使用其完整昵称与头像投影，不能把其中 null 头像擅自回退成当前账号头像，尤其不能绕过治理移除。
- 历史卡使用 rpIdentitiesFind 按 author.rpIdentity.id 查询同一角色；该条发言展示来自 author.rpIdentity，不能用旧兼容映射、另一角色或当前卡覆盖历史。已归档角色 identity、display、token 为空，仍可保留允许展示的原发言快照，不补另一个角色作为当前资料。详情 rpIdentityEnabled 缺失按 false；启用前的普通账号发言没有 RP 快照，之后开启或修改角色也不补造快照。
- @ 候选 relation 中 OWNER、COLLABORATOR 分别按楼主、协作者显示，不能落入 PLAYER 标签。新候选以 candidateKey 区分账号及角色，插入使用 mentionHref 与 mentionLabel，不按 userId 去重或从当前展示猜源；id／username／avatar 仍是账号字段，通知、筛选和账号主页导航继续绑定 userId。
- 结构化提及按 mentionIdentities 的 sourceHref 与原 label 配对匹配 displayName；旧 bare 来源才沿用原兼容键。targetIdentityId 与 threadId 是稳定角色目标，关闭或归档不丢失；identityId 只是可遮蔽的显示身份，不能反推目标。编辑始终保留源 content，不把投影名写回正文；跨页面卡片按 threadId／targetIdentityId 查询，不能猜当前页面主题或换成该账号另一角色。
- 新 RP 提及只验证所选角色自己的当前／历史别名，新增时仍须属于所选账号、当前主题且有效；ACCOUNT 只验证账号当前名或登记的账号旧名，源称呼保留，显示当前账号名。伪造或跨角色、跨主题、无效目标按 409／40012 保稿重选，不自动改账号或标签；代码、转义和普通 @角色名不新增模糊解析。已存合法节点在关闭、归档或撤资格后可保留、重排和删除。
- 设置省略项为保留，单项清除使用契约的 null 或 clearNickname／clearAvatar；不能把“未修改头像”发送成清除，也不能同时设置及清除同一项。昵称校验与头像的本人已完成 AVATAR 媒体要求来自 Backend；失败就近反馈，禁止任意 URL 绕过上传契约。

## 平级角色集合与旧接口兼容

新客户端使用已提交的 rpIdentitiesList／Create／Find／Update／Remove。集合按 createdAt、id 稳定排序，activeCount 包含空资料的未归档角色，limit 为 10；创建至少有一个非空自定义项，空请求 400／40001。并发创建由 Backend 原子计数，达到上限返回 409／40013，客户端就近反馈并重读列表，不覆盖已有角色。更新与删除携带所选角色 version，删除使用 JSON 请求体；409／40002 保留输入、重读同一角色后再决定，不以刷新结果静默覆盖。

角色创建 POST 没有 clientRequestId，也不按同名或相同字段去重。结果未知时保留表单，先刷新集合供用户核对，不自动重试、不按昵称猜测已创建角色，也不自动选中猜测结果；发言的幂等冻结规则不能套用于角色创建。

旧 single 接口的 compatibilityIdentity／compatibilityIdentityId 仅是内部兼容映射，迁移保留原 ID、快照和别名；归档后不自动改指其他角色。旧 GET／PUT／CLEAR 的限定行为保留，无映射 CLEAR 不创建、不占名额、不清其他角色。新端不能提供主角色设置，不能把该映射用作候选优先级或账号代表；defaultIdentityId 固定 null，新稿直接默认 ACCOUNT。关闭或撤资格后本人仍按 canDelete 删除未归档角色，canEdit 与 canDelete 分别判定。

## 提及源码与能力协商

v6 角色源为 `[@label](/users/{userId}?rpIdentityId={identityId})`，显式账号为 `[@label](/users/{userId}?identityMode=ACCOUNT)`；旧 `[@label](/users/{userId})` 保留 LEGACY 语义，不能称其为明确 ACCOUNT。源码 label 按 1–32 个 Unicode 码点校验，不按 UTF-16 单元计数；合法 24 个 emoji 昵称须可插入、编辑和复制。使用规范相对路径及唯一精确参数；混合、重复、未知参数或非法角色 ID 按契约拒绝，不落回普通 @ 扫描。跨主题粘贴后发布须重新验证，云草稿只保存合法语法，不证明角色使用权。

- `/meta.capabilities.roleMentionsV6Supported` 和 `roleMentionsV6WriteEnabled` 缺失均为 false。supported 为 true 时新端读取带 `X-Markdown-Contract-Version: 6`，初始主题／发言／编辑／BODY／子贴／aggregate／云草稿八个写 DTO 始终带整数 `markdownContractVersion: 6`，包括删光旧角色节点；读取头不能替代写声明。旧后端不支持时不发送未知 DTO 字段。首次创建主题的 CreateThreadDto.content 同样声明能力；此时尚无本帖角色，允许合法显式 ACCOUNT 提及，跨主题 RP 仍按 40012 拒绝。
- supported 为 true 时候选始终请求 includeIdentities=true。gate 开启才返回平级账号与角色，最多 20 个目标；gate 关闭 users 为空，不回退旧候选，以既有状态组件简短反馈“暂时无法提及用户”，区别于暂无匹配。仅 supported=false 的旧后端兼容期使用旧候选；@全体玩家按原独立权限，不随 users 为空关闭。
- 新提交或原存正文任一含 v6 源而未声明能力，返回 409／MARKDOWN_CAPABILITY_REQUIRED（40014），不得用旧端降级副本覆盖原文。gate 关闭只拒新增的 sourceHref＋label 键，返回 409／ROLE_MENTIONS_DISABLED（40015）；具备能力仍可保留、重排、复制或删除原节点，普通正文和旧 bare 源不因声明 6 受阻。失败保留输入，不自动降级重试。
- header6 保留授权可读原 content 与稳定目标，仅当前显示按开关及权限投影；无 header6 的响应副本把新版节点降成安全账号 bare 链接与账号称呼，不夹带角色 sourceHref／label／targetIdentityId，不改数据库。此边界覆盖 BODY、楼层、回复、聚合、搜索、通知摘要和云草稿；账号注销、拉黑及主题失权仍执行原可见性。
- 富文本 HTML 复制以成对 `data-wenyou-mention-source-href` 和 `data-wenyou-mention-source-label` 保存规范 href 与完整 @原label；严格校验后恢复，不能信任单属性或视觉文字。编辑与站内结构化 payload 保留原源，渲染文字和 text/plain 用当前显示投影。
- 普通 `.md`／`.txt` 档案为安全显示副本，不是无损回写源；关闭时显示账号。header6 的导出额外提供 `identity-sources.json`，保存原 content、插入 label、稳定目标及当前投影，并明确关闭时原源仍含历史称呼。无 header6 不提供清单，所有文件仍须主题授权。

兼容后端、可读保源消费者、新写激活分阶段交付。全局 `/meta.markdownContractVersion` 仍为 5；不能仅升全局版本让旧 App 被锁出。新写默认关闭，激活须两端通过隔离验收并独立批准；回滚关闭新写但保留可读、旧写保护与原存数据，不退回会破坏新源的服务端。

## 历史、开关与资格

- 修改昵称、头像只影响之后发言；历史作者、已发表 @ 与结构化回复来源保留各自快照。不同主题互不影响，子贴不另建身份。
- 清空指定角色两项资料后，该角色不能用于新 RP 发言，其他有效角色不受影响；旧快照保留。空角色仍占名额且可编辑，删除归档才释放名额。删除不删除旧快照、别名与必要媒体引用，稳定 ID 不复用。
- 取消玩家标记后仍为楼主或协作者的，保留设置资格。失去全部资格后，后续按原有权限使用站内身份，旧发言保留历史展示。楼主不能代玩家修改资料。
- 楼主关闭时，全帖结构化作者、@、回复来源和身份卡恢复站内资料；RP 资料与历史保留。卡片展开、旧候选或离线缓存不能继续展示被关闭的 RP 信息。
- 开启前、关闭期间及主动选择站内身份的普通发言均不追溯套用身份。重新开启后，过去采用 RP 的发言恢复各自快照。
- 关闭前明确确认：“全帖将显示站内资料，角色资料与历史记录保留。”取消不写入；失败保留原状态并反馈，不以开关动画代表提交成功。
- 禁用是展示屏蔽，不是历史清理。治理移除媒体、访问权限失效独立生效，重新开启不能恢复已禁止图片或越过主题可见性。

## 草稿、确认与兼容

发表身份必须与编辑器呈现一致。草稿保留正文、结构化节点及必要上下文；账号切换按既有草稿隔离规则处理。

- 选择 RP 写作期间功能关闭、全部资格撤销或身份上下文变化时，停止本次发布，保留草稿并提示“发表身份已变化”，显示最新身份预览。用户确认后使用最新上下文重试，不自动换身份重发。
- 身份确认凭据按正式 Backend 契约取得并原样回传，本地名字、头像不能替代授权及并发校验；根据结构化错误处理，不匹配错误文案猜测原因。
- 新建楼层、楼中楼、子贴和首次 BODY 使用已提交 DTO 的 identityMode（ACCOUNT／RP）、identityId 及该角色 identityToken。新建主题尚未开放帖内身份，首正文沿用站内账号；编辑已有正文忽略新 mode、identityId 与 token。
- 选择 RP 但不可用、缺少 token 或确认 token 失效时，返回 HTTP 409／RP_IDENTITY_CHANGED（40011）并保留草稿；不能改为站内身份自动重试。明确 ACCOUNT 忽略 RP identityId 与 token，不因 RP 开关、资料或资格变化而发生 RP 确认冲突，但仍实时检查发言权限。RP 冲突后重新读取集合及同 ID 角色，保留草稿并等待用户确认后发出新请求；新建正文、子贴及 aggregate 中首次 BODY 也遵守确认，编辑已有正文保持原作者。
- 旧客户端省略 identityId 时只使用旧 single 内部兼容映射，不从集合任选。省略 identityMode 且兼容路径无有效 RP、无 token 时沿用账号发表；有效兼容 RP 仍需原确认能力，不得把其他角色 token 当作兼容角色凭据。不能静默换身份、伪造确认或循环重试。能够处理新错误的客户端保留输入并说明恢复方式，不能承诺旧客户端已有保稿交互。
- token 绑定所选角色的独立作者版本、资格、开关和实际缺省资料，修改角色 B 或仅修改 A 的资料楼层绑定不改变角色 A 的 token；清空或删除已选角色仍需重新确认，不自动使用另一角色。
- 正常有效上下文直接发布，确认只用于身份变化等必要情况，不每次打断创作。
- 网络超时或结果未知时冻结 mode、identityId、token、Markdown 能力声明和待重试完整 payload 并复用同 clientRequestId；已成功请求返回原帖，之后改名或关闭也不生成重复发言。明确 409 未写入且用户重新确认身份后，使用新幂等键；同键不同正文、mode、identityId 或 token 仍是冲突，省略 mode 与明确 ACCOUNT 不视为同一输入；遵循 Backend 各端点的原幂等错误语义。未确认成功前不清空草稿，不用刷新后的身份自动重复提交。

首次 BODY 没有 clientRequestId；结果未知时保留并冻结完整输入，回读可展示保存结果，但相同正文不能证明请求归属，不自动补新 version 覆盖已保存正文。

## 访问与缓存

私密主题权限同样约束当前身份、历史快照、候选、搜索、通知补充和导出。知道账号 ID、角色名、旧头像 URL 或曾经访问过主题不能替代当前授权。

- 缓存至少区分账号会话、主题与 Markdown 读取能力，同角色资料另按 identityId 区分，不把 RP 资料写进全局账号实体；历史条目按内容绑定快照，不用当前作者映射覆盖历史。
- 受影响响应合并 Vary: X-Markdown-Contract-Version，不覆盖现有 Origin／Accept 等维度；新旧能力不能复用同一显示副本。
- 观察到开关、资料、资格、访问状态变化时，失效受影响的详情、分页、楼中楼、候选、筛选、身份卡、回复预览、搜索和导出缓存，同时更新已打开界面。
- 关闭时清除可展示的旧 RP 派生缓存并重读允许数据，保留草稿和服务端历史。访问丧失、退出或账号切换时撤下不可访问内容、关闭卡片并清理会话私有缓存。
- 旧请求迟到不得回填已关闭、切换账号或失去访问权的 RP 数据；按既有取消／版本边界丢弃不属于当前上下文的响应。
- 另一端至少在既有重验证时取得新状态，发布始终受服务端确认约束；不能把未实现的实时推送称作即时同步。

## 平台与验收

Web 复用 Popover／Dialog，支持键盘、焦点返回及窄屏；Mobile 使用安全区 Sheet、系统返回和 48dp 命中区。用户名用 body，头像圆形，控件、圆角、明暗、间距均消费既有 Foundation 契约，不新增近似 Token 或强行统一平台密度。

[固定场景](../tests/thread-identity-semantics-fixtures.json)是稳定 ID 的验收描述，不是 HTTP DTO、执行器或实际画面证据：

| 关注点 | 场景 ID |
| --- | --- |
| 资格、范围、设置 | `eligible-owner`、`eligible-collaborator-player`、`ineligible-reader`、`scope-topic`、`avatar-only`、`nickname-only`、`settings-failure` |
| 历史与状态 | `profile-snapshot`、`body-edit`、`clear-identity`、`partial-role-revoke`、`all-roles-revoke`、`disable-mask`、`reenable-history` |
| 选人与卡片 | `mention-snapshot`、`duplicate-alias`、`filter-account`、`identity-card-history`、`reply-source`、`system-role-badge` |
| 精确协议衔接 | `mention-node-key`、`mention-invalid-label`、`identity-single-field-clear`、`ordinary-account-fallback` |
| 逐次身份选择 | `per-post-mode`、`draft-mode-restore`、`account-mode-rp-change` |
| 草稿与兼容 | `compose-context-change`、`legacy-confirmation`、`unknown-submit-result` |
| 权限、媒体、缓存 | `private-visibility`、`cache-context`、`late-response`、`moderated-avatar`、`notification-boundary`、`search-export` |
| 行内操作与未配置入口 | `identity-row-actions`、`unconfigured-identity-affordance` |
| 多身份与旧接口兼容 | `identity-limit-race`、`identity-delete-slot`、`empty-identity-slot`、`legacy-primary-anchor`、`draft-role-binding`、`role-token-isolation`、`identity-card-role-match`、`account-mention-compat` |
| 平级角色与能力兼容 | `new-draft-account`、`account-directory-projection`、`equal-identity-mentions`、`mention-role-roundtrip`、`mention-role-lifecycle`、`mention-capability-cache`、`legacy-role-edit-protection` |
| 身份资料与正文引用 | `profile-card-layout`、`profile-reference-scope`、`profile-live-content`、`profile-binding-edit`、`profile-unavailable`、`profile-compat-cache` |
| 平台与隔离 | `responsive-accessibility`、`isolated-acceptance` |

Foundation 只静态验证 JSON、结构、ID 与文档关联并执行仓库门禁。三端在实现测试中关联场景，功能、画面、负责人验收与旧客户端兼容分别记录。写入验收只用登记的独立数据库、Redis、上传路径与测试账号，验证身份和实际代理后执行，成功、失败、超时均清理。公开开发环境、localhost 或 Tailnet 都不是隔离证据。
