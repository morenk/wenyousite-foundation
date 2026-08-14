/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type LanguageNounId = "thread" | "subthread" | "post" | "reply" | "moment" | "notification" | "directMessage" | "bookmark";
export type LanguageActionId = "publish" | "save" | "delete" | "hide" | "restore" | "retry" | "cancel" | "close";
export declare const LANGUAGE_NOUNS: Readonly<Record<LanguageNounId, string>>;
export declare const LANGUAGE_ACTIONS: Readonly<Record<LanguageActionId, string>>;
export declare const LANGUAGE_INVARIANTS: Readonly<Record<string, boolean>>;
