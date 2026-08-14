/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type NotificationGroupId = "interaction" | "subscription" | "system";
export type NotificationEventType = "reply" | "mention" | "follow" | "like" | "new_post" | "thread_created" | "tip" | "level_up" | "system";
export interface NotificationGroupContract {
  readonly id: NotificationGroupId;
  readonly label: string;
  readonly types: readonly NotificationEventType[];
}
export declare const NOTIFICATION_ALL_LABEL: "全部";
export declare const NOTIFICATION_GROUPS: readonly NotificationGroupContract[];
export declare const NOTIFICATION_INVARIANTS: Readonly<{
  eventTypeOwner: "backend-notification-contract";
  unknownTypeVisibility: "all";
}>;
