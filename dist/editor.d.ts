/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type EditorCapabilityId = "heading" | "bold" | "italic" | "strikethrough" | "image" | "draft" | "more" | "link" | "inline-code" | "quote" | "bullet-list" | "ordered-list" | "hr" | "dice" | "task-list" | "code-block" | "table";
export declare const FOUNDATION_VERSION: "1.0.1";
export declare const EDITOR_CAPABILITY_LABELS: Readonly<Record<EditorCapabilityId, string>>;
export declare const EDITOR_PRIMARY_NARROW: readonly EditorCapabilityId[];
export declare const EDITOR_PRIMARY_WIDE: readonly EditorCapabilityId[];
export declare const EDITOR_MORE_FALLBACK: readonly EditorCapabilityId[];
export declare const EDITOR_MORE_PROGRESSIVE: readonly EditorCapabilityId[];
export declare const EDITOR_SYNTAX_ONLY: readonly EditorCapabilityId[];
export declare const EDITOR_CREATABLE_HEADING_LEVELS: readonly (2 | 3)[];
export declare function editorCapabilityLabels(ids: readonly EditorCapabilityId[]): string[];
