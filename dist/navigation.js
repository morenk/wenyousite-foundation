/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const NAVIGATION_LABELS = Object.freeze({
  "discover": "发现",
  "moments": "动态",
  "publish": "发布",
  "messages": "消息",
  "profile": "我的",
  "search": "搜索",
  "notifications": "通知",
  "directMessages": "私聊",
  "bookmarks": "收藏"
});
export const NAVIGATION_ICONS = Object.freeze({
  "discover": "navigation.home",
  "moments": "navigation.moments",
  "publish": "navigation.publish",
  "messages": "navigation.messages",
  "profile": "navigation.profile",
  "search": "action.search",
  "notifications": "status.notifications",
  "directMessages": "navigation.messages",
  "bookmarks": "action.bookmark"
});
export const NAVIGATION_INVARIANTS = Object.freeze({
  "routeOwner": "client",
  "selectedState": "same-destination-semantics",
  "messageUnreadAggregation": "notifications-plus-direct-messages"
});
export const NAVIGATION_WEB_PROFILE = Object.freeze({
  "primary": [
    "discover",
    "moments",
    "search"
  ],
  "accountShortcuts": [
    "notifications",
    "directMessages",
    "bookmarks"
  ],
  "publishPresentation": "separate-action",
  "profilePresentation": "account-entry"
});
export const NAVIGATION_MOBILE_PROFILE = Object.freeze({
  "primary": [
    "discover",
    "moments",
    "publish",
    "messages",
    "profile"
  ],
  "messageSections": [
    "notifications",
    "directMessages"
  ]
});
