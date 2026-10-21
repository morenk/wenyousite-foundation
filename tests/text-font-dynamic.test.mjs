import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";

const bytes = (name) => fs.readFileSync(new URL(`./fixtures/text-font-dynamic/${name}`, import.meta.url));
const read = (name) => JSON.parse(bytes(name));
const source = read("source.json");
const bodySchema = read("markdown-text-font-v2.schema.json");
const body = read("markdown-text-font-v2-fixtures.json");
const dynamic = read("thread-font-dynamic-v2-fixtures.json");
const manifestSchema = read("thread-font-manifest-v2.schema.json");
const policySchema = read("thread-font-runtime-policy-v3.schema.json");
const policy = read("thread-font-runtime-policy-v3.json");
const mapping = read("thread-font-v1-import-map.json");
const legacy = JSON.parse(fs.readFileSync(new URL("./fixtures/text-font/thread-font-catalog-v1.json", import.meta.url)));
const ajv = new Ajv2020({ strict: true, allErrors: true });
const validateBody = ajv.compile(bodySchema);
const validatePolicy = ajv.compile(policySchema);
const validateManifest = ajv.compile(manifestSchema);
const at = (object, path) => path.reduce((node, key) => node[key], object);
const mutate = (object, path, value) => {
  const copy = structuredClone(object);
  at(copy, path.slice(0, -1))[path.at(-1)] = value;
  return copy;
};

test("动态镜像固定生产者提交与原字节，旧协议来源独立保留", () => {
  assert.equal(source.repository, "morenk/wenyousite-backend");
  assert.match(source.commit, /^[a-f0-9]{40}$/);
  assert.equal(source.apiVersion, "5.43.0-dev.20261022.1");
  assert.deepEqual(Object.keys(source.files).sort(), [
    "markdown-text-font-v2-fixtures.json", "markdown-text-font-v2.schema.json",
    "thread-font-dynamic-v2-fixtures.json", "thread-font-manifest-v2.schema.json",
    "thread-font-runtime-policy-v3.json", "thread-font-runtime-policy-v3.schema.json",
    "thread-font-v1-import-map.json",
  ]);
  for (const [name, entry] of Object.entries(source.files)) {
    assert.equal(entry.sourcePath, `contracts/${name}`);
    assert.equal(bytes(name).length, entry.bytes, name);
    assert.equal(crypto.createHash("sha256").update(bytes(name)).digest("hex"), entry.sha256, name);
  }
  const oldSource = JSON.parse(fs.readFileSync(new URL("./fixtures/text-font/source.json", import.meta.url)));
  assert.notEqual(oldSource.commit, source.commit);
  assert.ok(source.references["contracts/openapi.json"]);
  assert.ok(source.references["docs/dynamic-text-fonts.md"]);
});

test("正文接受导入映射外的合法版本身份，拒绝家族身份与任意属性", () => {
  const versionId = `tfv_${"f".repeat(32)}`;
  assert.equal(mapping.fonts.some((font) => font.versionId === versionId), false);
  const value = { version: 2, versionId, content: "未发现字体 中文 é 👨‍👩‍👧‍👦" };
  for (const extra of [{}, { color: "#D14343" }]) assert.equal(validateBody({ ...value, ...extra }), true);
  for (const patch of [
    { version: 1 }, { versionId: dynamic.familyId }, { versionId: "tfv_short" },
    { versionId: versionId.toUpperCase() }, { versionId: `${versionId}0` },
    { content: "" }, { content: "a\nb" }, { content: "a\rb" },
    { color: "#d14343" }, { color: "red" }, { fontId: "legacy" },
    { style: "font-family: arbitrary" }, { url: "https://example.invalid/font" },
  ]) assert.equal(validateBody({ ...value, ...patch }), false, JSON.stringify(patch));
  for (const key of bodySchema.required) {
    const copy = { ...value }; delete copy[key];
    assert.equal(validateBody(copy), false, key);
  }
  // 这是解析结果 Schema 验证，不解析 Markdown，也不把未知身份当作新写许可。
});

test("混合正文能力及降级语料保留 v1，字体与颜色独立协商", () => {
  assert.deepEqual(body.capability, {
    readHeader: "X-Text-Font-Version", writeField: "textFontVersion", version: 2, includesV1: true,
  });
  assert.equal(body.attribute, "data-wenyou-font-v2");
  assert.deepEqual(body.canonicalAttributeOrder, [body.attribute, "data-wenyou-color-v1"]);
  assert.equal(new Set(body.validCases.map(({ id }) => id)).size, body.validCases.length);
  for (const id of ["plain", "bold", "italic", "code", "escaped-block", "mixed", "combined"]) {
    const entry = body.validCases.find((entry) => entry.id === id);
    assert.ok(entry, id);
    for (const field of ["source", "canonical", "v1", "legacy"]) assert.equal(typeof entry[field], "string");
  }
  const mixed = body.validCases.find(({ id }) => id === "mixed");
  assert.match(mixed.v1, /data-wenyou-font-v1/);
  assert.doesNotMatch(mixed.v1, /data-wenyou-font-v2/);
  const combined = body.validCases.find(({ id }) => id === "combined");
  assert.match(combined.v1, /data-wenyou-color-v1/);
  assert.doesNotMatch(combined.legacy, /data-wenyou-/);
  assert.ok(body.invalidSources.length);
});

test("写入预期覆盖未知保留、移除、禁止扩写和旧端覆盖保护", () => {
  const expected = {
    "new-capable-but-disabled": 40020, "unknown-preserve": null, "unknown-remove": null,
    "old-client-cannot-overwrite": 40019, "unknown-expand": 40020, "allowed-new": null,
    "v2-includes-v1": null, "mixed-old-client-refused": 40019,
  };
  assert.equal(new Set(body.writeCases.map(({ id }) => id)).size, body.writeCases.length);
  for (const [id, code] of Object.entries(expected)) {
    const entry = body.writeCases.find((entry) => entry.id === id);
    assert.ok(entry, id); assert.equal(entry.expectedCode, code, id);
  }
  // 验证生产者预期完整性；HTTP、事务复核及 Markdown 投影由生产者和消费者执行。
});

test("选择、粘贴与历史渲染权限彼此独立，撤回优先于旧缓存", () => {
  const expected = {
    "active-current": [true, true, true], historical: [false, true, true],
    disabled: [false, false, true], withdrawn: [false, false, false],
  };
  for (const [id, flags] of Object.entries(expected)) {
    const entry = dynamic.statusCases.find((entry) => entry.id === id);
    assert.ok(entry, id);
    assert.deepEqual([entry.selectable, entry.pasteAllowed, entry.renderAllowed], flags, id);
  }
  assert.equal(dynamic.metadataRules.knownWithdrawn, "sticky-deny");
  assert.equal(dynamic.metadataRules.failure, "retain-last-known-good");
});

test("目录截页、元数据、负缓存与运行策略数值同源", () => {
  assert.equal(dynamic.catalogRules.maxItems, 200);
  assert.equal(dynamic.catalogRules.limitIsUpperBound, true);
  assert.equal(dynamic.catalogRules.maxEnvelopeUtf8Bytes, policy.metadata.reservationBytes);
  assert.equal(dynamic.catalogRules.changedCursorHttpStatus, 409);
  assert.equal(dynamic.catalogRules.changedCursorCode, 40927);
  assert.equal(dynamic.catalogRules.ifNoneMatchStatus, 304);
  assert.equal(dynamic.metadataRules.descriptorMaxEnvelopeUtf8Bytes, policy.metadata.reservationBytes);
  assert.equal(dynamic.metadataRules.runtimeMaxEnvelopeUtf8Bytes, policy.metadata.reservationBytes);
  assert.equal(dynamic.metadataRules.manifestMaxBytes, 4 * 1024 * 1024);
  assert.equal(dynamic.metadataRules.unknownVersionNegativeCacheMs, policy.metadata.negativeCacheMs);
  assert.equal(dynamic.metadataRules.refreshMs, policy.metadata.revalidateAfterMs);
  assert.deepEqual(dynamic.metadataRules.refreshTriggers, ["foreground", "picker-open", "unknown-version"]);
  assert.equal(dynamic.metadataRules.coalescingKey, "endpoint-and-versionId");
});

test("动态策略 v3 不接受固定家族数、manifest 绑定或旧快照字段", () => {
  assert.equal(validatePolicy(policy), true, JSON.stringify(validatePolicy.errors));
  assert.equal(policy.policyVersion, dynamic.policyVersion);
  assert.equal(policy.fontVersion, dynamic.fontVersion);
  for (const [path, value] of [
    [["policyVersion"], 2], [["fontVersion"], 1], [["manifestSha256"], "a".repeat(64)],
    [["web", "residency", "maxFamilies"], 28],
    [["mobile", "registration", "mode"], "fixed-manifest"],
    [["mobile", "registration", "snapshot"], {}],
    [["mobile", "registration", "maxAttemptsPerKey"], 2],
    [["mobile", "registration", "failedAttempt"], "refund"],
  ]) assert.equal(validatePolicy(mutate(policy, path, value)), false, path.join("."));
  function rejectShapeChanges(schema, value, path = []) {
    if (schema.type !== "object") return;
    assert.equal(validatePolicy(mutate(policy, [...path, "unexpected"], true)), false, path.join("."));
    for (const key of schema.required) {
      const copy = structuredClone(policy); delete at(copy, path)[key];
      assert.equal(validatePolicy(copy), false, [...path, key].join("."));
    }
    for (const [key, child] of Object.entries(schema.properties)) rejectShapeChanges(child, value[key], [...path, key]);
  }
  rejectShapeChanges(policySchema, policy);
});

test("动态预算允许服务器收紧，拒绝零值、小数及超过本地上限", () => {
  let ranges = 0;
  function verifyRanges(schema, path = []) {
    if (schema.minimum !== undefined && schema.maximum !== undefined) {
      ranges += 1;
      for (const value of [schema.minimum, schema.maximum]) {
        assert.equal(validatePolicy(mutate(policy, path, value)), true, `${path}/${value}`);
      }
      for (const value of [schema.minimum - 1, schema.maximum + 1, schema.minimum + 0.5]) {
        assert.equal(validatePolicy(mutate(policy, path, value)), false, `${path}/${value}`);
      }
    }
    for (const [key, child] of Object.entries(schema.properties ?? {})) verifyRanges(child, [...path, key]);
  }
  verifyRanges(policySchema);
  assert.equal(ranges, 11);
  assert.equal(policy.mobile.registration.maxInputBytes, 64 * 1024 * 1024);
  assert.equal(policy.mobile.registration.maxKeys, 1024);
  assert.equal(policy.diskCacheBytes, 64 * 1024 * 1024);
});

test("动态账本语料保留跨发布失败占用、别名收费和超限静默回退", () => {
  const cases = Object.fromEntries(dynamic.ledgerCases.map((entry) => [entry.id, entry]));
  assert.equal(Object.keys(cases).length, dynamic.ledgerCases.length);
  assert.equal(cases["new-release-does-not-reset"].requestsCharged, 1);
  assert.equal(cases["new-release-does-not-reset"].nativeKeysCharged, 1);
  assert.equal(cases["same-hash-new-family-charged"].nativeKeysCharged, 2);
  assert.equal(cases["native-budget-exhausted"].inputBytes, policy.mobile.registration.maxInputBytes);
  assert.equal(cases["native-keys-exhausted"].keys, policy.mobile.registration.maxKeys);
  for (const id of ["native-budget-exhausted", "native-keys-exhausted"]) {
    assert.equal(cases[id].expected, "silent-system-fallback");
  }
  // 不执行 FlutterEngine，也不把输入成本当成 RSS 测量。
});

test("单版本清单 Schema 拒绝可变状态、外链和缺失描述符", () => {
  // 仅用于结构验证的合成对象，不是可下载的生产者产物或字形覆盖证据。
  const asset = (format) => ({ sha256: "a".repeat(64), bytes: 1, format });
  const manifest = {
    manifestVersion: 2, buildKey: "b".repeat(64), sourceSha256: "c".repeat(64),
    baseWeight: 400, baseStyle: "normal", coverage: { codepointCount: 1, unicodeRanges: ["U+0041"] },
    shards: [{ id: "core", family: `WYF2-${"d".repeat(32)}-core`, unicodeRanges: ["U+0041"],
      codepointCount: 1, web: asset("woff2"), mobile: asset("ttf") }],
    notices: [asset("json")], specimen: asset("png"),
  };
  assert.equal(validateManifest(manifest), true, JSON.stringify(validateManifest.errors));
  assert.equal(validateManifest(mutate(manifest, ["shards", 0, "mobile", "format"], "otf")), true);
  for (const [path, value] of [
    [["status"], "published"], [["selectable"], true], [["versionId"], dynamic.versionId],
    [["manifestVersion"], 1], [["shards"], []], [["notices"], []],
    [["shards", 0, "family"], "Display Name"], [["coverage", "codepointCount"], 0],
    [["shards", 0, "web", "url"], "https://example.invalid/font"],
    [["shards", 0, "web", "sha256"], "bad"], [["shards", 0, "web", "format"], "zip"],
    [["shards", 0, "mobile", "bytes"], 67108865],
  ]) assert.equal(validateManifest(mutate(manifest, path, value)), false, path.join("."));
  for (const key of manifestSchema.required) {
    const copy = structuredClone(manifest); delete copy[key];
    assert.equal(validateManifest(copy), false, key);
  }
  // 角色对应格式、Unicode 标量/区间并集、字节上限、SHA 实物及状态网关须另行语义验证；Schema 单独不能证明。
});

test("历史导入映射覆盖旧 28 款且小城退役，不成为动态 ID 白名单", () => {
  assert.equal(mapping.mappingVersion, 1);
  assert.deepEqual(mapping.retired, ["xiaocheng-lafeng"]);
  assert.deepEqual(mapping.fonts.map(({ legacyId }) => legacyId), legacy.fonts.map(({ id }) => id));
  for (const key of ["legacyId", "familyId", "versionId"]) {
    assert.equal(new Set(mapping.fonts.map((font) => font[key])).size, mapping.fonts.length, key);
  }
  for (const font of mapping.fonts) {
    assert.match(font.familyId, /^tff_[a-f0-9]{32}$/);
    assert.equal(validateBody({ version: 2, versionId: font.versionId, content: "历史映射" }), true);
  }
});

test("可信导入保留 WYF1 alias，跨协议夹具要求相同注册键零新增尝试", () => {
  const validateFamily = ajv.compile(manifestSchema.properties.shards.items.properties.family);
  for (const family of [`WYF2-${"a".repeat(32)}-core`, `WYF1-${"a".repeat(16)}-core`]) {
    assert.equal(validateFamily(family), true, family);
  }
  for (const family of [`WYF1-${"a".repeat(32)}-core`, `WYF2-${"a".repeat(16)}-core`,
    `WYF1-${"A".repeat(16)}-core`, "Display Name", "WYF1-arbitrary-core"]) {
    assert.equal(validateFamily(family), false, family);
  }
  assert.equal(mapping.preserveAssetFamily, true);
  const legacySource = JSON.parse(fs.readFileSync(new URL("./fixtures/text-font/source.json", import.meta.url)));
  assert.equal(mapping.sourceManifestSha256, legacySource.references["contracts/thread-font-manifest-v1.json"].sha256);
  assert.equal(mapping.sourceManifestSha256, source.references["contracts/thread-font-manifest-v1.json"].sha256);
  const cases = dynamic.legacyImportRegistrationCases;
  assert.ok(cases.some(({ id }) => id === "v1-then-imported-v2-no-additional-native-attempt"));
  assert.equal(new Set(cases.map(({ id }) => id)).size, cases.length);
  for (const entry of cases) {
    assert.ok(mapping.fonts.some(({ legacyId }) => legacyId === entry.legacyId));
    assert.equal(entry.sourceManifestSha256, mapping.sourceManifestSha256);
    assert.deepEqual(entry.events.map(({ protocol }) => protocol), [1, 2]);
    const [legacyEvent, importedEvent] = entry.events;
    assert.match(legacyEvent.family, /^WYF1-/);
    for (const event of entry.events) assert.equal(validateFamily(event.family), true);
    for (const key of ["sha256", "family", "bytes"]) assert.equal(importedEvent[key], legacyEvent[key], key);
    assert.equal(entry.expectedNativeAttempts, 1);
    assert.equal(entry.expectedAdditionalAttemptsAfterImport, 0);
    assert.equal(entry.expectedChargedBytes, legacyEvent.bytes);
  }
  // 只核对生产者轨迹与绑定；源清单实物在同步时核验，真实引擎去重由 Mobile 执行。
});
