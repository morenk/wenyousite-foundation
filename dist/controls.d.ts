/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type ActionControlRole = "primary" | "secondary" | "quiet" | "destructive" | "link";
export type FieldControlState = "default" | "focus" | "disabled" | "read-only" | "error";
export type SelectionControlPattern = "tabs" | "filter" | "sort" | "single-select" | "multi-select";
export type ProgressControlRole = "level" | "upload" | "operation";
export declare const ACTION_CONTROL_CONTRACT: Readonly<{"roles":["primary","secondary","quiet","destructive","link"],"invariants":{"onePrimaryPerDecisionRegion":true,"pendingPreservesDimensions":true,"pendingPreventsDuplicateSubmit":true,"disabledRemainsLegible":true,"iconOnlyHasAccessibleName":true}}>;
export declare const FIELD_CONTROL_CONTRACT: Readonly<{"anatomy":["label","control","helper-or-error"],"states":["default","focus","disabled","read-only","error"],"invariants":{"placeholderNeverReplacesLabel":true,"errorBoundToField":true,"requiredHasNonColorCue":true}}>;
export declare const SELECTION_CONTROL_CONTRACT: Readonly<{"patterns":["tabs","filter","sort","single-select","multi-select"],"invariants":{"selectedHasNonColorCue":true,"clearOnlyWhenSelectionExists":true,"selectionDoesNotImplySubmission":true}}>;
export declare const PROGRESS_CONTROL_CONTRACT: Readonly<{"roles":["level","upload","operation"],"levelFill":"current-level-tier","track":"muted","showPercentWhenActionable":true,"indeterminateUsesSpinner":true}>;
export declare const CONTROL_WEB_PROFILE: Readonly<{"minimumTargetPx":40,"compactTargetPx":32}>;
export declare const CONTROL_MOBILE_PROFILE: Readonly<{"minimumTargetDp":48}>;
