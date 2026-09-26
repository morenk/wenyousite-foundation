# 移动端阅读快翻（兼容组件）

本页由 experiences.readingQuickScroll.mobile 生成，完整保留 v7.1.2 已发布字段、数值与主动开启行为，供已有消费者稳定升级；新页面使用[自适应阅读滑块](adaptive-reading-scroll.md)，不复用本兼容组件。

## 几何与视觉

- 右侧悬浮轨道在扣除固定标题、底部操作、发表按钮和系统安全区后的正文区域垂直居中，最大长度 360dp；正文宽、高和顶部阅读锚点不因显隐改变。
- 轨道 2dp、透明度 0.24，不接收触摸且没有整轨背景。滑块 8×40dp，局部底衬 24×48dp；命中区至少 48×48dp，不随内容长度缩小。
- 滑块与轨道使用主题 brandStrong，局部底衬使用 surface、透明度 0.92，圆角复用 pill；标签和操作卡使用不透明 surface 与 foreground。

## 兼容边界

- READING_QUICK_SCROLL_MOBILE_PROFILE 与 WenyouReadingQuickScrollContract 保持 v7.1.2 完整源码 API，不添加弃用注解，不指向新形状。
- 既有消费者仍可使用 action.reading-quick-scroll 显式入口、局部操作卡与原始映射；这不代表新页面可以恢复该入口。
- 新能力独立消费 experiences.adaptiveReadingScroll.mobile、ADAPTIVE_READING_SCROLL_MOBILE_PROFILE 与 WenyouAdaptiveReadingScrollContract。
