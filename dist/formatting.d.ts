/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export declare const FORMATTING_CONTRACT: Readonly<{"relativeTime":{"relativeWindowSeconds":259200,"justNowSeconds":60,"minutesUntilSeconds":3600,"hoursUntilSeconds":86400,"sameYearFallback":"MM-dd HH:mm","crossYearFallback":"yyyy-MM-dd HH:mm","futureBehavior":"absolute","timezone":"user-local","exactValueExposure":["web-title","mobile-semantics"]},"counts":{"compactFrom":10000,"wanFrom":10000,"yiFrom":100000000,"maximumFractionDigits":1,"trimTrailingZero":true,"exactValueExposure":"accessible-name"}}>;
export type WenyouDateInput = Date | string | number;
export declare function formatWenyouExactTime(value: WenyouDateInput): string;
export declare function formatWenyouTime(value: WenyouDateInput, reference?: WenyouDateInput): string;
export declare function formatWenyouCompactCount(value: number): string;
