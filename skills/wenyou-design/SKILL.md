---
name: wenyou-design
description: Apply and review 温油站's shared visual identity and platform-specific Web/Flutter design contracts. Use for new screens, UI redesigns, component styling, typography, color, layout, editor affordances, cross-platform visual alignment, screenshots, visual regression review, or any proposal that changes the product's appearance or interaction density.
---

# 温油站审美指导

## 读取事实源

先定位包含本 Skill 的 `wenyousite-foundation` 仓库根目录，再完整读取：

1. `contracts/foundation.v1.json`
2. `docs/foundation.md`
3. 目标为 Web 时读取 `docs/platforms/web.md`；目标为 Flutter 时读取 `docs/platforms/mobile.md`

任务涉及正文内联、引用、分隔线、状态徽标、标签、等级、未读数或分类标记时，还要完整读取 `docs/elements.md` 与 `experiences.elements`。

任务涉及头像、封面、正文图片、画廊、表情或大图查看时，还要完整读取 `docs/images.md` 与 `experiences.images`。

不得从本 Skill 记忆或重写色值、字体版本、能力清单或图标映射。目标仓库的锁定 foundation 版本与当前仓库不一致时，以目标仓库锁定版本为准；需要新语义时先更新中央契约并发布版本。图标任务还必须读取 `docs/icons.md` 与 `experiences.icons`。

任务涉及加载、提交、空结果、错误、无障碍、Dialog、菜单、Tooltip 或浮层时，还要完整读取 `docs/interaction.md`、顶层 `accessibility`、`experiences.feedback` 与 `experiences.overlays`。任务涉及全局导航、消息入口、用户可见名词或动作词时，还要读取 `docs/navigation-language.md`、`experiences.navigation` 与 `experiences.language`。

任务涉及按钮、字段、筛选、列表、详情、卡片、时间或紧凑数字时，还要完整读取 `docs/presentation.md`、`experiences.controls`、`experiences.collections.content` 与 `experiences.formatting`。

## 设计工作流

1. 明确页面的真实受众、单一主要任务和当前平台；检查现有页面、共享组件、Token 与视觉基线。
2. 写一个紧凑设计方向：颜色角色、字体角色、布局结构和唯一辨识元素。辨识元素必须承载真实内容或分类语义。
3. 对照共享基础自审：纯白画布、柔粉克制、信息不丢失、无虚假装饰、文案使用真实功能名称。
4. 对照平台 profile 落地：Web 保留桌面密度和键鼠效率；Flutter 保留单列、48dp 触控、安全区、文字缩放和系统返回。不要用像素相同替代体验一致。
5. 只消费中央 package 暴露的 Token、字体和体验契约。业务代码不得写近似色值、复制能力矩阵或建立第二套组件语义。
6. 用真实中文内容构建并截图自审。检查语义排版、层级、字形、对比度、溢出、焦点、空/错/加载态、pending 防重和减少动态效果；集合页面还要按 `experiences.collections` 检查列表容器与列表项占满分配列、短内容不收缩；图片任务还要检查裁切、比例预留、失败/受限状态、替代文本和完整查看出口；导航与反馈文案必须使用中央标签和稳定动词；删除不承载信息的装饰。
7. 运行目标仓库的设计门禁、组件测试和代表性视觉回归。涉及共享语义时，两端都必须评估，即使只修改一个客户端。

## 变更判断

- 现有 Token 能表达：直接复用，不改中央契约。
- 只影响一个平台的布局或输入方式：更新对应 platform profile，保持共享语义不变。
- 新增共享色彩、字体角色、文案语气或体验能力：先修改机器契约、生成产物和 CHANGELOG，再发布新版本并升级消费者锁。
- HTTP、错误码、Markdown 存储或推送字段：不进入本仓库，回到后端生产者契约。
