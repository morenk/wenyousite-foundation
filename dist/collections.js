/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const COLLECTION_INVARIANTS = Object.freeze({
  "containerWidth": "available",
  "itemWidth": "available",
  "narrowContentDoesNotChangeItemWidth": true,
  "horizontalOverflow": "explicit-only",
  "contentSizedExceptions": [
    "message-bubble",
    "chip",
    "badge",
    "compact-action"
  ]
});
export const COLLECTION_WEB_PROFILE = Object.freeze({
  "tabPanelWidth": "available",
  "multiColumn": "explicit-grid-only"
});
export const COLLECTION_MOBILE_PROFILE = Object.freeze({
  "layout": "single-column",
  "itemWidth": "available"
});
