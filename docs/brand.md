# 品牌标识与应用图标

## 品牌表达

温油站的正式名称为“温油站”，品牌文案为“最温油的文字共创社区”。标识以“文”与油管加油枪组合表达文字共创和温油站名称；它是身份识别，不代替导航、状态或业务操作图标。

品牌标识使用柔粉 `primary` 表面与深莓 `brandStrong` 前景。名称和文案使用 LXGW WenKai 500；不得另建近似色、替换字形、添加渐变、阴影或持续动效。

## 移动端使用

- 原生启动画面只放静态标识和品牌底色，确保系统启动阶段简洁稳定；名称、文案及加载状态由 Flutter 第一帧呈现。
- Flutter 启动页标识为 96dp，名称与文案依次位于其下；认证入口为 48dp，首页标题栏为 24dp。
- 首页和认证入口已有相邻可见名称，标识作为装饰排除重复朗读。单独使用标识时必须通过 `WenyouBrandMark.semantic` 提供语义标签。
- 更新、错误、找回密码等任务页面不重复堆叠品牌标识。
- Android 使用 adaptive foreground/background、monochrome 与 legacy mipmap；Apple 使用静态 AppIcon 与 LaunchScreen 标识，不在 Foundation 任务中签名或发布客户端。

## 资源治理

`brand/masters` 保存 1024px 主源，`brand/app` 与 `brand/web` 保存平台交付物。Flutter package 生成 `brand_assets/runtime` 与只供客户端同步的 `brand_assets/platform`，消费者不得手改生成副本。

每次修改必须同时更新机器契约、生成物、资源清单与 CHANGELOG，并通过尺寸、alpha、安全区和哈希校验。设计导出目录、说明副本和重复许可证不进入发布资源树。
