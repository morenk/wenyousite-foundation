// 由 contracts/foundation.v1.json 生成，禁止手改。
abstract final class WenyouFormattingContract {
  static const Duration relativeWindow = Duration(seconds: 259200);
  static const Duration justNow = Duration(seconds: 60);
  static const Duration minutesUntil = Duration(seconds: 3600);
  static const Duration hoursUntil = Duration(seconds: 86400);
  static const int compactCountFrom = 10000;
  static const int yiCountFrom = 100000000;
}

String _wenyouPad2(int value) => value.toString().padLeft(2, '0');

String formatWenyouExactTime(DateTime value) {
  final date = value.toLocal();
  return date.year.toString() + '-' + _wenyouPad2(date.month) + '-' + _wenyouPad2(date.day)
      + ' ' + _wenyouPad2(date.hour) + ':' + _wenyouPad2(date.minute);
}

String formatWenyouTime(DateTime value, {DateTime? reference}) {
  final date = value.toLocal();
  final now = (reference ?? DateTime.now()).toLocal();
  final difference = now.difference(date);
  if (!difference.isNegative && difference < WenyouFormattingContract.justNow) return '刚刚';
  if (difference >= WenyouFormattingContract.justNow && difference < WenyouFormattingContract.minutesUntil) {
    return difference.inMinutes.toString() + ' 分钟前';
  }
  if (difference >= WenyouFormattingContract.minutesUntil && difference < WenyouFormattingContract.hoursUntil) {
    return difference.inHours.toString() + ' 小时前';
  }
  if (difference >= WenyouFormattingContract.hoursUntil && difference < WenyouFormattingContract.relativeWindow) {
    return difference.inDays.toString() + ' 天前';
  }
  final datePart = date.year == now.year
      ? _wenyouPad2(date.month) + '-' + _wenyouPad2(date.day)
      : date.year.toString() + '-' + _wenyouPad2(date.month) + '-' + _wenyouPad2(date.day);
  return datePart + ' ' + _wenyouPad2(date.hour) + ':' + _wenyouPad2(date.minute);
}

String _formatWenyouCompact(num value, num divisor, String suffix) {
  final scaled = (value / divisor * 10).round() / 10;
  final digits = scaled == scaled.roundToDouble() ? 0 : 1;
  return scaled.toStringAsFixed(digits) + suffix;
}

String formatWenyouCompactCount(num value) {
  if (!value.isFinite || value < 0) return '—';
  final count = value.truncate();
  if (count >= 100000000) return _formatWenyouCompact(count, 100000000, '亿');
  if (count >= 10000) return _formatWenyouCompact(count, 10000, '万');
  return count.toString();
}
