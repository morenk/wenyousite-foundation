/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type EditorCapabilityId = "heading" | "text-color" | "alignment" | "bold" | "italic" | "strikethrough" | "image" | "draft" | "more" | "link" | "inline-code" | "quote" | "bullet-list" | "ordered-list" | "hr" | "dice" | "mention" | "sticker";
export declare const FOUNDATION_VERSION: "7.5.0";
export declare const EDITOR_CAPABILITY_LABELS: Readonly<Record<EditorCapabilityId, string>>;
export declare const EDITOR_PRIMARY_NARROW: readonly EditorCapabilityId[];
export declare const EDITOR_PRIMARY_WIDE: readonly EditorCapabilityId[];
export declare const EDITOR_MORE_FALLBACK: readonly EditorCapabilityId[];
export declare const EDITOR_MORE_PROGRESSIVE: readonly EditorCapabilityId[];
export type EditorToolbarDensity = "expanded" | "with-more" | "without-draft" | "compact";
export type EditorCreationMode = "primary" | "secondary" | "contextual" | "none";
export type EditorEditingMode = "structured" | "atomic" | "ui-only";
export type EditorRenderingMode = "native" | "not-applicable";
export type EditorRoundTripMode = "structured" | "identity-preserving" | "not-applicable";
export interface EditorCapabilityContract {
  readonly creation: EditorCreationMode;
  readonly editing: EditorEditingMode;
  readonly rendering: EditorRenderingMode;
  readonly roundTrip: EditorRoundTripMode;
}
export declare const EDITOR_DENSITY_ORDER: readonly EditorToolbarDensity[];
export declare const EDITOR_PRIMARY_BY_DENSITY: Readonly<Record<EditorToolbarDensity, readonly EditorCapabilityId[]>>;
export declare const EDITOR_MORE_BY_DENSITY: Readonly<Record<EditorToolbarDensity, readonly EditorCapabilityId[]>>;
export declare const EDITOR_CONTEXTUAL_WEB: readonly EditorCapabilityId[];
export declare const EDITOR_CONTEXTUAL_MOBILE: readonly EditorCapabilityId[];
export declare const EDITOR_INVARIANTS: Readonly<Record<string, string>>;
export declare const EDITOR_TEXT_COLOR_PROFILE: Readonly<{"scope":["thread-body","subthread-body","floor-body","reply-body"],"excluded":["moment","private-message","thread-title"],"colorModel":"opaque-rgb","channelMinimum":0,"channelMaximum":255,"presets":[{"id":"red","label":"红色","rgb":"#D14343"},{"id":"orange","label":"橙色","rgb":"#D97706"},{"id":"green","label":"绿色","rgb":"#25855A"},{"id":"blue","label":"蓝色","rgb":"#2563EB"},{"id":"purple","label":"紫色","rgb":"#8B5CF6"}],"selection":{"application":"selected-text-or-caret","empty":"caret-sets-typing-color","atomicNodes":"skip","paragraphs":"split-inline-ranges","continuedTyping":"explicit-caret-color-only","mixedColors":"no-preselection","defaultBehavior":"remove-color-only","undo":"single-transaction","caret":{"invalid":"disabled","emptyDocument":"enabled","documentMutation":"on-text-input-only","inputState":"unset-rgb-default","insertions":"preserve-source-and-skip-atoms","defaultBehavior":"clear-typing-color-only","continuation":"typing-and-newline","relocation":"derive-from-new-position","persistence":"document-text-only","undo":"normal-input-history"}},"mobile":{"parentCapability":"heading","mainToolbar":"unchanged","sectionOrder":["default","presets","recent","custom"],"minimumTargetDp":48,"defaultLabel":"默认","customLabel":"自定义","applyLabel":"应用","cancelLabel":"取消","picker":"inline-replacement","controls":["drag-picker","red","green","blue","text-preview"],"numericInput":"integer-0-255","preview":"panel-only","commit":"explicit-apply","cancel":"unchanged","keyboard":"hide-body-before-picker-numeric-for-channels","completion":"restore-body-focus-and-selection","layout":"available-height-scroll"},"recent":{"maximum":4,"source":"applied-custom-colors","scope":"account-local","order":"most-recent-first","deduplication":"canonical-rgb"},"web":{"picker":false,"existingContent":"render-edit-preserve","clipboard":"preserve-color"},"protocolOwner":"backend-markdown-contract"}>;
export declare const EDITOR_TEXT_COLOR_PRESETS: ReadonlyArray<Readonly<{ id: string; label: string; rgb: string }>>;
export declare const EDITOR_CONTENT_POLICY: Readonly<{
  markdownContractVersion: 4;
  structuredCapabilitySource: "toolbar";
  unsupportedClientBehavior: "literal-text-silent";
  unsupportedApiBehavior: "reject";
  maximumListDepth: 3;
}>;
export declare const EDITOR_WEB_LAYOUT: Readonly<{
  frameMaxRem: number;
  textMeasurePx: number;
  contentInlinePaddingPx: number;
  toolbarInlinePaddingPx: number;
  firstControlInternalInsetPx: number;
  bodyPx: number;
  lineHeight: number;
}>;
export declare const EDITOR_MOBILE_LAYOUT: Readonly<{
  compactContentInlinePaddingDp: number;
  regularContentInlinePaddingDp: number;
  toolbarHorizontalPaddingDp: number;
  bodySp: number;
  lineHeight: number;
  respectsSystemTextScale: boolean;
}>;
export type EditorMobileSurface = "page" | "expandableSheet" | "inline";
export declare const EDITOR_MOBILE_SURFACES: readonly EditorMobileSurface[];
export type EditorMobileRenderingException = "inline-code-padding-uses-flutter-quill-native-bounds";
export declare const EDITOR_MOBILE_RENDERING_EXCEPTIONS: readonly EditorMobileRenderingException[];
export declare const EDITOR_MOBILE_TOOLBAR: Readonly<{
  placementWhenKeyboardVisible: "above-keyboard-dock";
  primaryLayout: "responsive-single-row";
  horizontalOverflow: "forbidden";
  morePresentation: "inline";
}>;
export declare const EDITOR_MOBILE_MORE_INLINE: readonly EditorCapabilityId[];
export declare const EDITOR_WEB_CAPABILITIES: Readonly<Record<EditorCapabilityId, EditorCapabilityContract>>;
export declare const EDITOR_MOBILE_CAPABILITIES: Readonly<Record<EditorCapabilityId, EditorCapabilityContract>>;
export declare const EDITOR_CREATABLE_HEADING_LEVELS: readonly (2 | 3)[];
export declare function editorCapabilityLabels(ids: readonly EditorCapabilityId[]): string[];
