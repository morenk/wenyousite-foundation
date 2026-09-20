// 与 JavaScript 使用同一组用例，无需 Flutter 依赖即可执行。
import 'dart:convert';
import 'dart:io';
import '../packages/flutter/lib/src/foundation_formatters.dart';

void main() {
  final fixtures = jsonDecode(File.fromUri(Platform.script.resolve('formatting-fixtures.json')).readAsStringSync()) as Map<String, dynamic>;
  final timezone = Platform.environment['TZ'];
  final zones = fixtures['zones'] as Map<String, dynamic>;
  if (!zones.containsKey(timezone)) {
    throw StateError('请设置 TZ 为 UTC、Asia/Shanghai 或 America/New_York');
  }
  final cases = <dynamic>[...fixtures['common'], ...zones[timezone]];
  for (final fixture in cases) {
    final value = DateTime.parse(fixture['value'] as String);
    final reference = DateTime.parse(fixture['reference'] as String);
    final actual = <String, String>{
      'time': formatWenyouTime(value, reference: reference),
      'date': formatWenyouDate(value),
      'exact': formatWenyouExactTime(value),
    };
    for (final entry in actual.entries) {
      if (entry.value != fixture[entry.key]) {
        throw StateError('${fixture['name']} ${entry.key}: ${entry.value} != ${fixture[entry.key]}');
      }
    }
  }
  stdout.writeln('$timezone: ${cases.length} 组共享时间用例通过');
}
