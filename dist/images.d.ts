/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type ImageRoleId = "avatar" | "cover" | "content" | "galleryThumbnail" | "sticker";
export interface ImageRoleContract {
  readonly fit: "cover" | "contain";
  readonly crop: "allowed" | "forbidden";
  readonly shape: "circle" | "rounded" | "content";
  readonly viewer: "none" | "full-source" | "optional";
}
export declare const IMAGE_ROLES: Readonly<Record<ImageRoleId, ImageRoleContract>>;
export declare const IMAGE_INVARIANTS: Readonly<Record<string, string | boolean>>;
export declare const IMAGE_STATES: readonly string[];
export declare const IMAGE_WEB_PROFILE: Readonly<Record<string, string | number | readonly string[]>>;
export declare const IMAGE_MOBILE_PROFILE: Readonly<Record<string, string | number | readonly string[]>>;
