import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const contract = JSON.parse(read("contracts/foundation.v1.json"));
const manifest = JSON.parse(read("foundation-manifest.json"));
const packageJson = JSON.parse(read("package.json"));
const failures = [];

if (contract.schemaVersion !== 1) failures.push("foundation schemaVersion 必须为 1");
if (packageJson.version !== contract.version) failures.push("根 package 版本与契约不一致");
const contractSha256 = crypto
  .createHash("sha256")
  .update(fs.readFileSync(path.join(root, "contracts/foundation.v1.json")))
  .digest("hex");
if (manifest.contractSha256 !== contractSha256) failures.push("契约清单哈希与事实源不一致");
if (read("packages/flutter/foundation-manifest.json") !== read("foundation-manifest.json")) {
  failures.push("Flutter package 清单与根清单不一致");
}
if (!read("packages/flutter/pubspec.yaml").includes(`version: ${contract.version}`)) {
  failures.push("Flutter package 版本与契约不一致");
}

const requiredPalette = [
  "background", "foreground", "surface", "primary", "onPrimary", "brandStrong",
  "secondary", "muted", "mutedForeground", "accent", "border", "input",
];
for (const token of requiredPalette) {
  if (!/^#[0-9A-F]{6}$/.test(contract.palette[token] ?? "")) {
    failures.push(`缺少或无效色彩 Token：${token}`);
  }
}

function luminance(hex) {
  const channels = [1, 3, 5].map(
    (index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255,
  );
  const [r, g, b] = channels.map((value) =>
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

for (const [surface, foreground, label] of [
  [contract.palette.primary, contract.palette.onPrimary, "primary/onPrimary"],
  [contract.palette.background, contract.palette.foreground, "background/foreground"],
  [contract.palette.background, contract.palette.mutedForeground, "background/mutedForeground"],
]) {
  if (contrast(surface, foreground) < 4.5) failures.push(`${label} 未达到 WCAG AA`);
}

const editor = contract.experiences.editor;
const knownCapabilities = new Set(Object.keys(editor.labels));
for (const [name, ids] of Object.entries({
  widePrimary: editor.web.widePrimary,
  collapsedPrimary: editor.web.collapsedPrimary,
  moreFallback: editor.web.moreFallback,
  progressiveCollapse: editor.web.progressiveCollapse,
  mobilePrimary: editor.mobile.primary,
  mobileWideAdditions: editor.mobile.wideAdditions,
  mobileMoreSheet: editor.mobile.moreSheet,
  syntaxOnly: editor.syntaxOnly,
})) {
  if (new Set(ids).size !== ids.length) failures.push(`${name} 存在重复能力`);
  for (const id of ids) {
    if (!knownCapabilities.has(id)) failures.push(`${name} 引用了未知能力 ${id}`);
  }
}
if (editor.web.widePrimary.includes("more")) failures.push("Web 宽栏不得显示更多");
if (!editor.web.collapsedPrimary.includes("more")) failures.push("Web 收纳栏必须保留更多");
if (!editor.mobile.primary.includes("more")) failures.push("Flutter 一级栏必须保留更多");

for (const font of contract.fonts) {
  for (const property of ["flutterAsset", "license"]) {
    if (!fs.existsSync(path.join(root, font[property]))) failures.push(`${font.family} 缺少 ${property}`);
  }
  const hash = crypto
    .createHash("sha256")
    .update(fs.readFileSync(path.join(root, font.flutterAsset)))
    .digest("hex");
  if (hash !== font.sha256) failures.push(`${font.family} Flutter 字体校验和不一致`);
  if (font.webAsset) {
    const webHash = crypto
      .createHash("sha256")
      .update(fs.readFileSync(path.join(root, font.webAsset)))
      .digest("hex");
    if (webHash !== font.webSha256) failures.push(`${font.family} Web 字体校验和不一致`);
  }
}

const skill = read("skills/wenyou-design/SKILL.md");
if (!skill.includes("name: wenyou-design") || !skill.includes("contracts/foundation.v1.json")) {
  failures.push("wenyou-design Skill 未正确引用中央事实源");
}
if (/#[0-9a-f]{6}\b/iu.test(skill)) failures.push("Skill 不得复制具体色值");

if (failures.length > 0) {
  throw new Error(`Foundation 检查失败：\n- ${failures.join("\n- ")}`);
}
console.log(`Foundation ${contract.version} contract, contrast, fonts, editor matrix, and skill are valid`);
