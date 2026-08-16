# 核心元素系统

本规范治理正文与元数据中的最小可复用视觉单元。机器事实源为 `contracts/foundation.v1.json` 的 `experiences.elements`；业务协议、页面布局、卡片和浮层仍由各自生产者或既有契约拥有。

## 共同边界

- 状态与类别不能只靠颜色表达；文字、图标、前缀或结构至少保留一种非色彩线索。
- 阅读态与编辑态使用等价元素。编辑器中的传送门保持原子编辑并阻止导航，发布后才按链接行为打开目标。
- 非交互 Badge 按内容收缩，不为视觉对齐伪造点击命中区；独立可点击元素服从 Web 32px、Flutter 48dp 的平台下限。
- Markdown、站内坐标与通知数量仍由后端/API 契约拥有；分类接口中的历史颜色字段不参与客户端呈现。

## 正文内联与块级元素

| 元素 | 识别线索 | 核心呈现 |
| --- | --- | --- |
| 站内传送门 | `content.internal-reference` 门图标 | 柔粉轻量内联胶囊、可换行、不截断；hover/pressed 使用共享状态层 |
| 普通链接 | 下划线 | 品牌深色、600 字重；外链在新标签页打开 |
| 提及 | `@` 前缀 | 品牌深色、无底色；编辑态作为原子语义 |
| 行内代码 | 等宽字形 | 中性浅底、紧凑内边距，不生成块级卡片 |
| 骰子 | 数值或 `?` | 已结算使用品牌色对，待掷使用警告色对与问号 |
| 引用 | 3px 语义侧线 | 中性浅底、正常字形，不强制斜体 |
| 分隔线 | 水平结构 | 1px `border`，不使用装饰渐变 |

## 元数据元素

- Badge 只有 `default` 与 `compact` 两种尺寸，tone 固定为 `neutral`、`brand`、`success`、`warning`、`danger`、`info`；所有 tone 复用既有色对。
- 主题标签是可点击浏览入口，以 `#` 提供文字线索并使用中性描边；Web 命中高度不小于 32px。
- 等级固定为 `Lv.N`，使用紧凑圆角和 utility 数字；未读数隐藏零值、超过 99 显示 `99+`。
- 分类不再使用专属色。Web 线路保持 4px 结构宽度并统一使用 `mutedForeground`；分类 Badge 复用 neutral tone，且必须同时显示类别文字。API 即使返回历史颜色值也应忽略。

## 生成物

- Web/TypeScript：`@wenyousite/foundation/elements` 导出元素样式、平台 profile、`ElementTone` 与 `BadgeSize`。
- Web/CSS：`web/tokens.css` 导出 `--element-*`。
- Flutter：`WenyouElementContract` 导出移动 profile 的尺寸、状态与分类中性呈现常量。
