/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export declare const COLLECTION_INVARIANTS: Readonly<{
  containerWidth: "available";
  itemWidth: "available";
  narrowContentDoesNotChangeItemWidth: true;
  horizontalOverflow: "explicit-only";
  contentSizedExceptions: readonly ("message-bubble" | "chip" | "badge" | "compact-action")[];
}>;
export declare const CONTENT_PRESENTATION: Readonly<{"slots":["title","identity","time","summary","cover","tags","metrics","status","actions"],"list":{"titleFamily":"body","titleWeight":600,"purpose":"scan-and-enter","summary":"optional-preview","surface":"platform-flat-or-light-card"},"detail":{"titleFamily":"display","titleWeight":500,"purpose":"continuous-reading","summary":"do-not-repeat-list-summary","surface":"continuous-main-flow-with-accessory-panels"},"invariants":{"titlePrecedesSupportingMetadata":true,"statusNeverColorOnly":true,"nestedCards":"forbidden","domainProfiles":"differences-only"}}>;
export declare const COLLECTION_WEB_PROFILE: Readonly<{
  tabPanelWidth: "available";
  multiColumn: "explicit-grid-only";
}>;
export declare const COLLECTION_MOBILE_PROFILE: Readonly<{
  layout: "single-column";
  itemWidth: "available";
  domainLayoutExceptions: Readonly<{
    "moments-feed": "two-column-waterfall";
  }>;
}>;
