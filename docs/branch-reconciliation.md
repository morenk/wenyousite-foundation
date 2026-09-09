# 旧发布分支合并核验

负责人于 2026-09-09 确认暂留分支已人工验证，授权合并并清理。

`release/2.4.2` 的提交 `7e7d863ca40c0642f95cdad41901b1b0bd214c5a` 修复语义图标被较大触控区域拉伸的问题。该修复已经由 `3107b25bda6c62887860070a2fd847b0a1a2c04b` 进入主线并作为 3.0.1 发布，后者是合并前 `main` 的祖先。

核验结果：

- 两个修复提交的 `packages/flutter/lib/src/wenyou_icons.dart` 和 `packages/flutter/test/wenyou_icons_test.dart` 文件内容分别完全一致。
- `scripts/generate.mjs` 的修复增删行完全一致，主线仍生成 `Align` 包装和声明尺寸。
- 旧分支的其余改动为 2.4.2 版本号、对应生成哈希、同一修复的变更说明和 Flutter 测试依赖；后续主线已具备对应实现与测试。

本次使用保留主线内容的合并补齐旧分支祖先关系，合并提交的文件树与合并前 `origin/main` 完全一致。仅本核验记录作为文档追加；不降低 6.9.0 版本，不修改契约、生成产物、既有 Tag 或 Release，也不发布或部署。
