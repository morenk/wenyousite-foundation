/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export declare const COLLECTION_INVARIANTS: Readonly<{
  containerWidth: "available";
  itemWidth: "available";
  narrowContentDoesNotChangeItemWidth: true;
  horizontalOverflow: "explicit-only";
  contentSizedExceptions: readonly ("message-bubble" | "chip" | "badge" | "compact-action")[];
}>;
export declare const COLLECTION_WEB_PROFILE: Readonly<{
  tabPanelWidth: "available";
  multiColumn: "explicit-grid-only";
}>;
export declare const COLLECTION_MOBILE_PROFILE: Readonly<{
  layout: "single-column";
  itemWidth: "available";
}>;
