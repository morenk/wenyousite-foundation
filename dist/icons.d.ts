/** 由 contracts/foundation.v1.json 与 Lucide 1.28.0 生成，禁止手改。 */
export type IconSemanticId = "navigation.home" | "navigation.moments" | "navigation.publish" | "navigation.messages" | "navigation.profile" | "navigation.back" | "navigation.forward" | "navigation.previous" | "navigation.next" | "navigation.expand" | "navigation.collapse" | "action.add" | "action.edit" | "action.delete" | "action.save" | "action.send" | "action.search" | "action.filter" | "action.sort" | "action.refresh" | "action.close" | "action.more" | "action.copy" | "action.download" | "action.upload" | "action.share" | "action.reply" | "action.archive" | "action.restore" | "action.pin" | "action.report" | "action.block" | "action.follow" | "action.unfollow" | "action.bookmark" | "action.like" | "action.image" | "action.add-image" | "action.sticker" | "action.folder" | "action.add-folder" | "action.unlink" | "action.mention" | "action.show" | "action.hide" | "action.login" | "action.logout" | "action.settings" | "action.account" | "action.lock" | "action.devices" | "editor.heading" | "editor.heading-2" | "editor.heading-3" | "editor.bold" | "editor.italic" | "editor.strikethrough" | "editor.inline-code" | "editor.bullet-list" | "editor.ordered-list" | "editor.link" | "editor.image" | "editor.quote" | "editor.horizontal-rule" | "editor.dice" | "editor.sticker" | "editor.content-drafts" | "editor.more" | "editor.close" | "editor.chevron-down" | "status.loading" | "status.success" | "status.info" | "status.warning" | "status.error" | "status.offline" | "status.synced" | "status.syncing" | "status.cloud" | "status.empty" | "status.verified" | "status.image-unavailable" | "status.no-results" | "status.messages-disabled" | "status.notifications" | "status.users" | "status.file" | "status.gallery" | "status.tag" | "status.mail" | "status.key" | "status.shield" | "status.help" | "status.unavailable";
export type IconGlyphId = "archive" | "archive-restore" | "arrow-down-up" | "arrow-left" | "arrow-right" | "at-sign" | "badge-check" | "ban" | "bell" | "bold" | "bookmark" | "chevron-down" | "chevron-left" | "chevron-right" | "chevron-up" | "circle-alert" | "circle-check" | "circle-help" | "circle-x" | "cloud" | "cloud-check" | "cloud-off" | "cloud-upload" | "code-2" | "copy" | "dices" | "download" | "ellipsis" | "eye" | "eye-off" | "file-clock" | "file-text" | "flag" | "folder" | "folder-plus" | "heading-2" | "heading-3" | "heart" | "house" | "image" | "image-off" | "image-plus" | "images" | "inbox" | "info" | "italic" | "key-round" | "link-2" | "list" | "list-filter" | "list-ordered" | "loader-circle" | "lock-keyhole" | "log-in" | "log-out" | "mail" | "message-circle" | "message-circle-off" | "minus" | "monitor-smartphone" | "pencil" | "pin" | "plus" | "quote" | "refresh-cw" | "reply" | "save" | "search" | "search-x" | "send" | "settings" | "share-2" | "shield" | "smile-plus" | "sparkles" | "strikethrough" | "tag" | "trash-2" | "triangle-alert" | "type" | "unlink" | "upload" | "user-minus" | "user-plus" | "user-round" | "user-round-cog" | "users" | "x";
export type IconNode = readonly [elementName: "circle" | "ellipse" | "line" | "path" | "polygon" | "polyline" | "rect", attributes: Readonly<Record<string, string>>];
export declare const ICON_FAMILY: "Lucide";
export declare const ICON_VERSION: "1.28.0";
export declare const ICON_STYLE: Readonly<{
  strokeWidth: number;
  lineCap: "round";
  lineJoin: "round";
  compactSize: number;
  defaultSize: number;
  navigationSize: number;
  selectedState: "same-glyph-on-accent-container";
  decorativeSemantics: "hidden";
  interactiveLabelOwner: "control";
}>;
export declare const ICON_SEMANTICS: Readonly<Record<IconSemanticId, IconGlyphId>>;
export declare const ICON_GLYPH_NODES: Readonly<Record<IconGlyphId, readonly IconNode[]>>;
export declare const ICON_GLYPH_SVGS: Readonly<Record<IconGlyphId, string>>;
export declare const ICON_GLYPH_SHA256: Readonly<Record<IconGlyphId, string>>;
export declare const ICON_PLATFORM_EXCEPTIONS: readonly string[];
export declare function iconGlyphId(semanticId: IconSemanticId): IconGlyphId;
export declare function iconNode(semanticId: IconSemanticId): readonly IconNode[];
export declare function iconSvg(semanticId: IconSemanticId): string;
