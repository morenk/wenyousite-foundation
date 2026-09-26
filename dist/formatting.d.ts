/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export declare const FORMATTING_CONTRACT: Readonly<{"sourceTimestamp":"preserve","exactTime":{"contexts":["security","audit","wenyou-ledger","appointment","expiry"],"format":"yyyy-MM-dd HH:mm","timezone":"user-local","preserveExistingSeconds":true},"relativeTime":{"relativeWindowSeconds":259200,"justNowSeconds":60,"minutesUntilSeconds":3600,"hoursUntilSeconds":86400,"sameYearFallback":"MM-dd","crossYearFallback":"yyyy-MM-dd","futureBehavior":"absolute","timezone":"user-local","exactValueExposure":["web-title","web-accessible-name","mobile-semantics"],"exposureFormat":"yyyy-MM-dd","exposurePrecision":"date-only","contexts":["post","reply","moment","notification","direct-message","draft","profile"]},"counts":{"compactFrom":10000,"wanFrom":10000,"yiFrom":100000000,"maximumFractionDigits":1,"trimTrailingZero":true,"exactValueExposure":"accessible-name"}}>;
export type WenyouDateInput = Date | string | number;
export declare function formatWenyouDate(value: WenyouDateInput): string;
export declare function formatWenyouExactTime(value: WenyouDateInput): string;
export declare function formatWenyouTime(value: WenyouDateInput, reference?: WenyouDateInput): string;
export declare function formatWenyouCompactCount(value: number): string;
