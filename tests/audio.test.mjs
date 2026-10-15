import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import { AUDIO_UPLOAD, AUDIO_PRESENTATION, AUDIO_PLAYBACK, AUDIO_ACCESSIBILITY } from "../dist/audio.js";
import { ICON_SEMANTICS } from "../dist/icons.js";

const read = (name) => fs.readFileSync(new URL(`../${name}`, import.meta.url), "utf8");
const contract = JSON.parse(read("contracts/foundation.v1.json"));
const schema = JSON.parse(read("contracts/foundation.schema.json"));
const manifest = JSON.parse(read("foundation-manifest.json"));
const audioSchema = new Ajv2020({ strict: true }).compile(schema.$defs.audio);

test("音频契约限制预加载、后台自动恢复和未知字段", () => {
  assert.equal(audioSchema(contract.experiences.audio), true);
  for (const mutate of [
    (audio) => { audio.playback.preload = "auto"; },
    (audio) => { audio.playback.resume = "automatic"; },
    (audio) => { audio.upload.source = "microphone"; },
    (audio) => { audio.presentation.cover = "decorative"; },
    (audio) => { audio.playback.unknown = true; },
    (audio) => { delete audio.accessibility; },
  ]) {
    const invalid = structuredClone(contract.experiences.audio);
    mutate(invalid);
    assert.equal(audioSchema(invalid), false);
  }
});

test("Web 与 Flutter 音频导出保留机器事实源及包装清单", () => {
  for (const [name, generated] of Object.entries({ upload: AUDIO_UPLOAD, presentation: AUDIO_PRESENTATION, playback: AUDIO_PLAYBACK, accessibility: AUDIO_ACCESSIBILITY })) {
    assert.deepEqual(generated, contract.experiences.audio[name]);
    assert.ok(read("packages/flutter/lib/src/foundation_tokens.dart").includes(`Map<String, Object> ${name}`));
  }
  for (const name of ["dist/audio.js", "dist/audio.d.ts", "packages/flutter/lib/src/foundation_tokens.dart"]) {
    assert.equal(crypto.createHash("sha256").update(read(name)).digest("hex"), manifest.artifactSha256[name]);
  }
  assert.equal(JSON.parse(read("package.json")).exports["./audio"].default, "./dist/audio.js");
});

test("音频语义图标使用已锁定 Lucide 的生成资产", () => {
  for (const [semantic, glyph] of Object.entries({ "editor.audio": "file-audio", "media.play": "play", "media.pause": "pause" })) {
    assert.equal(ICON_SEMANTICS[semantic], glyph);
    const asset = read(`packages/flutter/icons/${glyph}.svg`).trimEnd();
    assert.equal(crypto.createHash("sha256").update(asset).digest("hex"), manifest.icons.glyphSha256[glyph]);
    const upstream = read(`node_modules/lucide-static/icons/${glyph}.svg`).replace(/^<!-- @license[^>]+-->\s*/, "").replace(/\s+/g, " ").replace(/> </g, "><").trim();
    assert.equal(asset, upstream);
    assert.ok(read("packages/flutter/lib/src/wenyou_icons.dart").includes(semantic));
  }
});

test("音频共用既有主题、圆角、排版和平台触控角色", () => {
  for (const key of ["surfaceToken", "foregroundToken", "secondaryForegroundToken", "progressToken"]) {
    const token = AUDIO_PRESENTATION[key];
    assert.ok(contract.palette[token]);
    assert.ok(contract.themes.dark.palette[token]);
  }
  for (const platform of ["web", "mobile"]) assert.ok(contract.profiles[platform].radii[AUDIO_PRESENTATION.radiusRole]);
  assert.equal(AUDIO_PRESENTATION.controlTarget, "platform-minimum");
  assert.equal(AUDIO_UPLOAD.composerPreference, "shared-thread-reply");
  assert.equal(AUDIO_UPLOAD.defaultToolbarPlacement, "more");
  assert.equal(AUDIO_PLAYBACK.autoplay, false);
  assert.equal(AUDIO_PLAYBACK.preload, "none");
  assert.deepEqual(AUDIO_PLAYBACK.pauseOn, ["page-inactive", "background", "audio-interruption"]);
});


test("后端固定音频语料保持来源校验和与 Schema，不复制成第二套语法", () => {
  const source = JSON.parse(read("contracts/fixtures/audio-source.json"));
  assert.match(source.commit, /^[a-f0-9]{40}$/);
  for (const [name, entry] of Object.entries(source.files)) {
    assert.equal(crypto.createHash("sha256").update(read(`contracts/fixtures/${name}`)).digest("hex"), entry.sha256);
  }
  const fixtures = JSON.parse(read("contracts/fixtures/markdown-audio-v1-fixtures.json"));
  const fixtureSchema = new Ajv2020({ strict: true }).compile(JSON.parse(read("contracts/fixtures/markdown-audio-v1.schema.json")));
  assert.equal(fixtureSchema(fixtures), true, JSON.stringify(fixtureSchema.errors));
  const cases = Object.fromEntries(fixtures.cases.map((entry) => [entry.id, entry]));
  for (const id of ["standalone", "renamed", "surrounded", "duplicate", "label-escape", "marked-label"]) assert.equal(cases[id].player, true);
  for (const id of ["soft-break", "inline", "quote", "list", "code", "escaped", "adjacent", "external", "missing-projection", "mismatched-source"]) assert.equal(cases[id].player, false);
  assert.deepEqual(cases.renamed.labels, ["雨夜片段"]);
  assert.deepEqual(cases["marked-label"].labels, ["雨夜与片段"]);
  assert.deepEqual(fixtures.invalidProjectionCases.map((entry) => entry.id), ["wrong-mime", "zero-size", "negative-duration", "too-long", "empty-media-id"]);
  assert.ok(fixtures.invalidProjectionCases.every((entry) => entry.player === false));
});
