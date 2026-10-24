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

test("运行策略 v2 绑定当前 manifest，历史 manifest 与累计 limits 分别保留", () => {
  assert.equal(validatePolicy(policy), true, JSON.stringify(validatePolicy.errors));
  assert.equal(policy.policyVersion, policyFixtures.policyVersion);
  const manifestHash = source.references["contracts/thread-font-manifest-v1.json"].sha256;
  assert.equal(policy.manifestSha256, manifestHash);
  assert.equal(policyFixtures.manifestSha256, manifestHash);
  assert.equal(policyFixtures.legacyManifestSha256, source.legacyManifest.sha256);
  assert.notEqual(manifestHash, source.legacyManifest.sha256);
  assert.match(source.legacyManifest.commit, /^[a-f0-9]{40}$/);
  assert.equal(source.legacyManifest.sourcePath, "contracts/thread-font-manifest-v1.json");
  assert.equal(policyFixtures.legacyLimits.maxSessionFamilies, 8);
  assert.equal(policyFixtures.legacyLimits.maxMobileRegisteredFaces, 32);
  assert.equal(policy.web.residency.mode, "lease-lru");
  assert.equal(policy.mobile.registration.mode, "fixed-manifest");
  assert.equal(Object.hasOwn(policy, "originalAsset"), false);
  assert.equal(Object.hasOwn(policy.web.residency, "originalSfntBytes"), false);
  for (const { network } of [policy.web, policy.mobile]) {
    assert.equal(Object.hasOwn(network, "originalWindowBytes"), false);
    assert.equal(network.timeoutMode, "idle-with-total-cap");
    assert.equal(network.timeoutMs, 15000);
    assert.equal(network.maxTransferMs, 600000);
  }
  // 哈希语法校验不能替代绑定验证；资产可用、新写许可也不由策略放行。
});

test("生产者无效策略及嵌套扩展被拒绝，快照接受边界不能由远端扩大", () => {
  assert.ok(policyFixtures.invalidPolicies.length);
  for (const { path, value } of policyFixtures.invalidPolicies) {
    const mutated = structuredClone(policy);
    const keys = path.split(".");
    const last = keys.pop();
    const target = keys.reduce((node, key) => node[key], mutated);
    // 部分反向用例故意重新添加已移除的原件槽，末级字段可不存在。
    assert.equal(typeof target, "object", path);
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
  for (const platform of ["web", "mobile"]) {
    for (const key of ["timeoutMode", "maxTransferMs"]) {
      const mutated = structuredClone(policy);
      delete mutated[platform].network[key];
      assert.equal(validatePolicy(mutated), false, `${platform}/${key}`);
    }
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

test("运行策略语料包含激活降级、窗口边界、退避和 SFNT 估算场景", () => {
  const requiredCases = {
    activationCases: ["matching", "old-backend", "unknown-version", "unpublished", "different-manifest"],
    notBeforeCases: ["server-wait", "window-wait", "date-wait", "invalid-retry-after"],
    windowCases: ["full-before-boundary", "renew-at-boundary"],
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

test("传输语料保留持续进度、截止边界、取消和流式上限的生产者预期", () => {
  const expectedOutcomes = {
    "subset-completes-after-100s": "complete",
    "no-first-response": "idle-timeout",
    "headers-do-not-reset-idle": "idle-timeout",
    "empty-chunks-do-not-reset-idle": "idle-timeout",
    "nonempty-chunk-renews-idle": "complete",
    "stalled-after-progress": "idle-timeout",
    "chunk-at-idle-deadline-is-too-late": "idle-timeout",
    "continuous-progress-cannot-extend-total-cap": "total-timeout",
    "completes-before-total-cap": "complete",
    "queue-time-is-excluded": "complete",
    "metadata-streaming-limit-unchanged": "length-rejected",
    "cancel-offscreen": "cancelled",
    "cancel-background": "cancelled",
    "cancel-withdrawn": "cancelled",
  };
  assert.equal(new Set(policyFixtures.transferCases.map(({ id }) => id)).size, policyFixtures.transferCases.length);
  for (const [id, outcome] of Object.entries(expectedOutcomes)) {
    const entry = policyFixtures.transferCases.find((entry) => entry.id === id);
    assert.ok(entry, id);
    assert.equal(entry.expected.outcome, outcome, id);
    assert.ok(entry.events.length, id);
    assert.ok(entry.expected.atMs >= entry.startedAtMs, id);
    assert.ok(entry.expected.acceptedBytes <= entry.byteLimit, id);
  }
  // 验证固定语料完整性，不执行消费者读取器或冒称真实慢链路已通过。
});

test("当前目录属于解析身份集合，小城仅保留历史解析身份", () => {
  const ids = catalog.fonts.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length);
  const historicalIds = schema.properties.fontId.enum;
  assert.deepEqual(historicalIds.filter((id) => ids.includes(id)), ids);
  assert.deepEqual(historicalIds.filter((id) => !ids.includes(id)), ["xiaocheng-lafeng"]);
  for (const fontId of historicalIds) {
    for (const extra of [{}, { color: "#D14343" }]) {
      assert.equal(validate({ version: 1, fontId, content: "中文 Hello 👨‍👩‍👧‍👦 é", ...extra }), true);
    }
  }
  // Schema 表达可保源的身份；ready 与新写许可仍由后端业务能力决定。
  assert.ok(catalog.fonts.every(({ availability }) => ["ready", "pendingSource"].includes(availability)));
});

test("当前目录三种语言分类共 28 款就绪，不把小城恢复为可选项", () => {
  assert.equal(catalog.catalogVersion, "1.2.0");
  const groups = { zh: [], ja: [], en: [] };
  for (const font of catalog.fonts) {
    assert.ok(Object.hasOwn(groups, font.designLanguage), font.id);
    groups[font.designLanguage].push(font.id);
  }
  assert.deepEqual(Object.fromEntries(Object.entries(groups).map(([key, ids]) => [key, ids.length])), {
    zh: 12, ja: 10, en: 6,
  });
  for (const id of ["shinsyoku-mincho", "hakkou-mincho", "bouken-gothic", "kaitou-yokoku-gothic"]) {
    assert.ok(groups.ja.includes(id), id);
  }
  assert.equal(catalog.fonts.filter(({ availability }) => availability === "ready").length, 28);
  assert.deepEqual(catalog.fonts.filter(({ availability }) => availability === "pendingSource"), []);
  assert.equal(catalog.fonts.some(({ id }) => id === "zcoolxiaowei"), false);
  assert.equal(catalog.fonts.some(({ id }) => id === "xiaocheng-lafeng"), false);
  // 固定源快照的分类与状态；客户端对未知语言的回退仍由各端验证。
});

test("退役身份语料保留历史范围并拒绝新建与旧端覆盖", () => {
  assert.ok(fixtures.validCases.some(({ id }) => id === "retired-xiaocheng-history"));
  for (const [id, expectedCode] of [
    ["retired-xiaocheng-new", 40020], ["retired-xiaocheng-keep", null],
    ["retired-xiaocheng-remove", null], ["retired-xiaocheng-old-overwrite", 40019],
  ]) {
    const entry = fixtures.writeCases.find((entry) => entry.id === id);
    assert.ok(entry, id);
    assert.equal(entry.expectedCode, expectedCode, id);
  }
  // 仅核对生产者预期；实际写入保护由 Backend 和消费者执行。
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
