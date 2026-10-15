import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import {
  EDITOR_TEXT_COLOR_PROFILE, EDITOR_TEXT_COLOR_PRESETS,
  EDITOR_WEB_CAPABILITIES, EDITOR_MOBILE_CAPABILITIES,
  EDITOR_PRIMARY_NARROW, EDITOR_PRIMARY_WIDE,
} from "../dist/editor.js";
import { INLINE_ELEMENT_STYLES } from "../dist/elements.js";

const read = (name) => fs.readFileSync(new URL(`../${name}`, import.meta.url), "utf8");
const contract = JSON.parse(read("contracts/foundation.v1.json"));
const schema = JSON.parse(read("contracts/foundation.schema.json"));
const validateProfile = new Ajv2020({ strict: true }).compile(schema.$defs.editorTextColor);
const validatePresentation = new Ajv2020({ strict: true }).compile(schema.$defs.inlineTextColor);

test("文字颜色拒绝持续输入模式、原子染色、跨账号最近色和新增主栏入口", () => {
  const profile = contract.experiences.editor.textColor;
  assert.equal(validateProfile(profile), true);
  for (const mutate of [
    (value) => { value.selection.continuedTyping = "inherit"; },
    (value) => { value.selection.atomicNodes = "color"; },
    (value) => { value.mobile.mainToolbar = "add-button"; },
    (value) => { value.mobile.preview = "mutate-body"; },
    (value) => { value.mobile.minimumTargetDp = 32; },
    (value) => { value.recent.scope = "device-global"; },
    (value) => { value.recent.maximum = 5; },
    (value) => { value.web.picker = true; },
    (value) => { value.presets[0].rgb = "#D1434380"; },
    (value) => { value.channelMaximum = 256; },
    (value) => { value.excluded = []; },
  ]) {
    const candidate = structuredClone(profile);
    mutate(candidate);
    assert.equal(validateProfile(candidate), false);
  }
});

test("作者 RGB 保持明暗原值，仅覆盖文本前景且不改变其他格式", () => {
  const value = contract.experiences.elements.inline.textColor;
  assert.equal(validatePresentation(value), true);
  for (const patch of [
    { alpha: 0.5 }, { themeBehavior: "automatic" }, { automaticAdjustment: true },
    { contrastWarning: true }, { atomicNodes: "included" }, { otherMarks: "remove" },
  ]) assert.equal(validatePresentation({ ...value, ...patch }), false);
  assert.deepEqual(INLINE_ELEMENT_STYLES.textColor, value);
});

test("Web、Flutter 预设与能力来自同一机器契约且主栏保持原有能力", () => {
  assert.deepEqual(EDITOR_TEXT_COLOR_PROFILE, contract.experiences.editor.textColor);
  assert.deepEqual(EDITOR_TEXT_COLOR_PRESETS, EDITOR_TEXT_COLOR_PROFILE.presets);
  assert.equal(new Set(EDITOR_TEXT_COLOR_PRESETS.map(({ rgb }) => rgb)).size, 5);
  assert.equal(EDITOR_WEB_CAPABILITIES["text-color"].creation, "none");
  assert.equal(EDITOR_MOBILE_CAPABILITIES["text-color"].creation, "secondary");
  for (const entries of [EDITOR_PRIMARY_NARROW, EDITOR_PRIMARY_WIDE, contract.experiences.editor.mobile.primary]) {
    assert.equal(entries.includes("text-color"), false);
  }
  const dart = read("packages/flutter/lib/src/foundation_tokens.dart");
  assert.ok(dart.includes("abstract final class WenyouEditorTextColorContract"));
  for (const { id, label, rgb } of EDITOR_TEXT_COLOR_PRESETS) {
    assert.ok(dart.includes(`'${id}': '${rgb}'`));
    assert.ok(dart.includes(`'${id}': '${label}'`));
  }
  const manifest = JSON.parse(read("foundation-manifest.json"));
  for (const name of ["dist/editor.js", "dist/editor.d.ts", "packages/flutter/lib/src/foundation_tokens.dart"]) {
    assert.equal(crypto.createHash("sha256").update(read(name)).digest("hex"), manifest.artifactSha256[name]);
  }
});

test("后端颜色与剪贴板语料保留精确提交及原始字节", () => {
  const source = JSON.parse(read("contracts/fixtures/text-color-source.json"));
  assert.match(source.commit, /^[a-f0-9]{40}$/);
  assert.equal(source.repository, "morenk/wenyousite-backend");
  for (const [name, entry] of Object.entries(source.files)) {
    assert.equal(entry.sourcePath, `contracts/${name}`);
    assert.equal(crypto.createHash("sha256").update(read(`contracts/fixtures/${name}`)).digest("hex"), entry.sha256);
  }
  const validateNode = new Ajv2020({ strict: true }).compile(JSON.parse(read("contracts/fixtures/markdown-text-color-v1.schema.json")));
  assert.equal(validateNode({ version: 1, color: "#000000", content: "中文😀" }), true);
  assert.equal(validateNode({ version: 1, color: "#FFFFFF", content: "**文字**" }), true);
  for (const patch of [{ color: "#123" }, { color: "#12345678" }, { color: "#aabbcc" }, { content: "" }, { content: "跨\n行" }, { style: "color:red" }]) {
    assert.equal(validateNode({ version: 1, color: "#123456", content: "文字", ...patch }), false);
  }
  const fixtures = JSON.parse(read("contracts/fixtures/markdown-text-color-v1-fixtures.json"));
  assert.equal(fixtures.version, 1);
  assert.ok(fixtures.validCases.length > 0 && fixtures.invalidSources.length > 0 && fixtures.writeCases.length > 0);
  assert.equal(new Set(fixtures.validCases.map(({ id }) => id)).size, fixtures.validCases.length);
  const clipboard = JSON.parse(read("contracts/fixtures/editor-clipboard-v2-fixtures.json"));
  assert.equal(clipboard.version, 2);
  assert.equal(clipboard.textColorRule.externalPaste, "literal-text");
  assert.equal(clipboard.mobileTransport.interoperability, "plain-text-only");
  for (const id of ["reader-text-color-v1", "text-color-style-not-allowed"]) {
    assert.ok(clipboard.goldenCases.some((entry) => entry.id === id));
  }
});
