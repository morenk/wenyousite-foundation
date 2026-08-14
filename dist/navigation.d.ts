/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
import type { IconSemanticId } from "./icons.js";
export type NavigationDestinationId = "discover" | "moments" | "publish" | "messages" | "profile" | "search" | "notifications" | "directMessages" | "bookmarks";
export declare const NAVIGATION_LABELS: Readonly<Record<NavigationDestinationId, string>>;
export declare const NAVIGATION_ICONS: Readonly<Record<NavigationDestinationId, IconSemanticId>>;
export declare const NAVIGATION_INVARIANTS: Readonly<Record<string, string>>;
export declare const NAVIGATION_WEB_PROFILE: Readonly<{
  primary: readonly NavigationDestinationId[];
  accountShortcuts: readonly NavigationDestinationId[];
  publishPresentation: "separate-action";
  profilePresentation: "account-entry";
}>;
export declare const NAVIGATION_MOBILE_PROFILE: Readonly<{
  primary: readonly NavigationDestinationId[];
  messageSections: readonly NavigationDestinationId[];
}>;
