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
