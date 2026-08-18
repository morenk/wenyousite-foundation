/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type FeedbackResourceState = "loading" | "refreshing" | "loading-more" | "empty" | "no-results" | "error" | "offline" | "restricted";
export type FeedbackMutationState = "idle" | "pending" | "success" | "error";
export type OverlayLayerId = "sticky" | "chrome" | "floating" | "popup" | "modalBackdrop" | "modal" | "tooltip" | "nestedPopup" | "globalProgress";
export declare const ACCESSIBILITY_CONTRACT: Readonly<{"contrast":{"normalText":4.5,"largeText":3,"nonText":3},"invariants":{"focusVisible":true,"statusNeverColorOnly":true,"iconOnlyControlHasLabel":true,"reducedMotion":"respect-user","asyncAnnouncement":"polite-unless-critical"},"web":{"keyboardOperable":true,"browserZoom":"preserve-function"},"mobile":{"systemTextScale":true,"safeArea":true,"systemBack":true}}>;
export declare const FEEDBACK_RESOURCE_STATES: readonly FeedbackResourceState[];
export declare const FEEDBACK_MUTATION_STATES: readonly FeedbackMutationState[];
export declare const FEEDBACK_INVARIANTS: Readonly<Record<string, boolean>>;
export declare const FEEDBACK_PRESENTATION: Readonly<{"initialContentLoading":"structure-preserving-skeleton","smallIndeterminateLoading":"spinner","buttonPending":"inline-spinner-preserve-label-width","refresh":"preserve-content-and-mark-busy","stateAnatomy":["icon-optional","title","message-optional","action-optional"]}>;
export declare const FEEDBACK_WEB_PROFILE: Readonly<{ transientChannel: "toast"; asyncLiveRegion: "polite" }>;
export declare const FEEDBACK_MOBILE_PROFILE: Readonly<{ transientChannel: "snackbar"; asyncLiveRegion: "polite" }>;
export declare const OVERLAY_INVARIANTS: Readonly<Record<string, boolean>>;
export declare const OVERLAY_TASKS: Readonly<{"tooltip":"brief-nonessential-help","popover":"anchored-quick-action-selection-or-detail","sheet":"mobile-long-choice-multi-action-or-detail","dialog":"blocking-decision-form-or-confirmation"}>;
export declare const DESTRUCTIVE_ACTION_POLICY: Readonly<{"lowRiskUndoable":"execute-and-offer-undo","irreversibleOrAffectsOthers":"explicit-confirmation","confirmationNamesAction":true,"pendingBlocksDismissal":true}>;
export declare const OVERLAY_WEB_PROFILE: Readonly<{
  layers: Readonly<Record<OverlayLayerId, number>>;
  shadows: Readonly<Record<"popover" | "dialog" | "floating", string>>;
  scrim: Readonly<{ color: string; blurPx: number }>;
  dismiss: readonly ("explicit-control" | "escape")[];
}>;
export declare const OVERLAY_MOBILE_PROFILE: Readonly<{
  elevation: Readonly<Record<"flat" | "floating" | "popup", number>>;
  dismiss: readonly ("explicit-control" | "system-back")[];
  safeArea: true;
}>;
export declare const MOTION_USAGE: Readonly<{"allowed":["state-feedback","expand-collapse","overlay-relationship"],"forbidden":["decorative-drift","list-layout-shift","ambient-loop"],"reducedMotion":"remove-nonessential-and-use-static-skeleton"}>;
