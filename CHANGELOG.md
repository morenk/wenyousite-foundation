# Foundation Changelog

## 6.6.0

- `elements`：正文分隔线改为居中的 5em 短线与品牌圆点，以长度、位置和形状区别于楼层、卡片和列表项的满宽边界；Markdown thematic break 语义保持不变。
- `web`：新增分隔线颜色、短线宽度、圆点与纵向节奏 Token，供阅读态和编辑态统一消费，并同时覆盖亮色与黑夜模式。
- `mobile`：生成等价的线宽、短线宽度、圆点和间距常量；实际 Flutter 客户端升级仍须在 Windows 环境完成。
- `compatibility`：保留既有 `divider.color` 与 `divider.widthPx` 字段，新布局字段为兼容新增。

## 6.5.1

- `web`：修正黑夜系统偏好回退生成 CSS 末尾的多余闭合花括号，并新增 CSS 块结构门禁，避免无效 Token 样式进入消费者构建。

## 6.5.0

- `shared`：新增“跟随系统、亮色、黑夜”主题偏好契约与温暖墨紫黑夜色板；默认跟随系统，显式偏好由客户端本机持久化，图片与内容结构不随主题改变。
- `color`：拆分柔和容器 `primary`、主要行动 `actionPrimary` 与结构强调 `brandStrong`，并为两种模式校验正文、色对、控件边界和等级层次的对比度。
- `web`：生成显式主题选择器、系统偏好回退、`color-scheme`、黑夜阴影/遮罩和图片查看背景，并新增 `@wenyousite/foundation/theme` 供首屏解析与切换器消费。
- `mobile`：生成 `WenyouFoundationDarkPalette`、`WenyouFoundationTheme` 与黑夜等级契约；实际 Flutter 客户端升级仍须在 Windows 环境完成。
- `icons`：新增系统、亮色和黑夜三个外观语义图标，继续复用固定 Lucide 母版。
- `compatibility`：亮色视觉与既有公开 Token 保持兼容；新主题能力和主要行动角色均为兼容新增。

## 6.4.0

- `brand`：发布“文”与油管加油枪组合标识、应用图标和“最温油的文字共创社区”正式文案，资源按源稿、Android、Apple、Web 与 Flutter 运行时分层治理。
- `mobile`：固定启动页 96dp、认证入口 48dp、首页标题栏 24dp 的品牌尺寸与可访问性语义；原生启动层保持静态，完整文案进入 Flutter 第一帧。
- `generated`：新增 `@wenyousite/foundation/brand`、Flutter `WenyouBrandContract` / `WenyouBrandMark`、平台同步资源与品牌 Manifest。
- `governance`：新增 PNG 尺寸、透明度、Android adaptive 安全区、主色和全量哈希门禁，设计导出目录不再作为客户端依赖。

## 6.3.0

- `elements`：普通 Markdown 引用统一为中性浅底的书签纸条，以 2px/2dp 深莓起始侧线、近端直角和平台 compact 远端圆角取代厚线整卡呈现。
- `elements`：引用继承正文排版，收紧为 `0.5em/0.75em` 内边距并固定无生成引号、图标、阴影或强制斜体；首尾内容收口、多段结构保留正常节奏。
- `generated`：Web 补齐引用颜色与圆角 Token，Flutter `WenyouElementContract` 补齐引用颜色、尺寸、方向性形状和排版常量，客户端不再复制数字。

## 6.2.0

- `dice`：已结算原子节点保持 `{notation} = {total}` 无图标主文案，并新增无可见提示的逐骰明细披露；Web 使用锚定 Popover，Flutter 使用安全区 Bottom Sheet，长骰池按服务端顺序进入可滚动数字骰盘。
- `dice`：明细计算区统一显示骰面小计、非零正负修正和服务端总计；触发器改用简洁按钮语义，逐骰点数只在明细内逐项朗读，待掷与编辑态仍不可激活。
- `editor`：骰子插入器统一为骰子数、面数、修正三个字段，保留常用面数并实时预览 canonical 待掷表达式；业务范围仍由后端协议拥有。
- `elements`：骰子与站内传送门统一收紧为 1.5 内部行高和 0.04em 垂直内边距，不改变正文行高、字号、基线与既有色对。

## 6.1.0

- `collections`：移动端继续以单列为默认布局，并将动态主信息流双列瀑布流登记为唯一正式领域例外。
- `editor`：允许 Flutter Quill 编辑态行内代码使用渲染器原生背景边界；字体、字号、颜色、圆角以及所有阅读态内边距要求保持不变。
- `generated`：TypeScript 与 Flutter 导出移动领域布局例外和编辑器渲染例外，客户端无需复制例外字符串。

## 6.0.1

- `dice`：补齐跨端渲染合同。正文主文案统一为 `{notation} = {total}`，待掷统一为 `{notation} = ?`；逐骰点数与修正值进入完整可访问描述，不再让多骰明细撑破正文行宽。
- `dice`：固定为无图标、基线对齐、内部不换行且不截断的内联原子节点；阅读态与编辑态等价，节点仅按 `nodeId` 绑定服务端不可变结果，缺失结果不得由客户端伪造。

## 6.0.0

- `typography`：文楷收敛到品牌、结构标题、详情内容标题和文字封面，并统一使用真实 500 字重；列表项、弹层、状态、用户名、控件和富文本标题使用 Noto Sans SC。
- `content`：新增列表/详情语义槽位与内容优先表面规则，详情正文保持连续阅读流，禁止无意义嵌套卡片。
- `controls`：新增操作层级、字段骨架、选择模式、进度与跨端命中区合同。
- `interaction`：固定 Skeleton/Spinner 分工、刷新保留内容、浮层任务重量、风险分级确认与克制功能型动效。
- `identity`：新增头像降级、职责型角色 tone 和内容状态 tone；邮箱验证明确不作为公开身份展示。
- `level`：Lv.1–9 使用雾灰、杏桃、玫瑰、珊瑚、深莓五档暖色渐进，等级进度跟随当前档并通过对比度校验。
- `formatting`：列表与详情统一使用 72 小时相对时间窗口，之后按是否跨年回退绝对时间；新增“万/亿”紧凑计数及 TS/Dart 等价格式化接口。
- `generated`：新增 `controls`、`formatting` 导出、等级 CSS Token、Flutter 等级/身份合同和格式化函数；Schema 升级为 2。

## 5.1.0

- `shared`：图标 Toggle 改为透明静止容器；hover/focus 使用 10% 当前语义色圆形状态层，pressed 使用 15%，选中关系只由图标颜色、填充和平台状态语义表达。
- `icons`：点赞保留鲜粉实心心形，收藏保留金色实心书签，新增品牌深紫实心铃铛的主题帖订阅 tone 与 `action.subscribe` / `action.unsubscribe` 语义。
- `generated`：删除 `likeSoft`、`bookmarkSoft`，为 heart、bookmark、bell 生成同路径实心 SVG 变体，并向 TypeScript 与 Flutter 图标接口公开 outline/filled 选择。
- `accessibility`：专色互动图标限制在已校验的中性表面；无图形变化的普通 Toggle 必须提供可见状态文字，计数和辅助文字保持中性。
- `compatibility`：本次按产品版本要求保留在 5.x；删除的两个公开色彩 Token 需要消费者升级时同步迁移。

## 5.0.0

- `elements`：主题帖分类 API 删除颜色字段后，移除 Foundation 中用于兼容历史字段的 `apiColorBehavior` 语义。
- 分类线路与 Badge 继续使用 Foundation 中性呈现，不改变既有布局和文字线索。

## 4.0.0

- `elements`：移除主题帖分类专属色语义；分类线路统一使用中性前景，分类 Badge 复用 neutral tone，客户端忽略 API 历史颜色值。
- `generated`：以 `--element-category-marker-foreground` 与跨端中性呈现常量替代分类 Badge 透明度常量。

## 3.2.0

- `shared`：新增核心元素系统，统一传送门、普通链接、提及、行内代码、骰子、引用、分隔线以及五类元数据元素的语义、状态和跨端边界。
- `web`：站内传送门改为可换行的轻量内联胶囊；Badge、主题标签、等级、未读数与分类线路获得统一尺寸和无障碍线索。
- `mobile`：生成 `WenyouElementContract` 供本地 Windows 客户端后续升级消费；本次不修改移动端仓库。
- `generated`：新增 `@wenyousite/foundation/elements`、`--element-*` CSS Token、`content.internal-reference` 同源 Lucide 图标与 Manifest `elements` 能力。

## 3.1.0

- `shared`：新增点赞鲜粉与收藏金色的互动语义色对，未选中、普通选中、危险命令、状态层、禁用与 pending 行为进入机器契约。
- `icons`：点赞与收藏选中态使用同一 Lucide 图形的实心状态和极浅同色容器；只读指标、导航目的地和辅助计数不继承互动色。
- `generated`：Web 新增互动色与状态层 CSS Token，TypeScript 导出 `ICON_CONTROL_STATES`，Flutter 生成对应色彩与 `WenyouIconControlContract`。
- `accessibility`：校验互动图标在白底和选中容器上的非文字对比度，并要求辅助文字保持普通文字对比度。

## 3.0.1

- `mobile`：语义 SVG 在输入框、图标按钮与导航等较大约束容器内保持声明尺寸居中，不再被 48dp 触控区拉伸。

## 3.0.0

- `editor`：结构化正文能力改为工具栏能力白名单，移除任务列表、代码块和表格的产品能力声明。
- `shared`：绑定 Markdown v3；客户端对工具栏外结构静默降为字面文本，API 严格拒绝，列表嵌套最多三层。
- `generated`：Web 与 Flutter 编辑器契约导出新的内容策略，不再生成 `syntaxOnly` 或源码保留生命周期。
- `governance`：这是删除既有表格原生渲染与工具栏外语法承诺的主版本变更。

## 2.4.1

- `shared`：补齐确认、拖动排序和移除标签三个交互语义，避免全量迁移时误用状态类图标。

## 2.4.0

- `shared`：扩展移动端全量迁移所需的业务语义图标，明确回复、评论、浏览、点赞、参与者与加油等指标的跨端映射。
- `shared`：补齐内容类型、身份、经济、审核、安全和状态语义；交互动作与只读指标不再共用含义相近但方向不同的图形。
- `mobile`：Flutter 生成物新增完整语义常量与同源 Lucide SVG 资产，为产品代码禁止直连 Material 图标提供唯一事实源。

## 2.3.0

- `mobile`：编辑器一级栏改为按实际宽度逐项提升能力，固定“正文草稿、引用、分隔线、表情包”的提升顺序。
- `mobile`：提升后的能力从“更多”中去重，并以 48dp 最小操作尺寸计算容量；存在提交按钮时自动减少提升项，保持单行无横向滚动。
- `generated`：Flutter `WenyouEditorContract` 新增核心操作、提升顺序与最小操作尺寸常量。

## 2.2.0

- `shared`：新增语义排版、资源与 Mutation 反馈状态、无障碍最低要求、浮层层级、导航目的地和稳定界面词汇契约。
- `web`：生成排版、断点、阴影、遮罩与九级浮层 CSS Token，并固定桌面导航和账户快捷入口语义。
- `mobile`：生成语义排版、页面宽度、反馈、无障碍、elevation、导航与界面语言常量；实际客户端升级仍须在 Windows 环境完成。
- `generated`：新增 `typography`、`interaction`、`navigation`、`language` Web 模块及类型声明，Manifest 记录全部生成产物校验和。
- `governance`：Foundation Schema 严格覆盖全部契约分支，`pnpm check` 同时执行正向校验和反向失败用例；生成器不再写死阴影与贴纸上限。

## 2.1.0

- `shared`：通知中心固定为“互动、订阅、系统”三组筛选，并明确“全部”默认入口与未知事件降级语义。
- `generated`：新增 Web 通知契约导出和 Flutter `WenyouNotificationContract`，客户端不再复制分组名称与事件成员。
- `governance`：通知事件协议继续由后端拥有，Foundation 只负责跨端展示分组。

## 2.0.0

- `shared`：新增 Lucide 1.28.0 双层图标契约，以产品语义映射到固定 SVG 母版，并统一尺寸、状态与无障碍策略。
- `web`：生成类型化图标节点和编辑器 SVG 字符串，普通组件与第三方编辑器可以消费同一图形来源。
- `mobile`：由 Material Icons Rounded 迁移到 Foundation 打包的同源 SVG，并提供语义化 `WenyouIcon` 组件。
- `governance`：图标来源、版本、许可证与每个 SVG 校验和进入发布清单，避免跨端封装或手写路径漂移。

## 1.3.1

- `mobile`：内容编辑器固定 `page`、`expandableSheet`、`inline` 三种承载面，软键盘可见时将核心工具栏 dock 在键盘上方。
- `mobile`：核心工具保持响应式单行且禁止横向滚动；次级能力改为编辑器内部 inline 渐进披露，展开和执行时保留选区、焦点与软键盘。

## 1.3.0

- `shared`：扩充编辑器能力生命周期，逐项固定创建入口、结构化/原子编辑、渲染与往返保障；未知协议和暂不支持语法必须保留源码。
- `web`：固定 50rem 编辑器框架、680px 正文测量宽度、正文与工具栏首列基线，以及四档工具栏收纳矩阵。
- `mobile`：统一阅读态与编辑态为 17sp、1.8 倍行高，记录紧凑/常规正文内边距，并补充提及与表情包条件能力。
- `generated`：Web 与 Flutter 产物新增编辑器布局、上下文能力和平台能力生命周期常量。

## 1.2.1

- `flutter`：将包描述改为 ASCII，避免 Windows 上 Dart Pub 通过 `git show` 读取含中文的 `pubspec.yaml` 时错误吞并换行，确保 Git tag 依赖可以稳定解析。

## 1.2.0

- `shared`：新增集合布局契约，固定列表容器与列表项占满分配列，短内容不得改变卡片宽度。
- `shared`：明确消息气泡、标签、徽标与紧凑操作是允许按内容收缩的语义例外。
- `web/mobile`：分别固定 Tabs 面板/明确网格与移动单列的列表宽度边界。

## 1.1.0

- `shared`：新增头像、封面、正文、画廊缩略图和收藏表情的跨端图片呈现契约。
- `web/mobile`：分别固定 lightbox 与全屏手势查看的等价体验边界。
- `skill`：图片任务强制读取图片契约并检查裁切、占位、状态、替代文本和退出路径。

## 1.0.2

- Web 包与 Flutter package 随自托管字体分发对应 OFL 文本。
- Flutter Token 生成具名间距常量，消费者不再依赖数组位置。

## 1.0.1

- 为编辑器契约补充通用默认导出条件，兼容 `tsx` 等运行时解析器。

## 1.0.0

- `shared`：确立纯白画布、柔粉主色、三角色自托管字体与克制的线路视觉语言。
- `web`：迁入桌面布局、阅读排版、控件密度与编辑器自适应工具栏规范。
- `mobile`：由高饱和粉白主题切换为共享色板和字体，保留 48dp 触控、单列布局与底部面板。
- `shared`：集中编辑器能力矩阵；HTTP 与 Markdown 存储协议继续由后端维护。
