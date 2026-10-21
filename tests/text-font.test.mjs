import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import test from "node:test";
import Ajv from "ajv";
import Ajv2020 from "ajv/dist/2020.js";

const bytes = (name) => fs.readFileSync(new URL(`./fixtures/text-font/${name}`, import.meta.url));
const read = (name) => JSON.parse(bytes(name));
const source = read("source.json");
const schema = read("markdown-text-font-v1.schema.json");
const fixtures = read("markdown-text-font-v1-fixtures.json");
const catalog = read("thread-font-catalog-v1.json");
const validate = new Ajv2020({ strict: true }).compile(schema);
const policy = read("thread-font-runtime-policy-v2.json");
const policySchema = read("thread-font-runtime-policy-v2.schema.json");
const policyFixtures = read("thread-font-runtime-policy-v2-fixtures.json");
const validatePolicy = new Ajv({ strict: true }).compile(policySchema);

test("Backend 字体测试镜像保留精确提交、原始字节与源路径", () => {
  assert.equal(source.repository, "morenk/wenyousite-backend");
  assert.match(source.commit, /^[a-f0-9]{40}$/);
  assert.deepEqual(Object.keys(source.files).sort(), [
    "markdown-text-font-v1-fixtures.json", "markdown-text-font-v1.schema.json", "thread-font-catalog-v1.json",
    "thread-font-runtime-policy-v2-fixtures.json", "thread-font-runtime-policy-v2.json", "thread-font-runtime-policy-v2.schema.json",
  ]);
  for (const [name, entry] of Object.entries(source.files)) {
    const content = bytes(name);
    assert.equal(entry.sourcePath, `contracts/${name}`);
    assert.equal(content.length, entry.bytes, name);
    assert.equal(crypto.createHash("sha256").update(content).digest("hex"), entry.sha256, name);
  }
});

test("运行策略 v2 严格校验并绑定未改字节的 manifest，旧 limits 保留累计含义", () => {
  assert.equal(validatePolicy(policy), true, JSON.stringify(validatePolicy.errors));
  assert.equal(policy.policyVersion, policyFixtures.policyVersion);
  const manifestHash = source.references["contracts/thread-font-manifest-v1.json"].sha256;
  assert.equal(policy.manifestSha256, manifestHash);
  assert.equal(policyFixtures.legacyManifestSha256, manifestHash);
  assert.equal(policyFixtures.legacyLimits.maxSessionFamilies, 8);
  assert.equal(policyFixtures.legacyLimits.maxMobileRegisteredFaces, 32);
  assert.equal(policy.web.residency.mode, "lease-lru");
  assert.equal(policy.mobile.registration.mode, "fixed-manifest");
  assert.equal(policy.mobile.network.originalWindowBytes, 0);
  assert.equal(policy.web.network.originalWindowBytes, policy.originalAsset.bytes);
  // 哈希语法校验不能替代绑定验证；资产可用、新写许可也不由策略放行。
});

test("生产者无效策略及嵌套扩展被拒绝，快照接受边界不能由远端扩大", () => {
  assert.ok(policyFixtures.invalidPolicies.length);
  for (const { path, value } of policyFixtures.invalidPolicies) {
    const mutated = structuredClone(policy);
    const keys = path.split(".");
    const last = keys.pop();
    const target = keys.reduce((node, key) => node[key], mutated);
    assert.ok(Object.hasOwn(target, last), path);
    target[last] = value;
    assert.equal(validatePolicy(mutated), false, path);
  }
  for (const path of [[], ["web"], ["web", "network"], ["web", "residency"],
    ["mobile", "registration"], ["mobile", "registration", "snapshot"], ["retry"]]) {
    const mutated = structuredClone(policy);
    path.reduce((node, key) => node[key], mutated).unexpected = true;
    assert.equal(validatePolicy(mutated), false, path.join("."));
  }
  for (const key of policySchema.required) {
    const mutated = structuredClone(policy);
    delete mutated[key];
    assert.equal(validatePolicy(mutated), false, key);
  }
  for (const entry of policyFixtures.snapshotCases) {
    const mutated = structuredClone(policy);
    Object.assign(mutated.mobile.registration.snapshot, {
      assetCount: entry.uniqueAssets, registrationCount: entry.uniqueAssets,
      totalAssetBytes: entry.totalAssetBytes, totalRegistrationAssetBytes: entry.totalAssetBytes,
    });
    assert.equal(validatePolicy(mutated), entry.expected === "accept", entry.id);
  }
});

test("运行策略语料包含激活降级、窗口边界、退避、原生失败和 SFNT 估算场景", () => {
  const requiredCases = {
    activationCases: ["matching", "old-backend", "unknown-version", "unpublished", "different-manifest"],
    notBeforeCases: ["server-wait", "window-wait", "date-wait", "invalid-retry-after"],
    windowCases: ["full-before-boundary", "renew-at-boundary"],
    originalCases: ["failed-download-renews", "failed-download-waits", "failed-native-stays-quarantined"],
    snapshotCases: ["current", "too-many", "too-large"],
    sfntEstimateCases: ["woff2-expanded-tables", "mobile-larger"],
  };
  for (const [name, ids] of Object.entries(requiredCases)) {
    const cases = policyFixtures[name];
    assert.equal(new Set(cases.map(({ id }) => id)).size, cases.length, name);
    for (const id of ids) assert.ok(cases.some((entry) => entry.id === id), `${name}/${id}`);
  }
  assert.ok(policyFixtures.backoffCases.some(({ random }) => random === 0));
  assert.ok(policyFixtures.backoffCases.some(({ failureCount }) => failureCount > policy.retry.delayCeilingsMs.length));
  // 本仓验证 Schema 与固定语料完整性，不复制窗口、时钟、网络或原生注册实现。
});

test("解析结果 Schema 与后端目录身份一致，资源未就绪不删除持久化身份", () => {
  const ids = catalog.fonts.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(schema.properties.fontId.enum, ids);
  for (const fontId of ids) {
    for (const extra of [{}, { color: "#D14343" }]) {
      assert.equal(validate({ version: 1, fontId, content: "中文 Hello 👨‍👩‍👧‍👦 é", ...extra }), true);
    }
  }
  // Schema 表达可保源的身份；ready 与新写许可仍由后端业务能力决定。
  assert.ok(catalog.fonts.every(({ availability }) => ["ready", "pendingSource"].includes(availability)));
});

test("最终目录保留三种语言分类，29 款全部资源就绪", () => {
  assert.equal(catalog.catalogVersion, "1.1.1");
  const groups = { zh: [], ja: [], en: [] };
  for (const font of catalog.fonts) {
    assert.ok(Object.hasOwn(groups, font.designLanguage), font.id);
    groups[font.designLanguage].push(font.id);
  }
  assert.deepEqual(Object.fromEntries(Object.entries(groups).map(([key, ids]) => [key, ids.length])), {
    zh: 13, ja: 10, en: 6,
  });
  for (const id of ["shinsyoku-mincho", "hakkou-mincho", "bouken-gothic", "kaitou-yokoku-gothic"]) {
    assert.ok(groups.ja.includes(id), id);
  }
  assert.equal(catalog.fonts.filter(({ availability }) => availability === "ready").length, 29);
  assert.deepEqual(catalog.fonts.filter(({ availability }) => availability === "pendingSource"), []);
  assert.equal(catalog.fonts.some(({ id }) => id === "zcoolxiaowei"), false);
  // 固定源快照的分类与状态；客户端对未知语言的回退仍由各端验证。
});

test("解析结果拒绝未知身份、任意样式、跨行、空内容和非规范颜色", () => {
  const valid = { version: 1, fontId: catalog.fonts[0].id, content: "正文" };
  for (const patch of [
    { fontId: "missing-font" }, { fontId: "Arial" }, { fontId: "https://example.com/font.ttf" },
    { version: 2 }, { version: "1" }, { content: "" }, { content: "跨\n行" }, { content: "跨\r行" },
    { color: "#d14343" }, { color: "#123" }, { color: "#12345678" },
    { style: "font-family:Arial" }, { fontUrl: "https://example.com/font.ttf" },
  ]) assert.equal(validate({ ...valid, ...patch }), false, JSON.stringify(patch));
  for (const key of schema.required) {
    const value = { ...valid };
    delete value[key];
    assert.equal(validate(value), false, key);
  }
});

test("共享语料保留四种读取投影、组合格式和写入保护案例", () => {
  assert.equal(fixtures.version, 1);
  assert.deepEqual(fixtures.capability, { readHeader: "X-Text-Font-Version", writeField: "textFontVersion", version: 1 });
  assert.deepEqual(fixtures.canonicalAttributeOrder, ["data-wenyou-font-v1", "data-wenyou-color-v1"]);
  for (const cases of [fixtures.validCases, fixtures.writeCases]) {
    assert.ok(cases.length);
    assert.equal(new Set(cases.map(({ id }) => id)).size, cases.length);
  }
  for (const entry of fixtures.validCases) {
    for (const name of ["source", "canonical", "fontOnly", "colorOnly", "legacy"]) {
      assert.equal(typeof entry[name], "string", `${entry.id}/${name}`);
      assert.ok(entry[name].length, `${entry.id}/${name}`);
    }
  }
  for (const id of ["plain-color", "code-color", "literal-heading-color", "emoji-color", "reverse-attributes"]) {
    assert.ok(fixtures.validCases.some((entry) => entry.id === id), id);
  }
  for (const id of ["missing-capability-clear", "disabled-create", "disabled-retain", "disabled-remove", "disabled-change"]) {
    assert.ok(fixtures.writeCases.some((entry) => entry.id === id), id);
  }
  assert.ok(fixtures.invalidSources.length);
  assert.ok(fixtures.invalidSources.every((value) => typeof value === "string" && value.length));
  // 此处检查语料完整性，不运行 Markdown 解析、HTTP 写入或资源加载。
});
