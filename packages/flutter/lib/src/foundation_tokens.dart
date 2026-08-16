// 由 contracts/foundation.v1.json 生成，禁止手改。
import 'package:flutter/material.dart';

abstract final class WenyouFoundationVersion {
  static const String value = '3.2.0';
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
  static const Color like = Color(0xFFD81B60);
  static const Color likeSoft = Color(0xFFFCE7F0);
  static const Color bookmark = Color(0xFFB77900);
  static const Color bookmarkSoft = Color(0xFFFFF3BF);
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

abstract final class WenyouIconControlContract {
  static const Color inactiveForeground = WenyouFoundationPalette.mutedForeground;
  static const Color genericSelectedForeground = WenyouFoundationPalette.onAccent;
  static const Color genericSelectedSurface = WenyouFoundationPalette.accent;
  static const Color likeSelectedForeground = WenyouFoundationPalette.like;
  static const Color likeSelectedSurface = WenyouFoundationPalette.likeSoft;
  static const Color bookmarkSelectedForeground = WenyouFoundationPalette.bookmark;
  static const Color bookmarkSelectedSurface = WenyouFoundationPalette.bookmarkSoft;
  static const Color supportingInactive = WenyouFoundationPalette.mutedForeground;
  static const Color supportingSelected = WenyouFoundationPalette.foreground;
  static const Color focusRing = WenyouFoundationPalette.brandStrong;
  static const double hoverStateLayerOpacity = 0.08;
  static const double pressedStateLayerOpacity = 0.12;
  static const double disabledContentOpacity = 0.38;
  static const String pendingVisual = 'preserve-state-with-loading-indicator';
}

abstract final class WenyouElementContract {
  static const double interactiveMinimumTarget = 48.0;
  static const double internalReferencePaddingBlock = 0.08;
  static const double internalReferencePaddingInline = 0.38;
  static const double internalReferenceGap = 0.28;
  static const double internalReferenceRadius = 0.4;
  static const double internalReferenceIconSize = 0.92;
  static const double internalReferencePressedStateOpacity = 0.12;
  static const String internalReferenceIcon = 'content.internal-reference';
  static const bool readingEditorEquivalent = true;
  static const bool statusNeverColorOnly = true;
  static const double badgeDefaultHeight = 24.0;
  static const double badgeCompactHeight = 20.0;
  static const double badgeDefaultFontSize = 12.0;
  static const double badgeCompactFontSize = 11.0;
  static const double levelHeight = 20.0;
  static const double levelFontSize = 11.0;
  static const double unreadCountHeight = 16.0;
  static const double unreadCountFontSize = 10.0;
  static const String unreadMaximumDisplay = '99+';
  static const double categoryMarkerWidth = 4.0;
  static const double categoryBadgeTintOpacity = 0.12;
  static const double categoryBadgeBorderOpacity = 0.33;
}

abstract final class WenyouFoundationTypography {
  static const String body = 'Wenyou Noto Sans SC';
  static const String display = 'Wenyou LXGW WenKai';
  static const String utility = 'Wenyou Nunito';
  static const List<String> chineseFallback = <String>['Noto Sans SC', 'sans-serif'];
  static const Map<String, String> mobileFamilies = <String, String>{
    'pageTitle': 'display',
    'sectionTitle': 'display',
    'subsectionTitle': 'display',
    'body': 'body',
    'compactBody': 'body',
    'label': 'body',
    'caption': 'body',
    'reading': 'body',
  };
  static const Map<String, double> mobileSizes = <String, double>{
    'pageTitle': 22.0,
    'sectionTitle': 18.0,
    'subsectionTitle': 16.0,
    'body': 16.0,
    'compactBody': 14.0,
    'label': 14.0,
    'caption': 12.0,
    'reading': 17.0,
  };
  static const Map<String, double> mobileLineHeights = <String, double>{
    'pageTitle': 1.3,
    'sectionTitle': 1.35,
    'subsectionTitle': 1.35,
    'body': 1.6,
    'compactBody': 1.45,
    'label': 1.4,
    'caption': 1.4,
    'reading': 1.8,
  };
  static const Map<String, int> mobileWeights = <String, int>{
    'pageTitle': 500,
    'sectionTitle': 500,
    'subsectionTitle': 500,
    'body': 400,
    'compactBody': 400,
    'label': 700,
    'caption': 400,
    'reading': 400,
  };
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
  static const double regularHorizontalPaddingFrom = 401.0;
  static const double pageContentMaxWidth = 520.0;
  static const double wideContainerMaxWidth = 600.0;
}

abstract final class WenyouAccessibilityContract {
  static const double normalTextContrast = 4.5;
  static const double largeTextContrast = 3.0;
  static const double nonTextContrast = 3.0;
  static const bool focusVisible = true;
  static const bool statusNeverColorOnly = true;
  static const bool iconOnlyControlHasLabel = true;
  static const String reducedMotion = 'respect-user';
  static const String asyncAnnouncement = 'polite-unless-critical';
  static const bool systemTextScale = true;
  static const bool safeArea = true;
  static const bool systemBack = true;
}

abstract final class WenyouFeedbackContract {
  static const List<String> resourceStates = <String>['loading', 'refreshing', 'loading-more', 'empty', 'no-results', 'error', 'offline', 'restricted'];
  static const List<String> mutationStates = <String>['idle', 'pending', 'success', 'error'];
  static const String transientChannel = 'snackbar';
  static const String asyncLiveRegion = 'polite';
  static const bool refreshPreservesContent = true;
  static const bool paginationPreservesContent = true;
  static const bool pendingPreventsDuplicateSubmit = true;
  static const bool retryOnlyWhenSafe = true;
  static const bool blockingFailureStaysInContext = true;
}

abstract final class WenyouOverlayContract {
  static const Map<String, double> elevation = <String, double>{
    'flat': 0.0,
    'floating': 2.0,
    'popup': 4.0,
  };
  static const List<String> dismiss = <String>['explicit-control', 'system-back'];
  static const bool safeArea = true;
  static const bool modalBlocksBackground = true;
  static const bool explicitClosePath = true;
  static const bool restoreFocus = true;
}

abstract final class WenyouNavigationContract {
  static const Map<String, String> labels = <String, String>{
    'discover': '发现',
    'moments': '动态',
    'publish': '发布',
    'messages': '消息',
    'profile': '我的',
    'search': '搜索',
    'notifications': '通知',
    'directMessages': '私聊',
    'bookmarks': '收藏',
  };
  static const Map<String, String> icons = <String, String>{
    'discover': 'navigation.home',
    'moments': 'navigation.moments',
    'publish': 'navigation.publish',
    'messages': 'navigation.messages',
    'profile': 'navigation.profile',
    'search': 'action.search',
    'notifications': 'status.notifications',
    'directMessages': 'navigation.messages',
    'bookmarks': 'action.bookmark',
  };
  static const List<String> primary = <String>['discover', 'moments', 'publish', 'messages', 'profile'];
  static const List<String> messageSections = <String>['notifications', 'directMessages'];
  static const String routeOwner = 'client';
  static const String messageUnreadAggregation = 'notifications-plus-direct-messages';
}

abstract final class WenyouLanguageContract {
  static const Map<String, String> nouns = <String, String>{
    'thread': '主题帖',
    'subthread': '子贴',
    'post': '楼层',
    'reply': '回复',
    'moment': '动态',
    'notification': '通知',
    'directMessage': '私聊',
    'bookmark': '收藏',
  };
  static const Map<String, String> actions = <String, String>{
    'publish': '发布',
    'save': '保存',
    'delete': '删除',
    'hide': '隐藏',
    'restore': '恢复',
    'retry': '重试',
    'cancel': '取消',
    'close': '关闭',
  };
  static const bool sameActionKeepsVerb = true;
  static const bool sentencesOwnedByClient = true;
  static const bool protocolNamesNeverUserFacing = true;
}

abstract final class WenyouCollectionContract {
  static const bool fillAvailableWidth = true;
  static const bool narrowContentKeepsItemWidth = true;
  static const Set<String> contentSizedExceptions = <String>{'message-bubble', 'chip', 'badge', 'compact-action'};
}

abstract final class WenyouNotificationContract {
  static const String allLabel = '全部';
  static const String eventTypeOwner = 'backend-notification-contract';
  static const String unknownTypeVisibility = 'all';
  static const List<String> groupOrder = <String>['interaction', 'subscription', 'system'];
  static const Map<String, String> labels = <String, String>{
    'interaction': '互动',
    'subscription': '订阅',
    'system': '系统',
  };
  static const Map<String, List<String>> eventTypes = <String, List<String>>{
    'interaction': <String>['reply', 'mention', 'follow', 'like'],
    'subscription': <String>['new_post', 'thread_created'],
    'system': <String>['tip', 'level_up', 'system'],
  };
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
    'mention': '提及',
    'sticker': '表情包',
  };
  static const List<String> primary = <String>['heading', 'bold', 'italic', 'image', 'more'];
  static const List<String> wideAdditions = <String>['draft', 'quote', 'hr', 'sticker'];
  static const List<String> primaryCore = <String>['heading', 'bold', 'italic', 'image', 'more'];
  static const List<String> primaryPromotionOrder = <String>['draft', 'quote', 'hr', 'sticker'];
  static const List<String> surfaces = <String>['page', 'expandableSheet', 'inline'];
  static const String keyboardToolbarPlacement = 'above-keyboard-dock';
  static const String primaryLayout = 'responsive-single-row';
  static const String horizontalOverflow = 'forbidden';
  static const String morePresentation = 'inline';
  static const List<String> moreInline = <String>['link', 'inline-code', 'quote', 'bullet-list', 'ordered-list', 'hr', 'dice', 'sticker', 'draft', 'strikethrough'];
  static const List<String> contextual = <String>['mention', 'sticker'];
  static const int markdownContractVersion = 3;
  static const String structuredCapabilitySource = 'toolbar';
  static const String unsupportedClientBehavior = 'literal-text-silent';
  static const String unsupportedApiBehavior = 'reject';
  static const int maximumListDepth = 3;
  static const List<int> creatableHeadingLevels = <int>[2, 3];
  static const double compactContentInlinePadding = 4.0;
  static const double regularContentInlinePadding = 16.0;
  static const double toolbarHorizontalPadding = 4.0;
  static const double minimumActionExtent = 48.0;
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
