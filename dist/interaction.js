/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const ACCESSIBILITY_CONTRACT = Object.freeze({
  "contrast": {
    "normalText": 4.5,
    "largeText": 3,
    "nonText": 3
  },
  "invariants": {
    "focusVisible": true,
    "statusNeverColorOnly": true,
    "iconOnlyControlHasLabel": true,
    "reducedMotion": "respect-user",
    "asyncAnnouncement": "polite-unless-critical"
  },
  "web": {
    "keyboardOperable": true,
    "browserZoom": "preserve-function"
  },
  "mobile": {
    "systemTextScale": true,
    "safeArea": true,
    "systemBack": true
  }
});
export const FEEDBACK_RESOURCE_STATES = Object.freeze([
  "loading",
  "refreshing",
  "loading-more",
  "empty",
  "no-results",
  "error",
  "offline",
  "restricted"
]);
export const FEEDBACK_MUTATION_STATES = Object.freeze([
  "idle",
  "pending",
  "success",
  "error"
]);
export const FEEDBACK_INVARIANTS = Object.freeze({
  "initialLoadingOwnsRegion": true,
  "refreshPreservesContent": true,
  "paginationPreservesContent": true,
  "pendingPreventsDuplicateSubmit": true,
  "retryOnlyWhenSafe": true,
  "emptyActionOnlyWhenExecutable": true,
  "blockingFailureStaysInContext": true,
  "transientFeedbackNeverSoleCriticalResult": true
});
export const FEEDBACK_WEB_PROFILE = Object.freeze({
  "transientChannel": "toast",
  "asyncLiveRegion": "polite"
});
export const FEEDBACK_MOBILE_PROFILE = Object.freeze({
  "transientChannel": "snackbar",
  "asyncLiveRegion": "polite"
});
export const OVERLAY_INVARIANTS = Object.freeze({
  "modalBlocksBackground": true,
  "explicitClosePath": true,
  "restoreFocus": true,
  "backdropNeverSoleDismissal": true
});
export const OVERLAY_WEB_PROFILE = Object.freeze({
  "layers": {
    "sticky": 30,
    "chrome": 40,
    "floating": 60,
    "popup": 70,
    "modalBackdrop": 80,
    "modal": 81,
    "tooltip": 90,
    "nestedPopup": 100,
    "globalProgress": 110
  },
  "shadows": {
    "popover": "0 12px 32px rgb(52 47 62 / 12%)",
    "dialog": "0 24px 64px rgb(52 47 62 / 16%)",
    "floating": "0 10px 28px rgb(52 47 62 / 14%)"
  },
  "scrim": {
    "color": "rgb(52 47 62 / 40%)",
    "blurPx": 1
  },
  "dismiss": [
    "explicit-control",
    "escape"
  ]
});
export const OVERLAY_MOBILE_PROFILE = Object.freeze({
  "elevation": {
    "flat": 0,
    "floating": 2,
    "popup": 4
  },
  "dismiss": [
    "explicit-control",
    "system-back"
  ],
  "safeArea": true
});
