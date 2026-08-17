/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const FORMATTING_CONTRACT = Object.freeze({
  "relativeTime": {
    "relativeWindowSeconds": 259200,
    "justNowSeconds": 60,
    "minutesUntilSeconds": 3600,
    "hoursUntilSeconds": 86400,
    "sameYearFallback": "MM-dd HH:mm",
    "crossYearFallback": "yyyy-MM-dd HH:mm",
    "futureBehavior": "absolute",
    "timezone": "user-local",
    "exactValueExposure": [
      "web-title",
      "mobile-semantics"
    ]
  },
  "counts": {
    "compactFrom": 10000,
    "wanFrom": 10000,
    "yiFrom": 100000000,
    "maximumFractionDigits": 1,
    "trimTrailingZero": true,
    "exactValueExposure": "accessible-name"
  }
});

const pad2 = (value) => String(value).padStart(2, "0");
const validDate = (value) => {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export function formatWenyouExactTime(value) {
  const date = validDate(value);
  if (!date) return "—";
  return [date.getFullYear(), pad2(date.getMonth() + 1), pad2(date.getDate())].join("-")
    + " " + [pad2(date.getHours()), pad2(date.getMinutes())].join(":");
}

export function formatWenyouTime(value, reference = new Date()) {
  const date = validDate(value);
  const now = validDate(reference);
  if (!date || !now) return "—";
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const policy = FORMATTING_CONTRACT.relativeTime;
  if (seconds >= 0 && seconds < policy.justNowSeconds) return "刚刚";
  if (seconds >= policy.justNowSeconds && seconds < policy.minutesUntilSeconds) return `${Math.floor(seconds / 60)} 分钟前`;
  if (seconds >= policy.minutesUntilSeconds && seconds < policy.hoursUntilSeconds) return `${Math.floor(seconds / 3600)} 小时前`;
  if (seconds >= policy.hoursUntilSeconds && seconds < policy.relativeWindowSeconds) return `${Math.floor(seconds / 86400)} 天前`;
  const datePart = date.getFullYear() === now.getFullYear()
    ? [pad2(date.getMonth() + 1), pad2(date.getDate())].join("-")
    : [date.getFullYear(), pad2(date.getMonth() + 1), pad2(date.getDate())].join("-");
  return datePart + " " + [pad2(date.getHours()), pad2(date.getMinutes())].join(":");
}

const compact = (value, divisor, suffix) => {
  const scaled = Math.round((value / divisor) * 10) / 10;
  return `${Number.isInteger(scaled) ? scaled.toFixed(0) : scaled.toFixed(1)}${suffix}`;
};

export function formatWenyouCompactCount(value) {
  if (!Number.isFinite(value) || value < 0) return "—";
  const count = Math.trunc(value);
  if (count >= FORMATTING_CONTRACT.counts.yiFrom) return compact(count, FORMATTING_CONTRACT.counts.yiFrom, "亿");
  if (count >= FORMATTING_CONTRACT.counts.wanFrom) return compact(count, FORMATTING_CONTRACT.counts.wanFrom, "万");
  return String(count);
}
