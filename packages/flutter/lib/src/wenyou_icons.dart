// 由 contracts/foundation.v1.json 与 Lucide 1.28.0 生成，禁止手改。
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

enum WenyouIconVariant { outline, filled }

abstract final class WenyouIconIds {
  static const String navigationHome = 'navigation.home'; // house
  static const String navigationMoments = 'navigation.moments'; // sparkles
  static const String navigationPublish = 'navigation.publish'; // plus
  static const String navigationMessages = 'navigation.messages'; // message-circle
  static const String navigationProfile = 'navigation.profile'; // user-round
  static const String navigationBack = 'navigation.back'; // arrow-left
  static const String navigationForward = 'navigation.forward'; // arrow-right
  static const String navigationPrevious = 'navigation.previous'; // chevron-left
  static const String navigationNext = 'navigation.next'; // chevron-right
  static const String navigationExpand = 'navigation.expand'; // chevron-down
  static const String navigationCollapse = 'navigation.collapse'; // chevron-up
  static const String navigationUp = 'navigation.up'; // arrow-up
  static const String navigationDown = 'navigation.down'; // arrow-down
  static const String navigationExplore = 'navigation.explore'; // compass
  static const String actionAdd = 'action.add'; // plus
  static const String actionAddComment = 'action.add-comment'; // message-square-plus
  static const String actionAddReaction = 'action.add-reaction'; // smile-plus
  static const String actionAddTag = 'action.add-tag'; // tag-plus
  static const String actionConfirm = 'action.confirm'; // check
  static const String actionEdit = 'action.edit'; // pencil
  static const String actionDisableEdit = 'action.disable-edit'; // pencil-off
  static const String actionDelete = 'action.delete'; // trash-2
  static const String actionSave = 'action.save'; // save
  static const String actionSaveAll = 'action.save-all'; // save-all
  static const String actionSend = 'action.send'; // send
  static const String actionSearch = 'action.search'; // search
  static const String actionFilter = 'action.filter'; // list-filter
  static const String actionClearFilter = 'action.clear-filter'; // list-x
  static const String actionSort = 'action.sort'; // arrow-down-up
  static const String actionRefresh = 'action.refresh'; // refresh-cw
  static const String actionSync = 'action.sync'; // refresh-ccw
  static const String actionUndo = 'action.undo'; // undo-2
  static const String actionClose = 'action.close'; // x
  static const String actionMore = 'action.more'; // ellipsis
  static const String actionCopy = 'action.copy'; // copy
  static const String actionCopyAll = 'action.copy-all'; // copy-plus
  static const String actionDownload = 'action.download'; // download
  static const String actionUpload = 'action.upload'; // upload
  static const String actionShare = 'action.share'; // share-2
  static const String actionReply = 'action.reply'; // reply
  static const String actionOpenExternal = 'action.open-external'; // external-link
  static const String actionFullscreen = 'action.fullscreen'; // maximize
  static const String actionExitFullscreen = 'action.exit-fullscreen'; // minimize
  static const String actionMove = 'action.move'; // folder-input
  static const String actionReorder = 'action.reorder'; // grip-horizontal
  static const String actionArchive = 'action.archive'; // archive
  static const String actionUnarchive = 'action.unarchive'; // archive-restore
  static const String actionRestore = 'action.restore'; // archive-restore
  static const String actionPin = 'action.pin'; // pin
  static const String actionReport = 'action.report'; // flag
  static const String actionBlock = 'action.block'; // ban
  static const String actionFollow = 'action.follow'; // user-plus
  static const String actionUnfollow = 'action.unfollow'; // user-minus
  static const String actionSubscribe = 'action.subscribe'; // bell
  static const String actionUnsubscribe = 'action.unsubscribe'; // bell-off
  static const String actionBookmark = 'action.bookmark'; // bookmark
  static const String actionRemoveBookmark = 'action.remove-bookmark'; // bookmark-x
  static const String actionRemoveTag = 'action.remove-tag'; // tag-x
  static const String actionLike = 'action.like'; // heart
  static const String actionTip = 'action.tip'; // fuel
  static const String actionRedeem = 'action.redeem'; // gift
  static const String actionImage = 'action.image'; // image
  static const String actionAddImage = 'action.add-image'; // image-plus
  static const String actionSticker = 'action.sticker'; // smile-plus
  static const String actionFolder = 'action.folder'; // folder
  static const String actionAddFolder = 'action.add-folder'; // folder-plus
  static const String actionUnlink = 'action.unlink'; // unlink
  static const String actionMention = 'action.mention'; // at-sign
  static const String actionShow = 'action.show'; // eye
  static const String actionHide = 'action.hide'; // eye-off
  static const String actionLogin = 'action.login'; // log-in
  static const String actionLogout = 'action.logout'; // log-out
  static const String actionSettings = 'action.settings'; // settings
  static const String actionAccount = 'action.account'; // user-round-cog
  static const String actionLock = 'action.lock'; // lock-keyhole
  static const String actionUnlock = 'action.unlock'; // lock-keyhole-open
  static const String actionResetPassword = 'action.reset-password'; // key-round
  static const String actionDevices = 'action.devices'; // monitor-smartphone
  static const String actionMarkRead = 'action.mark-read'; // mail-check
  static const String actionMarkUnread = 'action.mark-unread'; // mail-open
  static const String actionUpdate = 'action.update'; // cloud-download
  static const String contentAnnouncement = 'content.announcement'; // megaphone
  static const String contentArticle = 'content.article'; // newspaper
  static const String contentCategory = 'content.category'; // shapes
  static const String contentDraft = 'content.draft'; // file-clock
  static const String contentFolder = 'content.folder'; // folder
  static const String contentFolderOpen = 'content.folder-open'; // folder-open
  static const String contentGallery = 'content.gallery'; // images
  static const String contentInvitation = 'content.invitation'; // mail-plus
  static const String contentInternalReference = 'content.internal-reference'; // door-open
  static const String contentLayers = 'content.layers'; // layers
  static const String contentList = 'content.list'; // list
  static const String contentMoment = 'content.moment'; // sparkles
  static const String contentReview = 'content.review'; // notebook-pen
  static const String contentRoleplay = 'content.roleplay'; // drama
  static const String contentTag = 'content.tag'; // tag
  static const String contentThread = 'content.thread'; // message-square
  static const String contentTopic = 'content.topic'; // notebook-text
  static const String economyReward = 'economy.reward'; // gift
  static const String economyTip = 'economy.tip'; // fuel
  static const String economyTransaction = 'economy.transaction'; // receipt-text
  static const String economyWallet = 'economy.wallet'; // wallet-cards
  static const String identityLevel = 'identity.level'; // badge
  static const String identityMember = 'identity.member'; // user-round
  static const String identityMembers = 'identity.members'; // users
  static const String moderationAppeal = 'moderation.appeal'; // scale
  static const String moderationDecision = 'moderation.decision'; // gavel
  static const String securityDeviceDesktop = 'security.device-desktop'; // laptop
  static const String securityDeviceMobile = 'security.device-mobile'; // smartphone
  static const String securityPassword = 'security.password'; // key-round
  static const String metricComments = 'metric.comments'; // message-circle
  static const String metricLikes = 'metric.likes'; // heart
  static const String metricPlayers = 'metric.players'; // users
  static const String metricReplies = 'metric.replies'; // message-square
  static const String metricTips = 'metric.tips'; // fuel
  static const String metricViews = 'metric.views'; // eye
  static const String editorHeading = 'editor.heading'; // type
  static const String editorHeading2 = 'editor.heading-2'; // heading-2
  static const String editorHeading3 = 'editor.heading-3'; // heading-3
  static const String editorBold = 'editor.bold'; // bold
  static const String editorItalic = 'editor.italic'; // italic
  static const String editorStrikethrough = 'editor.strikethrough'; // strikethrough
  static const String editorInlineCode = 'editor.inline-code'; // code-2
  static const String editorBulletList = 'editor.bullet-list'; // list
  static const String editorOrderedList = 'editor.ordered-list'; // list-ordered
  static const String editorLink = 'editor.link'; // link-2
  static const String editorImage = 'editor.image'; // image
  static const String editorQuote = 'editor.quote'; // quote
  static const String editorHorizontalRule = 'editor.horizontal-rule'; // minus
  static const String editorDice = 'editor.dice'; // dices
  static const String editorSticker = 'editor.sticker'; // smile-plus
  static const String editorContentDrafts = 'editor.content-drafts'; // file-clock
  static const String editorMore = 'editor.more'; // ellipsis
  static const String editorClose = 'editor.close'; // x
  static const String editorChevronDown = 'editor.chevron-down'; // chevron-down
  static const String statusLoading = 'status.loading'; // loader-circle
  static const String statusSuccess = 'status.success'; // circle-check
  static const String statusInfo = 'status.info'; // info
  static const String statusWarning = 'status.warning'; // triangle-alert
  static const String statusError = 'status.error'; // circle-alert
  static const String statusOffline = 'status.offline'; // cloud-off
  static const String statusSynced = 'status.synced'; // cloud-check
  static const String statusSyncing = 'status.syncing'; // cloud-upload
  static const String statusCloud = 'status.cloud'; // cloud
  static const String statusEmpty = 'status.empty'; // inbox
  static const String statusVerified = 'status.verified'; // badge-check
  static const String statusImageUnavailable = 'status.image-unavailable'; // image-off
  static const String statusNoResults = 'status.no-results'; // search-x
  static const String statusMessagesDisabled = 'status.messages-disabled'; // message-circle-off
  static const String statusNotifications = 'status.notifications'; // bell
  static const String statusNotificationsActive = 'status.notifications-active'; // bell-ring
  static const String statusNotificationsOff = 'status.notifications-off'; // bell-off
  static const String statusUsers = 'status.users'; // users
  static const String statusFile = 'status.file'; // file-text
  static const String statusGallery = 'status.gallery'; // images
  static const String statusTag = 'status.tag'; // tag
  static const String statusMail = 'status.mail'; // mail
  static const String statusKey = 'status.key'; // key-round
  static const String statusShield = 'status.shield'; // shield
  static const String statusHelp = 'status.help'; // circle-help
  static const String statusUnavailable = 'status.unavailable'; // circle-x
  static const String statusArchived = 'status.archived'; // archive
  static const String statusBlocked = 'status.blocked'; // ban
  static const String statusCalendar = 'status.calendar'; // calendar-days
  static const String statusEmailRead = 'status.email-read'; // mail-check
  static const String statusEmailUnread = 'status.email-unread'; // mail-open
  static const String statusGreeting = 'status.greeting'; // hand
  static const String statusGroupUnavailable = 'status.group-unavailable'; // users-round
  static const String statusHistory = 'status.history'; // history
  static const String statusLocked = 'status.locked'; // lock-keyhole
  static const String statusNew = 'status.new'; // badge-alert
  static const String statusPinned = 'status.pinned'; // pin
  static const String statusPremium = 'status.premium'; // crown
  static const String statusTrending = 'status.trending'; // trending-up
  static const String statusUserUnavailable = 'status.user-unavailable'; // user-round-x
}

abstract final class WenyouIconContract {
  static const String family = 'Lucide';
  static const String version = '1.28.0';
  static const double compactSize = 16.0;
  static const double defaultSize = 20.0;
  static const double navigationSize = 24.0;
  static const Map<String, String> glyphs = <String, String>{
    'navigation.home': 'house',
    'navigation.moments': 'sparkles',
    'navigation.publish': 'plus',
    'navigation.messages': 'message-circle',
    'navigation.profile': 'user-round',
    'navigation.back': 'arrow-left',
    'navigation.forward': 'arrow-right',
    'navigation.previous': 'chevron-left',
    'navigation.next': 'chevron-right',
    'navigation.expand': 'chevron-down',
    'navigation.collapse': 'chevron-up',
    'navigation.up': 'arrow-up',
    'navigation.down': 'arrow-down',
    'navigation.explore': 'compass',
    'action.add': 'plus',
    'action.add-comment': 'message-square-plus',
    'action.add-reaction': 'smile-plus',
    'action.add-tag': 'tag-plus',
    'action.confirm': 'check',
    'action.edit': 'pencil',
    'action.disable-edit': 'pencil-off',
    'action.delete': 'trash-2',
    'action.save': 'save',
    'action.save-all': 'save-all',
    'action.send': 'send',
    'action.search': 'search',
    'action.filter': 'list-filter',
    'action.clear-filter': 'list-x',
    'action.sort': 'arrow-down-up',
    'action.refresh': 'refresh-cw',
    'action.sync': 'refresh-ccw',
    'action.undo': 'undo-2',
    'action.close': 'x',
    'action.more': 'ellipsis',
    'action.copy': 'copy',
    'action.copy-all': 'copy-plus',
    'action.download': 'download',
    'action.upload': 'upload',
    'action.share': 'share-2',
    'action.reply': 'reply',
    'action.open-external': 'external-link',
    'action.fullscreen': 'maximize',
    'action.exit-fullscreen': 'minimize',
    'action.move': 'folder-input',
    'action.reorder': 'grip-horizontal',
    'action.archive': 'archive',
    'action.unarchive': 'archive-restore',
    'action.restore': 'archive-restore',
    'action.pin': 'pin',
    'action.report': 'flag',
    'action.block': 'ban',
    'action.follow': 'user-plus',
    'action.unfollow': 'user-minus',
    'action.subscribe': 'bell',
    'action.unsubscribe': 'bell-off',
    'action.bookmark': 'bookmark',
    'action.remove-bookmark': 'bookmark-x',
    'action.remove-tag': 'tag-x',
    'action.like': 'heart',
    'action.tip': 'fuel',
    'action.redeem': 'gift',
    'action.image': 'image',
    'action.add-image': 'image-plus',
    'action.sticker': 'smile-plus',
    'action.folder': 'folder',
    'action.add-folder': 'folder-plus',
    'action.unlink': 'unlink',
    'action.mention': 'at-sign',
    'action.show': 'eye',
    'action.hide': 'eye-off',
    'action.login': 'log-in',
    'action.logout': 'log-out',
    'action.settings': 'settings',
    'action.account': 'user-round-cog',
    'action.lock': 'lock-keyhole',
    'action.unlock': 'lock-keyhole-open',
    'action.reset-password': 'key-round',
    'action.devices': 'monitor-smartphone',
    'action.mark-read': 'mail-check',
    'action.mark-unread': 'mail-open',
    'action.update': 'cloud-download',
    'content.announcement': 'megaphone',
    'content.article': 'newspaper',
    'content.category': 'shapes',
    'content.draft': 'file-clock',
    'content.folder': 'folder',
    'content.folder-open': 'folder-open',
    'content.gallery': 'images',
    'content.invitation': 'mail-plus',
    'content.internal-reference': 'door-open',
    'content.layers': 'layers',
    'content.list': 'list',
    'content.moment': 'sparkles',
    'content.review': 'notebook-pen',
    'content.roleplay': 'drama',
    'content.tag': 'tag',
    'content.thread': 'message-square',
    'content.topic': 'notebook-text',
    'economy.reward': 'gift',
    'economy.tip': 'fuel',
    'economy.transaction': 'receipt-text',
    'economy.wallet': 'wallet-cards',
    'identity.level': 'badge',
    'identity.member': 'user-round',
    'identity.members': 'users',
    'moderation.appeal': 'scale',
    'moderation.decision': 'gavel',
    'security.device-desktop': 'laptop',
    'security.device-mobile': 'smartphone',
    'security.password': 'key-round',
    'metric.comments': 'message-circle',
    'metric.likes': 'heart',
    'metric.players': 'users',
    'metric.replies': 'message-square',
    'metric.tips': 'fuel',
    'metric.views': 'eye',
    'editor.heading': 'type',
    'editor.heading-2': 'heading-2',
    'editor.heading-3': 'heading-3',
    'editor.bold': 'bold',
    'editor.italic': 'italic',
    'editor.strikethrough': 'strikethrough',
    'editor.inline-code': 'code-2',
    'editor.bullet-list': 'list',
    'editor.ordered-list': 'list-ordered',
    'editor.link': 'link-2',
    'editor.image': 'image',
    'editor.quote': 'quote',
    'editor.horizontal-rule': 'minus',
    'editor.dice': 'dices',
    'editor.sticker': 'smile-plus',
    'editor.content-drafts': 'file-clock',
    'editor.more': 'ellipsis',
    'editor.close': 'x',
    'editor.chevron-down': 'chevron-down',
    'status.loading': 'loader-circle',
    'status.success': 'circle-check',
    'status.info': 'info',
    'status.warning': 'triangle-alert',
    'status.error': 'circle-alert',
    'status.offline': 'cloud-off',
    'status.synced': 'cloud-check',
    'status.syncing': 'cloud-upload',
    'status.cloud': 'cloud',
    'status.empty': 'inbox',
    'status.verified': 'badge-check',
    'status.image-unavailable': 'image-off',
    'status.no-results': 'search-x',
    'status.messages-disabled': 'message-circle-off',
    'status.notifications': 'bell',
    'status.notifications-active': 'bell-ring',
    'status.notifications-off': 'bell-off',
    'status.users': 'users',
    'status.file': 'file-text',
    'status.gallery': 'images',
    'status.tag': 'tag',
    'status.mail': 'mail',
    'status.key': 'key-round',
    'status.shield': 'shield',
    'status.help': 'circle-help',
    'status.unavailable': 'circle-x',
    'status.archived': 'archive',
    'status.blocked': 'ban',
    'status.calendar': 'calendar-days',
    'status.email-read': 'mail-check',
    'status.email-unread': 'mail-open',
    'status.greeting': 'hand',
    'status.group-unavailable': 'users-round',
    'status.history': 'history',
    'status.locked': 'lock-keyhole',
    'status.new': 'badge-alert',
    'status.pinned': 'pin',
    'status.premium': 'crown',
    'status.trending': 'trending-up',
    'status.user-unavailable': 'user-round-x',
  };
  static const Set<String> filledGlyphs = <String>{'bell', 'bookmark', 'heart'};

  static String assetName(
    String semanticId, {
    WenyouIconVariant variant = WenyouIconVariant.outline,
  }) {
    final glyph = glyphs[semanticId];
    if (glyph == null) throw ArgumentError.value(semanticId, 'semanticId', 'Unknown Wenyou icon semantic');
    if (variant == WenyouIconVariant.filled) {
      if (!filledGlyphs.contains(glyph)) {
        throw ArgumentError.value(semanticId, 'semanticId', 'Wenyou icon has no filled variant');
      }
      return 'icons/$glyph-filled.svg';
    }
    return 'icons/$glyph.svg';
  }
}

class WenyouIcon extends StatelessWidget {
  const WenyouIcon(
    this.semanticId, {
    this.size = WenyouIconContract.defaultSize,
    this.color,
    this.semanticLabel,
    this.variant = WenyouIconVariant.outline,
    super.key,
  });

  final String semanticId;
  final double size;
  final Color? color;
  final String? semanticLabel;
  final WenyouIconVariant variant;

  @override
  Widget build(BuildContext context) {
    final resolvedColor = color ?? IconTheme.of(context).color ?? DefaultTextStyle.of(context).style.color;
    final picture = SvgPicture.asset(
      WenyouIconContract.assetName(semanticId, variant: variant),
      package: 'wenyousite_foundation',
      width: size,
      height: size,
      fit: BoxFit.contain,
      colorFilter: resolvedColor == null ? null : ColorFilter.mode(resolvedColor, BlendMode.srcIn),
      excludeFromSemantics: semanticLabel == null,
      semanticsLabel: semanticLabel,
    );
    return Align(
      widthFactor: 1,
      heightFactor: 1,
      child: SizedBox.square(dimension: size, child: picture),
    );
  }
}
