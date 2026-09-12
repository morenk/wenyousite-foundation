/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const ACTION_CONTROL_CONTRACT = Object.freeze({
  "roles": [
    "primary",
    "secondary",
    "quiet",
    "destructive",
    "link"
  ],
  "invariants": {
    "onePrimaryPerDecisionRegion": true,
    "pendingPreservesDimensions": true,
    "pendingPreventsDuplicateSubmit": true,
    "disabledRemainsLegible": true,
    "iconOnlyHasAccessibleName": true
  }
});
export const FIELD_CONTROL_CONTRACT = Object.freeze({
  "anatomy": [
    "label",
    "control",
    "helper-or-error"
  ],
  "states": [
    "default",
    "focus",
    "disabled",
    "read-only",
    "error"
  ],
  "invariants": {
    "placeholderNeverReplacesLabel": true,
    "errorBoundToField": true,
    "requiredHasNonColorCue": true
  }
});
export const SELECTION_CONTROL_CONTRACT = Object.freeze({
  "patterns": [
    "tabs",
    "filter",
    "sort",
    "single-select",
    "multi-select"
  ],
  "invariants": {
    "selectedHasNonColorCue": true,
    "clearOnlyWhenSelectionExists": true,
    "selectionDoesNotImplySubmission": true
  }
});
export const PROGRESS_CONTROL_CONTRACT = Object.freeze({
  "roles": [
    "level",
    "upload",
    "operation"
  ],
  "levelFill": "current-level-tier",
  "track": "muted",
  "showPercentWhenActionable": true,
  "indeterminateUsesSpinner": true
});
export const CONTROL_WEB_PROFILE = Object.freeze({
  "minimumTargetPx": 40,
  "compactTargetPx": 32
});
export const CONTROL_MOBILE_PROFILE = Object.freeze({
  "minimumTargetDp": 48
});
export const READING_QUICK_SCROLL_MOBILE_PROFILE = Object.freeze({
  "minimumTarget": 48,
  "railThickness": 2,
  "railMaxLength": 360,
  "thumbWidth": 8,
  "thumbHeight": 40,
  "backingWidth": 24,
  "backingHeight": 48,
  "backingOpacity": 0.92,
  "railOpacity": 0.24,
  "edgeGap": 8,
  "labelGap": 8,
  "cardMaxWidth": 280,
  "thumbForeground": "brandStrong",
  "backingSurface": "surface",
  "labelSurface": "surface",
  "labelForeground": "foreground",
  "railInteractive": false,
  "viewportResize": false,
  "fullTrackBackdrop": false,
  "activation": "explicit-icon",
  "placement": "right-centered-reading-viewport",
  "dragMapping": "reading-distance",
  "dragLabel": "actual-visible-location",
  "releaseBehavior": "finish-last-input-stop-follow-and-hide-label",
  "cancelBehavior": "clear-pending-on-cancel-close-or-scope-change",
  "tailHoldBehavior": "follow-loaded-content-until-release-or-leave",
  "tapBehavior": "local-actions-card",
  "outsidePointerBehavior": "dismiss-card-and-pass-through",
  "closeTriggers": [
    "toggle",
    "collapse-action",
    "editor",
    "keyboard",
    "subpost-change",
    "filter-change",
    "sort-change"
  ],
  "actions": [
    "start",
    "loaded-end-or-end",
    "collapse",
    "retry"
  ],
  "keyboard": [
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End"
  ],
  "accessibility": "adjustable-slider-with-current-location"
});
