import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { formatWenyouDate, formatWenyouTime, formatWenyouExactTime } from "../dist/formatting.js";

const fixtures = JSON.parse(readFileSync(new URL("./formatting-fixtures.json", import.meta.url), "utf8"));
for (const timezone of Object.keys(fixtures.zones)) {
  test(`共享 JS/Dart 用例：${timezone}`, () => {
    const result = spawnSync(process.execPath, ["--input-type=module", "-e", `
      import assert from "node:assert/strict";
      import { formatWenyouDate, formatWenyouTime, formatWenyouExactTime } from ${JSON.stringify(new URL("../dist/formatting.js", import.meta.url).href)};
      for (const fixture of ${JSON.stringify([...fixtures.common, ...fixtures.zones[timezone]])}) {
        assert.equal(formatWenyouTime(fixture.value, fixture.reference), fixture.time, fixture.name + " 正文");
        assert.equal(formatWenyouDate(fixture.value), fixture.date, fixture.name + " 完整日期");
        assert.equal(formatWenyouExactTime(fixture.value), fixture.exact, fixture.name + " 精确时间");
      }
    `], { env: { ...process.env, TZ: timezone }, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.error?.message);
  });
}

test("无效输入与无效参考时间保持占位", () => {
  for (const value of ["invalid-date", new Date(NaN), NaN, Infinity]) {
    assert.equal(formatWenyouDate(value), "—");
    assert.equal(formatWenyouExactTime(value), "—");
    assert.equal(formatWenyouTime(value), "—");
  }
  assert.equal(formatWenyouTime("2026-09-20", "invalid-date"), "—");
});

test("既有 Date/毫秒输入签名保持一致且不修改原值", () => {
  const date = new Date("2026-09-20T02:30:45.123Z");
  const before = date.getTime();
  assert.equal(formatWenyouDate(date), formatWenyouDate(before));
  assert.equal(formatWenyouExactTime(date), formatWenyouExactTime(before));
  assert.equal(formatWenyouTime(date, date), "刚刚");
  assert.equal(date.getTime(), before);
});
