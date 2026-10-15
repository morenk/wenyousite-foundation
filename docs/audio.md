# 音频文件与正文播放器

机器事实源为 `contracts/foundation.v1.json` 的 `experiences.audio`；Web 从 `@wenyousite/foundation/audio` 消费生成常量，Flutter 从 `WenyouAudioContract` 消费。本文解释体验，不复制接口 Schema 或存储限制。

## 已提交接口来源

[Backend 62d1918b 音频契约](https://github.com/morenk/wenyousite-backend/blob/62d1918b437c2d5c992b70f8fceb81466878f2b6/docs/audio-upload.md)及同提交 [OpenAPI](https://github.com/morenk/wenyousite-backend/blob/62d1918b437c2d5c992b70f8fceb81466878f2b6/contracts/openapi.json)拥有接口事实。上传 purpose 精确为 `RICH_CONTENT_AUDIO`；`meta.audioUpload` 缺失时隐藏入口。播放器精确匹配 `mediaAudios.sourceUrl`，使用可信投影中的时长，不探测陌生 URL。当前对象沿用图片的公开 URL 语义，帖子访问控制不撤销已知媒体 URL，不能宣称音频私有。输入上限和标准播放副本以该来源为准，不写入 Foundation Token。

## 上传与工具栏

- 入口使用 `editor.audio`，打开系统文件选择器，不提供录音。默认位于展开工具栏；用户可直接拖动调整位置。
- 回复和主题共用一份本机布局；网页与 App 分别保存。设置预览复用真实编辑器的宽度、容量、溢出、固定按钮及能力过滤，不出现模式切换、横向滚动或额外分组说明。
- 格式、大小、时长、处理状态与可用 URL 以 Backend 已提交契约为准。客户端保留正在编辑的正文，上传或处理失败就近提供必要错误与重试；不得把失败上传当作成功正文提交。

## 正文呈现

播放器是一段正文内的紧凑内容，宽度跟随正文；使用现有 `surface`、`foreground`、`mutedForeground`、`brandStrong`、`compact` 圆角及 body/utility 排版角色。控制命中区遵守平台现有下限，移动端至少 48dp。不新增主题、装饰封面、大卡片或假波形。

常驻操作只有播放／暂停、可调整的进度与已播／总时长；文件名只在区分音频等必要场景显示，长名称允许省略但无障碍名称完整。错误、处理中与加载状态靠近对应音频，不叠加常驻说明。窄屏和系统文字放大时允许自然换行，不能压缩操作命中区；明暗模式保持相同层级。

只有 Backend 可信媒体投影与规范正文位置匹配时才升级为播放器。普通外链、内联链接、列表及引用内链接保持原有语义，用户修改过的链接文案不丢失。缺少投影、未知音频或旧客户端均保留普通链接，不根据扩展名猜测播放器。具体识别和往返边界以 [Backend 固定语料](https://github.com/morenk/wenyousite-backend/blob/62d1918b437c2d5c992b70f8fceb81466878f2b6/contracts/markdown-audio-v1-fixtures.json)为准；本仓库 [原样副本](../contracts/fixtures/markdown-audio-v1-fixtures.json)与 [来源及校验和](../contracts/fixtures/audio-source.json)仅供跨端验收，不另建语法事实源。

## 加载与生命周期

- 挂载播放器、滚动经过或渲染信息流不获取音频资源；只有明确点击播放才加载，Web 使用 `preload=none`。可用时长来自可信元数据，不为显示时长单独下载媒体。
- 同页只允许一个音频活动播放，启动另一条先暂停上一条。页面失活、进入后台或音频中断即暂停；恢复前台不自动续播。
- 列表只显示摘要，不挂载播放资源、不自动播放。播放使用服务端提供 URL 和原生范围加载；不得拼接衍生 URL、拉取整页音频或为了进度下载完整文件。
- 网络、资源或解码失败保留上下文，提供显式重试；不无限自动重试。卸载后释放播放句柄并取消过期回调，防止离页后继续播放。

## 无障碍与验收

播放／暂停名称随状态变化；进度控件提供 adjustable/slider 语义和当前值。键盘、触屏、读屏均可操作，时间不逐秒打断读屏，只在用户操作时播报；错误不只用颜色表达。继承系统减少动态效果。

消费者定向验证必须覆盖：首次点击前无音源请求、单页互斥、后台及离页暂停、失败重试、拖动进度、长文件名、窄屏／明暗／文字缩放、普通链接降级及草稿保存重开。Foundation 的定向验证检查语义图标资产、生成物与行为契约；不能代替消费者交互和视觉验收。

## 发布边界

本分支为未发布候选，现有 `v7.2.1` Tag 不变。新增语义图标及生成常量须经负责人明确决定版本、合并和正式 Tag 后，客户端通过独立升级提交消费；不能用未发布提交或复制资产绕过发布规则。本轮不创建 Tag/Release、不部署、不运行全量检查或门禁。
