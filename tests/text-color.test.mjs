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

test("文字颜色允许显式光标输入色并拒绝无条件继承、原子染色和新增主栏入口", () => {
  const profile = contract.experiences.editor.textColor;
  assert.equal(validateProfile(profile), true);
  for (const mutate of [
    (value) => { value.selection.continuedTyping = "inherit"; },
    (value) => { value.selection.application = "selected-text-only"; },
    (value) => { value.selection.empty = "disabled"; },
    (value) => { delete value.selection.caret; },
    (value) => { value.selection.caret.invalid = "enabled"; },
    (value) => { value.selection.caret.documentMutation = "on-color-pick"; },
    (value) => { value.selection.caret.inputState = "rgb-or-null"; },
    (value) => { value.selection.caret.insertions = "override-all-content"; },
    (value) => { value.selection.caret.defaultBehavior = "remove-all-marks"; },
    (value) => { value.selection.caret.relocation = "keep-global-color"; },
    (value) => { value.selection.caret.persistence = "account-local"; },
    (value) => { value.selection.caret.undo = "empty-format-transaction"; },
    (value) => { value.selection.atomicNodes = "color"; },
    (value) => { value.mobile.mainToolbar = "add-button"; },
    (value) => { value.mobile.preview = "mutate-body"; },
    (value) => { value.mobile.minimumTargetDp = 32; },
    (value) => { value.recent.scope = "device-global"; },
    (value) => { value.recent.maximum = 5; },
    (value) => { value.web.picker = false; },
    (value) => { value.web.parentCapability = "more"; },
    (value) => { value.web.mainToolbar = "add-button"; },
    (value) => { value.web.primaryRow = ["default", "presets", "recent", "custom"]; },
    (value) => { value.web.defaultPresentation = "text-label"; },
    (value) => { value.web.recentPresentation = "always-visible-row"; },
    (value) => { value.web.pickerPresentation = "nested-dialog"; },
    (value) => { value.web.numericInput = "decimal-with-alpha"; },
    (value) => { value.web.preview = "mutate-body"; },
    (value) => { value.web.cancel = "keep-preview"; },
    (value) => { value.web.minimumTargetDp = 48; },
    (value) => { value.presets[0].rgb = "#D1434380"; },
    (value) => { value.channelMaximum = 256; },
    (value) => { value.excluded = []; },
  ]) {
    const candidate = structuredClone(profile);
    mutate(candidate);
    assert.equal(validateProfile(candidate), false);
  }
});

test("折叠光标与范围改色具有不同的文档、生命周期和撤销边界", () => {
  const selection = EDITOR_TEXT_COLOR_PROFILE.selection;
  assert.equal(selection.application, "selected-text-or-caret");
  assert.equal(selection.empty, "caret-sets-typing-color");
  assert.equal(selection.continuedTyping, "explicit-caret-color-only");
  assert.equal(selection.undo, "single-transaction");
  assert.equal(selection.defaultBehavior, "remove-color-only");
  assert.deepEqual(selection.caret, {
    invalid: "disabled",
    emptyDocument: "enabled",
    documentMutation: "on-text-input-only",
    inputState: "unset-rgb-default",
    insertions: "preserve-source-and-skip-atoms",
    defaultBehavior: "clear-typing-color-only",
    continuation: "typing-and-newline",
    relocation: "derive-from-new-position",
    persistence: "document-text-only",
    undo: "normal-input-history",
  });
  assert.equal(EDITOR_TEXT_COLOR_PROFILE.mobile.cancel, "unchanged");
  assert.equal(EDITOR_TEXT_COLOR_PROFILE.mobile.completion, "restore-body-focus-and-selection");
  assert.equal(EDITOR_TEXT_COLOR_PROFILE.recent.maximum, 4);
  const dart = read("packages/flutter/lib/src/foundation_tokens.dart");
  for (const [key, value] of Object.entries(selection.caret)) {
    assert.ok(dart.includes(`'${key}': '${value}'`));
  }
});

test("Web 正文菜单提供紧凑颜色入口，共享光标规则而保留平台密度", () => {
  const { web, mobile, selection } = EDITOR_TEXT_COLOR_PROFILE;
  assert.equal(web.picker, true);
  assert.equal(web.parentCapability, "heading");
  assert.deepEqual(web.primaryRow, ["default", "presets", "custom"]);
  assert.equal(web.defaultPresentation, "t-icon");
  assert.equal(web.recentPresentation, "separate-row-when-present");
  assert.equal(web.pickerPresentation, "popover-content-replacement");
  for (const name of ["controls", "numericInput", "preview", "commit", "cancel", "completion", "layout"]) {
    assert.deepEqual(web[name], mobile[name]);
  }
  assert.equal(web.keyboard, "tab-controls-escape-cancel");
  assert.equal(Object.hasOwn(web, "minimumTargetDp"), false);
  assert.equal(mobile.minimumTargetDp, 48);
  assert.equal(selection.caret.emptyDocument, "enabled");
  assert.equal(selection.caret.continuation, "typing-and-newline");
  assert.equal(web.existingContent, "render-edit-preserve");
  assert.equal(web.clipboard, "preserve-color");
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
  assert.equal(EDITOR_WEB_CAPABILITIES["text-color"].creation, "secondary");
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
