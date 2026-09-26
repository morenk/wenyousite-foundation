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
export const ADAPTIVE_READING_SCROLL_MOBILE_PROFILE = Object.freeze({
  "scope": [
    "topic-detail",
    "standalone-subpost",
    "moment-detail"
  ],
  "excludedScope": [
    "moment-feed"
  ],
  "collapsedWidth": 2,
  "collapsedHeight": 24,
  "expandedWidth": 8,
  "expandedHeight": 56,
  "expandedBackingWidth": 24,
  "expandedBackingHeight": 64,
  "expandedBackingOpacity": 0.92,
  "minimumTargetWidth": 48,
  "minimumTargetHeight": 64,
  "edgeGap": 8,
  "labelGap": 8,
  "indicatorForeground": "brandStrong",
  "expandedBackingSurface": "surface",
  "labelSurface": "surface",
  "labelForeground": "foreground",
  "cornerRadius": "pill",
  "geometryModel": "single-indicator-shape-invariant-center",
  "trackExtent": "available-reading-height",
  "trackVisual": "none",
  "backingBehavior": "expanded-only-fade-with-expansion",
  "avoidInsets": [
    "sticky-header",
    "composer-entry",
    "system-safe-area",
    "system-gesture-area"
  ],
  "viewportResize": false,
  "activation": "adaptive-fast-user-scroll",
  "eligibleInput": "primary-vertical-reading-list-touch",
  "sampleWindowMs": 100,
  "minimumSampleDurationMs": 50,
  "minimumSameDirectionDistance": 48,
  "minimumAverageVelocity": 650,
  "minimumViewportVelocityFactor": 0.9,
  "velocityThresholdRule": "max-of-absolute-and-viewport-relative",
  "directionChangeBehavior": "clear-samples",
  "excludedActivationSources": [
    "programmatic-navigation",
    "deep-link",
    "layout-change",
    "image-height-change",
    "horizontal-carousel",
    "overscroll-rebound"
  ],
  "flingBehavior": "continue-only-after-activation",
  "activationLatchBehavior": "stay-expanded-after-trigger",
  "gestureHandoff": "current-reading-gesture-remains-owned-next-pointer-can-drag",
  "expandDurationMs": 180,
  "expandCurve": "easeOutCubic",
  "expandOvershoot": false,
  "resumeExpansionFromCurrentValue": true,
  "dragStartBehavior": "stop-inertia-map-current-position-with-grab-offset",
  "dragMapping": "loaded-reading-distance-over-frozen-track",
  "dragScrollBehavior": "direct-follow-no-easing",
  "frameUpdateBehavior": "coalesce-latest-per-frame",
  "dragGeometryBehavior": "freeze-until-release",
  "expandedDuringDrag": true,
  "releaseBehavior": "apply-final-input-then-clear-stale-queue-and-tail-follow-before-scroll-idle",
  "expandedHoldMs": 1500,
  "collapseDurationMs": 240,
  "collapseCurve": "easeInOutCubic",
  "collapsedHoldMs": 600,
  "fadeDurationMs": 180,
  "slowReadHoldMs": 1500,
  "slowReadBehavior": "collapsed-wait-for-scroll-idle-hold-1500-then-fade-180",
  "pointerCapture": "expanded-indicator-only",
  "trackTapBehavior": "pass-through",
  "tapBehavior": "consume-without-menu-navigation-or-jump",
  "dragLabel": "drag-only-actual-visible-content-location",
  "incompleteEndLabel": "loaded-range-not-complete-end",
  "tailHoldBehavior": "follow-existing-content-growth-while-held-at-loaded-end",
  "paginationBehavior": "consumer-owned-unchanged",
  "clearTriggers": [
    "scope-change",
    "account-change",
    "filter-change",
    "sort-change",
    "subpost-change",
    "editor",
    "ime",
    "route-leave",
    "cancel",
    "controller-dispose"
  ],
  "cancelBehavior": "clear-pending-input-without-applying-unpainted-update",
  "automaticVisibilityBehavior": "never-navigate-or-move-content",
  "reducedMotionBehavior": "switch-shape-without-animation",
  "focusBehavior": "keep-expanded-while-keyboard-or-talkback-accessible",
  "keyboard": [
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End"
  ],
  "accessibility": "persistent-adjustable-slider-with-current-location",
  "accessibilityStep": "one-viewport",
  "emptyBehavior": "hidden-when-not-scrollable",
  "legacyEntryBehavior": "removed-retain-icon-asset-only",
  "legacyActionsCardBehavior": "removed"
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
