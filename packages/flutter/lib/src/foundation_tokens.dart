// 由 contracts/foundation.v1.json 生成，禁止手改。
import 'package:flutter/material.dart';

abstract final class WenyouFoundationVersion {
  static const String value = '1.3.1';
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

abstract final class WenyouCollectionContract {
  static const bool fillAvailableWidth = true;
  static const bool narrowContentKeepsItemWidth = true;
  static const Set<String> contentSizedExceptions = <String>{'message-bubble', 'chip', 'badge', 'compact-action'};
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
    'mention': '提及',
    'sticker': '表情包',
  };
  static const List<String> primary = <String>['heading', 'bold', 'italic', 'image', 'more'];
  static const List<String> wideAdditions = <String>['strikethrough', 'draft'];
  static const List<String> surfaces = <String>['page', 'expandableSheet', 'inline'];
  static const String keyboardToolbarPlacement = 'above-keyboard-dock';
  static const String primaryLayout = 'responsive-single-row';
  static const String horizontalOverflow = 'forbidden';
  static const String morePresentation = 'inline';
  static const List<String> moreInline = <String>['link', 'inline-code', 'quote', 'bullet-list', 'ordered-list', 'hr', 'dice', 'sticker', 'draft', 'strikethrough'];
  static const List<String> contextual = <String>['mention', 'sticker'];
  static const List<String> syntaxOnly = <String>['task-list', 'code-block', 'table'];
  static const List<int> creatableHeadingLevels = <int>[2, 3];
  static const double compactContentInlinePadding = 4.0;
  static const double regularContentInlinePadding = 16.0;
  static const double toolbarHorizontalPadding = 4.0;
  static const double bodyFontSize = 17.0;
  static const double bodyLineHeight = 1.8;
  static const bool respectsSystemTextScale = true;
  static const Map<String, Map<String, String>> capabilities = <String, Map<String, String>>{
    'heading': <String, String>{'creation': 'primary', 'editing': 'structured', 'rendering': 'native', 'roundTrip': 'structured'},
    'bold': <String, String>{'creation': 'primary', 'editing': 'structured', 'rendering': 'native', 'roundTrip': 'structured'},
    'italic': <String, String>{'creation': 'primary', 'editing': 'structured', 'rendering': 'native', 'roundTrip': 'structured'},
    'strikethrough': <String, String>{'creation': 'secondary', 'editing': 'structured', 'rendering': 'native', 'roundTrip': 'structured'},
    'image': <String, String>{'creation': 'primary', 'editing': 'atomic', 'rendering': 'native', 'roundTrip': 'structured'},
    'draft': <String, String>{'creation': 'secondary', 'editing': 'ui-only', 'rendering': 'not-applicable', 'roundTrip': 'not-applicable'},
    'more': <String, String>{'creation': 'primary', 'editing': 'ui-only', 'rendering': 'not-applicable', 'roundTrip': 'not-applicable'},
    'link': <String, String>{'creation': 'secondary', 'editing': 'structured', 'rendering': 'native', 'roundTrip': 'structured'},
    'inline-code': <String, String>{'creation': 'secondary', 'editing': 'structured', 'rendering': 'native', 'roundTrip': 'structured'},
    'quote': <String, String>{'creation': 'secondary', 'editing': 'structured', 'rendering': 'native', 'roundTrip': 'structured'},
    'bullet-list': <String, String>{'creation': 'secondary', 'editing': 'structured', 'rendering': 'native', 'roundTrip': 'structured'},
    'ordered-list': <String, String>{'creation': 'secondary', 'editing': 'structured', 'rendering': 'native', 'roundTrip': 'structured'},
    'hr': <String, String>{'creation': 'secondary', 'editing': 'atomic', 'rendering': 'native', 'roundTrip': 'structured'},
    'dice': <String, String>{'creation': 'secondary', 'editing': 'atomic', 'rendering': 'native', 'roundTrip': 'identity-preserving'},
    'task-list': <String, String>{'creation': 'source', 'editing': 'source-preserve', 'rendering': 'native', 'roundTrip': 'source-preserve'},
    'code-block': <String, String>{'creation': 'source', 'editing': 'source-preserve', 'rendering': 'native', 'roundTrip': 'source-preserve'},
    'table': <String, String>{'creation': 'source', 'editing': 'source-preserve', 'rendering': 'native', 'roundTrip': 'source-preserve'},
    'mention': <String, String>{'creation': 'contextual', 'editing': 'atomic', 'rendering': 'native', 'roundTrip': 'identity-preserving'},
    'sticker': <String, String>{'creation': 'contextual', 'editing': 'atomic', 'rendering': 'native', 'roundTrip': 'identity-preserving'},
  };
}

abstract final class WenyouImageContract {
  static const Map<String, String> roleFits = <String, String>{
    'avatar': 'cover',
    'cover': 'cover',
    'content': 'contain',
    'galleryThumbnail': 'cover',
    'sticker': 'contain',
  };
  static const Set<String> cropAllowed = <String>{'avatar', 'cover', 'galleryThumbnail'};
  static const List<String> states = <String>['loading', 'processing', 'failed', 'restricted', 'sensitive'];
  static const double stickerDisplayMax = 128.0;
}
