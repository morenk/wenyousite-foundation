// 由 contracts/foundation.v1.json 生成，禁止手改。
import 'package:flutter/material.dart';

abstract final class WenyouFoundationVersion {
  static const String value = '1.0.2';
  static const int schema = 1;
}

abstract final class WenyouFoundationPalette {
  static const Color background = Color(0xFFFFFFFF);
  static const Color foreground = Color(0xFF342F3E);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color primary = Color(0xFFF3C6DD);
  static const Color onPrimary = Color(0xFF704C65);
  static const Color brandStrong = Color(0xFF704C65);
  static const Color secondary = Color(0xFFC7CCFF);
  static const Color onSecondary = Color(0xFF4B527C);
  static const Color muted = Color(0xFFF7F5F8);
  static const Color mutedForeground = Color(0xFF6D6775);
  static const Color accent = Color(0xFFF7DBEA);
  static const Color onAccent = Color(0xFF68455D);
  static const Color border = Color(0xFFE8E3EB);
  static const Color input = Color(0xFFDCD5E0);
  static const Color destructive = Color(0xFF8A3F50);
  static const Color onDestructive = Color(0xFFFFFFFF);
  static const Color destructiveSoft = Color(0xFFF8D2D8);
  static const Color success = Color(0xFF3D6650);
  static const Color successSoft = Color(0xFFC8E8D6);
  static const Color warning = Color(0xFF6B5A19);
  static const Color warningSoft = Color(0xFFF7E7A9);
  static const Color info = Color(0xFF4B527C);
  static const Color infoSoft = Color(0xFFC7CCFF);
  static const Color categoryDeduction = Color(0xFF7B5D22);
  static const Color categoryDeductionSoft = Color(0xFFFAEDBB);
  static const Color categoryNation = Color(0xFF4B527C);
  static const Color categoryNationSoft = Color(0xFFDDE0FF);
  static const Color categoryRpg = Color(0xFF704C65);
  static const Color categoryRpgSoft = Color(0xFFF7DBEA);
}

abstract final class WenyouFoundationTypography {
  static const String body = 'Wenyou Noto Sans SC';
  static const String display = 'Wenyou LXGW WenKai';
  static const String utility = 'Wenyou Nunito';
  static const List<String> chineseFallback = <String>['Noto Sans SC', 'sans-serif'];
}

abstract final class WenyouFoundationMotion {
  static const Duration fast = Duration(milliseconds: 120);
  static const Duration standard = Duration(milliseconds: 180);
  static const Duration slow = Duration(milliseconds: 240);
}

abstract final class WenyouFoundationMobile {
  static const double minimumTouchTarget = 48.0;
  static const List<double> spacing = <double>[4.0, 8.0, 12.0, 16.0, 20.0, 24.0, 32.0];
  static const double space4 = 4.0;
  static const double space8 = 8.0;
  static const double space12 = 12.0;
  static const double space16 = 16.0;
  static const double space20 = 20.0;
  static const double space24 = 24.0;
  static const double space32 = 32.0;
  static const double radiusCompact = 12.0;
  static const double radiusControl = 16.0;
  static const double radiusPanel = 20.0;
  static const double radiusPill = 999.0;
  static const double compactHorizontalPadding = 12.0;
  static const double regularHorizontalPadding = 24.0;
}

abstract final class WenyouEditorContract {
  static const Map<String, String> labels = <String, String>{
    'heading': '正文样式',
    'bold': '粗体',
    'italic': '斜体',
    'strikethrough': '删除线',
    'image': '图片',
    'draft': '正文草稿',
    'more': '更多',
    'link': '链接',
    'inline-code': '行内代码',
    'quote': '引用',
    'bullet-list': '无序列表',
    'ordered-list': '有序列表',
    'hr': '分隔线',
    'dice': '骰子',
    'task-list': '任务列表',
    'code-block': '代码块',
    'table': '表格',
  };
  static const List<String> primary = <String>['heading', 'bold', 'italic', 'image', 'more'];
  static const List<String> wideAdditions = <String>['strikethrough', 'draft'];
  static const List<String> moreSheet = <String>['link', 'inline-code', 'quote', 'bullet-list', 'ordered-list', 'hr', 'dice', 'draft', 'strikethrough'];
  static const List<String> syntaxOnly = <String>['task-list', 'code-block', 'table'];
  static const List<int> creatableHeadingLevels = <int>[2, 3];
}
