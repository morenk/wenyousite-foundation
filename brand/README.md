# 温油站品牌资源

本目录是品牌图形与平台应用图标的唯一资源事实源。源稿位于 `masters/`，平台交付物分别位于 `app/android/`、`app/apple/` 与 `web/`，Flutter 页面运行时只消费透明标识源稿的生成副本。

- 品牌底色与前景色分别消费 `palette.primary`、`palette.brandStrong`。
- 标识由“文”字与油管加油枪构成，不得拆分、换色、加阴影或重新描摹。
- 带相邻可见“温油站”文字时标识为装饰；单独出现时必须提供明确语义标签。
- 字形使用 LXGW WenKai，许可证见 `licenses/LXGWWenKaiLite-OFL.txt`。
- 平台资源必须由本目录同步，不从设计工具导出目录或客户端仓库反向回填。

尺寸、透明度、安全区与校验和由 `pnpm check` 验证。
