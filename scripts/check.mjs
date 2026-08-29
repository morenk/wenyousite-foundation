import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { PNG } from "pngjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const contract = JSON.parse(read("contracts/foundation.v1.json"));
const schema = JSON.parse(read("contracts/foundation.schema.json"));
const manifest = JSON.parse(read("foundation-manifest.json"));
const packageJson = JSON.parse(read("package.json"));
const failures = [];

function hasBalancedCssBlocks(source) {
  let depth = 0;
  let quote = null;
  let inComment = false;
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];
    if (inComment) {
      if (character === "*" && next === "/") {
        inComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (character === "\\") {
        index += 1;
      } else if (character === quote) {
        quote = null;
      }
      continue;
    }
    if (character === "/" && next === "*") {
      inComment = true;
      index += 1;
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === "{") {
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth < 0) return false;
    }
  }
  return depth === 0 && !quote && !inComment;
}

const ajv = new Ajv2020({ allErrors: true, strict: true });
const validateContract = ajv.compile(schema);
if (!validateContract(contract)) {
  failures.push(`Foundation JSON Schema 校验失败：${ajv.errorsText(validateContract.errors, { separator: "; " })}`);
}
for (const [label, mutate] of [
  ["未知根字段", (value) => { value.unknown = true; }],
  ["缺少品牌契约", (value) => { delete value.experiences.brand; }],
  ["未知品牌字段", (value) => { value.experiences.brand.unknown = true; }],
  ["未知 profile 字段", (value) => { value.profiles.web.unknown = true; }],
  ["缺少无障碍契约", (value) => { delete value.accessibility; }],
  ["缺少互动控件契约", (value) => { delete value.experiences.icons.controls; }],
  ["未知互动控件字段", (value) => { value.experiences.icons.controls.unknown = true; }],
  ["缺少订阅互动 tone", (value) => { delete value.experiences.icons.controls.selected.subscription; }],
  ["选中态错误使用背景", (value) => { value.experiences.icons.controls.selected.like.surface = "accent"; }],
  ["遗留互动柔和色", (value) => { value.palette.likeSoft = "#FCE7F0"; }],
  ["缺少黑夜主题", (value) => { delete value.themes.dark; }],
  ["黑夜主题缺少色彩", (value) => { delete value.themes.dark.palette.foreground; }],
  ["黑夜偏好顺序错误", (value) => { value.themes.preferences.reverse(); }],
  ["黑夜等级缺少一档", (value) => { value.themes.dark.levelTiers.pop(); }],
  ["缺少元素契约", (value) => { delete value.experiences.elements; }],
  ["未知元素字段", (value) => { value.experiences.elements.unknown = true; }],
  ["缺少移动端引用宽度", (value) => { delete value.experiences.elements.mobile.quote; }],
  ["缺少移动端分隔线尺寸", (value) => { delete value.experiences.elements.mobile.divider; }],
  ["分隔线错误回退为满宽", (value) => { value.experiences.elements.block.divider.layout = "available"; }],
  ["分隔线未占正文一半", (value) => { value.experiences.elements.block.divider.inlineSizePercent = 40; }],
  ["主题标签错误回退为中性色", (value) => { value.experiences.elements.metadata.topicTag.tone = "neutral"; }],
  ["主题标签错误使用胶囊态", (value) => { value.experiences.elements.metadata.topicTag.presentation = "pill"; }],
  ["主题标签错误恢复常驻底色", (value) => { value.experiences.elements.metadata.topicTag.surface = "accent"; }],
  ["缺少骰子明细契约", (value) => { delete value.experiences.elements.inline.dice.detail; }],
  ["骰子错误显示展开提示", (value) => { value.experiences.elements.inline.dice.layout.visibleAffordance = "icon"; }],
  ["骰子待掷态错误可操作", (value) => { value.experiences.elements.inline.dice.interaction.pendingActivation = "open-detail"; }],
  ["缺少控件契约", (value) => { delete value.experiences.controls; }],
  ["缺少格式化契约", (value) => { delete value.experiences.formatting; }],
  ["非法等级色", (value) => { value.experiences.elements.metadata.level.tiers[0].foreground = "gray"; }],
  ["错误平台单位", (value) => { value.profiles.mobile.unit = "px"; }],
  ["非法浮层数值", (value) => { value.experiences.overlays.web.layers.popup = "70"; }],
]) {
  const invalid = structuredClone(contract);
  mutate(invalid);
  if (validateContract(invalid)) failures.push(`JSON Schema 反向用例未拒绝：${label}`);
}

if (contract.schemaVersion !== 2) failures.push("foundation schemaVersion 必须为 2");
if (packageJson.version !== contract.version) failures.push("根 package 版本与契约不一致");
if (
  packageJson.exports?.["./brand"]?.types !== "./dist/brand.d.ts"
  || packageJson.exports?.["./brand"]?.default !== "./dist/brand.js"
  || packageJson.exports?.["./theme"]?.types !== "./dist/theme.d.ts"
  || packageJson.exports?.["./theme"]?.default !== "./dist/theme.js"
  ||
  packageJson.exports?.["./elements"]?.types !== "./dist/elements.d.ts"
  || packageJson.exports?.["./elements"]?.default !== "./dist/elements.js"
  || packageJson.exports?.["./controls"]?.types !== "./dist/controls.d.ts"
  || packageJson.exports?.["./formatting"]?.types !== "./dist/formatting.d.ts"
) {
  failures.push("根 package 未导出 v6 设计契约模块");
}
const contractSha256 = crypto
  .createHash("sha256")
  .update(fs.readFileSync(path.join(root, "contracts/foundation.v1.json")))
  .digest("hex");
if (manifest.contractSha256 !== contractSha256) failures.push("契约清单哈希与事实源不一致");
if (Object.keys(manifest.artifactSha256 ?? {}).length < 35) {
  failures.push("发布清单未完整记录品牌、生成代码与 Token 产物");
}
for (const [relativePath, expectedHash] of Object.entries(manifest.artifactSha256 ?? {})) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    failures.push(`发布清单引用了不存在的生成产物 ${relativePath}`);
    continue;
  }
  const hash = crypto.createHash("sha256").update(fs.readFileSync(path.join(root, relativePath))).digest("hex");
  if (hash !== expectedHash) failures.push(`生成产物校验和不一致 ${relativePath}`);
}
if (!manifest.features?.brand || !manifest.features?.themes || !manifest.features?.typography || !manifest.features?.interaction || !manifest.features?.controls || !manifest.features?.formatting || !manifest.features?.contentPresentation || !manifest.features?.iconControls || !manifest.features?.navigation || !manifest.features?.language || !manifest.features?.elements) {
  failures.push("发布清单缺少共享语义能力清单");
}
if (read("packages/flutter/foundation-manifest.json") !== read("foundation-manifest.json")) {
  failures.push("Flutter package 清单与根清单不一致");
}
for (const claim of ["--action-primary", "--action-primary-foreground", "--image-viewer-backdrop", "--element-internal-reference-surface", "--element-internal-reference-line-height", "--element-dice-line-height", "--element-dice-detail-cell-surface", "--element-quote-foreground", "--element-quote-surface", "--element-quote-marker", "--element-quote-radius", "--element-badge-default-height", "--element-category-marker-width", "--element-level-mist-surface", "--element-level-berry-surface"]) {
  if (!read("web/tokens.css").includes(`${claim}:`)) failures.push(`Web Token 缺少 ${claim}`);
}
if (!read("packages/flutter/lib/src/foundation_tokens.dart").includes("class WenyouElementContract")) {
  failures.push("Flutter 生成物缺少 WenyouElementContract");
}
if (!read("packages/flutter/lib/src/foundation_tokens.dart").includes("class WenyouFoundationDarkPalette") || !read("packages/flutter/lib/src/foundation_tokens.dart").includes("class WenyouDarkLevelContract")) {
  failures.push("Flutter 生成物缺少黑夜 palette 或等级契约");
}
if (!read("web/tokens.css").includes('[data-theme="dark"]') || !read("web/tokens.css").includes("prefers-color-scheme: dark")) {
  failures.push("Web Token 缺少显式黑夜选择器或系统偏好回退");
}
if (!hasBalancedCssBlocks(read("web/tokens.css"))) {
  failures.push("Web Token CSS 块结构不平衡");
}
if (hasBalancedCssBlocks(`${read("web/tokens.css")}\n}`)) {
  failures.push("Web Token CSS 块结构反向用例未拒绝多余闭合花括号");
}
if (!read("dist/theme.js").includes("THEME_PALETTES") || !read("dist/theme.d.ts").includes("ThemePreference")) {
  failures.push("Web 主题模块缺少调色板或偏好类型");
}
if (!read("packages/flutter/lib/src/foundation_formatters.dart").includes("formatWenyouTime")) {
  failures.push("Flutter 生成物缺少统一时间格式化能力");
}
if (!read("packages/flutter/lib/src/foundation_brand.dart").includes("class WenyouBrandMark")) {
  failures.push("Flutter 生成物缺少 WenyouBrandMark");
}
for (const font of contract.fonts) {
  if (!read("packages/flutter/LICENSE").includes(font.family)) {
    failures.push(`Flutter package LICENSE 缺少 ${font.family}`);
  }
}
if (!read("packages/flutter/pubspec.yaml").includes(`version: ${contract.version}`)) {
  failures.push("Flutter package 版本与契约不一致");
}

const icons = contract.experiences.icons;
const brand = contract.experiences.brand;
const elements = contract.experiences.elements;

const listFiles = (relativeDirectory) => fs.readdirSync(path.join(root, relativeDirectory), { withFileTypes: true })
  .flatMap((entry) => {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    return entry.isDirectory() ? listFiles(relativePath) : [relativePath];
  })
  .sort();
const expectedBrandFiles = listFiles(brand.source.assetRoot);
const manifestedBrandFiles = Object.keys(manifest.brand?.assets ?? {}).sort();
if (JSON.stringify(expectedBrandFiles) !== JSON.stringify(manifestedBrandFiles)) {
  failures.push("品牌清单未精确覆盖 brand 事实源中的文件");
}
for (const relativePath of expectedBrandFiles) {
  const hash = crypto.createHash("sha256").update(fs.readFileSync(path.join(root, relativePath))).digest("hex");
  if (manifest.brand?.assets?.[relativePath] !== hash) failures.push(`品牌资产校验和不一致 ${relativePath}`);
}
for (const relativePath of [brand.assets.appIconMaster, brand.assets.symbolMaster, brand.source.fontLicense]) {
  if (!fs.existsSync(path.join(root, relativePath))) failures.push(`品牌契约引用了不存在的文件 ${relativePath}`);
}
if (manifest.brand?.name !== brand.name || manifest.brand?.tagline !== brand.tagline) {
  failures.push("品牌清单名称或文案与契约不一致");
}
const expectedPngDimensions = {
  "brand/masters/app-icon-master-1024.png": 1024,
  "brand/masters/logo-symbol-transparent-1024.png": 1024,
  "brand/app/android/play-store-icon-512.png": 512,
  "brand/app/android/adaptive/ic_launcher_background-432.png": 432,
  "brand/app/android/adaptive/ic_launcher_foreground-432.png": 432,
  "brand/app/android/mipmap-mdpi/ic_launcher.png": 48,
  "brand/app/android/mipmap-hdpi/ic_launcher.png": 72,
  "brand/app/android/mipmap-xhdpi/ic_launcher.png": 96,
  "brand/app/android/mipmap-xxhdpi/ic_launcher.png": 144,
  "brand/app/android/mipmap-xxxhdpi/ic_launcher.png": 192,
  "brand/app/apple/AppIcon-1024.png": 1024,
  "brand/app/apple/legacy/AppIcon-20.png": 20,
  "brand/app/apple/legacy/AppIcon-29.png": 29,
  "brand/app/apple/legacy/AppIcon-40.png": 40,
  "brand/app/apple/legacy/AppIcon-58.png": 58,
  "brand/app/apple/legacy/AppIcon-60.png": 60,
  "brand/app/apple/legacy/AppIcon-76.png": 76,
  "brand/app/apple/legacy/AppIcon-80.png": 80,
  "brand/app/apple/legacy/AppIcon-87.png": 87,
  "brand/app/apple/legacy/AppIcon-120.png": 120,
  "brand/app/apple/legacy/AppIcon-152.png": 152,
  "brand/app/apple/legacy/AppIcon-167.png": 167,
  "brand/app/apple/legacy/AppIcon-180.png": 180,
  "brand/app/apple/launch/LaunchMark-96.png": 96,
  "brand/app/apple/launch/LaunchMark-192.png": 192,
  "brand/app/apple/launch/LaunchMark-288.png": 288,
  ...Object.fromEntries([20, 24, 32, 40, 48, 64, 96, 128].map((size) => [`brand/ui/title-icon-${size}.png`, size])),
  "brand/web/apple-touch-icon.png": 180,
  "brand/web/favicon-16x16.png": 16,
  "brand/web/favicon-32x32.png": 32,
  "brand/web/favicon-48x48.png": 48,
  "brand/web/pwa-icon-192.png": 192,
  "brand/web/pwa-icon-512.png": 512,
  "brand/web/pwa-icon-1024.png": 1024,
  "brand/web/pwa-icon-maskable-512.png": 512,
};
const pngs = new Map();
for (const [relativePath, expectedSize] of Object.entries(expectedPngDimensions)) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    failures.push(`缺少品牌 PNG ${relativePath}`);
    continue;
  }
  const png = PNG.sync.read(fs.readFileSync(path.join(root, relativePath)));
  pngs.set(relativePath, png);
  if (png.width !== expectedSize || png.height !== expectedSize) failures.push(`品牌 PNG 尺寸错误 ${relativePath}`);
}
const opaquePngs = [...pngs.entries()].filter(([relativePath]) =>
  relativePath.includes("app-icon-master")
  || relativePath.includes("ic_launcher_background")
  || relativePath.includes("/mipmap-")
  || relativePath.includes("play-store")
  || relativePath.includes("/apple/AppIcon")
  || relativePath.includes("/apple/legacy/")
  || relativePath.includes("apple-touch")
  || relativePath.includes("pwa-icon"));
for (const [relativePath, png] of opaquePngs) {
  for (let offset = 3; offset < png.data.length; offset += 4) {
    if (png.data[offset] !== 255) {
      failures.push(`应用图标不得含透明像素 ${relativePath}`);
      break;
    }
  }
}
const foreground = pngs.get("brand/app/android/adaptive/ic_launcher_foreground-432.png");
if (foreground) {
  let left = foreground.width;
  let top = foreground.height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < foreground.height; y += 1) {
    for (let x = 0; x < foreground.width; x += 1) {
      if (foreground.data[(y * foreground.width + x) * 4 + 3] > 0) {
        left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
      }
    }
  }
  const safePixels = 264;
  if (right < left || right - left + 1 > safePixels || bottom - top + 1 > safePixels) {
    failures.push("Android adaptive foreground 超出 66dp 安全区");
  }
}
const adaptiveBackground = pngs.get("brand/app/android/adaptive/ic_launcher_background-432.png");
if (adaptiveBackground) {
  const expected = contract.palette[brand.colors.surface].slice(1).match(/../g).map((value) => Number.parseInt(value, 16));
  for (let offset = 0; offset < adaptiveBackground.data.length; offset += 4) {
    if (adaptiveBackground.data[offset] !== expected[0] || adaptiveBackground.data[offset + 1] !== expected[1] || adaptiveBackground.data[offset + 2] !== expected[2] || adaptiveBackground.data[offset + 3] !== 255) {
      failures.push("Android adaptive background 必须完全使用品牌主色");
      break;
    }
  }
}
if (icons.source.package !== "lucide-static" || icons.source.version !== packageJson.dependencies[icons.source.package]) {
  failures.push("Lucide 图标来源版本与根依赖不一致");
}
if (!read("pnpm-lock.yaml").includes(icons.source.integrity)) failures.push("Lucide 来源完整性未锁定");
if (!fs.existsSync(path.join(root, icons.source.license))) failures.push("Lucide 图标许可证不存在");
const semanticIds = Object.keys(icons.semantics);
const glyphIds = [...new Set(Object.values(icons.semantics))];
const filledGlyphIds = [...new Set(Object.values(icons.controls.selected)
  .filter((state) => state.glyph === "filled" && state.semanticId)
  .map((state) => icons.semantics[state.semanticId]))];
if (semanticIds.length !== new Set(semanticIds).size) failures.push("图标语义 ID 重复");
for (const glyphId of glyphIds) {
  const upstream = path.join(root, "node_modules", icons.source.package, "icons", `${glyphId}.svg`);
  const flutterAsset = path.join(root, "packages", "flutter", "icons", `${glyphId}.svg`);
  if (!fs.existsSync(upstream)) failures.push(`Lucide 来源缺少 ${glyphId}`);
  if (!fs.existsSync(flutterAsset)) failures.push(`Flutter package 缺少图标资产 ${glyphId}`);
  if (!manifest.icons?.glyphSha256?.[glyphId]) failures.push(`发布清单缺少图标校验和 ${glyphId}`);
  if (fs.existsSync(flutterAsset)) {
    const hash = crypto.createHash("sha256").update(read(path.relative(root, flutterAsset)).trimEnd()).digest("hex");
    if (hash !== manifest.icons?.glyphSha256?.[glyphId]) failures.push(`Flutter 图标资产校验和不一致 ${glyphId}`);
  }
}
for (const glyphId of filledGlyphIds) {
  const outlineAsset = `packages/flutter/icons/${glyphId}.svg`;
  const filledAsset = `packages/flutter/icons/${glyphId}-filled.svg`;
  if (!fs.existsSync(path.join(root, filledAsset))) {
    failures.push(`Flutter package 缺少实心图标资产 ${glyphId}`);
    continue;
  }
  const expected = read(outlineAsset).trimEnd().replace('fill="none"', 'fill="currentColor"');
  const actual = read(filledAsset).trimEnd();
  if (actual !== expected) failures.push(`实心图标 ${glyphId} 必须只改变同一 Lucide 路径的填充呈现`);
  const hash = crypto.createHash("sha256").update(actual).digest("hex");
  if (hash !== manifest.icons?.filledGlyphSha256?.[glyphId]) failures.push(`实心图标资产校验和不一致 ${glyphId}`);
}
const packagedIconFiles = fs.readdirSync(path.join(root, "packages", "flutter", "icons"))
  .filter((fileName) => fileName.endsWith(".svg"));
const expectedIconFiles = new Set([
  ...glyphIds.map((glyphId) => `${glyphId}.svg`),
  ...filledGlyphIds.map((glyphId) => `${glyphId}-filled.svg`),
]);
for (const fileName of packagedIconFiles) {
  if (!expectedIconFiles.has(fileName)) failures.push(`Flutter package 存在未纳入契约的图标 ${fileName}`);
}
for (const capability of Object.keys(contract.experiences.editor.labels)) {
  const semanticId = capability === "hr"
    ? "editor.horizontal-rule"
    : capability === "draft"
      ? "editor.content-drafts"
      : `editor.${capability}`;
  if (capability !== "mention" && !icons.semantics[semanticId]) {
    failures.push(`编辑器能力 ${capability} 缺少图标语义`);
  }
}

const requiredPalette = [
  "background", "foreground", "surface", "primary", "onPrimary", "actionPrimary", "onActionPrimary", "brandStrong",
  "secondary", "onSecondary", "muted", "mutedForeground", "accent", "onAccent", "like", "bookmark", "border", "input",
];
const themePalettes = [
  ["light", contract.palette],
  ["dark", contract.themes.dark.palette],
];
if (JSON.stringify(Object.keys(contract.palette)) !== JSON.stringify(Object.keys(contract.themes.dark.palette))) {
  failures.push("亮色与黑夜 palette 的语义键或顺序不一致");
}
if (contract.themes.defaultPreference !== "system" || contract.themes.preferences.join(",") !== "system,light,dark") {
  failures.push("主题默认偏好或公开偏好顺序发生漂移");
}
for (const preference of contract.themes.preferences) {
  if (!contract.themes.labels[preference] || !icons.semantics[contract.themes.icons[preference]]) {
    failures.push(`主题偏好 ${preference} 缺少标签或语义图标`);
  }
}
for (const [mode, palette] of themePalettes) {
  for (const token of requiredPalette) {
    if (!/^#[0-9A-F]{6}$/.test(palette[token] ?? "")) {
      failures.push(`${mode} 缺少或无效色彩 Token：${token}`);
    }
  }
}
const expectedInteractionPalettes = {
  light: { like: "#D81B60", bookmark: "#B77900" },
  dark: { like: "#FF6FA9", bookmark: "#E9BE64" },
};
for (const [mode, palette] of themePalettes) {
  const expected = expectedInteractionPalettes[mode];
  if (JSON.stringify(Object.fromEntries(Object.keys(expected).map((token) => [token, palette[token]]))) !== JSON.stringify(expected)) {
    failures.push(`${mode} 点赞与收藏互动色偏离已审定色板`);
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

for (const [mode, palette] of themePalettes) {
  for (const [surface, foreground, label] of [
    [palette.primary, palette.onPrimary, "primary/onPrimary"],
    [palette.actionPrimary, palette.onActionPrimary, "actionPrimary/onActionPrimary"],
    [palette.secondary, palette.onSecondary, "secondary/onSecondary"],
    [palette.accent, palette.onAccent, "accent/onAccent"],
    [palette.destructive, palette.onDestructive, "destructive/onDestructive"],
    [palette.destructiveSoft, palette.destructive, "destructiveSoft/destructive"],
    [palette.successSoft, palette.success, "successSoft/success"],
    [palette.warningSoft, palette.warning, "warningSoft/warning"],
    [palette.infoSoft, palette.info, "infoSoft/info"],
    [palette.background, palette.foreground, "background/foreground"],
    [palette.background, palette.mutedForeground, "background/mutedForeground"],
  ]) {
    if (contrast(surface, foreground) < contract.accessibility.contrast.normalText) {
      failures.push(`${mode} ${label} 未达到普通文字对比度要求`);
    }
  }
  if (mode === "dark" && contrast(palette.surface, palette.input) < contract.accessibility.contrast.nonText) {
    failures.push(`${mode} surface/input 未达到控件边界对比度要求`);
  }
  if (mode === "dark" && contrast(palette.surface, palette.actionPrimary) < contract.accessibility.contrast.nonText) {
    failures.push("dark surface/actionPrimary 未达到强操作边界对比度要求");
  }
}

const expectedLevelRanges = [[1, 1], [2, 3], [4, 5], [6, 7], [8, 9]];
for (const [mode, tiers] of [["light", elements.metadata.level.tiers], ["dark", contract.themes.dark.levelTiers]]) {
  for (const [index, tier] of tiers.entries()) {
    const [minimum, maximum] = expectedLevelRanges[index];
    if (tier.minimum !== minimum || tier.maximum !== maximum) {
      failures.push(`${mode} 等级色阶 ${tier.id} 未覆盖审定范围 ${minimum}-${maximum}`);
    }
    if (contrast(tier.surface, tier.foreground) < contract.accessibility.contrast.normalText) {
      failures.push(`${mode} 等级色阶 ${tier.id} 未达到普通文字对比度要求`);
    }
  }
}
if (
  contract.typography.usage.displayWeight !== 500
  || contract.typography.usage.listTitleWeight !== 600
  || !contract.typography.usage.bodyOnlyContexts.includes("username")
  || !contract.typography.usage.bodySemiboldContexts.includes("dialog-title")
) {
  failures.push("文楷与黑体的使用语境偏离 v6 规范");
}
if (
  contract.experiences.formatting.relativeTime.relativeWindowSeconds !== 72 * 60 * 60
  || contract.experiences.formatting.relativeTime.sameYearFallback !== "MM-dd HH:mm"
  || contract.experiences.formatting.relativeTime.crossYearFallback !== "yyyy-MM-dd HH:mm"
) {
  failures.push("相对时间三天窗口或绝对时间回退格式发生漂移");
}
if (elements.identity.emailVerification.publicIdentity !== "hidden") {
  failures.push("邮箱验证不得进入公开身份呈现");
}
if (
  contract.experiences.overlays.tasks.popover !== "anchored-quick-action-selection-or-detail"
  || contract.experiences.overlays.tasks.sheet !== "mobile-long-choice-multi-action-or-detail"
) {
  failures.push("Popover 与 Sheet 必须允许承载非阻断式上下文明细");
}
const dice = elements.inline.dice;
if (
  dice.labels.settled !== "{notation} = {total}"
  || dice.labels.pending !== "{notation} = ?"
  || dice.labels.visibleResult !== "total-only"
  || dice.labels.resultBreakdown !== "interactive-detail"
  || dice.lineHeight !== 1.5
  || dice.paddingBlockEm !== 0.04
  || dice.layout.display !== "inline-atomic"
  || dice.layout.internalWrap !== "forbidden"
  || dice.layout.icon !== "none"
  || dice.layout.visibleAffordance !== "none"
  || dice.semantics.settledRole !== "button"
  || dice.semantics.pendingRole !== "note"
  || dice.semantics.settled !== "骰子 {notation}，总计 {total}"
  || dice.interaction.settledActivation !== "open-detail"
  || dice.interaction.pendingActivation !== "none"
  || dice.interaction.visibleHint !== "none"
  || !dice.interaction.exposesExpandedState
  || !dice.interaction.restoreFocus
  || dice.detail.resultLayout !== "adaptive-number-tray"
  || dice.detail.resultOrder !== "server-order"
  || dice.detail.resultIndexOrigin !== 1
  || dice.detail.calculation.subtotalSource !== "sum-server-results"
  || dice.detail.calculation.totalSource !== "server-total"
  || !dice.semantics.neverColorOnly
  || dice.data.binding !== "node-id"
  || dice.data.resultSource !== "server-only"
  || dice.data.settledResult !== "immutable"
  || dice.editor.selection !== "atomic"
  || dice.editor.activation !== "selection-only"
  || dice.editor.readingEquivalentScope !== "visual-presentation"
  || dice.editor.insertion.fields.join(",") !== "quantity,sides,modifier"
  || dice.editor.insertion.fieldTypes.modifier !== "signed-integer"
  || dice.editor.insertion.quickSides.join(",") !== "4,6,8,10,12,20,100"
  || dice.editor.insertion.layout !== "responsive-expression-builder"
  || dice.editor.insertion.previewBehavior !== "live-canonical"
  || dice.editor.insertion.validationOwner !== "backend-contracts"
) {
  failures.push("骰子节点文案、明细、插入器、无障碍或服务端结果绑定偏离 v6.1 规范");
}

for (const [mode, palette] of themePalettes) {
  for (const surfaceToken of icons.controls.hostSurfaces) {
    for (const [foregroundToken, label] of [
      [icons.controls.selected.default.foreground, "default"],
      [icons.controls.selected.like.foreground, "like"],
      [icons.controls.selected.bookmark.foreground, "bookmark"],
      [icons.controls.selected.subscription.foreground, "subscription"],
    ]) {
      if (contrast(palette[surfaceToken], palette[foregroundToken]) < contract.accessibility.contrast.nonText) {
        failures.push(`${mode} ${surfaceToken}/${label} 未达到透明图标控件状态对比度要求`);
      }
    }
  }
}

const iconControls = icons.controls;
if (
  iconControls.selected.like.semanticId !== "action.like"
  || iconControls.selected.bookmark.semanticId !== "action.bookmark"
  || iconControls.selected.subscription.semanticId !== "action.subscribe"
  || icons.semantics[iconControls.selected.like.semanticId] !== "heart"
  || icons.semantics[iconControls.selected.bookmark.semanticId] !== "bookmark"
  || icons.semantics[iconControls.selected.subscription.semanticId] !== "bell"
) {
  failures.push("点赞、收藏与订阅互动色必须绑定对应 Foundation 语义图标");
}
if (
  Object.values(iconControls.selected).some((state) => state.surface !== "transparent")
  || iconControls.selected.like.glyph !== "filled"
  || iconControls.selected.bookmark.glyph !== "filled"
  || iconControls.selected.subscription.glyph !== "filled"
  || !iconControls.selected.default.requiresVisibleStateCue
) {
  failures.push("图标选中态必须使用透明容器，并通过实心图形或可见文字提供非颜色线索");
}
if (
  iconControls.stateLayer.color !== "currentColor"
  || iconControls.stateLayer.shape !== "circle"
  || iconControls.stateLayer.target !== "icon-hit-area"
  || iconControls.stateLayer.hoverOpacity !== 0.1
  || iconControls.stateLayer.focusOpacity !== 0.1
  || iconControls.stateLayer.pressedOpacity !== 0.15
  || iconControls.disabledContentOpacity !== 0.38
) {
  failures.push("图标控件瞬时状态层或禁用透明度偏离审定值");
}

if (
  elements.inline.internalReference.icon !== "content.internal-reference"
  || icons.semantics[elements.inline.internalReference.icon] !== "door-open"
  || elements.inline.internalReference.overflow !== "wrap-no-truncate"
  || elements.inline.internalReference.editorBehavior !== "atomic-no-navigation"
) {
  failures.push("站内传送门必须绑定同源 door-open 语义并在阅读/编辑态保持可换行胶囊");
}
if (
  elements.web.internalReference.lineHeight !== 1.5
  || elements.web.internalReference.paddingBlockEm !== 0.04
  || elements.web.internalReference.paddingInlineEm !== 0.38
  || elements.web.internalReference.gapEm !== 0.26
  || elements.web.internalReference.radiusEm !== 0.4
  || elements.web.internalReference.iconSizeEm !== 0.9
) {
  failures.push("Web 站内传送门尺寸偏离审定的轻量内联胶囊");
}
if (
  elements.mobile.internalReference.lineHeight !== 1.5
  || elements.mobile.internalReference.paddingBlockEm !== 0.04
  || elements.web.dice.detailSurface !== "anchored-popover"
  || elements.web.dice.detailWidthRem !== 22
  || elements.web.dice.detailMaxHeightRem !== 28
  || !elements.web.dice.detailViewportClamp
  || elements.mobile.dice.detailSurface !== "bottom-sheet"
  || elements.mobile.dice.detailMaximumHeightFraction !== 0.8
  || !elements.web.dice.explicitClose
  || !elements.mobile.dice.explicitClose
) {
  failures.push("跨端紧凑原子或骰子明细承载方式偏离 v6.1 规范");
}
if (
  elements.block.quote.fontStyle !== "normal"
  || elements.block.quote.fontFamily !== "body"
  || elements.block.quote.fontSize !== "inherit"
  || elements.block.quote.lineHeight !== "inherit"
  || elements.block.quote.fontWeight !== 400
  || elements.block.quote.marker !== "brandStrong"
  || elements.block.quote.markerWidthPx !== 2
  || elements.mobile.quote.markerWidthDp !== 2
  || elements.block.quote.radiusApplication !== "trailing-only"
  || elements.block.quote.width !== "available"
  || elements.block.quote.paddingBlockEm !== 0.5
  || elements.block.quote.paddingInlineEm !== 0.75
  || elements.block.quote.outerSpacing !== "native-block-rhythm"
  || elements.block.quote.contentSpacing !== "trim-outer-preserve-inner"
  || elements.block.quote.generatedAdornment !== "none"
  || elements.block.quote.shadow !== "none"
  || elements.block.divider.color !== "border"
  || elements.block.divider.widthPx !== 1
  || elements.block.divider.layout !== "centered-short-line-with-dot"
  || elements.block.divider.alignment !== "center"
  || elements.block.divider.inlineSizeEm !== 5
  || elements.block.divider.inlineSizePercent !== 50
  || elements.block.divider.inlineSizePreference !== "available-content-percent"
  || elements.block.divider.marker !== "brandStrong"
  || elements.block.divider.markerDiameterPx !== 5
  || elements.block.divider.outerSpacingEm !== 1.75
  || elements.mobile.divider.widthDp !== 1
  || elements.mobile.divider.markerDiameterDp !== 5
) {
  failures.push("引用书签纸条与正文停顿分隔线必须使用统一块级元素语义");
}
for (const [mode, palette] of themePalettes) {
  if (
    contrast(palette[elements.block.quote.surface], palette[elements.block.quote.foreground]) < contract.accessibility.contrast.normalText
    || contrast(palette[elements.block.quote.surface], palette[elements.block.quote.marker]) < contract.accessibility.contrast.nonText
  ) {
    failures.push(`${mode} 引用正文或书签线未达到对比度要求`);
  }
  for (const surface of ["background", "surface"]) {
    if (
      contrast(palette[surface], palette[elements.block.divider.marker])
      < contract.accessibility.contrast.nonText
    ) {
      failures.push(`${mode} 分隔线中心圆点在 ${surface} 上未达到非文字对比度要求`);
    }
  }
}
if (elements.metadata.badge.sizes.join(",") !== "default,compact") {
  failures.push("Badge 只能使用 default 与 compact 两种尺寸");
}
if (JSON.stringify(Object.keys(elements.metadata.badge.tones)) !== JSON.stringify(["neutral", "brand", "success", "warning", "danger", "info"])) {
  failures.push("Badge tone 集合或顺序不稳定");
}
if (
  elements.metadata.badge.default.heightPx !== 24
  || elements.metadata.badge.compact.heightPx !== 20
  || elements.metadata.topicTag.prefix !== "#"
  || elements.metadata.topicTag.tone !== "brand"
  || elements.metadata.topicTag.presentation !== "text-only"
  || elements.metadata.topicTag.shape !== "none"
  || elements.metadata.topicTag.foreground !== "brandStrong"
  || elements.metadata.topicTag.surface !== "transparent"
  || elements.metadata.topicTag.border !== "transparent"
  || elements.metadata.topicTag.hoverSurface !== "transparent"
  || elements.metadata.topicTag.hoverDecoration !== "underline"
  || elements.metadata.topicTag.focusRing !== "brandStrong"
  || elements.metadata.topicTag.weight !== 600
  || elements.metadata.level.format !== "Lv.N"
  || elements.metadata.unreadCount.maximumDisplay !== "99+"
  || elements.metadata.unreadCount.zeroBehavior !== "hidden"
) {
  failures.push("元数据元素的尺寸、文本线索或计数降级规则发生漂移");
}
for (const [mode, palette] of themePalettes) {
  const topicTag = elements.metadata.topicTag;
  for (const surface of ["background", "surface", "muted"]) {
    if (contrast(palette[surface], palette[topicTag.foreground]) < contract.accessibility.contrast.normalText) {
      failures.push(`${mode} 主题标签文字在 ${surface} 上未达到普通文字对比度`);
    }
  }
}
if (
  elements.web.interactiveMinimumPx !== contract.profiles.web.minimumCompactTarget
  || elements.mobile.interactiveMinimumDp !== contract.profiles.mobile.minimumControlTarget
  || elements.web.categoryMarkerWidthPx !== 4
  || elements.metadata.categoryMarker.colorOwner !== "foundation"
  || elements.metadata.categoryMarker.foreground !== "mutedForeground"
  || elements.metadata.categoryMarker.badgeTone !== "neutral"
  || !elements.metadata.categoryMarker.neverSoleCue
) {
  failures.push("跨端元素命中区或分类中性标记规则不符合平台 profile");
}
if (
  iconControls.supportingContent.selected !== "foreground"
  || iconControls.pendingVisual !== "preserve-state-with-loading-indicator"
) {
  failures.push("互动控件辅助内容或 pending 语义发生漂移");
}

const typeRoleIds = ["pageTitle", "sectionTitle", "subsectionTitle", "body", "compactBody", "label", "caption", "reading"];
for (const platform of ["web", "mobile"]) {
  const scale = contract.profiles[platform].typeScale;
  if (JSON.stringify(Object.keys(scale)) !== JSON.stringify(typeRoleIds)) {
    failures.push(`${platform} 语义排版角色不完整或顺序不稳定`);
  }
}
if (
  contract.profiles.web.typeScale.reading.size !== contract.profiles.web.reading.bodyPx ||
  contract.profiles.web.typeScale.reading.lineHeight !== contract.profiles.web.reading.lineHeightPx ||
  contract.profiles.mobile.typeScale.reading.size !== contract.profiles.mobile.reading.bodySp ||
  contract.profiles.mobile.typeScale.reading.lineHeight !== contract.profiles.mobile.reading.lineHeight
) {
  failures.push("语义 reading 角色必须与平台阅读 profile 保持一致");
}
if (
  contract.profiles.web.expandedChromeFrom !== 1280 ||
  contract.profiles.mobile.horizontalPadding.regularFrom !== 401 ||
  contract.profiles.mobile.pageContentMaxWidth !== 520 ||
  contract.profiles.mobile.wideContainerMaxWidth !== 600 ||
  contract.profiles.mobile.radii.pill !== 999 ||
  "pill" in contract.profiles.web.radii
) {
  failures.push("平台断点与内容宽度不符合 v2.2 profile");
}

const feedback = contract.experiences.feedback;
if (feedback.resourceStates.join(",") !== "loading,refreshing,loading-more,empty,no-results,error,offline,restricted") {
  failures.push("资源反馈状态必须使用 v2.2 固定集合");
}
if (feedback.mutationStates.join(",") !== "idle,pending,success,error") {
  failures.push("Mutation 反馈状态必须使用 v2.2 固定集合");
}
for (const invariant of ["refreshPreservesContent", "paginationPreservesContent", "pendingPreventsDuplicateSubmit", "retryOnlyWhenSafe", "blockingFailureStaysInContext", "transientFeedbackNeverSoleCriticalResult"]) {
  if (!feedback.invariants[invariant]) failures.push(`反馈契约未保证 ${invariant}`);
}

const overlays = contract.experiences.overlays;
const expectedLayers = { sticky: 30, chrome: 40, floating: 60, popup: 70, modalBackdrop: 80, modal: 81, tooltip: 90, nestedPopup: 100, globalProgress: 110 };
if (JSON.stringify(overlays.web.layers) !== JSON.stringify(expectedLayers)) {
  failures.push("Web 浮层层级必须使用 v2.2 语义顺序");
}
const layerValues = Object.values(overlays.web.layers);
if (layerValues.some((value, index) => index > 0 && value <= layerValues[index - 1])) {
  failures.push("Web 浮层层级必须严格递增");
}
if (JSON.stringify(overlays.mobile.elevation) !== JSON.stringify({ flat: 0, floating: 2, popup: 4 })) {
  failures.push("Flutter elevation 角色必须固定为 0/2/4");
}

const navigation = contract.experiences.navigation;
const expectedNavigationLabels = {
  discover: "发现", moments: "动态", publish: "发布", messages: "消息", profile: "我的",
  search: "搜索", notifications: "通知", directMessages: "私聊", bookmarks: "收藏",
};
if (JSON.stringify(navigation.labels) !== JSON.stringify(expectedNavigationLabels)) {
  failures.push("导航标签必须使用共享词汇");
}
for (const id of [...navigation.web.primary, ...navigation.web.accountShortcuts, ...navigation.mobile.primary, ...navigation.mobile.messageSections]) {
  if (!navigation.labels[id]) failures.push(`导航 profile 引用了未知目的地 ${id}`);
}
for (const [id, semanticId] of Object.entries(navigation.icons)) {
  if (!navigation.labels[id]) failures.push(`导航图标引用了未知目的地 ${id}`);
  if (!contract.experiences.icons.semantics[semanticId]) failures.push(`导航目的地 ${id} 缺少图标语义 ${semanticId}`);
}

const language = contract.experiences.language;
if (language.actions.hide !== "隐藏" || language.actions.restore !== "恢复" || language.nouns.thread !== "主题帖") {
  failures.push("共享界面词汇未保留稳定名词与动作");
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
  mobilePrimaryCore: editor.mobile.primaryCore,
  mobilePrimaryPromotionOrder: editor.mobile.primaryPromotionOrder,
  mobileMoreInline: editor.mobile.moreInline,
  webContextual: editor.web.contextual,
  mobileContextual: editor.mobile.contextual,
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
if (editor.mobile.primaryCore.join(",") !== "heading,bold,italic,image,more") {
  failures.push("Flutter 编辑器核心一级栏顺序必须保持稳定");
}
if (editor.mobile.primaryPromotionOrder.join(",") !== "draft,quote,hr,sticker") {
  failures.push("Flutter 编辑器宽度提升顺序必须为草稿、引用、分隔线、表情包");
}
if (editor.mobile.layout.minimumActionExtentDp !== contract.profiles.mobile.minimumControlTarget) {
  failures.push("Flutter 编辑器按钮最小尺寸必须服从移动端触控目标");
}
if (editor.mobile.surfaces.join(",") !== "page,expandableSheet,inline") {
  failures.push("Flutter 编辑器必须固定 page、expandableSheet 与 inline 三种承载面");
}
if (
  editor.mobile.toolbar.placementWhenKeyboardVisible !== "above-keyboard-dock" ||
  editor.mobile.toolbar.primaryLayout !== "responsive-single-row" ||
  editor.mobile.toolbar.horizontalOverflow !== "forbidden" ||
  editor.mobile.toolbar.morePresentation !== "inline"
) {
  failures.push("Flutter 编辑工具栏必须在键盘上方单行响应式布局，并以内联更多渐进披露");
}
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
if (
  editor.contentPolicy.markdownContractVersion !== 4 ||
  editor.contentPolicy.structuredCapabilitySource !== "toolbar" ||
  editor.contentPolicy.unsupportedClientBehavior !== "literal-text-silent" ||
  editor.contentPolicy.unsupportedApiBehavior !== "reject" ||
  editor.contentPolicy.maximumListDepth !== 3
) {
  failures.push("编辑器必须绑定 Markdown v4 工具栏白名单策略");
}
for (const id of ["task-list", "code-block", "table"]) {
  if (knownCapabilities.has(id) || editor.capabilities.web[id] || editor.capabilities.mobile[id]) {
    failures.push(`工具栏外格式 ${id} 不得继续声明为产品能力`);
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

const notifications = contract.experiences.notifications;
const expectedNotificationGroups = [
  ["interaction", "互动", ["reply", "mention", "follow", "like"]],
  ["subscription", "订阅", ["new_post", "thread_created"]],
  ["system", "系统", ["tip", "level_up", "system"]],
];
if (notifications.allLabel !== "全部") failures.push("通知总览入口必须命名为全部");
if (notifications.eventTypeOwner !== "backend-notification-contract") {
  failures.push("通知事件协议必须继续由后端契约拥有");
}
if (notifications.unknownTypeVisibility !== "all") {
  failures.push("未知通知类型必须至少在全部通知中可见");
}
if (JSON.stringify(notifications.groups) !== JSON.stringify(
  expectedNotificationGroups.map(([id, label, types]) => ({ id, label, types })),
)) {
  failures.push("通知分组必须固定为互动、订阅、系统及其当前事件成员");
}
const groupedNotificationTypes = notifications.groups.flatMap(({ types }) => types);
if (new Set(groupedNotificationTypes).size !== groupedNotificationTypes.length) {
  failures.push("同一通知事件不得属于多个筛选分组");
}

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
if (!skill.includes("name: wenyou-design") || !skill.includes("contracts/foundation.v1.json") || !skill.includes("docs/images.md") || !skill.includes("docs/icons.md") || !skill.includes("docs/elements.md") || !skill.includes("docs/interaction.md") || !skill.includes("docs/presentation.md") || !skill.includes("docs/navigation-language.md") || !skill.includes("experiences.collections") || !skill.includes("experiences.controls") || !skill.includes("experiences.formatting") || !skill.includes("experiences.elements") || !skill.includes("experiences.icons") || !skill.includes("experiences.feedback") || !skill.includes("experiences.navigation")) {
  failures.push("wenyou-design Skill 未正确引用中央事实源");
}
if (/#[0-9a-f]{6}\b/iu.test(skill)) failures.push("Skill 不得复制具体色值");

if (failures.length > 0) {
  throw new Error(`Foundation 检查失败：\n- ${failures.join("\n- ")}`);
}
console.log(`Foundation ${contract.version} schema, artifacts, contrast, typography, elements, interaction, navigation, editor, and skill are valid`);
