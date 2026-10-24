import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import test from "node:test";
import Ajv from "ajv";

const bytes = (name) => fs.readFileSync(new URL(`./fixtures/admin-font-management/${name}`, import.meta.url));
const read = (name) => JSON.parse(bytes(name));
const source = read("source.json");
const fixtures = read("admin-font-management-v1-fixtures.json");
const api = read("openapi.json");
const schemas = api.components.schemas;
const route = (suffix, method) => api.paths[`/api/v1/admin/text-fonts${suffix}`][method];
const byId = (section, id) => {
  const value = fixtures[section].find((entry) => entry.id === id);
  assert.ok(value, `${section}/${id}`);
  return value;
};
// 直接验证生产者 Schema，不实现 DTO 规范化、列表比较器或任务状态机。
// 允许 OpenAPI 注解；UUID／日期格式在下方单独核验。
const ajv = new Ajv({ strict: false, validateFormats: false });
const validate = (name) => ajv.compile({ components: api.components, $ref: `#/components/schemas/${name}` });
const uuid4 = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const setEqual = (actual, expected) => assert.deepEqual(new Set(actual), new Set(expected));

test("管理员三份镜像固定已提交来源、字节摘要及独立版本，不覆盖历史镜像", () => {
  assert.equal(source.repository, "morenk/wenyousite-backend");
  assert.equal(source.commit, "2db4ef1254c7738966dc28b1cd1fc10dcb19da47");
  assert.equal(source.apiVersion, "5.44.0-dev.20261024.3");
  assert.equal(api.info.version, source.apiVersion);
  assert.equal(fixtures.apiContractVersion, source.apiVersion);
  assert.equal(fixtures.fixtureVersion, 1);
  assert.deepEqual(Object.keys(source.files).sort(), ["admin-font-management-v1-fixtures.json", "admin-font-management.md", "openapi.json"]);
  for (const [name, entry] of Object.entries(source.files)) {
    assert.equal(entry.sourcePath, `${name.endsWith('.md') ? 'docs' : 'contracts'}/${name}`);
    assert.equal(bytes(name).length, entry.bytes, name);
    assert.equal(crypto.createHash("sha256").update(bytes(name)).digest("hex"), entry.sha256, name);
  }
  for (const directory of ["text-font", "text-font-dynamic"]) {
    const old = JSON.parse(fs.readFileSync(new URL(`./fixtures/${directory}/source.json`, import.meta.url)));
    assert.notEqual(old.commit, source.commit);
  }
  const sections = ["createCases", "submissionCases", "sourceCases", "listCases", "cursorCases", "publicationHistoryCases", "orderCases", "metadataCases", "versionReuseCases", "jobRecoveryCases"];
  setEqual(Object.keys(fixtures).filter((key) => key.endsWith("Cases")), sections);
  for (const section of sections) {
    assert.ok(fixtures[section].length > 0, section);
    assert.equal(new Set(fixtures[section].map(({ id }) => id)).size, fixtures[section].length, section);
  }
});

test("新增管理操作绑定生产者 DTO、管理员安全方案与旧发布入口", () => {
  for (const [suffix, method, dto] of [
    ["/submissions", "post", "CreateFontSubmissionDto"],
    ["/submissions/{submissionId}/process", "post", "ProcessFontSubmissionDto"],
    ["/order", "put", "ReorderFontsDto"],
  ]) {
    const operation = route(suffix, method);
    assert.equal(operation.requestBody.content["application/json"].schema.$ref, `#/components/schemas/${dto}`);
    assert.deepEqual(operation.security, [{ adminSession: [], adminCsrf: [] }]);
  }
  for (const suffix of ["/management", "/submissions/{submissionId}"]) assert.ok(route(suffix, "get"));
  const upload = route("/{familyId}/sources", "post");
  assert.ok(upload.requestBody.content["application/octet-stream"]);
  const submission = upload.parameters.find(({ name }) => name === "submissionId");
  assert.equal(submission.required, false);
  assert.equal(submission.schema.format, "uuid");
  assert.deepEqual(schemas.FontPublishDto.required, ["versionId", "expectedFamilyRevision", "expectedCatalogRevision"]);
  assert.ok(route("/{familyId}/publish", "post"));
  assert.ok(route("", "get").parameters.some(({ name }) => name === "after"));
  assert.equal(schemas.FontSubmissionDto.properties.job.nullable, true);
  assert.equal(schemas.FontSubmissionDto.properties.job.allOf[0].$ref, "#/components/schemas/FontJobDto");
  assert.deepEqual(schemas.FontSubmissionDto.properties.authorizationRuleVersion.enum, [fixtures.authorizationRuleVersion]);
});

test("创建样例绑定 DTO 形状，规范化与成对修订约束保留为生产者运行边界", () => {
  const check = validate("CreateFontSubmissionDto");
  for (const entry of fixtures.createCases.filter(({ accepted }) => accepted)) {
    assert.equal(check(entry.expected), true, `${entry.id}: ${JSON.stringify(check.errors)}`);
    assert.match(entry.expected.submissionId, uuid4);
    assert.equal(entry.expected.name, entry.expected.name.normalize("NFC").trim());
  }
  const minimum = byId("createCases", "minimum-default-language");
  assert.equal(Object.hasOwn(minimum.input, "language"), false);
  assert.equal(minimum.expected.language, schemas.CreateFontSubmissionDto.properties.language.default);
  assert.deepEqual(Object.keys(fixtures.specimens).sort(), [...schemas.CreateFontSubmissionDto.properties.language.enum].sort());
  for (const text of Object.values(fixtures.specimens)) assert.ok(typeof text === "string" && text.length > 0);
  for (const id of ["null-language", "unknown-language", "invalid-revision", "too-long-name"]) {
    const entry = byId("createCases", id);
    assert.equal(entry.accepted, false);
    assert.equal(check(entry.input), false, id);
  }
  assert.doesNotMatch(byId("createCases", "invalid-uuid").input.submissionId, uuid4);
  for (const [id, field] of [["client-author", "author"], ["client-license", "licenseText"], ["client-evidence", "authorization"], ["client-sort", "sortOrder"]]) {
    const entry = byId("createCases", id);
    assert.equal(entry.accepted, false);
    assert.ok(Object.hasOwn(entry.input, field));
    assert.equal(Object.hasOwn(schemas.CreateFontSubmissionDto.properties, field), false);
  }
  for (const [id, present, absent] of [["missing-revision", "familyId", "expectedFamilyRevision"], ["missing-family", "expectedFamilyRevision", "familyId"]]) {
    const entry = byId("createCases", id);
    assert.equal(entry.accepted, false);
    assert.ok(Object.hasOwn(entry.input, present));
    assert.equal(Object.hasOwn(entry.input, absent), false);
  }
  assert.equal(byId("createCases", "blank-name").input.name.trim(), "");
  assert.equal(byId("createCases", "blank-name").accepted, false);
  assert.notEqual(byId("createCases", "normalize-name").input.name, byId("createCases", "normalize-name").expected.name);
  // OpenAPI 未完整表达规范化、额外字段拒绝与成对字段，不宣称执行了 DTO 运行校验。
});

test("四类自动样张使用已提交 Wenyou 文案，HTTP 仅更新版本元数据", () => {
  assert.deepEqual(fixtures.specimens, {
    zh: "温油文字 Aa 0123", ja: "温油文字 Aa 0123",
    en: "Wenyou Aa 0123", other: "Wenyou Aa 0123",
  });
  assert.equal(fixtures.parametersVersion, 2);
  assert.equal(fixtures.authorizationRuleVersion, "admin-font-upload-v1");
  const canonical = (value) => Array.isArray(value) ? value.map(canonical)
    : value && typeof value === "object"
      ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]))
      : value;
  const withoutVersion = structuredClone(api);
  delete withoutVersion.info.version;
  // 摘要在同步时从 history.commit 的原始 OpenAPI 计算，覆盖字段、路由和其他元数据。
  assert.equal(crypto.createHash("sha256").update(JSON.stringify(canonical(withoutVersion))).digest("hex"),
    source.history.openapiWithoutVersionSha256);
});

test("旧默认值原字节快照独立保留，样张修订不改变重放和版本复用语料", () => {
  const history = source.history;
  assert.equal(history.commit, "2b8abf3b6ae23c94dd843dfd6ce72865554a657e");
  assert.equal(history.apiVersion, "5.44.0-dev.20261024.2");
  assert.deepEqual(Object.keys(history.files), ["history/admin-font-management-v1-fixtures.5.44.0-dev.20261024.2.json"]);
  const [name, entry] = Object.entries(history.files)[0];
  assert.equal(entry.sourcePath, "contracts/admin-font-management-v1-fixtures.json");
  assert.equal(bytes(name).length, entry.bytes);
  assert.equal(crypto.createHash("sha256").update(bytes(name)).digest("hex"), entry.sha256);
  const previous = read(name);
  assert.equal(previous.apiContractVersion, history.apiVersion);
  assert.deepEqual(previous.specimens, {
    zh: "温油站，一起书写故事。0123456789",
    ja: "物語を一緒に紡ぎましょう。0123456789",
    en: "The quick brown fox jumps over the lazy dog. 0123456789",
    other: "Aa Bb Cc 0123456789",
  });
  const { specimens: oldSpecimens, apiContractVersion: oldVersion, ...oldCases } = previous;
  const { specimens: newSpecimens, apiContractVersion: newVersion, ...newCases } = fixtures;
  assert.notDeepEqual(oldSpecimens, newSpecimens);
  assert.notEqual(oldVersion, newVersion);
  assert.deepEqual(newCases, oldCases);
  // 这是历史契约快照和语料完整性断言；旧提交/失败重试使用原配置由 Backend 真实服务测试保证。
});

test("提交与源重放预期区分响应丢失、同键冲突、明确重试和并发意图", () => {
  const replay = byId("submissionCases", "create-replay-after-revision-change");
  assert.deepEqual(replay.events, ["create", "family-revision-changes", "replay-identical-create"]);
  assert.equal(replay.expectedFamiliesCreated, 1);
  assert.equal(replay.expectedSameSubmission, true);
  for (const id of ["create-key-payload-conflict", "create-key-other-actor", "source-key-bytes-conflict"]) {
    const entry = byId("submissionCases", id);
    assert.equal(entry.expectedHttpStatus, 409);
    assert.equal(entry.expectedCode, 40930);
  }
  const sourceReplay = byId("submissionCases", "source-concurrent-replay");
  assert.equal(sourceReplay.expectedJobsCreated, 1);
  assert.equal(sourceReplay.expectedSameJob, true);
  const recovery = byId("submissionCases", "lost-upload-response-refresh");
  assert.equal(recovery.events.at(-1), "GET-submission");
  assert.equal(recovery.expectedJobPresent, true);
  assert.equal(recovery.expectedSourceUploadsAfterRecovery, 0);
  const same = byId("submissionCases", "process-same-intent-failed");
  const retry = byId("submissionCases", "process-explicit-retry");
  assert.equal(same.expectedAttempts, 1);
  assert.equal(retry.expectedAttempts, 2);
  assert.equal(same.expectedSourceUploads, 1);
  assert.equal(retry.expectedSourceUploads, 1);
  assert.equal(retry.expectedSameJob, true);
  const concurrent = byId("submissionCases", "process-concurrent-intents");
  assert.equal(concurrent.expectedAttempts, 1);
  assert.equal(concurrent.expectedActiveJobs, 1);
  assert.equal(byId("submissionCases", "no-automatic-publication").expectedPublished, false);
});

test("job 提交绑定是可选可空 UUID，兼容旧响应并拒绝非法类型和格式", () => {
  const property = schemas.FontJobDto.properties.submissionId;
  assert.equal(property.type, "string");
  assert.equal(property.format, "uuid");
  assert.equal(property.nullable, true);
  assert.equal(schemas.FontJobDto.required.includes("submissionId"), false);
  // 仅此标量启用 UUID 格式验证；不收紧生产者 Schema 为仅接受 UUID v4。
  const checkId = new Ajv({ strict: false, formats: {
    uuid: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
  } }).compile(property);
  for (const value of [null, byId("jobRecoveryCases", "simple-job-after-refresh").submissionId]) {
    assert.equal(checkId(value), true);
  }
  for (const value of ["", "not-a-uuid", "tff_" + "0".repeat(32), 1, {}, []]) {
    assert.equal(checkId(value), false, JSON.stringify(value));
  }
  // 合成 job 只验证响应结构，不作为运行任务或资源证据。
  const job = {
    jobId: `tfj_${"0".repeat(32)}`, familyId: `tff_${"0".repeat(32)}`,
    status: "failed", sourceSha256: "a".repeat(64), sourceBytes: 1,
    versionId: null, failureCode: "processing-failed",
  };
  const checkJob = validate("FontJobDto");
  assert.equal(checkJob(job), true, JSON.stringify(checkJob.errors));
  for (const submissionId of [null, byId("jobRecoveryCases", "simple-job-after-refresh").submissionId]) {
    assert.equal(checkJob({ ...job, submissionId }), true, JSON.stringify(checkJob.errors));
  }
  assert.equal(checkJob({ ...job, submissionId: 1 }), false);
});

test("刷新与旧任务恢复绑定任务自身提交，不能扫描列表后改用最新提交", () => {
  setEqual(fixtures.jobRecoveryCases.map(({ id }) => id), [
    "legacy-job", "simple-job-after-refresh", "older-job-after-newer-submission",
    "anonymous-recovery", "ordinary-user-process",
  ]);
  const legacy = byId("jobRecoveryCases", "legacy-job");
  assert.equal(legacy.submissionId, null);
  assert.equal(legacy.expectedProcessRoute, "legacy-job");
  const simple = byId("jobRecoveryCases", "simple-job-after-refresh");
  assert.match(simple.submissionId, uuid4);
  assert.equal(simple.expectedProcessRoute, "bound-submission");
  const historical = byId("jobRecoveryCases", "older-job-after-newer-submission");
  assert.match(historical.submissionId, uuid4);
  assert.match(historical.latestSubmissionId, uuid4);
  assert.equal(historical.expectedProcessSubmissionId, historical.submissionId);
  assert.notEqual(historical.expectedProcessSubmissionId, historical.latestSubmissionId);
  assert.equal(historical.expectedScanManagementList, false);
  assert.equal(byId("jobRecoveryCases", "anonymous-recovery").expectedHttpStatus, 401);
  assert.equal(byId("jobRecoveryCases", "ordinary-user-process").expectedHttpStatus, 403);
  for (const [suffix, method] of [
    ["/jobs/{jobId}", "get"], ["/jobs/{jobId}/process", "post"],
    ["/submissions/{submissionId}", "get"], ["/submissions/{submissionId}/process", "post"],
  ]) {
    assert.deepEqual(route(suffix, method).security, [{ adminSession: [], adminCsrf: [] }]);
  }
  // 只核对契约关联与生产者预期；身份鉴别、权限执行和真实恢复仍由运行验收覆盖。
});

test("缺元数据、显式限制及原始上传大小边界与 job schema 一致", () => {
  assert.equal(fixtures.parametersVersion, 2);
  const absent = byId("sourceCases", "metadata-absent");
  assert.deepEqual(absent.nameRecords, []);
  assert.equal(absent.expectedStatus, "ready");
  const reasons = schemas.FontJobDto.properties.failureReason.enum;
  for (const [id, flag] of [["embedding-restricted", 2], ["subsetting-restricted", 256], ["bitmap-only", 512]]) {
    const entry = byId("sourceCases", id);
    assert.equal(entry.fsType, flag);
    assert.equal(entry.expectedStatus, "failed");
    assert.equal(entry.expectedFailureCode, "rights-required");
    assert.ok(reasons.includes(entry.expectedFailureReason));
    assert.equal(entry.expectedFailureReason, id);
  }
  const combined = byId("sourceCases", "combined-restrictions");
  assert.equal(combined.fsType, 2 | 256 | 512);
  assert.equal(combined.expectedFailureReason, reasons[0]);
  assert.equal(combined.expectedStatus, "failed");
  assert.equal(combined.expectedFailureCode, "rights-required");
  assert.equal(byId("sourceCases", "corrupt-source").validFont, false);
  assert.equal(byId("sourceCases", "corrupt-source").expectedStatus, "failed");
  const bound = schemas.FontJobDto.properties.sourceBytes;
  assert.equal(byId("sourceCases", "exact-limit").bytes, bound.maximum);
  assert.equal(byId("sourceCases", "exact-limit").expectedUploadStatus, 201);
  assert.equal(byId("sourceCases", "over-limit").bytes, bound.maximum + 1);
  assert.equal(byId("sourceCases", "over-limit").expectedUploadStatus, 413);
  const check = ajv.compile(bound);
  assert.equal(check(bound.maximum), true);
  assert.equal(check(bound.maximum + 1), false);
});

test("原始许可保留 CR LF TAB，非法 NUL 整条省略，审计不进入公开声明和构建身份", () => {
  const policy = fixtures.metadataPolicy;
  assert.deepEqual(policy.nameIds, [0, 8, 9, 13, 14]);
  assert.deepEqual(policy.allowedControlCodepoints, [9, 10, 13]);
  assert.equal(policy.maxExaminedRecords, 256);
  assert.equal(policy.maxKeptRecords, 64);
  assert.equal(policy.maxRecordUtf8Bytes, 8192);
  assert.equal(policy.maxTotalUtf8Bytes, 65536);
  assert.equal(policy.invalidRecordAction, "omit-and-count");
  assert.equal(policy.publicAuditFieldsAllowed, false);
  assert.equal(policy.auditExcludedFromBuildKey, true);
  assert.equal(policy.legacyParametersUnchanged, true);
  const multiline = byId("metadataCases", "multiline-original-license");
  assert.ok(policy.nameIds.includes(multiline.nameId));
  assert.equal(multiline.expectedOmitted, false);
  assert.deepEqual(Buffer.from(multiline.expectedText), Buffer.from(multiline.text));
  for (const code of policy.allowedControlCodepoints) assert.ok(multiline.text.includes(String.fromCodePoint(code)));
  assert.ok(Buffer.byteLength(multiline.text) <= policy.maxRecordUtf8Bytes);
  const nul = byId("metadataCases", "reject-nul-in-license");
  assert.ok(nul.text.includes("\0"));
  assert.equal(nul.expectedOmitted, true);
});

test("超过一页的数据集与列表 DTO 字段、时间和状态关联一致", () => {
  const data = fixtures.listDataset;
  const page = schemas.FontManagementPageDto;
  assert.equal(fixtures.pageSize, page.properties.items.maxItems);
  assert.ok(data.length > fixtures.pageSize);
  assert.equal(new Set(data.map(({ familyId }) => familyId)).size, data.length);
  const item = schemas.FontManagementItemDto;
  // 直接验证标量字段：OpenAPI nullable＋allOf job 不当作 JSON Schema null 联合。
  const scalarChecks = Object.entries(item.properties).filter(([key]) => key !== "latestJob")
    .map(([key, schema]) => [key, schema, ajv.compile(schema)]);
  for (const row of data) {
    for (const key of item.required) assert.ok(Object.hasOwn(row, key), key);
    for (const [key, schema, check] of scalarChecks) {
      assert.equal(check(row[key]), true, `${row.familyId}/${key}`);
      if (schema.format === "date-time" && row[key] !== null) assert.equal(new Date(row[key]).toISOString(), row[key]);
    }
    assert.equal(row.latestJob, null);
    if (row.status === "withdrawn") {
      assert.equal(row.currentVersionId, null);
      assert.ok(row.lastPublishedVersionId && row.withdrawnAt);
    }
    if (row.status === "draft") assert.equal(row.lastPublishedVersionId, null);
  }
  assert.equal(item.properties.latestJob.nullable, true);
  setEqual(data.map(({ language }) => language), schemas.CreateFontSubmissionDto.properties.language.enum);
  setEqual(data.map(({ status }) => status), item.properties.status.enum);
});

test("列表预期跨页无遗漏，全量筛选包含第二页成员，查询不被误作公开排序写入", () => {
  const data = fixtures.listDataset;
  const index = new Map(data.map((row) => [row.familyId, row]));
  const first = byId("listCases", "default-page-one");
  const second = byId("listCases", "default-page-two");
  assert.equal(first.expectedFamilyIds.length, fixtures.pageSize);
  assert.equal(first.expectedHasNext, true);
  assert.equal(second.afterCase, first.id);
  assert.equal(second.expectedHasNext, false);
  const joined = [...first.expectedFamilyIds, ...second.expectedFamilyIds];
  assert.equal(new Set(joined).size, data.length);
  setEqual(joined, index.keys());
  for (const entry of fixtures.listCases) {
    assert.ok(entry.expectedFamilyIds.every((id) => index.has(id)), entry.id);
    assert.equal(new Set(entry.expectedFamilyIds).size, entry.expectedFamilyIds.length);
    assert.ok(entry.expectedFamilyIds.length <= fixtures.pageSize);
    assert.ok(entry.expectedTotal >= entry.expectedFamilyIds.length);
  }
  assert.equal(first.expectedTotal, data.length);
  assert.equal(second.expectedTotal, data.length);
  const filtered = byId("listCases", "filter-before-pagination");
  setEqual(filtered.expectedFamilyIds, data.filter(({ language }) => language === filtered.query.language).map(({ familyId }) => familyId));
  assert.equal(filtered.expectedTotal, filtered.expectedFamilyIds.length);
  assert.ok(filtered.expectedFamilyIds.some((id) => second.expectedFamilyIds.includes(id)));
  const literal = byId("listCases", "literal-wildcards");
  assert.equal(literal.expectedTotal, 1);
  assert.ok(index.get(literal.expectedFamilyIds[0]).name.includes(literal.query.q));
  const normalized = byId("listCases", "name-case-and-trim");
  assert.equal(normalized.expectedTotal, 1);
  assert.equal(index.get(normalized.expectedFamilyIds[0]).name, "Font 01");
  const withdrawn = byId("listCases", "withdrawn-wins-enabled");
  setEqual(withdrawn.expectedFamilyIds, data.filter(({ status }) => status === "withdrawn").map(({ familyId }) => familyId));
  assert.ok(withdrawn.expectedFamilyIds.every((id) => index.get(id).enabled));
  const ascending = byId("listCases", "ascending-order");
  assert.equal(ascending.expectedTotal, data.length);
  assert.equal(ascending.expectedHasNext, true);
  // 此升序案例与夹具显式输入顺序一致，不在这里实现后端比较器。
  assert.deepEqual(ascending.expectedFamilyIds, data.slice(0, fixtures.pageSize).map(({ familyId }) => familyId));
  const params = route("/management", "get").parameters;
  for (const entry of fixtures.listCases) for (const [key, value] of Object.entries(entry.query)) {
    const parameter = params.find(({ name }) => name === key);
    assert.ok(parameter, key);
    assert.equal(ajv.compile(parameter.schema)(value), true);
  }
  assert.equal(params.find(({ name }) => name === "sort").schema.default, "createdAt");
  assert.equal(params.find(({ name }) => name === "direction").schema.default, "desc");
  assert.equal(params.some(({ name }) => name === "limit"), false);
});

test("游标覆盖筛选变化、列表修订变化、固定并列顺序及格式错误", () => {
  for (const id of ["filter-changed", "listing-changed"]) assert.equal(byId("cursorCases", id).expectedCode, 40931);
  const filter = byId("cursorCases", "filter-changed");
  assert.notDeepEqual(filter.firstQuery, filter.nextQuery);
  const revision = byId("cursorCases", "listing-changed");
  assert.ok(revision.nextListingRevision > revision.firstListingRevision);
  assert.equal(byId("cursorCases", "same-primary-sort-key").direction, "desc");
  assert.equal(byId("cursorCases", "same-primary-sort-key").expectedTieBreak, "familyId-asc");
  assert.equal(byId("cursorCases", "malformed").expectedHttpStatus, 400);
});

test("多语言原子顺序 DTO 与全组拒绝语料绑定，禁止局部成功和历史变更", () => {
  const entry = byId("orderCases", "two-language-atomic");
  const check = validate("ReorderFontsDto");
  assert.equal(check(entry.input), true, JSON.stringify(check.errors));
  const { groups } = entry.input;
  assert.ok(groups.length > 1);
  assert.equal(new Set(groups.map(({ language }) => language)).size, groups.length);
  const ids = groups.flatMap(({ items }) => items.map(({ familyId }) => familyId));
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(entry.expectedChanged, true);
  assert.equal(entry.expectedCatalogIncrements, 1);
  assert.equal(entry.expectedListingIncrements, 1);
  for (const key of ["expectedHistoricalVersionsUnchanged", "expectedArtifactBytesUnchanged", "expectedPostSourceUnchanged"]) assert.equal(entry[key], true);
  const noop = byId("orderCases", "same-order-noop");
  assert.equal(noop.expectedChanged, false);
  assert.equal(noop.expectedCatalogIncrements, 0);
  assert.equal(noop.expectedListingIncrements, 0);
  assert.equal(noop.expectedAuditCount, 0);
  const rejects = ["missing-member", "duplicate-member", "duplicate-language", "cross-language", "no-longer-selectable", "concurrent-new-member", "stale-family-revision", "stale-catalog-revision"];
  setEqual(fixtures.orderCases.filter(({ expectedCode }) => expectedCode).map(({ id }) => id), rejects);
  for (const id of rejects) {
    const rejected = byId("orderCases", id);
    assert.equal(rejected.expectedHttpStatus, 409);
    assert.equal(rejected.expectedCode, 40928);
    assert.equal(rejected.expectedGroupsWritten, 0);
  }
  assert.equal(check({ ...entry.input, groups: [] }), false);
  assert.equal(check({ ...entry.input, groups: Array(5).fill(groups[0]) }), false);
  assert.equal(check({ ...entry.input, expectedCatalogRevision: -1 }), false);
  assert.equal(schemas.FontOrderGroupDto.properties.items.maxItems, 10000);
  assert.equal(check({ ...entry.input, groups: [{ ...groups[0], items: Array(10001).fill(groups[0].items[0]) }] }), false);
  const invalidRevision = structuredClone(entry.input);
  invalidRevision.groups[0].items[0].expectedFamilyRevision = 0;
  assert.equal(check(invalidRevision), false);
  // orderCases 为独立场景，不能当作 listDataset 子集推断成员语言。
  // 生产者未提供此场景的完整可选快照；集合完整性、锁和回滚仍需真实 E2E。
});

test("同源改名和撤回后提交只复用产物，不能复用旧版本身份", () => {
  for (const entry of fixtures.versionReuseCases) {
    assert.equal(entry.sourceSame, true);
    assert.equal(entry.expectedSameArtifact, true);
    assert.equal(entry.expectedSameVersion, false);
  }
  const rename = byId("versionReuseCases", "same-source-renamed");
  assert.notEqual(rename.nameBefore, rename.nameAfter);
  assert.equal(rename.expectedVersionName, rename.nameAfter);
  assert.equal(rename.expectedHistoricalConfigurationUnchanged, true);
  const withdrawal = byId("versionReuseCases", "same-source-after-withdrawal");
  assert.equal(withdrawal.previousWithdrawn, true);
  assert.equal(withdrawal.expectedNewVersionStatus, "preview");
  assert.equal(withdrawal.expectedHistoricalWithdrawalUnchanged, true);
});

test("发布后回滚再撤回保留最后当前墓碑，无可靠历史不得猜测回填", () => {
  const rollback = byId("publicationHistoryCases", "publish-rollback-withdraw");
  assert.deepEqual(rollback.events.map(({ action }) => action), ["publish", "publish", "withdraw"]);
  assert.notEqual(rollback.events[0].versionId, rollback.events[1].versionId);
  assert.equal(rollback.events[1].versionId, rollback.events[2].versionId);
  assert.equal(rollback.expectedLastPublishedVersionId, rollback.events[1].versionId);
  assert.equal(rollback.expectedCurrentVersionId, null);
  assert.equal(rollback.expectedStatus, "withdrawn");
  assert.equal(rollback.expectedHistoricalPublishedAtUnchanged, true);
  const unknown = byId("publicationHistoryCases", "no-reliable-history");
  assert.equal(unknown.currentVersionId, null);
  assert.deepEqual(unknown.events, []);
  assert.equal(unknown.hasPublishedVersion, true);
  assert.equal(unknown.expectedRestoreOldVersion, false);
  assert.equal(unknown.expectedMigrationFailure, true);
  assert.equal(unknown.expectedMisclassifiedAsDraft, false);
});
