/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const NOTIFICATION_ALL_LABEL = "全部";
export const NOTIFICATION_GROUPS = Object.freeze([
  {
    "id": "interaction",
    "label": "互动",
    "types": [
      "reply",
      "mention",
      "follow",
      "like"
    ]
  },
  {
    "id": "subscription",
    "label": "订阅",
    "types": [
      "new_post",
      "thread_created"
    ]
  },
  {
    "id": "system",
    "label": "系统",
    "types": [
      "tip",
      "level_up",
      "system"
    ]
  }
]);
export const NOTIFICATION_INVARIANTS = Object.freeze({
  "eventTypeOwner": "backend-notification-contract",
  "unknownTypeVisibility": "all"
});
