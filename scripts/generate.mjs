import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contract = JSON.parse(
  fs.readFileSync(path.join(root, "contracts/foundation.v1.json"), "utf8"),
);
const contractSha256 = crypto
  .createHash("sha256")
  .update(fs.readFileSync(path.join(root, "contracts/foundation.v1.json")))
  .digest("hex");
const checkOnly = process.argv.includes("--check");
const readFile = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8").trimEnd();

function write(relativePath, content) {
  const target = path.join(root, relativePath);
  const normalized = `${content.trimEnd()}\n`;
  if (checkOnly) {
    const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
    if (current !== normalized) {
      throw new Error(`${relativePath} 与 foundation 契约不一致，请运行 pnpm generate`);
    }
    return;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, normalized);
}

function copyBinary(sourceRelativePath, targetRelativePath) {
  const source = path.join(root, sourceRelativePath);
  const target = path.join(root, targetRelativePath);
  const expected = fs.readFileSync(source);
  if (checkOnly) {
    const current = fs.existsSync(target) ? fs.readFileSync(target) : Buffer.alloc(0);
    if (!current.equals(expected)) {
      throw new Error(`${targetRelativePath} 与品牌事实源不一致，请运行 pnpm generate`);
    }
    return;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function listFiles(relativeDirectory) {
  const directory = path.join(root, relativeDirectory);
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const relativePath = path.posix.join(relativeDirectory.replaceAll("\\", "/"), entry.name);
      return entry.isDirectory() ? listFiles(relativePath) : [relativePath];
    })
    .sort();
}

const js = (value) => JSON.stringify(value, null, 2);
const cssHex = (value) => value.toLowerCase();
const dartColor = (value) => `Color(0xFF${value.slice(1)})`;
const dartString = (value) => `'${value.replaceAll("'", "\\'")}'`;
const dartList = (values, mapper = dartString) =>
  `[${values.map(mapper).join(", ")}]`;
const dartIdentifier = (value) => value
  .split(/[.-]/u)
  .map((part, index) => index === 0 ? part : `${part[0].toUpperCase()}${part.slice(1)}`)
  .join("");

const editor = contract.experiences.editor;
const brand = contract.experiences.brand;
const icons = contract.experiences.icons;
const images = contract.experiences.images;
const collections = contract.experiences.collections;
const controls = contract.experiences.controls;
const elements = contract.experiences.elements;
const notifications = contract.experiences.notifications;
const accessibility = contract.accessibility;
const feedback = contract.experiences.feedback;
const overlays = contract.experiences.overlays;
const formatting = contract.experiences.formatting;
const navigation = contract.experiences.navigation;
const language = contract.experiences.language;
const typeRoleIds = Object.keys(contract.profiles.web.typeScale);
const kebab = (value) => value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
const paletteCssNames = {
  foreground: "--foreground",
  mutedForeground: "--muted-foreground",
  brandStrong: "--brand-strong",
  primary: "--primary",
  accent: "--accent",
  onAccent: "--accent-foreground",
  muted: "--muted",
  border: "--border",
  destructive: "--destructive",
  onDestructive: "--destructive-foreground",
  destructiveSoft: "--destructive-soft",
  success: "--success",
  successSoft: "--success-soft",
  warning: "--warning",
  warningSoft: "--warning-soft",
  info: "--info",
  infoSoft: "--info-soft",
};
const cssPaletteValue = (token) => token === "transparent" ? "transparent" : `var(${paletteCssNames[token]})`;

write("dist/brand.js", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const BRAND = Object.freeze(${js(brand)});
export const BRAND_NAME = ${JSON.stringify(brand.name)};
export const BRAND_TAGLINE = ${JSON.stringify(brand.tagline)};`);
write("dist/brand.d.ts", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export declare const BRAND: Readonly<${JSON.stringify(brand)}>;
export declare const BRAND_NAME: ${JSON.stringify(brand.name)};
export declare const BRAND_TAGLINE: ${JSON.stringify(brand.tagline)};`);

const iconSourceRoot = path.join(root, "node_modules", icons.source.package, "icons");
const iconLicenseHeader = /^<!-- @license[^>]+-->\s*/;
const normalizeSvg = (source) => source
  .replace(iconLicenseHeader, "")
  .replace(/\s+/g, " ")
  .replace(/> </g, "><")
  .trim();
const svgToNode = (source) => {
  const nodes = [];
  const childPattern = /<(path|circle|ellipse|line|polygon|polyline|rect)\s+([^>]*?)\s*\/?\s*>/g;
  for (const match of source.matchAll(childPattern)) {
    const attributes = {};
    for (const attribute of match[2].matchAll(/([\w:-]+)="([^"]*)"/g)) {
      if (attribute[1] !== "class") attributes[attribute[1]] = attribute[2];
    }
    nodes.push([match[1], attributes]);
  }
  return nodes;
};
const glyphIds = [...new Set(Object.values(icons.semantics))].sort();
const glyphSvgs = Object.fromEntries(glyphIds.map((glyphId) => {
  const sourcePath = path.join(iconSourceRoot, `${glyphId}.svg`);
  if (!fs.existsSync(sourcePath)) throw new Error(`Lucide ${icons.source.version} 缺少图形 ${glyphId}`);
  return [glyphId, normalizeSvg(fs.readFileSync(sourcePath, "utf8"))];
}));
const glyphNodes = Object.fromEntries(glyphIds.map((glyphId) => [glyphId, svgToNode(glyphSvgs[glyphId])]));
const glyphSha256 = Object.fromEntries(glyphIds.map((glyphId) => [
  glyphId,
  crypto.createHash("sha256").update(glyphSvgs[glyphId]).digest("hex"),
]));
const filledGlyphIds = [...new Set(Object.values(icons.controls.selected)
  .filter((state) => state.glyph === "filled" && state.semanticId)
  .map((state) => icons.semantics[state.semanticId]))]
  .sort();
const filledGlyphSvgs = Object.fromEntries(filledGlyphIds.map((glyphId) => [
  glyphId,
  glyphSvgs[glyphId].replace('fill="none"', 'fill="currentColor"'),
]));
const filledGlyphSha256 = Object.fromEntries(filledGlyphIds.map((glyphId) => [
  glyphId,
  crypto.createHash("sha256").update(filledGlyphSvgs[glyphId]).digest("hex"),
]));
const flutterIconDirectory = path.join(root, "packages", "flutter", "icons");
const flutterIconFiles = new Set([
  ...glyphIds.map((glyphId) => `${glyphId}.svg`),
  ...filledGlyphIds.map((glyphId) => `${glyphId}-filled.svg`),
]);
if (!checkOnly && fs.existsSync(flutterIconDirectory)) {
  for (const fileName of fs.readdirSync(flutterIconDirectory)) {
    if (fileName.endsWith(".svg") && !flutterIconFiles.has(fileName)) {
      fs.unlinkSync(path.join(flutterIconDirectory, fileName));
    }
  }
}

write("dist/icons.js", `/** 由 contracts/foundation.v1.json 与 Lucide ${icons.source.version} 生成，禁止手改。 */
export const ICON_FAMILY = ${JSON.stringify(icons.source.family)};
export const ICON_VERSION = ${JSON.stringify(icons.source.version)};
export const ICON_STYLE = Object.freeze(${js(icons.style)});
export const ICON_CONTROL_STATES = Object.freeze(${js(icons.controls)});
export const ICON_SEMANTICS = Object.freeze(${js(icons.semantics)});
export const ICON_GLYPH_NODES = Object.freeze(${js(glyphNodes)});
export const ICON_GLYPH_SVGS = Object.freeze(${js(glyphSvgs)});
export const ICON_GLYPH_SHA256 = Object.freeze(${js(glyphSha256)});
export const ICON_GLYPH_FILLED_SVGS = Object.freeze(${js(filledGlyphSvgs)});
export const ICON_GLYPH_FILLED_SHA256 = Object.freeze(${js(filledGlyphSha256)});
export const ICON_PLATFORM_EXCEPTIONS = Object.freeze(${js(icons.platformExceptions)});
export function iconGlyphId(semanticId) {
  return ICON_SEMANTICS[semanticId];
}
export function iconNode(semanticId) {
  const glyphId = iconGlyphId(semanticId);
  return glyphId ? ICON_GLYPH_NODES[glyphId] : undefined;
}
export function iconSvg(semanticId) {
  const glyphId = iconGlyphId(semanticId);
  return glyphId ? ICON_GLYPH_SVGS[glyphId] : undefined;
}
export function iconVariantSvg(semanticId, variant = "outline") {
  const glyphId = iconGlyphId(semanticId);
  if (!glyphId) return undefined;
  return variant === "filled" ? ICON_GLYPH_FILLED_SVGS[glyphId] : ICON_GLYPH_SVGS[glyphId];
}`);

const semanticUnion = Object.keys(icons.semantics).map((id) => JSON.stringify(id)).join(" | ");
const glyphUnion = glyphIds.map((id) => JSON.stringify(id)).join(" | ");
const controlToneUnion = Object.keys(icons.controls.selected).map((id) => JSON.stringify(id)).join(" | ");
write("dist/icons.d.ts", `/** 由 contracts/foundation.v1.json 与 Lucide ${icons.source.version} 生成，禁止手改。 */
export type IconSemanticId = ${semanticUnion};
export type IconGlyphId = ${glyphUnion};
export type IconControlTone = ${controlToneUnion};
export type IconVisualVariant = "outline" | "filled";
export type IconNode = readonly [elementName: "circle" | "ellipse" | "line" | "path" | "polygon" | "polyline" | "rect", attributes: Readonly<Record<string, string>>];
export declare const ICON_FAMILY: ${JSON.stringify(icons.source.family)};
export declare const ICON_VERSION: ${JSON.stringify(icons.source.version)};
export declare const ICON_STYLE: Readonly<{
  strokeWidth: number;
  lineCap: "round";
  lineJoin: "round";
  compactSize: number;
  defaultSize: number;
  navigationSize: number;
  selectedState: "semantic-color-on-transparent-container";
  decorativeSemantics: "hidden";
  interactiveLabelOwner: "control";
}>;
export declare const ICON_CONTROL_STATES: Readonly<${JSON.stringify(icons.controls)}>;
export declare const ICON_SEMANTICS: Readonly<Record<IconSemanticId, IconGlyphId>>;
export declare const ICON_GLYPH_NODES: Readonly<Record<IconGlyphId, readonly IconNode[]>>;
export declare const ICON_GLYPH_SVGS: Readonly<Record<IconGlyphId, string>>;
export declare const ICON_GLYPH_SHA256: Readonly<Record<IconGlyphId, string>>;
export declare const ICON_GLYPH_FILLED_SVGS: Readonly<Partial<Record<IconGlyphId, string>>>;
export declare const ICON_GLYPH_FILLED_SHA256: Readonly<Partial<Record<IconGlyphId, string>>>;
export declare const ICON_PLATFORM_EXCEPTIONS: readonly string[];
export declare function iconGlyphId(semanticId: IconSemanticId): IconGlyphId;
export declare function iconNode(semanticId: IconSemanticId): readonly IconNode[];
export declare function iconSvg(semanticId: IconSemanticId): string;
export declare function iconVariantSvg(semanticId: IconSemanticId, variant?: IconVisualVariant): string | undefined;`);

const iconCatalogRows = Object.entries(icons.semantics)
  .map(([semanticId, glyphId]) => `| \`${semanticId}\` | \`${glyphId}\` | \`${glyphSha256[glyphId]}\` |`)
  .join("\n");
write("docs/icons.md", `# 图标目录与治理

本目录由 \`contracts/foundation.v1.json\` 与 \`${icons.source.package}@${icons.source.version}\` 生成。产品代码使用语义 ID，不直接把 Lucide 图形名当作业务含义。

## 使用规则

- Web 与 Flutter 必须消费 Foundation 生成产物；第三方编辑器使用同源 SVG 字符串，不手写近似路径。
- 未选中图标使用低强调紫灰描边；hover 与 focus 提前切换到该动作的语义色，并在图标命中区使用 10% 同色圆形状态层，pressed 使用 15%。
- 选中态没有常驻背景。点赞、收藏与主题帖订阅保持同一 Lucide 路径，分别切换为实心鲜粉、实心金色与实心品牌深紫；计数和文字保持中性正文色。
- 通用 Toggle 若没有填充或图形变化，必须提供可见状态文字；只读指标、导航目的地和通知状态不继承互动色。
- 危险命令只使用 destructive 色对，不能借用点赞色；专色互动图标只放在审定的中性表面，有色容器改用对应 on-color 中性色。
- 有文字的控件由控件承担可访问名称，内部图标隐藏；独立图标按钮必须提供明确名称。
- 新增语义前先搜索本目录。同一图形可以承载多个经过审查的近义语义，但同一语义只能映射一个图形。
- 品牌标识、分类标记、插画和操作系统专属动作属于显式例外，不进入核心 UI 图标映射。

## 版本与视觉规格

- 图标家族：${icons.source.family}
- 固定版本：${icons.source.version}
- 画板：${icons.source.viewBox}
- 默认线宽：${icons.style.strokeWidth}
- 尺寸角色：紧凑 ${icons.style.compactSize}、默认 ${icons.style.defaultSize}、导航 ${icons.style.navigationSize}

## 互动控件状态

| 状态 | 图标 | 容器 | 辅助文字 | 图形 |
| --- | --- | --- | --- | --- |
| 未选中 | \`mutedForeground\` | 透明 | \`mutedForeground\` | 描边 |
| Hover / Focus | 当前 tone | 图标命中区 10% 同色圆形状态层 | 保持中性 | 保持当前图形 |
| Pressed | 当前 tone | 图标命中区 15% 同色圆形状态层 | 保持中性 | 保持当前图形 |
| 普通选中 | \`onAccent\` | 透明 | \`foreground\` | 保持原图形并要求可见状态文字 |
| 已点赞 | \`like\` (${contract.palette.like}) | 透明 | \`foreground\` | 实心 |
| 已收藏 | \`bookmark\` (${contract.palette.bookmark}) | 透明 | \`foreground\` | 实心 |
| 已订阅 | \`brandStrong\` (${contract.palette.brandStrong}) | 透明 | \`foreground\` | 实心 |

状态层颜色继承图标 currentColor，hover/focus 与 pressed 透明度分别为 ${icons.controls.stateLayer.hoverOpacity} 与 ${icons.controls.stateLayer.pressedOpacity}；禁用内容透明度为 ${icons.controls.disabledContentOpacity}。Pending 保持提交前 tone 并显示同色加载指示，不能回退成未选中态。

## 语义目录

| 语义 ID | SVG 图形 | SHA-256 |
| --- | --- | --- |
${iconCatalogRows}
`);
write("dist/editor.js", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const FOUNDATION_VERSION = ${JSON.stringify(contract.version)};
export const EDITOR_CAPABILITY_LABELS = Object.freeze(${js(editor.labels)});
export const EDITOR_PRIMARY_NARROW = Object.freeze(${js(editor.web.collapsedPrimary)});
export const EDITOR_PRIMARY_WIDE = Object.freeze(${js(editor.web.widePrimary)});
export const EDITOR_MORE_FALLBACK = Object.freeze(${js(editor.web.moreFallback)});
export const EDITOR_MORE_PROGRESSIVE = Object.freeze(${js(editor.web.progressiveCollapse)});
export const EDITOR_DENSITY_ORDER = Object.freeze(${js(editor.web.densityOrder)});
export const EDITOR_PRIMARY_BY_DENSITY = Object.freeze(${js(editor.web.primaryByDensity)});
export const EDITOR_MORE_BY_DENSITY = Object.freeze(${js(editor.web.moreByDensity)});
export const EDITOR_CONTEXTUAL_WEB = Object.freeze(${js(editor.web.contextual)});
export const EDITOR_CONTEXTUAL_MOBILE = Object.freeze(${js(editor.mobile.contextual)});
export const EDITOR_INVARIANTS = Object.freeze(${js(editor.invariants)});
export const EDITOR_CONTENT_POLICY = Object.freeze(${js(editor.contentPolicy)});
export const EDITOR_WEB_LAYOUT = Object.freeze(${js(editor.web.layout)});
export const EDITOR_MOBILE_LAYOUT = Object.freeze(${js(editor.mobile.layout)});
export const EDITOR_MOBILE_SURFACES = Object.freeze(${js(editor.mobile.surfaces)});
export const EDITOR_MOBILE_RENDERING_EXCEPTIONS = Object.freeze(${js(editor.mobile.renderingExceptions)});
export const EDITOR_MOBILE_TOOLBAR = Object.freeze(${js(editor.mobile.toolbar)});
export const EDITOR_MOBILE_MORE_INLINE = Object.freeze(${js(editor.mobile.moreInline)});
export const EDITOR_WEB_CAPABILITIES = Object.freeze(${js(editor.capabilities.web)});
export const EDITOR_MOBILE_CAPABILITIES = Object.freeze(${js(editor.capabilities.mobile)});
export const EDITOR_CREATABLE_HEADING_LEVELS = Object.freeze(${js(editor.creatableHeadingLevels)});
export function editorCapabilityLabels(ids) {
  return ids.map((id) => EDITOR_CAPABILITY_LABELS[id]);
}`);

const capabilityUnion = Object.keys(editor.labels)
  .map((id) => JSON.stringify(id))
  .join(" | ");
write("dist/editor.d.ts", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type EditorCapabilityId = ${capabilityUnion};
export declare const FOUNDATION_VERSION: ${JSON.stringify(contract.version)};
export declare const EDITOR_CAPABILITY_LABELS: Readonly<Record<EditorCapabilityId, string>>;
export declare const EDITOR_PRIMARY_NARROW: readonly EditorCapabilityId[];
export declare const EDITOR_PRIMARY_WIDE: readonly EditorCapabilityId[];
export declare const EDITOR_MORE_FALLBACK: readonly EditorCapabilityId[];
export declare const EDITOR_MORE_PROGRESSIVE: readonly EditorCapabilityId[];
export type EditorToolbarDensity = ${editor.web.densityOrder.map((density) => JSON.stringify(density)).join(" | ")};
export type EditorCreationMode = "primary" | "secondary" | "contextual";
export type EditorEditingMode = "structured" | "atomic" | "ui-only";
export type EditorRenderingMode = "native" | "not-applicable";
export type EditorRoundTripMode = "structured" | "identity-preserving" | "not-applicable";
export interface EditorCapabilityContract {
  readonly creation: EditorCreationMode;
  readonly editing: EditorEditingMode;
  readonly rendering: EditorRenderingMode;
  readonly roundTrip: EditorRoundTripMode;
}
export declare const EDITOR_DENSITY_ORDER: readonly EditorToolbarDensity[];
export declare const EDITOR_PRIMARY_BY_DENSITY: Readonly<Record<EditorToolbarDensity, readonly EditorCapabilityId[]>>;
export declare const EDITOR_MORE_BY_DENSITY: Readonly<Record<EditorToolbarDensity, readonly EditorCapabilityId[]>>;
export declare const EDITOR_CONTEXTUAL_WEB: readonly EditorCapabilityId[];
export declare const EDITOR_CONTEXTUAL_MOBILE: readonly EditorCapabilityId[];
export declare const EDITOR_INVARIANTS: Readonly<Record<string, string>>;
export declare const EDITOR_CONTENT_POLICY: Readonly<{
  markdownContractVersion: 3;
  structuredCapabilitySource: "toolbar";
  unsupportedClientBehavior: "literal-text-silent";
  unsupportedApiBehavior: "reject";
  maximumListDepth: 3;
}>;
export declare const EDITOR_WEB_LAYOUT: Readonly<{
  frameMaxRem: number;
  textMeasurePx: number;
  contentInlinePaddingPx: number;
  toolbarInlinePaddingPx: number;
  firstControlInternalInsetPx: number;
  bodyPx: number;
  lineHeight: number;
}>;
export declare const EDITOR_MOBILE_LAYOUT: Readonly<{
  compactContentInlinePaddingDp: number;
  regularContentInlinePaddingDp: number;
  toolbarHorizontalPaddingDp: number;
  bodySp: number;
  lineHeight: number;
  respectsSystemTextScale: boolean;
}>;
export type EditorMobileSurface = ${editor.mobile.surfaces.map((surface) => JSON.stringify(surface)).join(" | ")};
export declare const EDITOR_MOBILE_SURFACES: readonly EditorMobileSurface[];
export type EditorMobileRenderingException = ${editor.mobile.renderingExceptions.map((exception) => JSON.stringify(exception)).join(" | ")};
export declare const EDITOR_MOBILE_RENDERING_EXCEPTIONS: readonly EditorMobileRenderingException[];
export declare const EDITOR_MOBILE_TOOLBAR: Readonly<{
  placementWhenKeyboardVisible: "above-keyboard-dock";
  primaryLayout: "responsive-single-row";
  horizontalOverflow: "forbidden";
  morePresentation: "inline";
}>;
export declare const EDITOR_MOBILE_MORE_INLINE: readonly EditorCapabilityId[];
export declare const EDITOR_WEB_CAPABILITIES: Readonly<Record<EditorCapabilityId, EditorCapabilityContract>>;
export declare const EDITOR_MOBILE_CAPABILITIES: Readonly<Record<EditorCapabilityId, EditorCapabilityContract>>;
export declare const EDITOR_CREATABLE_HEADING_LEVELS: readonly (2 | 3)[];
export declare function editorCapabilityLabels(ids: readonly EditorCapabilityId[]): string[];`);

write("dist/images.js", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const IMAGE_ROLES = Object.freeze(${js(images.roles)});
export const IMAGE_INVARIANTS = Object.freeze(${js(images.invariants)});
export const IMAGE_STATES = Object.freeze(${js(images.states)});
export const IMAGE_WEB_PROFILE = Object.freeze(${js(images.web)});
export const IMAGE_MOBILE_PROFILE = Object.freeze(${js(images.mobile)});`);

const imageRoleUnion = Object.keys(images.roles)
  .map((id) => JSON.stringify(id))
  .join(" | ");
write("dist/images.d.ts", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type ImageRoleId = ${imageRoleUnion};
export interface ImageRoleContract {
  readonly fit: "cover" | "contain";
  readonly crop: "allowed" | "forbidden";
  readonly shape: "circle" | "rounded" | "content";
  readonly viewer: "none" | "full-source" | "optional";
}
export declare const IMAGE_ROLES: Readonly<Record<ImageRoleId, ImageRoleContract>>;
export declare const IMAGE_INVARIANTS: Readonly<Record<string, string | boolean>>;
export declare const IMAGE_STATES: readonly string[];
export declare const IMAGE_WEB_PROFILE: Readonly<Record<string, string | number | readonly string[]>>;
export declare const IMAGE_MOBILE_PROFILE: Readonly<Record<string, string | number | readonly string[]>>;`);

write("dist/collections.js", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const COLLECTION_INVARIANTS = Object.freeze(${js(collections.invariants)});
export const CONTENT_PRESENTATION = Object.freeze(${js(collections.content)});
export const COLLECTION_WEB_PROFILE = Object.freeze(${js(collections.web)});
export const COLLECTION_MOBILE_PROFILE = Object.freeze(${js(collections.mobile)});`);

write("dist/collections.d.ts", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export declare const COLLECTION_INVARIANTS: Readonly<{
  containerWidth: "available";
  itemWidth: "available";
  narrowContentDoesNotChangeItemWidth: true;
  horizontalOverflow: "explicit-only";
  contentSizedExceptions: readonly ("message-bubble" | "chip" | "badge" | "compact-action")[];
}>;
export declare const CONTENT_PRESENTATION: Readonly<${JSON.stringify(collections.content)}>;
export declare const COLLECTION_WEB_PROFILE: Readonly<{
  tabPanelWidth: "available";
  multiColumn: "explicit-grid-only";
}>;
export declare const COLLECTION_MOBILE_PROFILE: Readonly<{
  layout: "single-column";
  itemWidth: "available";
  domainLayoutExceptions: Readonly<{
    "moments-feed": "two-column-waterfall";
  }>;
}>;`);

write("dist/controls.js", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const ACTION_CONTROL_CONTRACT = Object.freeze(${js(controls.actions)});
export const FIELD_CONTROL_CONTRACT = Object.freeze(${js(controls.fields)});
export const SELECTION_CONTROL_CONTRACT = Object.freeze(${js(controls.selection)});
export const PROGRESS_CONTROL_CONTRACT = Object.freeze(${js(controls.progress)});
export const CONTROL_WEB_PROFILE = Object.freeze(${js(controls.web)});
export const CONTROL_MOBILE_PROFILE = Object.freeze(${js(controls.mobile)});`);

write("dist/controls.d.ts", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type ActionControlRole = ${controls.actions.roles.map((id) => JSON.stringify(id)).join(" | ")};
export type FieldControlState = ${controls.fields.states.map((id) => JSON.stringify(id)).join(" | ")};
export type SelectionControlPattern = ${controls.selection.patterns.map((id) => JSON.stringify(id)).join(" | ")};
export type ProgressControlRole = ${controls.progress.roles.map((id) => JSON.stringify(id)).join(" | ")};
export declare const ACTION_CONTROL_CONTRACT: Readonly<${JSON.stringify(controls.actions)}>;
export declare const FIELD_CONTROL_CONTRACT: Readonly<${JSON.stringify(controls.fields)}>;
export declare const SELECTION_CONTROL_CONTRACT: Readonly<${JSON.stringify(controls.selection)}>;
export declare const PROGRESS_CONTROL_CONTRACT: Readonly<${JSON.stringify(controls.progress)}>;
export declare const CONTROL_WEB_PROFILE: Readonly<${JSON.stringify(controls.web)}>;
export declare const CONTROL_MOBILE_PROFILE: Readonly<${JSON.stringify(controls.mobile)}>;`);

write("dist/notifications.js", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const NOTIFICATION_ALL_LABEL = ${JSON.stringify(notifications.allLabel)};
export const NOTIFICATION_GROUPS = Object.freeze(${js(notifications.groups)});
export const NOTIFICATION_INVARIANTS = Object.freeze(${js({
  eventTypeOwner: notifications.eventTypeOwner,
  unknownTypeVisibility: notifications.unknownTypeVisibility,
})});`);

const notificationGroupIdUnion = notifications.groups
  .map(({ id }) => JSON.stringify(id))
  .join(" | ");
const notificationTypeUnion = [...new Set(notifications.groups.flatMap(({ types }) => types))]
  .map((type) => JSON.stringify(type))
  .join(" | ");
write("dist/notifications.d.ts", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type NotificationGroupId = ${notificationGroupIdUnion};
export type NotificationEventType = ${notificationTypeUnion};
export interface NotificationGroupContract {
  readonly id: NotificationGroupId;
  readonly label: string;
  readonly types: readonly NotificationEventType[];
}
export declare const NOTIFICATION_ALL_LABEL: ${JSON.stringify(notifications.allLabel)};
export declare const NOTIFICATION_GROUPS: readonly NotificationGroupContract[];
export declare const NOTIFICATION_INVARIANTS: Readonly<{
  eventTypeOwner: "backend-notification-contract";
  unknownTypeVisibility: "all";
}>;`);

write("dist/typography.js", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const TYPOGRAPHY_FAMILIES = Object.freeze(${js({
  body: contract.typography.body,
  display: contract.typography.display,
  utility: contract.typography.utility,
})});
export const TYPOGRAPHY_USAGE = Object.freeze(${js(contract.typography.usage)});
export const WEB_TYPE_SCALE = Object.freeze(${js(contract.profiles.web.typeScale)});
export const MOBILE_TYPE_SCALE = Object.freeze(${js(contract.profiles.mobile.typeScale)});`);

const typeRoleUnion = typeRoleIds.map((id) => JSON.stringify(id)).join(" | ");
write("dist/typography.d.ts", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type TypographyRoleId = ${typeRoleUnion};
export type TypographyFamilyRole = "body" | "display" | "utility";
export interface TypographyStyleContract {
  readonly family: TypographyFamilyRole;
  readonly size: number;
  readonly lineHeight: number;
  readonly weight: number;
}
export declare const TYPOGRAPHY_FAMILIES: Readonly<Record<TypographyFamilyRole, Readonly<{
  family: string;
  weights: readonly number[];
  fallback: readonly string[];
}>>>;
export declare const TYPOGRAPHY_USAGE: Readonly<${JSON.stringify(contract.typography.usage)}>;
export declare const WEB_TYPE_SCALE: Readonly<Record<TypographyRoleId, TypographyStyleContract>>;
export declare const MOBILE_TYPE_SCALE: Readonly<Record<TypographyRoleId, TypographyStyleContract>>;`);

write("dist/interaction.js", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const ACCESSIBILITY_CONTRACT = Object.freeze(${js(accessibility)});
export const FEEDBACK_RESOURCE_STATES = Object.freeze(${js(feedback.resourceStates)});
export const FEEDBACK_MUTATION_STATES = Object.freeze(${js(feedback.mutationStates)});
export const FEEDBACK_INVARIANTS = Object.freeze(${js(feedback.invariants)});
export const FEEDBACK_PRESENTATION = Object.freeze(${js(feedback.presentation)});
export const FEEDBACK_WEB_PROFILE = Object.freeze(${js(feedback.web)});
export const FEEDBACK_MOBILE_PROFILE = Object.freeze(${js(feedback.mobile)});
export const OVERLAY_INVARIANTS = Object.freeze(${js(overlays.invariants)});
export const OVERLAY_TASKS = Object.freeze(${js(overlays.tasks)});
export const DESTRUCTIVE_ACTION_POLICY = Object.freeze(${js(overlays.destructiveActions)});
export const OVERLAY_WEB_PROFILE = Object.freeze(${js(overlays.web)});
export const OVERLAY_MOBILE_PROFILE = Object.freeze(${js(overlays.mobile)});
export const MOTION_USAGE = Object.freeze(${js(contract.motion.usage)});`);

write("dist/interaction.d.ts", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type FeedbackResourceState = ${feedback.resourceStates.map((id) => JSON.stringify(id)).join(" | ")};
export type FeedbackMutationState = ${feedback.mutationStates.map((id) => JSON.stringify(id)).join(" | ")};
export type OverlayLayerId = ${Object.keys(overlays.web.layers).map((id) => JSON.stringify(id)).join(" | ")};
export declare const ACCESSIBILITY_CONTRACT: Readonly<${JSON.stringify(accessibility)}>;
export declare const FEEDBACK_RESOURCE_STATES: readonly FeedbackResourceState[];
export declare const FEEDBACK_MUTATION_STATES: readonly FeedbackMutationState[];
export declare const FEEDBACK_INVARIANTS: Readonly<Record<string, boolean>>;
export declare const FEEDBACK_PRESENTATION: Readonly<${JSON.stringify(feedback.presentation)}>;
export declare const FEEDBACK_WEB_PROFILE: Readonly<{ transientChannel: "toast"; asyncLiveRegion: "polite" }>;
export declare const FEEDBACK_MOBILE_PROFILE: Readonly<{ transientChannel: "snackbar"; asyncLiveRegion: "polite" }>;
export declare const OVERLAY_INVARIANTS: Readonly<Record<string, boolean>>;
export declare const OVERLAY_TASKS: Readonly<${JSON.stringify(overlays.tasks)}>;
export declare const DESTRUCTIVE_ACTION_POLICY: Readonly<${JSON.stringify(overlays.destructiveActions)}>;
export declare const OVERLAY_WEB_PROFILE: Readonly<{
  layers: Readonly<Record<OverlayLayerId, number>>;
  shadows: Readonly<Record<"popover" | "dialog" | "floating", string>>;
  scrim: Readonly<{ color: string; blurPx: number }>;
  dismiss: readonly ("explicit-control" | "escape")[];
}>;
export declare const OVERLAY_MOBILE_PROFILE: Readonly<{
  elevation: Readonly<Record<"flat" | "floating" | "popup", number>>;
  dismiss: readonly ("explicit-control" | "system-back")[];
  safeArea: true;
}>;
export declare const MOTION_USAGE: Readonly<${JSON.stringify(contract.motion.usage)}>;`);

write("dist/formatting.js", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const FORMATTING_CONTRACT = Object.freeze(${js(formatting)});

const pad2 = (value) => String(value).padStart(2, "0");
const validDate = (value) => {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export function formatWenyouExactTime(value) {
  const date = validDate(value);
  if (!date) return "—";
  return [date.getFullYear(), pad2(date.getMonth() + 1), pad2(date.getDate())].join("-")
    + " " + [pad2(date.getHours()), pad2(date.getMinutes())].join(":");
}

export function formatWenyouTime(value, reference = new Date()) {
  const date = validDate(value);
  const now = validDate(reference);
  if (!date || !now) return "—";
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const policy = FORMATTING_CONTRACT.relativeTime;
  if (seconds >= 0 && seconds < policy.justNowSeconds) return "刚刚";
  if (seconds >= policy.justNowSeconds && seconds < policy.minutesUntilSeconds) return \`\${Math.floor(seconds / 60)} 分钟前\`;
  if (seconds >= policy.minutesUntilSeconds && seconds < policy.hoursUntilSeconds) return \`\${Math.floor(seconds / 3600)} 小时前\`;
  if (seconds >= policy.hoursUntilSeconds && seconds < policy.relativeWindowSeconds) return \`\${Math.floor(seconds / 86400)} 天前\`;
  const datePart = date.getFullYear() === now.getFullYear()
    ? [pad2(date.getMonth() + 1), pad2(date.getDate())].join("-")
    : [date.getFullYear(), pad2(date.getMonth() + 1), pad2(date.getDate())].join("-");
  return datePart + " " + [pad2(date.getHours()), pad2(date.getMinutes())].join(":");
}

const compact = (value, divisor, suffix) => {
  const scaled = Math.round((value / divisor) * 10) / 10;
  return \`\${Number.isInteger(scaled) ? scaled.toFixed(0) : scaled.toFixed(1)}\${suffix}\`;
};

export function formatWenyouCompactCount(value) {
  if (!Number.isFinite(value) || value < 0) return "—";
  const count = Math.trunc(value);
  if (count >= FORMATTING_CONTRACT.counts.yiFrom) return compact(count, FORMATTING_CONTRACT.counts.yiFrom, "亿");
  if (count >= FORMATTING_CONTRACT.counts.wanFrom) return compact(count, FORMATTING_CONTRACT.counts.wanFrom, "万");
  return String(count);
}`);

write("dist/formatting.d.ts", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export declare const FORMATTING_CONTRACT: Readonly<${JSON.stringify(formatting)}>;
export type WenyouDateInput = Date | string | number;
export declare function formatWenyouExactTime(value: WenyouDateInput): string;
export declare function formatWenyouTime(value: WenyouDateInput, reference?: WenyouDateInput): string;
export declare function formatWenyouCompactCount(value: number): string;`);

write("dist/navigation.js", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const NAVIGATION_LABELS = Object.freeze(${js(navigation.labels)});
export const NAVIGATION_ICONS = Object.freeze(${js(navigation.icons)});
export const NAVIGATION_INVARIANTS = Object.freeze(${js(navigation.invariants)});
export const NAVIGATION_WEB_PROFILE = Object.freeze(${js(navigation.web)});
export const NAVIGATION_MOBILE_PROFILE = Object.freeze(${js(navigation.mobile)});`);

const navigationIdUnion = Object.keys(navigation.labels).map((id) => JSON.stringify(id)).join(" | ");
write("dist/navigation.d.ts", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
import type { IconSemanticId } from "./icons.js";
export type NavigationDestinationId = ${navigationIdUnion};
export declare const NAVIGATION_LABELS: Readonly<Record<NavigationDestinationId, string>>;
export declare const NAVIGATION_ICONS: Readonly<Record<NavigationDestinationId, IconSemanticId>>;
export declare const NAVIGATION_INVARIANTS: Readonly<Record<string, string>>;
export declare const NAVIGATION_WEB_PROFILE: Readonly<{
  primary: readonly NavigationDestinationId[];
  accountShortcuts: readonly NavigationDestinationId[];
  publishPresentation: "separate-action";
  profilePresentation: "account-entry";
}>;
export declare const NAVIGATION_MOBILE_PROFILE: Readonly<{
  primary: readonly NavigationDestinationId[];
  messageSections: readonly NavigationDestinationId[];
}>;`);

write("dist/language.js", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const LANGUAGE_NOUNS = Object.freeze(${js(language.nouns)});
export const LANGUAGE_ACTIONS = Object.freeze(${js(language.actions)});
export const LANGUAGE_INVARIANTS = Object.freeze(${js(language.invariants)});`);

write("dist/language.d.ts", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type LanguageNounId = ${Object.keys(language.nouns).map((id) => JSON.stringify(id)).join(" | ")};
export type LanguageActionId = ${Object.keys(language.actions).map((id) => JSON.stringify(id)).join(" | ")};
export declare const LANGUAGE_NOUNS: Readonly<Record<LanguageNounId, string>>;
export declare const LANGUAGE_ACTIONS: Readonly<Record<LanguageActionId, string>>;
export declare const LANGUAGE_INVARIANTS: Readonly<Record<string, boolean>>;`);

write("dist/elements.js", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const ELEMENT_INVARIANTS = Object.freeze(${js(elements.invariants)});
export const INLINE_ELEMENT_STYLES = Object.freeze(${js(elements.inline)});
export const BLOCK_ELEMENT_STYLES = Object.freeze(${js(elements.block)});
export const METADATA_ELEMENT_STYLES = Object.freeze(${js(elements.metadata)});
export const IDENTITY_PRESENTATION = Object.freeze(${js(elements.identity)});
export const CONTENT_STATUS_TONES = Object.freeze(${js(elements.statusTones)});
export const ECONOMY_TONES = Object.freeze(${js(elements.economyTones)});
export const ELEMENT_WEB_PROFILE = Object.freeze(${js(elements.web)});
export const ELEMENT_MOBILE_PROFILE = Object.freeze(${js(elements.mobile)});
export function levelTier(level) {
  if (!Number.isInteger(level) || level < 1) return undefined;
  return METADATA_ELEMENT_STYLES.level.tiers.find((tier) => level <= tier.maximum)
    ?? METADATA_ELEMENT_STYLES.level.tiers.at(-1);
}`);

const elementToneUnion = Object.keys(elements.metadata.badge.tones)
  .map((tone) => JSON.stringify(tone))
  .join(" | ");
const badgeSizeUnion = elements.metadata.badge.sizes
  .map((size) => JSON.stringify(size))
  .join(" | ");
const levelTierUnion = elements.metadata.level.tiers
  .map(({ id }) => JSON.stringify(id))
  .join(" | ");
write("dist/elements.d.ts", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type ElementTone = ${elementToneUnion};
export type BadgeSize = ${badgeSizeUnion};
export type LevelTierId = ${levelTierUnion};
export declare const ELEMENT_INVARIANTS: Readonly<${JSON.stringify(elements.invariants)}>;
export declare const INLINE_ELEMENT_STYLES: Readonly<${JSON.stringify(elements.inline)}>;
export declare const BLOCK_ELEMENT_STYLES: Readonly<${JSON.stringify(elements.block)}>;
export declare const METADATA_ELEMENT_STYLES: Readonly<${JSON.stringify(elements.metadata)}>;
export declare const IDENTITY_PRESENTATION: Readonly<${JSON.stringify(elements.identity)}>;
export declare const CONTENT_STATUS_TONES: Readonly<${JSON.stringify(elements.statusTones)}>;
export declare const ECONOMY_TONES: Readonly<${JSON.stringify(elements.economyTones)}>;
export declare const ELEMENT_WEB_PROFILE: Readonly<${JSON.stringify(elements.web)}>;
export declare const ELEMENT_MOBILE_PROFILE: Readonly<${JSON.stringify(elements.mobile)}>;
export declare function levelTier(level: number): Readonly<(typeof METADATA_ELEMENT_STYLES)["level"]["tiers"][number]> | undefined;`);

const p = contract.palette;
const web = contract.profiles.web;
const motion = contract.motion;
write("web/tokens.css", `/* 由 contracts/foundation.v1.json 生成，禁止手改。 */
:root {
  --background: ${cssHex(p.background)};
  --foreground: ${cssHex(p.foreground)};
  --card: ${cssHex(p.surface)};
  --card-foreground: ${cssHex(p.foreground)};
  --popover: ${cssHex(p.surface)};
  --popover-foreground: ${cssHex(p.foreground)};
  --primary: ${cssHex(p.primary)};
  --primary-foreground: ${cssHex(p.onPrimary)};
  --brand-strong: ${cssHex(p.brandStrong)};
  --secondary: ${cssHex(p.secondary)};
  --secondary-foreground: ${cssHex(p.onSecondary)};
  --muted: ${cssHex(p.muted)};
  --muted-foreground: ${cssHex(p.mutedForeground)};
  --accent: ${cssHex(p.accent)};
  --accent-foreground: ${cssHex(p.onAccent)};
  --like: ${cssHex(p.like)};
  --bookmark: ${cssHex(p.bookmark)};
  --destructive: ${cssHex(p.destructive)};
  --destructive-foreground: ${cssHex(p.onDestructive)};
  --destructive-soft: ${cssHex(p.destructiveSoft)};
  --success: ${cssHex(p.success)};
  --success-soft: ${cssHex(p.successSoft)};
  --warning: ${cssHex(p.warning)};
  --warning-soft: ${cssHex(p.warningSoft)};
  --info: ${cssHex(p.info)};
  --info-soft: ${cssHex(p.infoSoft)};
  --category-deduction: ${cssHex(p.categoryDeduction)};
  --category-deduction-soft: ${cssHex(p.categoryDeductionSoft)};
  --category-nation: ${cssHex(p.categoryNation)};
  --category-nation-soft: ${cssHex(p.categoryNationSoft)};
  --category-rpg: ${cssHex(p.categoryRpg)};
  --category-rpg-soft: ${cssHex(p.categoryRpgSoft)};
  --border: ${cssHex(p.border)};
  --input: ${cssHex(p.input)};
  --ring: ${cssHex(p.brandStrong)};
  --radius-compact: ${web.radii.compact / 16}rem;
  --radius-control: ${web.radii.control / 16}rem;
  --radius-panel: ${web.radii.panel / 16}rem;
  --radius: var(--radius-control);
  --layout-narrow: ${web.layoutRem.narrow}rem;
  --layout-moment: ${web.layoutRem.moment}rem;
  --layout-feed: ${web.layoutRem.feed}rem;
  --layout-content: ${web.layoutRem.content}rem;
  --layout-workspace: ${web.layoutRem.workspace}rem;
  --layout-chrome-workspace: ${web.layoutRem.chromeWorkspace}rem;
  --layout-wide: ${web.layoutRem.wide}rem;
  --breakpoint-chrome-expanded: ${web.expandedChromeFrom / 16}rem;
${typeRoleIds.flatMap((role) => {
  const style = web.typeScale[role];
  const prefix = `  --type-${kebab(role)}`;
  return [
    `${prefix}-size: ${style.size}px;`,
    `${prefix}-line-height: ${style.lineHeight >= 4 ? `${style.lineHeight}px` : style.lineHeight};`,
    `${prefix}-weight: ${style.weight};`,
  ];
}).join("\n")}
  --editor-frame-max: ${editor.web.layout.frameMaxRem}rem;
  --editor-text-measure: ${editor.web.layout.textMeasurePx}px;
  --editor-content-inline-padding: ${editor.web.layout.contentInlinePaddingPx}px;
  --editor-toolbar-inline-padding: ${editor.web.layout.toolbarInlinePaddingPx}px;
  --editor-body-size: ${editor.web.layout.bodyPx}px;
  --editor-body-line-height: ${editor.web.layout.lineHeight};
  --sticker-display-max: ${images.web.stickerDisplayMaxRem}rem;
  --wenyou-shadow-popover: ${overlays.web.shadows.popover};
  --wenyou-shadow-dialog: ${overlays.web.shadows.dialog};
  --wenyou-shadow-floating: ${overlays.web.shadows.floating};
  --overlay-scrim: ${overlays.web.scrim.color};
  --overlay-scrim-blur: ${overlays.web.scrim.blurPx}px;
${Object.entries(overlays.web.layers).map(([id, value]) => `  --layer-${kebab(id)}: ${value};`).join("\n")}
  --motion-fast: ${motion.fastMs}ms;
  --motion-standard: ${motion.standardMs}ms;
  --motion-slow: ${motion.slowMs}ms;
  --ease-standard: ${motion.standardEase};
  --ease-exit: ${motion.exitEase};
  --icon-control-state-layer-color: currentColor;
  --icon-control-state-layer-radius: 999px;
  --icon-control-hover-state-opacity: ${icons.controls.stateLayer.hoverOpacity};
  --icon-control-focus-state-opacity: ${icons.controls.stateLayer.focusOpacity};
  --icon-control-pressed-state-opacity: ${icons.controls.stateLayer.pressedOpacity};
  --icon-control-disabled-content-opacity: ${icons.controls.disabledContentOpacity};
  --element-internal-reference-foreground: ${cssPaletteValue(elements.inline.internalReference.foreground)};
  --element-internal-reference-surface: ${cssPaletteValue(elements.inline.internalReference.surface)};
  --element-internal-reference-line-height: ${elements.web.internalReference.lineHeight};
  --element-internal-reference-padding-block: ${elements.web.internalReference.paddingBlockEm}em;
  --element-internal-reference-padding-inline: ${elements.web.internalReference.paddingInlineEm}em;
  --element-internal-reference-gap: ${elements.web.internalReference.gapEm}em;
  --element-internal-reference-radius: ${elements.web.internalReference.radiusEm}em;
  --element-internal-reference-icon-size: ${elements.web.internalReference.iconSizeEm}em;
  --element-internal-reference-hover-state-opacity: ${elements.web.internalReference.hoverStateOpacity};
  --element-internal-reference-pressed-state-opacity: ${elements.web.internalReference.pressedStateOpacity};
  --element-link-foreground: ${cssPaletteValue(elements.inline.link.foreground)};
  --element-link-underline-width: ${elements.inline.link.underlineWidthPx}px;
  --element-link-underline-offset: ${elements.inline.link.underlineOffsetEm}em;
  --element-code-foreground: ${cssPaletteValue(elements.inline.code.foreground)};
  --element-code-surface: ${cssPaletteValue(elements.inline.code.surface)};
  --element-code-size: ${elements.inline.code.sizeEm}em;
  --element-code-radius: ${elements.inline.code.radiusEm}em;
  --element-code-padding-block: ${elements.inline.code.paddingBlockEm}em;
  --element-code-padding-inline: ${elements.inline.code.paddingInlineEm}em;
  --element-dice-radius: ${elements.inline.dice.radiusEm}em;
  --element-dice-line-height: ${elements.inline.dice.lineHeight};
  --element-dice-padding-block: ${elements.inline.dice.paddingBlockEm}em;
  --element-dice-padding-inline: ${elements.inline.dice.paddingInlineEm}em;
  --element-dice-settled-foreground: ${cssPaletteValue(elements.inline.dice.settled.foreground)};
  --element-dice-settled-surface: ${cssPaletteValue(elements.inline.dice.settled.surface)};
  --element-dice-pending-foreground: ${cssPaletteValue(elements.inline.dice.pending.foreground)};
  --element-dice-pending-surface: ${cssPaletteValue(elements.inline.dice.pending.surface)};
  --element-dice-hover-state-opacity: ${elements.web.dice.hoverStateOpacity};
  --element-dice-pressed-state-opacity: ${elements.web.dice.pressedStateOpacity};
  --element-dice-detail-width: ${elements.web.dice.detailWidthRem}rem;
  --element-dice-detail-max-height: ${elements.web.dice.detailMaxHeightRem}rem;
  --element-dice-detail-cell-foreground: ${cssPaletteValue(elements.inline.dice.detail.resultCell.foreground)};
  --element-dice-detail-cell-surface: ${cssPaletteValue(elements.inline.dice.detail.resultCell.surface)};
  --element-dice-detail-cell-min-width: ${elements.inline.dice.detail.resultCell.minimumWidthEm}em;
  --element-dice-detail-cell-padding-block: ${elements.inline.dice.detail.resultCell.paddingBlockEm}em;
  --element-dice-detail-cell-padding-inline: ${elements.inline.dice.detail.resultCell.paddingInlineEm}em;
  --element-dice-detail-cell-radius: ${elements.inline.dice.detail.resultCell.radiusEm}em;
  --element-quote-foreground: ${cssPaletteValue(elements.block.quote.foreground)};
  --element-quote-surface: ${cssPaletteValue(elements.block.quote.surface)};
  --element-quote-marker: ${cssPaletteValue(elements.block.quote.marker)};
  --element-quote-marker-width: ${elements.block.quote.markerWidthPx}px;
  --element-quote-radius: var(--radius-${elements.block.quote.radius});
  --element-quote-font-weight: ${elements.block.quote.fontWeight};
  --element-quote-padding-block: ${elements.block.quote.paddingBlockEm}em;
  --element-quote-padding-inline: ${elements.block.quote.paddingInlineEm}em;
  --element-divider-width: ${elements.block.divider.widthPx}px;
  --element-badge-default-height: ${elements.metadata.badge.default.heightPx}px;
  --element-badge-default-font-size: ${elements.metadata.badge.default.fontSizePx}px;
  --element-badge-default-icon-size: ${elements.metadata.badge.default.iconSizePx}px;
  --element-badge-compact-height: ${elements.metadata.badge.compact.heightPx}px;
  --element-badge-compact-font-size: ${elements.metadata.badge.compact.fontSizePx}px;
  --element-badge-compact-icon-size: ${elements.metadata.badge.compact.iconSizePx}px;
  --element-topic-tag-min-height: ${elements.web.interactiveMinimumPx}px;
  --element-level-height: ${elements.metadata.level.heightPx}px;
  --element-level-font-size: ${elements.metadata.level.fontSizePx}px;
${elements.metadata.level.tiers.flatMap((tier) => [
  `  --element-level-${tier.id}-foreground: ${cssHex(tier.foreground)};`,
  `  --element-level-${tier.id}-surface: ${cssHex(tier.surface)};`,
  `  --element-level-${tier.id}-border: ${cssHex(tier.border)};`,
]).join("\n")}
  --element-unread-count-height: ${elements.metadata.unreadCount.heightPx}px;
  --element-unread-count-font-size: ${elements.metadata.unreadCount.fontSizePx}px;
  --element-category-marker-width: ${elements.web.categoryMarkerWidthPx}px;
  --element-category-marker-foreground: ${cssPaletteValue(elements.metadata.categoryMarker.foreground)};
}`);

write("web/fonts.css", `/* 字体版本与校验和以 contracts/foundation.v1.json 为准。 */
@import "@fontsource-variable/noto-sans-sc/wght.css";
@import "@fontsource-variable/nunito/wght.css";

@font-face {
  font-family: "LXGW WenKai";
  src: url("./fonts/LXGWWenKaiLite-Medium.woff2") format("woff2");
  font-display: swap;
  font-style: normal;
  font-weight: 500;
}`);

const mobile = contract.profiles.mobile;
const paletteLines = Object.entries(p)
  .map(([name, value]) => `  static const Color ${name} = ${dartColor(value)};`)
  .join("\n");
const labelEntries = Object.entries(editor.labels)
  .map(([id, label]) => `    ${dartString(id)}: ${dartString(label)},`)
  .join("\n");
const mobileCapabilityEntries = Object.entries(editor.capabilities.mobile)
  .map(([id, capability]) => `    ${dartString(id)}: <String, String>{${Object.entries(capability).map(([key, value]) => `${dartString(key)}: ${dartString(value)}`).join(", ")}},`)
  .join("\n");
const notificationLabelEntries = notifications.groups
  .map(({ id, label }) => `    ${dartString(id)}: ${dartString(label)},`)
  .join("\n");
const notificationTypeEntries = notifications.groups
  .map(({ id, types }) => `    ${dartString(id)}: <String>${dartList(types)},`)
  .join("\n");
const dartStringMapEntries = (record) => Object.entries(record)
  .map(([id, value]) => `    ${dartString(id)}: ${dartString(value)},`)
  .join("\n");
const mobileTypeFamilyEntries = Object.entries(mobile.typeScale)
  .map(([id, style]) => `    ${dartString(id)}: ${dartString(style.family)},`)
  .join("\n");
const mobileTypeNumberEntries = (property, suffix = "") => Object.entries(mobile.typeScale)
  .map(([id, style]) => `    ${dartString(id)}: ${style[property]}${suffix},`)
  .join("\n");
const levelTierEntries = elements.metadata.level.tiers
  .map((tier) => `    WenyouLevelTier(id: ${dartString(tier.id)}, minimum: ${tier.minimum}, maximum: ${tier.maximum}, foreground: ${dartColor(tier.foreground)}, surface: ${dartColor(tier.surface)}, border: ${dartColor(tier.border)}),`)
  .join("\n");
write("packages/flutter/lib/src/foundation_tokens.dart", `// 由 contracts/foundation.v1.json 生成，禁止手改。
import 'package:flutter/material.dart';

abstract final class WenyouFoundationVersion {
  static const String value = ${dartString(contract.version)};
  static const int schema = ${contract.schemaVersion};
}

abstract final class WenyouFoundationPalette {
${paletteLines}
}

abstract final class WenyouIconControlContract {
  static const Color inactiveForeground = WenyouFoundationPalette.mutedForeground;
  static const Color genericSelectedForeground = WenyouFoundationPalette.onAccent;
  static const Color genericSelectedSurface = Colors.transparent;
  static const Color likeSelectedForeground = WenyouFoundationPalette.like;
  static const Color likeSelectedSurface = Colors.transparent;
  static const Color bookmarkSelectedForeground = WenyouFoundationPalette.bookmark;
  static const Color bookmarkSelectedSurface = Colors.transparent;
  static const Color subscriptionSelectedForeground = WenyouFoundationPalette.brandStrong;
  static const Color subscriptionSelectedSurface = Colors.transparent;
  static const Color supportingInactive = WenyouFoundationPalette.mutedForeground;
  static const Color supportingSelected = WenyouFoundationPalette.foreground;
  static const Color focusRing = WenyouFoundationPalette.brandStrong;
  static const String stateLayerColor = ${dartString(icons.controls.stateLayer.color)};
  static const String stateLayerShape = ${dartString(icons.controls.stateLayer.shape)};
  static const String stateLayerTarget = ${dartString(icons.controls.stateLayer.target)};
  static const double hoverStateLayerOpacity = ${icons.controls.stateLayer.hoverOpacity};
  static const double focusStateLayerOpacity = ${icons.controls.stateLayer.focusOpacity};
  static const double pressedStateLayerOpacity = ${icons.controls.stateLayer.pressedOpacity};
  static const double disabledContentOpacity = ${icons.controls.disabledContentOpacity};
  static const String pendingVisual = ${dartString(icons.controls.pendingVisual)};
}

abstract final class WenyouElementContract {
  static const double interactiveMinimumTarget = ${elements.mobile.interactiveMinimumDp}.0;
  static const double internalReferenceLineHeight = ${elements.mobile.internalReference.lineHeight};
  static const double internalReferencePaddingBlock = ${elements.mobile.internalReference.paddingBlockEm};
  static const double internalReferencePaddingInline = ${elements.mobile.internalReference.paddingInlineEm};
  static const double internalReferenceGap = ${elements.mobile.internalReference.gapEm};
  static const double internalReferenceRadius = ${elements.mobile.internalReference.radiusEm};
  static const double internalReferenceIconSize = ${elements.mobile.internalReference.iconSizeEm};
  static const double internalReferencePressedStateOpacity = ${elements.mobile.internalReference.pressedStateOpacity};
  static const String internalReferenceIcon = ${dartString(elements.inline.internalReference.icon)};
  static const bool readingEditorEquivalent = ${elements.invariants.readingEditorEquivalent};
  static const bool statusNeverColorOnly = ${elements.invariants.statusNeverColorOnly};
  static const Color quoteForeground = WenyouFoundationPalette.${elements.block.quote.foreground};
  static const Color quoteSurface = WenyouFoundationPalette.${elements.block.quote.surface};
  static const Color quoteMarker = WenyouFoundationPalette.${elements.block.quote.marker};
  static const double quoteMarkerWidth = ${elements.mobile.quote.markerWidthDp}.0;
  static const double quoteRadius = WenyouFoundationMobile.radius${dartIdentifier(elements.block.quote.radius)[0].toUpperCase()}${dartIdentifier(elements.block.quote.radius).slice(1)};
  static const String quoteRadiusApplication = ${dartString(elements.block.quote.radiusApplication)};
  static const String quoteWidth = ${dartString(elements.block.quote.width)};
  static const String quoteFontFamily = ${dartString(elements.block.quote.fontFamily)};
  static const String quoteFontSize = ${dartString(elements.block.quote.fontSize)};
  static const String quoteLineHeight = ${dartString(elements.block.quote.lineHeight)};
  static const int quoteFontWeight = ${elements.block.quote.fontWeight};
  static const String quoteFontStyle = ${dartString(elements.block.quote.fontStyle)};
  static const double quotePaddingBlock = ${elements.block.quote.paddingBlockEm};
  static const double quotePaddingInline = ${elements.block.quote.paddingInlineEm};
  static const String quoteOuterSpacing = ${dartString(elements.block.quote.outerSpacing)};
  static const String quoteContentSpacing = ${dartString(elements.block.quote.contentSpacing)};
  static const String quoteGeneratedAdornment = ${dartString(elements.block.quote.generatedAdornment)};
  static const String quoteShadow = ${dartString(elements.block.quote.shadow)};
  static const double diceLineHeight = ${elements.inline.dice.lineHeight};
  static const double dicePaddingBlock = ${elements.inline.dice.paddingBlockEm};
  static const double dicePaddingInline = ${elements.inline.dice.paddingInlineEm};
  static const String diceSettledLabelPattern = ${dartString(elements.inline.dice.labels.settled)};
  static const String dicePendingLabelPattern = ${dartString(elements.inline.dice.labels.pending)};
  static const String diceSettledRole = ${dartString(elements.inline.dice.semantics.settledRole)};
  static const String dicePendingRole = ${dartString(elements.inline.dice.semantics.pendingRole)};
  static const String diceSettledSemanticsPattern = ${dartString(elements.inline.dice.semantics.settled)};
  static const String dicePendingSemanticsPattern = ${dartString(elements.inline.dice.semantics.pending)};
  static const String diceSettledSemanticsHint = ${dartString(elements.inline.dice.semantics.settledHint)};
  static const String diceResultItemSemanticsPattern = ${dartString(elements.inline.dice.semantics.resultItem)};
  static const String diceDetailTitle = ${dartString(elements.inline.dice.detail.title)};
  static const String diceDetailResultsLabel = ${dartString(elements.inline.dice.detail.resultsLabel)};
  static const String diceDetailResultOrder = ${dartString(elements.inline.dice.detail.resultOrder)};
  static const int diceDetailResultIndexOrigin = ${elements.inline.dice.detail.resultIndexOrigin};
  static const String diceDetailSubtotalLabel = ${dartString(elements.inline.dice.detail.calculation.subtotalLabel)};
  static const String diceDetailModifierLabel = ${dartString(elements.inline.dice.detail.calculation.modifierLabel)};
  static const String diceDetailTotalLabel = ${dartString(elements.inline.dice.detail.calculation.totalLabel)};
  static const String dicePositiveModifierPattern = ${dartString(elements.inline.dice.detail.calculation.positiveModifier)};
  static const String diceNegativeModifierPattern = ${dartString(elements.inline.dice.detail.calculation.negativeModifier)};
  static const String diceZeroModifierBehavior = ${dartString(elements.inline.dice.detail.calculation.zeroModifier)};
  static const String diceSubtotalSource = ${dartString(elements.inline.dice.detail.calculation.subtotalSource)};
  static const String diceTotalSource = ${dartString(elements.inline.dice.detail.calculation.totalSource)};
  static const double diceDetailCellMinimumWidth = ${elements.inline.dice.detail.resultCell.minimumWidthEm};
  static const double diceDetailCellPaddingBlock = ${elements.inline.dice.detail.resultCell.paddingBlockEm};
  static const double diceDetailCellPaddingInline = ${elements.inline.dice.detail.resultCell.paddingInlineEm};
  static const double diceDetailCellRadius = ${elements.inline.dice.detail.resultCell.radiusEm};
  static const Color diceDetailCellForeground = WenyouFoundationPalette.foreground;
  static const Color diceDetailCellSurface = WenyouFoundationPalette.muted;
  static const String diceDetailSurface = ${dartString(elements.mobile.dice.detailSurface)};
  static const double diceDetailMaximumHeightFraction = ${elements.mobile.dice.detailMaximumHeightFraction};
  static const double dicePressedStateOpacity = ${elements.mobile.dice.pressedStateOpacity};
  static const bool diceDetailUsesSafeArea = ${elements.mobile.dice.safeArea};
  static const bool diceDetailHasExplicitClose = ${elements.mobile.dice.explicitClose};
  static const String diceSettledActivation = ${dartString(elements.inline.dice.interaction.settledActivation)};
  static const String dicePendingActivation = ${dartString(elements.inline.dice.interaction.pendingActivation)};
  static const bool diceExposesExpandedState = ${elements.inline.dice.interaction.exposesExpandedState};
  static const bool diceRestoresFocus = ${elements.inline.dice.interaction.restoreFocus};
  static const String diceEditorActivation = ${dartString(elements.inline.dice.editor.activation)};
  static const String diceReadingEditorEquivalentScope = ${dartString(elements.inline.dice.editor.readingEquivalentScope)};
  static const String diceInsertionTitle = ${dartString(elements.inline.dice.editor.insertion.title)};
  static const List<String> diceInsertionFields = ${dartList(elements.inline.dice.editor.insertion.fields)};
  static const String diceQuantityLabel = ${dartString(elements.inline.dice.editor.insertion.fieldLabels.quantity)};
  static const String diceSidesLabel = ${dartString(elements.inline.dice.editor.insertion.fieldLabels.sides)};
  static const String diceModifierLabel = ${dartString(elements.inline.dice.editor.insertion.fieldLabels.modifier)};
  static const String diceQuantityFieldType = ${dartString(elements.inline.dice.editor.insertion.fieldTypes.quantity)};
  static const String diceSidesFieldType = ${dartString(elements.inline.dice.editor.insertion.fieldTypes.sides)};
  static const String diceModifierFieldType = ${dartString(elements.inline.dice.editor.insertion.fieldTypes.modifier)};
  static const int diceDefaultQuantity = ${elements.inline.dice.editor.insertion.defaults.quantity};
  static const int diceDefaultSides = ${elements.inline.dice.editor.insertion.defaults.sides};
  static const int diceDefaultModifier = ${elements.inline.dice.editor.insertion.defaults.modifier};
  static const List<int> diceQuickSides = ${dartList(elements.inline.dice.editor.insertion.quickSides, String)};
  static const String diceQuickSideBehavior = ${dartString(elements.inline.dice.editor.insertion.quickSideBehavior)};
  static const String diceInsertionLayout = ${dartString(elements.inline.dice.editor.insertion.layout)};
  static const String diceInsertionPreviewPattern = ${dartString(elements.inline.dice.editor.insertion.preview)};
  static const String diceInsertionPreviewBehavior = ${dartString(elements.inline.dice.editor.insertion.previewBehavior)};
  static const String diceValidationOwner = ${dartString(elements.inline.dice.editor.insertion.validationOwner)};
  static const String diceResultBinding = ${dartString(elements.inline.dice.data.binding)};
  static const bool diceReadingEditorEquivalent = ${elements.inline.dice.editor.readingEquivalent};
  static const bool diceNeverColorOnly = ${elements.inline.dice.semantics.neverColorOnly};
  static const double badgeDefaultHeight = ${elements.metadata.badge.default.heightPx}.0;
  static const double badgeCompactHeight = ${elements.metadata.badge.compact.heightPx}.0;
  static const double badgeDefaultFontSize = ${elements.metadata.badge.default.fontSizePx}.0;
  static const double badgeCompactFontSize = ${elements.metadata.badge.compact.fontSizePx}.0;
  static const double levelHeight = ${elements.metadata.level.heightPx}.0;
  static const double levelFontSize = ${elements.metadata.level.fontSizePx}.0;
  static const double unreadCountHeight = ${elements.metadata.unreadCount.heightPx}.0;
  static const double unreadCountFontSize = ${elements.metadata.unreadCount.fontSizePx}.0;
  static const String unreadMaximumDisplay = ${dartString(elements.metadata.unreadCount.maximumDisplay)};
  static const double categoryMarkerWidth = ${elements.mobile.categoryMarkerWidthDp}.0;
  static const Color categoryMarkerForeground = WenyouFoundationPalette.mutedForeground;
  static const String categoryBadgeTone = ${dartString(elements.metadata.categoryMarker.badgeTone)};
}

@immutable
class WenyouLevelTier {
  const WenyouLevelTier({required this.id, required this.minimum, required this.maximum, required this.foreground, required this.surface, required this.border});
  final String id;
  final int minimum;
  final int maximum;
  final Color foreground;
  final Color surface;
  final Color border;
}

abstract final class WenyouLevelContract {
  static const List<WenyouLevelTier> tiers = <WenyouLevelTier>[
${levelTierEntries}
  ];
  static WenyouLevelTier? resolve(int level) {
    if (level < 1) return null;
    for (final tier in tiers) {
      if (level <= tier.maximum) return tier;
    }
    return tiers.last;
  }
}

abstract final class WenyouIdentityContract {
  static const String missingAvatarFallback = ${dartString(elements.identity.avatarFallback.missingOrFailed)};
  static const String unavailableAvatarFallback = ${dartString(elements.identity.avatarFallback.unavailableOrAnonymous)};
  static const Map<String, String> roleTones = <String, String>{
${dartStringMapEntries(elements.identity.roleTones)}
  };
  static const String emailVerificationPublicIdentity = ${dartString(elements.identity.emailVerification.publicIdentity)};
  static const String emailVerificationAccountSecurityEntry = ${dartString(elements.identity.emailVerification.accountSecurityEntry)};
  static const String emailVerificationRestrictedActionGuidance = ${dartString(elements.identity.emailVerification.restrictedActionGuidance)};
}

abstract final class WenyouControlContract {
  static const List<String> actionRoles = <String>${dartList(controls.actions.roles)};
  static const List<String> fieldStates = <String>${dartList(controls.fields.states)};
  static const List<String> selectionPatterns = <String>${dartList(controls.selection.patterns)};
  static const double minimumTarget = ${controls.mobile.minimumTargetDp}.0;
  static const String levelProgressFill = ${dartString(controls.progress.levelFill)};
}

abstract final class WenyouFoundationTypography {
  static const String body = 'Wenyou Noto Sans SC';
  static const String display = 'Wenyou LXGW WenKai';
  static const String utility = 'Wenyou Nunito';
  static const List<String> chineseFallback = <String>['Noto Sans SC', 'sans-serif'];
  static const Map<String, String> mobileFamilies = <String, String>{
${mobileTypeFamilyEntries}
  };
  static const Map<String, double> mobileSizes = <String, double>{
${mobileTypeNumberEntries("size", ".0")}
  };
  static const Map<String, double> mobileLineHeights = <String, double>{
${mobileTypeNumberEntries("lineHeight")}
  };
  static const Map<String, int> mobileWeights = <String, int>{
${mobileTypeNumberEntries("weight")}
  };
}

abstract final class WenyouFoundationMotion {
  static const Duration fast = Duration(milliseconds: ${motion.fastMs});
  static const Duration standard = Duration(milliseconds: ${motion.standardMs});
  static const Duration slow = Duration(milliseconds: ${motion.slowMs});
}

abstract final class WenyouFoundationMobile {
  static const double minimumTouchTarget = ${mobile.minimumControlTarget}.0;
  static const List<double> spacing = <double>${dartList(mobile.spacing, (value) => `${value}.0`)};
${mobile.spacing.map((value) => `  static const double space${value} = ${value}.0;`).join("\n")}
  static const double radiusCompact = ${mobile.radii.compact}.0;
  static const double radiusControl = ${mobile.radii.control}.0;
  static const double radiusPanel = ${mobile.radii.panel}.0;
  static const double radiusPill = ${mobile.radii.pill}.0;
  static const double compactHorizontalPadding = ${mobile.horizontalPadding.compact}.0;
  static const double regularHorizontalPadding = ${mobile.horizontalPadding.regular}.0;
  static const double regularHorizontalPaddingFrom = ${mobile.horizontalPadding.regularFrom}.0;
  static const double pageContentMaxWidth = ${mobile.pageContentMaxWidth}.0;
  static const double wideContainerMaxWidth = ${mobile.wideContainerMaxWidth}.0;
}

abstract final class WenyouAccessibilityContract {
  static const double normalTextContrast = ${accessibility.contrast.normalText};
  static const double largeTextContrast = ${accessibility.contrast.largeText}.0;
  static const double nonTextContrast = ${accessibility.contrast.nonText}.0;
  static const bool focusVisible = ${accessibility.invariants.focusVisible};
  static const bool statusNeverColorOnly = ${accessibility.invariants.statusNeverColorOnly};
  static const bool iconOnlyControlHasLabel = ${accessibility.invariants.iconOnlyControlHasLabel};
  static const String reducedMotion = ${dartString(accessibility.invariants.reducedMotion)};
  static const String asyncAnnouncement = ${dartString(accessibility.invariants.asyncAnnouncement)};
  static const bool systemTextScale = ${accessibility.mobile.systemTextScale};
  static const bool safeArea = ${accessibility.mobile.safeArea};
  static const bool systemBack = ${accessibility.mobile.systemBack};
}

abstract final class WenyouFeedbackContract {
  static const List<String> resourceStates = <String>${dartList(feedback.resourceStates)};
  static const List<String> mutationStates = <String>${dartList(feedback.mutationStates)};
  static const String transientChannel = ${dartString(feedback.mobile.transientChannel)};
  static const String asyncLiveRegion = ${dartString(feedback.mobile.asyncLiveRegion)};
  static const bool refreshPreservesContent = ${feedback.invariants.refreshPreservesContent};
  static const bool paginationPreservesContent = ${feedback.invariants.paginationPreservesContent};
  static const bool pendingPreventsDuplicateSubmit = ${feedback.invariants.pendingPreventsDuplicateSubmit};
  static const bool retryOnlyWhenSafe = ${feedback.invariants.retryOnlyWhenSafe};
  static const bool blockingFailureStaysInContext = ${feedback.invariants.blockingFailureStaysInContext};
}

abstract final class WenyouOverlayContract {
  static const Map<String, double> elevation = <String, double>{
${Object.entries(overlays.mobile.elevation).map(([id, value]) => `    ${dartString(id)}: ${value}.0,`).join("\n")}
  };
  static const List<String> dismiss = <String>${dartList(overlays.mobile.dismiss)};
  static const bool safeArea = ${overlays.mobile.safeArea};
  static const bool modalBlocksBackground = ${overlays.invariants.modalBlocksBackground};
  static const bool explicitClosePath = ${overlays.invariants.explicitClosePath};
  static const bool restoreFocus = ${overlays.invariants.restoreFocus};
}

abstract final class WenyouNavigationContract {
  static const Map<String, String> labels = <String, String>{
${dartStringMapEntries(navigation.labels)}
  };
  static const Map<String, String> icons = <String, String>{
${dartStringMapEntries(navigation.icons)}
  };
  static const List<String> primary = <String>${dartList(navigation.mobile.primary)};
  static const List<String> messageSections = <String>${dartList(navigation.mobile.messageSections)};
  static const String routeOwner = ${dartString(navigation.invariants.routeOwner)};
  static const String messageUnreadAggregation = ${dartString(navigation.invariants.messageUnreadAggregation)};
}

abstract final class WenyouLanguageContract {
  static const Map<String, String> nouns = <String, String>{
${dartStringMapEntries(language.nouns)}
  };
  static const Map<String, String> actions = <String, String>{
${dartStringMapEntries(language.actions)}
  };
  static const bool sameActionKeepsVerb = ${language.invariants.sameActionKeepsVerb};
  static const bool sentencesOwnedByClient = ${language.invariants.sentencesOwnedByClient};
  static const bool protocolNamesNeverUserFacing = ${language.invariants.protocolNamesNeverUserFacing};
}

abstract final class WenyouCollectionContract {
  static const bool fillAvailableWidth = ${collections.invariants.itemWidth === "available"};
  static const bool narrowContentKeepsItemWidth = ${collections.invariants.narrowContentDoesNotChangeItemWidth};
  static const Set<String> contentSizedExceptions = <String>{${collections.invariants.contentSizedExceptions.map(dartString).join(", ")}};
  static const String mobileLayout = ${dartString(collections.mobile.layout)};
  static const String mobileItemWidth = ${dartString(collections.mobile.itemWidth)};
  static const Map<String, String> mobileDomainLayoutExceptions = <String, String>{
${dartStringMapEntries(collections.mobile.domainLayoutExceptions)}
  };
}

abstract final class WenyouNotificationContract {
  static const String allLabel = ${dartString(notifications.allLabel)};
  static const String eventTypeOwner = ${dartString(notifications.eventTypeOwner)};
  static const String unknownTypeVisibility = ${dartString(notifications.unknownTypeVisibility)};
  static const List<String> groupOrder = <String>${dartList(notifications.groups.map(({ id }) => id))};
  static const Map<String, String> labels = <String, String>{
${notificationLabelEntries}
  };
  static const Map<String, List<String>> eventTypes = <String, List<String>>{
${notificationTypeEntries}
  };
}

abstract final class WenyouEditorContract {
  static const Map<String, String> labels = <String, String>{
${labelEntries}
  };
  static const List<String> primary = <String>${dartList(editor.mobile.primary)};
  static const List<String> wideAdditions = <String>${dartList(editor.mobile.wideAdditions)};
  static const List<String> primaryCore = <String>${dartList(editor.mobile.primaryCore)};
  static const List<String> primaryPromotionOrder = <String>${dartList(editor.mobile.primaryPromotionOrder)};
  static const List<String> surfaces = <String>${dartList(editor.mobile.surfaces)};
  static const Set<String> mobileRenderingExceptions = <String>{${editor.mobile.renderingExceptions.map(dartString).join(", ")}};
  static const String keyboardToolbarPlacement = ${dartString(editor.mobile.toolbar.placementWhenKeyboardVisible)};
  static const String primaryLayout = ${dartString(editor.mobile.toolbar.primaryLayout)};
  static const String horizontalOverflow = ${dartString(editor.mobile.toolbar.horizontalOverflow)};
  static const String morePresentation = ${dartString(editor.mobile.toolbar.morePresentation)};
  static const List<String> moreInline = <String>${dartList(editor.mobile.moreInline)};
  static const List<String> contextual = <String>${dartList(editor.mobile.contextual)};
  static const int markdownContractVersion = ${editor.contentPolicy.markdownContractVersion};
  static const String structuredCapabilitySource = ${dartString(editor.contentPolicy.structuredCapabilitySource)};
  static const String unsupportedClientBehavior = ${dartString(editor.contentPolicy.unsupportedClientBehavior)};
  static const String unsupportedApiBehavior = ${dartString(editor.contentPolicy.unsupportedApiBehavior)};
  static const int maximumListDepth = ${editor.contentPolicy.maximumListDepth};
  static const List<int> creatableHeadingLevels = <int>${dartList(editor.creatableHeadingLevels, String)};
  static const double compactContentInlinePadding = ${editor.mobile.layout.compactContentInlinePaddingDp}.0;
  static const double regularContentInlinePadding = ${editor.mobile.layout.regularContentInlinePaddingDp}.0;
  static const double toolbarHorizontalPadding = ${editor.mobile.layout.toolbarHorizontalPaddingDp}.0;
  static const double minimumActionExtent = ${editor.mobile.layout.minimumActionExtentDp}.0;
  static const double bodyFontSize = ${editor.mobile.layout.bodySp}.0;
  static const double bodyLineHeight = ${editor.mobile.layout.lineHeight};
  static const bool respectsSystemTextScale = ${editor.mobile.layout.respectsSystemTextScale};
  static const Map<String, Map<String, String>> capabilities = <String, Map<String, String>>{
${mobileCapabilityEntries}
  };
}

abstract final class WenyouImageContract {
  static const Map<String, String> roleFits = <String, String>{
${Object.entries(images.roles).map(([role, value]) => `    ${dartString(role)}: ${dartString(value.fit)},`).join("\n")}
  };
  static const Set<String> cropAllowed = <String>{${Object.entries(images.roles).filter(([, value]) => value.crop === "allowed").map(([role]) => dartString(role)).join(", ")}};
  static const List<String> states = <String>${dartList(images.states)};
  static const double stickerDisplayMax = ${images.mobile.stickerDisplayMaxDp}.0;
}`);

write("packages/flutter/lib/src/foundation_formatters.dart", `// 由 contracts/foundation.v1.json 生成，禁止手改。
abstract final class WenyouFormattingContract {
  static const Duration relativeWindow = Duration(seconds: ${formatting.relativeTime.relativeWindowSeconds});
  static const Duration justNow = Duration(seconds: ${formatting.relativeTime.justNowSeconds});
  static const Duration minutesUntil = Duration(seconds: ${formatting.relativeTime.minutesUntilSeconds});
  static const Duration hoursUntil = Duration(seconds: ${formatting.relativeTime.hoursUntilSeconds});
  static const int compactCountFrom = ${formatting.counts.compactFrom};
  static const int yiCountFrom = ${formatting.counts.yiFrom};
}

String _wenyouPad2(int value) => value.toString().padLeft(2, '0');

String formatWenyouExactTime(DateTime value) {
  final date = value.toLocal();
  return date.year.toString() + '-' + _wenyouPad2(date.month) + '-' + _wenyouPad2(date.day)
      + ' ' + _wenyouPad2(date.hour) + ':' + _wenyouPad2(date.minute);
}

String formatWenyouTime(DateTime value, {DateTime? reference}) {
  final date = value.toLocal();
  final now = (reference ?? DateTime.now()).toLocal();
  final difference = now.difference(date);
  if (!difference.isNegative && difference < WenyouFormattingContract.justNow) return '刚刚';
  if (difference >= WenyouFormattingContract.justNow && difference < WenyouFormattingContract.minutesUntil) {
    return difference.inMinutes.toString() + ' 分钟前';
  }
  if (difference >= WenyouFormattingContract.minutesUntil && difference < WenyouFormattingContract.hoursUntil) {
    return difference.inHours.toString() + ' 小时前';
  }
  if (difference >= WenyouFormattingContract.hoursUntil && difference < WenyouFormattingContract.relativeWindow) {
    return difference.inDays.toString() + ' 天前';
  }
  final datePart = date.year == now.year
      ? _wenyouPad2(date.month) + '-' + _wenyouPad2(date.day)
      : date.year.toString() + '-' + _wenyouPad2(date.month) + '-' + _wenyouPad2(date.day);
  return datePart + ' ' + _wenyouPad2(date.hour) + ':' + _wenyouPad2(date.minute);
}

String _formatWenyouCompact(num value, num divisor, String suffix) {
  final scaled = (value / divisor * 10).round() / 10;
  final digits = scaled == scaled.roundToDouble() ? 0 : ${formatting.counts.maximumFractionDigits};
  return scaled.toStringAsFixed(digits) + suffix;
}

String formatWenyouCompactCount(num value) {
  if (!value.isFinite || value < 0) return '—';
  final count = value.truncate();
  if (count >= ${formatting.counts.yiFrom}) return _formatWenyouCompact(count, ${formatting.counts.yiFrom}, '亿');
  if (count >= ${formatting.counts.wanFrom}) return _formatWenyouCompact(count, ${formatting.counts.wanFrom}, '万');
  return count.toString();
}`);

write("packages/flutter/lib/src/foundation_brand.dart", `// 由 contracts/foundation.v1.json 生成，禁止手改。
import 'package:flutter/material.dart';

abstract final class WenyouBrandContract {
  static const String name = ${dartString(brand.name)};
  static const String tagline = ${dartString(brand.tagline)};
  static const String symbolAsset = 'brand_assets/runtime/logo-symbol-transparent-1024.png';
  static const double startupMarkSize = ${brand.mobile.startupMarkDp}.0;
  static const double authMarkSize = ${brand.mobile.authMarkDp}.0;
  static const double appBarMarkSize = ${brand.mobile.appBarMarkDp}.0;
}

class WenyouBrandMark extends StatelessWidget {
  const WenyouBrandMark.decorative({
    this.size = WenyouBrandContract.appBarMarkSize,
    super.key,
  }) : semanticLabel = null;

  const WenyouBrandMark.semantic({
    required this.semanticLabel,
    this.size = WenyouBrandContract.appBarMarkSize,
    super.key,
  });

  final double size;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final cacheSize = (size * MediaQuery.devicePixelRatioOf(context)).ceil();
    return SizedBox.square(
      dimension: size,
      child: Image.asset(
        WenyouBrandContract.symbolAsset,
        package: 'wenyousite_foundation',
        width: size,
        height: size,
        fit: BoxFit.contain,
        filterQuality: FilterQuality.high,
        cacheWidth: cacheSize,
        cacheHeight: cacheSize,
        excludeFromSemantics: semanticLabel == null,
        semanticLabel: semanticLabel,
      ),
    );
  }
}`);

const brandSourceFiles = listFiles(brand.source.assetRoot);
const brandAssetSha256 = Object.fromEntries(brandSourceFiles.map((relativePath) => [
  relativePath,
  crypto.createHash("sha256").update(fs.readFileSync(path.join(root, relativePath))).digest("hex"),
]));
const brandPackageCopies = [
  [brand.assets.symbolMaster, "packages/flutter/brand_assets/runtime/logo-symbol-transparent-1024.png"],
  ...brandSourceFiles
    .filter((relativePath) => relativePath.startsWith(`${brand.assets.androidRoot}/`) || relativePath.startsWith(`${brand.assets.appleRoot}/`))
    .map((relativePath) => [relativePath, `packages/flutter/brand_assets/platform/${relativePath.slice("brand/app/".length)}`]),
];
for (const [sourceRelativePath, targetRelativePath] of brandPackageCopies) {
  copyBinary(sourceRelativePath, targetRelativePath);
}
write("packages/flutter/brand_assets/manifest.json", JSON.stringify({
  version: contract.version,
  contract: "contracts/foundation.v1.json#experiences.brand",
  assets: brandAssetSha256,
}, null, 2));

for (const glyphId of glyphIds) {
  write(`packages/flutter/icons/${glyphId}.svg`, glyphSvgs[glyphId]);
}
for (const glyphId of filledGlyphIds) {
  write(`packages/flutter/icons/${glyphId}-filled.svg`, filledGlyphSvgs[glyphId]);
}
const dartSemanticFields = Object.entries(icons.semantics)
  .map(([semanticId, glyphId]) => `  static const String ${dartIdentifier(semanticId)} = ${dartString(semanticId)}; // ${glyphId}`)
  .join("\n");
const dartSemanticEntries = Object.entries(icons.semantics)
  .map(([semanticId, glyphId]) => `    ${dartString(semanticId)}: ${dartString(glyphId)},`)
  .join("\n");
write("packages/flutter/lib/src/wenyou_icons.dart", `// 由 contracts/foundation.v1.json 与 Lucide ${icons.source.version} 生成，禁止手改。
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

enum WenyouIconVariant { outline, filled }

abstract final class WenyouIconIds {
${dartSemanticFields}
}

abstract final class WenyouIconContract {
  static const String family = ${dartString(icons.source.family)};
  static const String version = ${dartString(icons.source.version)};
  static const double compactSize = ${icons.style.compactSize}.0;
  static const double defaultSize = ${icons.style.defaultSize}.0;
  static const double navigationSize = ${icons.style.navigationSize}.0;
  static const Map<String, String> glyphs = <String, String>{
${dartSemanticEntries}
  };
  static const Set<String> filledGlyphs = <String>{${filledGlyphIds.map(dartString).join(", ")}};

  static String assetName(
    String semanticId, {
    WenyouIconVariant variant = WenyouIconVariant.outline,
  }) {
    final glyph = glyphs[semanticId];
    if (glyph == null) throw ArgumentError.value(semanticId, 'semanticId', 'Unknown Wenyou icon semantic');
    if (variant == WenyouIconVariant.filled) {
      if (!filledGlyphs.contains(glyph)) {
        throw ArgumentError.value(semanticId, 'semanticId', 'Wenyou icon has no filled variant');
      }
      return 'icons/\$glyph-filled.svg';
    }
    return 'icons/\$glyph.svg';
  }
}

class WenyouIcon extends StatelessWidget {
  const WenyouIcon(
    this.semanticId, {
    this.size = WenyouIconContract.defaultSize,
    this.color,
    this.semanticLabel,
    this.variant = WenyouIconVariant.outline,
    super.key,
  });

  final String semanticId;
  final double size;
  final Color? color;
  final String? semanticLabel;
  final WenyouIconVariant variant;

  @override
  Widget build(BuildContext context) {
    final resolvedColor = color ?? IconTheme.of(context).color ?? DefaultTextStyle.of(context).style.color;
    final picture = SvgPicture.asset(
      WenyouIconContract.assetName(semanticId, variant: variant),
      package: 'wenyousite_foundation',
      width: size,
      height: size,
      fit: BoxFit.contain,
      colorFilter: resolvedColor == null ? null : ColorFilter.mode(resolvedColor, BlendMode.srcIn),
      excludeFromSemantics: semanticLabel == null,
      semanticsLabel: semanticLabel,
    );
    return Align(
      widthFactor: 1,
      heightFactor: 1,
      child: SizedBox.square(dimension: size, child: picture),
    );
  }
}`);

const artifactPaths = [
  ...["brand", "icons", "editor", "images", "collections", "controls", "notifications", "typography", "interaction", "formatting", "navigation", "language", "elements"]
    .flatMap((name) => [`dist/${name}.js`, `dist/${name}.d.ts`]),
  "web/tokens.css",
  "web/fonts.css",
  "packages/flutter/lib/src/foundation_tokens.dart",
  "packages/flutter/lib/src/foundation_formatters.dart",
  "packages/flutter/lib/src/foundation_brand.dart",
  "packages/flutter/lib/src/wenyou_icons.dart",
  "packages/flutter/brand_assets/manifest.json",
  ...brandPackageCopies.map(([, targetRelativePath]) => targetRelativePath),
];
const artifactSha256 = Object.fromEntries(artifactPaths.map((relativePath) => [
  relativePath,
  crypto.createHash("sha256").update(fs.readFileSync(path.join(root, relativePath))).digest("hex"),
]));
const manifest = JSON.stringify({
  version: contract.version,
  schemaVersion: contract.schemaVersion,
  contract: "contracts/foundation.v1.json",
  contractSha256,
  features: {
    typography: true,
    interaction: true,
    controls: true,
    formatting: true,
    contentPresentation: true,
    iconControls: true,
    navigation: true,
    language: true,
    elements: true,
    brand: true,
  },
  artifactSha256,
  icons: {
    family: icons.source.family,
    version: icons.source.version,
    license: icons.source.license,
    glyphSha256,
    filledGlyphSha256,
  },
  brand: {
    name: brand.name,
    tagline: brand.tagline,
    assets: brandAssetSha256,
  },
  fonts: contract.fonts.map(({ role, family, sha256, webSha256 }) => ({
    role,
    family,
    sha256,
    ...(webSha256 ? { webSha256 } : {}),
  })),
}, null, 2);
write("foundation-manifest.json", manifest);
write("packages/flutter/foundation-manifest.json", manifest);

const flutterLicense = contract.fonts
  .map((font) => [
    `${font.family} (${font.role})`,
    "=".repeat(font.family.length + font.role.length + 3),
    "以下许可仅适用于该字体文件；基础仓库其余内容不因此自动获得相同许可。",
    "",
    readFile(font.license),
  ].join("\n"))
  .join("\n\n---\n\n");
write("packages/flutter/LICENSE", `${flutterLicense}\n\n---\n\nLucide icons\n============\n${readFile(icons.source.license)}`);

if (!checkOnly) console.log(`Generated foundation ${contract.version} artifacts`);
