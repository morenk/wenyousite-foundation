/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const AUDIO_UPLOAD = Object.freeze({
  "source": "file-picker-only",
  "defaultToolbarPlacement": "more",
  "preferenceScope": "local-per-platform",
  "composerPreference": "shared-thread-reply",
  "toolbarPreview": "actual-editor-layout",
  "arrangement": "direct-drag",
  "sourceLimitsOwner": "backend-contract"
});
export const AUDIO_PRESENTATION = Object.freeze({
  "layout": "compact-inline-body-width",
  "controls": [
    "play-pause",
    "seek",
    "elapsed-duration"
  ],
  "filename": "when-needed",
  "waveform": "none",
  "cover": "none",
  "persistentInstructions": false,
  "list": "summary-only",
  "surfaceToken": "surface",
  "foregroundToken": "foreground",
  "secondaryForegroundToken": "mutedForeground",
  "progressToken": "brandStrong",
  "radiusRole": "compact",
  "typographyRole": "body",
  "timeTypographyRole": "utility",
  "controlTarget": "platform-minimum"
});
export const AUDIO_PLAYBACK = Object.freeze({
  "sourceLoading": "explicit-play-only",
  "preload": "none",
  "autoplay": false,
  "concurrency": "one-active-per-page",
  "pauseOn": [
    "page-inactive",
    "background",
    "audio-interruption"
  ],
  "resume": "explicit-play-only",
  "failure": "inline-explicit-retry",
  "automaticRetry": false,
  "seek": "native-range-playback",
  "sourceUrlOwner": "backend-contract",
  "urlDerivation": "forbidden"
});
export const AUDIO_ACCESSIBILITY = Object.freeze({
  "playLabel": "播放",
  "pauseLabel": "暂停",
  "seekLabel": "播放进度",
  "retryLabel": "重试",
  "seekControl": "adjustable",
  "timeAnnouncement": "user-interaction-only",
  "status": "text-and-semantics",
  "reducedMotion": "respect-system"
});
