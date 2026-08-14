/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type EditorCapabilityId = "heading" | "bold" | "italic" | "strikethrough" | "image" | "draft" | "more" | "link" | "inline-code" | "quote" | "bullet-list" | "ordered-list" | "hr" | "dice" | "mention" | "sticker";
export declare const FOUNDATION_VERSION: "3.0.0";
export declare const EDITOR_CAPABILITY_LABELS: Readonly<Record<EditorCapabilityId, string>>;
export declare const EDITOR_PRIMARY_NARROW: readonly EditorCapabilityId[];
export declare const EDITOR_PRIMARY_WIDE: readonly EditorCapabilityId[];
export declare const EDITOR_MORE_FALLBACK: readonly EditorCapabilityId[];
export declare const EDITOR_MORE_PROGRESSIVE: readonly EditorCapabilityId[];
export type EditorToolbarDensity = "expanded" | "with-more" | "without-draft" | "compact";
export type EditorCreationMode = "primary" | "secondary" | "contextual";
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
export declare const EDITOR_CONTENT_POLICY: Readonly<{
  markdownContractVersion: 3;
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
