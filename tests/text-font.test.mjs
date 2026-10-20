import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";

const bytes = (name) => fs.readFileSync(new URL(`./fixtures/text-font/${name}`, import.meta.url));
const read = (name) => JSON.parse(bytes(name));
const source = read("source.json");
const schema = read("markdown-text-font-v1.schema.json");
const fixtures = read("markdown-text-font-v1-fixtures.json");
const catalog = read("thread-font-catalog-v1.json");
const validate = new Ajv2020({ strict: true }).compile(schema);

test("Backend 字体测试镜像保留精确提交、原始字节与源路径", () => {
  assert.equal(source.repository, "morenk/wenyousite-backend");
  assert.match(source.commit, /^[a-f0-9]{40}$/);
  assert.deepEqual(Object.keys(source.files).sort(), [
    "markdown-text-font-v1-fixtures.json", "markdown-text-font-v1.schema.json", "thread-font-catalog-v1.json",
  ]);
  for (const [name, entry] of Object.entries(source.files)) {
    const content = bytes(name);
    assert.equal(entry.sourcePath, `contracts/${name}`);
    assert.equal(content.length, entry.bytes, name);
    assert.equal(crypto.createHash("sha256").update(content).digest("hex"), entry.sha256, name);
  }
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
  assert.ok(catalog.fonts.some(({ availability }) => availability === "pendingSource"));
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
