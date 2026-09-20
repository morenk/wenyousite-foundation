# 时间格式化回归

`pnpm test:formatting` 在独立 Node 进程的 `UTC`、`Asia/Shanghai` 与 `America/New_York` 时区运行 `formatting-fixtures.json`；`pnpm check` 包含此检查。共享用例覆盖 60 秒、60 分钟、24 小时、72 小时边界、未来（含 1 毫秒未来）、跨年、UTC 输入的本地日期及夏令时。JavaScript 另外验证无效输入、Date/毫秒输入和不修改原始时间值。

Dart 使用同一份 JSON 及生成的纯 Dart 格式化模块，无需启动 Flutter。已有 Dart SDK 的 Linux/macOS 环境在仓库根目录执行：

```sh
TZ=UTC dart tests/formatting_test.dart
TZ=Asia/Shanghai dart tests/formatting_test.dart
TZ=America/New_York dart tests/formatting_test.dart
```

Dart 接口只接受有效 `DateTime`，无效字符串属于上游解析职责，因此不复刻 JavaScript 字符串输入的占位测试。没有 Dart SDK 时必须在交付中说明未执行，不能以 JS 通过声称跨语言运行验收完成。
