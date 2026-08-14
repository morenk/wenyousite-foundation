# Foundation Changelog

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
