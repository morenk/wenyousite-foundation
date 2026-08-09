/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const IMAGE_ROLES = Object.freeze({
  "avatar": {
    "fit": "cover",
    "crop": "allowed",
    "shape": "circle",
    "viewer": "none"
  },
  "cover": {
    "fit": "cover",
    "crop": "allowed",
    "shape": "rounded",
    "viewer": "full-source"
  },
  "content": {
    "fit": "contain",
    "crop": "forbidden",
    "shape": "rounded",
    "viewer": "full-source"
  },
  "galleryThumbnail": {
    "fit": "cover",
    "crop": "allowed",
    "shape": "rounded",
    "viewer": "full-source"
  },
  "sticker": {
    "fit": "contain",
    "crop": "forbidden",
    "shape": "content",
    "viewer": "optional"
  }
});
export const IMAGE_INVARIANTS = Object.freeze({
  "reserveSpaceWhenDimensionsKnown": true,
  "neverDeriveVariantUrls": true,
  "failureKeepsContext": true,
  "statusNeverColorOnly": true,
  "altText": "contextual-never-filename",
  "decorativeAlt": "empty",
  "contentCropping": "forbidden"
});
export const IMAGE_STATES = Object.freeze([
  "loading",
  "processing",
  "failed",
  "restricted",
  "sensitive"
]);
export const IMAGE_WEB_PROFILE = Object.freeze({
  "viewer": "modal-lightbox",
  "dismiss": [
    "close-button",
    "escape",
    "backdrop"
  ],
  "zoom": [
    "fit",
    "actual-size",
    "wheel",
    "controls"
  ],
  "stickerDisplayMaxRem": 8
});
export const IMAGE_MOBILE_PROFILE = Object.freeze({
  "viewer": "fullscreen-route",
  "dismiss": [
    "back-button",
    "system-back",
    "swipe-down-when-unzoomed"
  ],
  "zoom": [
    "fit",
    "double-tap",
    "pinch",
    "pan"
  ],
  "stickerDisplayMaxDp": 128
});
