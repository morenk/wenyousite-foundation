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
export const CONTENT_PRESENTATION = Object.freeze({
  "slots": [
    "title",
    "identity",
    "time",
    "summary",
    "cover",
    "tags",
    "metrics",
    "status",
    "actions"
  ],
  "list": {
    "titleFamily": "body",
    "titleWeight": 600,
    "purpose": "scan-and-enter",
    "summary": "optional-preview",
    "surface": "platform-flat-or-light-card"
  },
  "detail": {
    "titleFamily": "display",
    "titleWeight": 500,
    "purpose": "continuous-reading",
    "summary": "do-not-repeat-list-summary",
    "surface": "continuous-main-flow-with-accessory-panels"
  },
  "invariants": {
    "titlePrecedesSupportingMetadata": true,
    "statusNeverColorOnly": true,
    "nestedCards": "forbidden",
    "domainProfiles": "differences-only"
  }
});
export const COLLECTION_WEB_PROFILE = Object.freeze({
  "tabPanelWidth": "available",
  "multiColumn": "explicit-grid-only"
});
export const COLLECTION_MOBILE_PROFILE = Object.freeze({
  "layout": "single-column",
  "itemWidth": "available"
});
