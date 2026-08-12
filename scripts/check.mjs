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
for (const font of contract.fonts) {
  if (!read("packages/flutter/LICENSE").includes(font.family)) {
    failures.push(`Flutter package LICENSE 缺少 ${font.family}`);
  }
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
  webContextual: editor.web.contextual,
  mobileContextual: editor.mobile.contextual,
  syntaxOnly: editor.syntaxOnly,
  ...Object.fromEntries(Object.entries(editor.web.primaryByDensity).map(([density, ids]) => [`webPrimary:${density}`, ids])),
  ...Object.fromEntries(Object.entries(editor.web.moreByDensity).map(([density, ids]) => [`webMore:${density}`, ids])),
})) {
  if (new Set(ids).size !== ids.length) failures.push(`${name} 存在重复能力`);
  for (const id of ids) {
    if (!knownCapabilities.has(id)) failures.push(`${name} 引用了未知能力 ${id}`);
  }
}
if (editor.web.widePrimary.includes("more")) failures.push("Web 宽栏不得显示更多");
if (!editor.web.collapsedPrimary.includes("more")) failures.push("Web 收纳栏必须保留更多");
if (!editor.mobile.primary.includes("more")) failures.push("Flutter 一级栏必须保留更多");
if (editor.web.densityOrder.join(",") !== "expanded,with-more,without-draft,compact") {
  failures.push("Web 编辑器必须按四档密度逐级收纳");
}
for (const density of editor.web.densityOrder) {
  const primary = editor.web.primaryByDensity[density];
  const more = editor.web.moreByDensity[density];
  if (!Array.isArray(primary) || !Array.isArray(more)) {
    failures.push(`Web 编辑器密度 ${density} 缺少一级栏或更多菜单`);
    continue;
  }
  for (const capability of primary) {
    if (more.includes(capability)) failures.push(`${density} 同时在一级栏和更多菜单显示 ${capability}`);
  }
}
if (editor.web.layout.textMeasurePx !== contract.profiles.web.reading.bodyPx * contract.profiles.web.reading.maxFullWidthCharacters) {
  failures.push("Web 编辑器正文测量宽度必须等于阅读字号乘以全角字数");
}
if (editor.web.layout.toolbarInlinePaddingPx + editor.web.layout.firstControlInternalInsetPx !== editor.web.layout.contentInlinePaddingPx) {
  failures.push("Web 工具栏首项与正文首列基线未对齐");
}
if (
  editor.mobile.layout.bodySp !== contract.profiles.mobile.reading.bodySp ||
  editor.mobile.layout.lineHeight !== contract.profiles.mobile.reading.lineHeight
) {
  failures.push("Flutter 编辑态与阅读态正文排版必须一致");
}
for (const platform of ["web", "mobile"]) {
  const capabilities = editor.capabilities[platform];
  for (const id of knownCapabilities) {
    if (!capabilities[id]) failures.push(`${platform} 缺少 ${id} 能力生命周期`);
  }
  for (const id of Object.keys(capabilities)) {
    if (!knownCapabilities.has(id)) failures.push(`${platform} 能力生命周期引用未知能力 ${id}`);
  }
}
for (const id of editor.syntaxOnly) {
  if (editor.capabilities.mobile[id]?.roundTrip !== "source-preserve") {
    failures.push(`Flutter 语法能力 ${id} 必须显式保留源码`);
  }
}

const images = contract.experiences.images;
const requiredImageRoles = ["avatar", "cover", "content", "galleryThumbnail", "sticker"];
for (const role of requiredImageRoles) {
  if (!images.roles[role]) failures.push(`图片契约缺少 ${role} 角色`);
}
if (images.roles.content?.fit !== "contain" || images.roles.content?.crop !== "forbidden") {
  failures.push("正文图片必须完整呈现且禁止裁切");
}
if (images.roles.avatar?.fit !== "cover" || images.roles.cover?.fit !== "cover") {
  failures.push("头像与封面预览必须使用 cover 语义");
}
if (!images.invariants.reserveSpaceWhenDimensionsKnown) failures.push("图片契约必须避免已知尺寸时布局跳动");
if (!images.invariants.neverDeriveVariantUrls) failures.push("客户端不得自行推导媒体派生 URL");
if (images.web.viewer !== "modal-lightbox") failures.push("Web 图片查看必须使用模态 lightbox");
if (images.mobile.viewer !== "fullscreen-route") failures.push("Flutter 图片查看必须使用全屏路由");

const collections = contract.experiences.collections;
if (collections.invariants.containerWidth !== "available") {
  failures.push("集合容器必须占满分配列");
}
if (collections.invariants.itemWidth !== "available") {
  failures.push("列表项必须占满分配列");
}
if (!collections.invariants.narrowContentDoesNotChangeItemWidth) {
  failures.push("短内容不得改变列表项宽度");
}
for (const exception of ["message-bubble", "chip", "badge", "compact-action"]) {
  if (!collections.invariants.contentSizedExceptions.includes(exception)) {
    failures.push(`集合布局缺少按内容收缩例外 ${exception}`);
  }
}
if (collections.web.tabPanelWidth !== "available") failures.push("Web Tabs 面板必须占满可用宽度");
if (collections.mobile.itemWidth !== "available") failures.push("Flutter 列表项必须占满单列宽度");

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
if (!skill.includes("name: wenyou-design") || !skill.includes("contracts/foundation.v1.json") || !skill.includes("docs/images.md") || !skill.includes("experiences.collections")) {
  failures.push("wenyou-design Skill 未正确引用中央事实源");
}
if (/#[0-9a-f]{6}\b/iu.test(skill)) failures.push("Skill 不得复制具体色值");

if (failures.length > 0) {
  throw new Error(`Foundation 检查失败：\n- ${failures.join("\n- ")}`);
}
console.log(`Foundation ${contract.version} contract, contrast, fonts, editor matrix, and skill are valid`);
