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
const icons = contract.experiences.icons;
const images = contract.experiences.images;
const collections = contract.experiences.collections;
const notifications = contract.experiences.notifications;
const accessibility = contract.accessibility;
const feedback = contract.experiences.feedback;
const overlays = contract.experiences.overlays;
const navigation = contract.experiences.navigation;
const language = contract.experiences.language;
const typeRoleIds = Object.keys(contract.profiles.web.typeScale);
const kebab = (value) => value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

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
const flutterIconDirectory = path.join(root, "packages", "flutter", "icons");
if (!checkOnly && fs.existsSync(flutterIconDirectory)) {
  for (const fileName of fs.readdirSync(flutterIconDirectory)) {
    if (fileName.endsWith(".svg") && !glyphIds.includes(fileName.slice(0, -4))) {
      fs.unlinkSync(path.join(flutterIconDirectory, fileName));
    }
  }
}

write("dist/icons.js", `/** 由 contracts/foundation.v1.json 与 Lucide ${icons.source.version} 生成，禁止手改。 */
export const ICON_FAMILY = ${JSON.stringify(icons.source.family)};
export const ICON_VERSION = ${JSON.stringify(icons.source.version)};
export const ICON_STYLE = Object.freeze(${js(icons.style)});
export const ICON_SEMANTICS = Object.freeze(${js(icons.semantics)});
export const ICON_GLYPH_NODES = Object.freeze(${js(glyphNodes)});
export const ICON_GLYPH_SVGS = Object.freeze(${js(glyphSvgs)});
export const ICON_GLYPH_SHA256 = Object.freeze(${js(glyphSha256)});
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
}`);

const semanticUnion = Object.keys(icons.semantics).map((id) => JSON.stringify(id)).join(" | ");
const glyphUnion = glyphIds.map((id) => JSON.stringify(id)).join(" | ");
write("dist/icons.d.ts", `/** 由 contracts/foundation.v1.json 与 Lucide ${icons.source.version} 生成，禁止手改。 */
export type IconSemanticId = ${semanticUnion};
export type IconGlyphId = ${glyphUnion};
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
  selectedState: "same-glyph-on-accent-container";
  decorativeSemantics: "hidden";
  interactiveLabelOwner: "control";
}>;
export declare const ICON_SEMANTICS: Readonly<Record<IconSemanticId, IconGlyphId>>;
export declare const ICON_GLYPH_NODES: Readonly<Record<IconGlyphId, readonly IconNode[]>>;
export declare const ICON_GLYPH_SVGS: Readonly<Record<IconGlyphId, string>>;
export declare const ICON_GLYPH_SHA256: Readonly<Record<IconGlyphId, string>>;
export declare const ICON_PLATFORM_EXCEPTIONS: readonly string[];
export declare function iconGlyphId(semanticId: IconSemanticId): IconGlyphId;
export declare function iconNode(semanticId: IconSemanticId): readonly IconNode[];
export declare function iconSvg(semanticId: IconSemanticId): string;`);

const iconCatalogRows = Object.entries(icons.semantics)
  .map(([semanticId, glyphId]) => `| \`${semanticId}\` | \`${glyphId}\` | \`${glyphSha256[glyphId]}\` |`)
  .join("\n");
write("docs/icons.md", `# 图标目录与治理

本目录由 \`contracts/foundation.v1.json\` 与 \`${icons.source.package}@${icons.source.version}\` 生成。产品代码使用语义 ID，不直接把 Lucide 图形名当作业务含义。

## 使用规则

- Web 与 Flutter 必须消费 Foundation 生成产物；第三方编辑器使用同源 SVG 字符串，不手写近似路径。
- 交互状态由控件容器表达；选中态保持同一图形，使用柔粉背景和前景色。
- 有文字的控件由控件承担可访问名称，内部图标隐藏；独立图标按钮必须提供明确名称。
- 新增语义前先搜索本目录。同一图形可以承载多个经过审查的近义语义，但同一语义只能映射一个图形。
- 品牌标识、分类标记、插画和操作系统专属动作属于显式例外，不进入核心 UI 图标映射。

## 版本与视觉规格

- 图标家族：${icons.source.family}
- 固定版本：${icons.source.version}
- 画板：${icons.source.viewBox}
- 默认线宽：${icons.style.strokeWidth}
- 尺寸角色：紧凑 ${icons.style.compactSize}、默认 ${icons.style.defaultSize}、导航 ${icons.style.navigationSize}

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
export const EDITOR_WEB_LAYOUT = Object.freeze(${js(editor.web.layout)});
export const EDITOR_MOBILE_LAYOUT = Object.freeze(${js(editor.mobile.layout)});
export const EDITOR_MOBILE_SURFACES = Object.freeze(${js(editor.mobile.surfaces)});
export const EDITOR_MOBILE_TOOLBAR = Object.freeze(${js(editor.mobile.toolbar)});
export const EDITOR_MOBILE_MORE_INLINE = Object.freeze(${js(editor.mobile.moreInline)});
export const EDITOR_WEB_CAPABILITIES = Object.freeze(${js(editor.capabilities.web)});
export const EDITOR_MOBILE_CAPABILITIES = Object.freeze(${js(editor.capabilities.mobile)});
export const EDITOR_SYNTAX_ONLY = Object.freeze(${js(editor.syntaxOnly)});
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
export type EditorCreationMode = "primary" | "secondary" | "contextual" | "source";
export type EditorEditingMode = "structured" | "atomic" | "source-preserve" | "ui-only";
export type EditorRenderingMode = "native" | "not-applicable";
export type EditorRoundTripMode = "structured" | "identity-preserving" | "source-preserve" | "not-applicable";
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
export declare const EDITOR_MOBILE_TOOLBAR: Readonly<{
  placementWhenKeyboardVisible: "above-keyboard-dock";
  primaryLayout: "responsive-single-row";
  horizontalOverflow: "forbidden";
  morePresentation: "inline";
}>;
export declare const EDITOR_MOBILE_MORE_INLINE: readonly EditorCapabilityId[];
export declare const EDITOR_WEB_CAPABILITIES: Readonly<Record<EditorCapabilityId, EditorCapabilityContract>>;
export declare const EDITOR_MOBILE_CAPABILITIES: Readonly<Record<EditorCapabilityId, EditorCapabilityContract>>;
export declare const EDITOR_SYNTAX_ONLY: readonly EditorCapabilityId[];
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
export declare const COLLECTION_WEB_PROFILE: Readonly<{
  tabPanelWidth: "available";
  multiColumn: "explicit-grid-only";
}>;
export declare const COLLECTION_MOBILE_PROFILE: Readonly<{
  layout: "single-column";
  itemWidth: "available";
}>;`);

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
export const TYPOGRAPHY_FAMILIES = Object.freeze(${js(contract.typography)});
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
export declare const WEB_TYPE_SCALE: Readonly<Record<TypographyRoleId, TypographyStyleContract>>;
export declare const MOBILE_TYPE_SCALE: Readonly<Record<TypographyRoleId, TypographyStyleContract>>;`);

write("dist/interaction.js", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const ACCESSIBILITY_CONTRACT = Object.freeze(${js(accessibility)});
export const FEEDBACK_RESOURCE_STATES = Object.freeze(${js(feedback.resourceStates)});
export const FEEDBACK_MUTATION_STATES = Object.freeze(${js(feedback.mutationStates)});
export const FEEDBACK_INVARIANTS = Object.freeze(${js(feedback.invariants)});
export const FEEDBACK_WEB_PROFILE = Object.freeze(${js(feedback.web)});
export const FEEDBACK_MOBILE_PROFILE = Object.freeze(${js(feedback.mobile)});
export const OVERLAY_INVARIANTS = Object.freeze(${js(overlays.invariants)});
export const OVERLAY_WEB_PROFILE = Object.freeze(${js(overlays.web)});
export const OVERLAY_MOBILE_PROFILE = Object.freeze(${js(overlays.mobile)});`);

write("dist/interaction.d.ts", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type FeedbackResourceState = ${feedback.resourceStates.map((id) => JSON.stringify(id)).join(" | ")};
export type FeedbackMutationState = ${feedback.mutationStates.map((id) => JSON.stringify(id)).join(" | ")};
export type OverlayLayerId = ${Object.keys(overlays.web.layers).map((id) => JSON.stringify(id)).join(" | ")};
export declare const ACCESSIBILITY_CONTRACT: Readonly<${JSON.stringify(accessibility)}>;
export declare const FEEDBACK_RESOURCE_STATES: readonly FeedbackResourceState[];
export declare const FEEDBACK_MUTATION_STATES: readonly FeedbackMutationState[];
export declare const FEEDBACK_INVARIANTS: Readonly<Record<string, boolean>>;
export declare const FEEDBACK_WEB_PROFILE: Readonly<{ transientChannel: "toast"; asyncLiveRegion: "polite" }>;
export declare const FEEDBACK_MOBILE_PROFILE: Readonly<{ transientChannel: "snackbar"; asyncLiveRegion: "polite" }>;
export declare const OVERLAY_INVARIANTS: Readonly<Record<string, boolean>>;
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
}>;`);

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
write("packages/flutter/lib/src/foundation_tokens.dart", `// 由 contracts/foundation.v1.json 生成，禁止手改。
import 'package:flutter/material.dart';

abstract final class WenyouFoundationVersion {
  static const String value = ${dartString(contract.version)};
  static const int schema = ${contract.schemaVersion};
}

abstract final class WenyouFoundationPalette {
${paletteLines}
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
  static const String keyboardToolbarPlacement = ${dartString(editor.mobile.toolbar.placementWhenKeyboardVisible)};
  static const String primaryLayout = ${dartString(editor.mobile.toolbar.primaryLayout)};
  static const String horizontalOverflow = ${dartString(editor.mobile.toolbar.horizontalOverflow)};
  static const String morePresentation = ${dartString(editor.mobile.toolbar.morePresentation)};
  static const List<String> moreInline = <String>${dartList(editor.mobile.moreInline)};
  static const List<String> contextual = <String>${dartList(editor.mobile.contextual)};
  static const List<String> syntaxOnly = <String>${dartList(editor.syntaxOnly)};
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

for (const glyphId of glyphIds) {
  write(`packages/flutter/icons/${glyphId}.svg`, glyphSvgs[glyphId]);
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

  static String assetName(String semanticId) {
    final glyph = glyphs[semanticId];
    if (glyph == null) throw ArgumentError.value(semanticId, 'semanticId', 'Unknown Wenyou icon semantic');
    return 'icons/\$glyph.svg';
  }
}

class WenyouIcon extends StatelessWidget {
  const WenyouIcon(
    this.semanticId, {
    this.size = WenyouIconContract.defaultSize,
    this.color,
    this.semanticLabel,
    super.key,
  });

  final String semanticId;
  final double size;
  final Color? color;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final resolvedColor = color ?? IconTheme.of(context).color ?? DefaultTextStyle.of(context).style.color;
    final picture = SvgPicture.asset(
      WenyouIconContract.assetName(semanticId),
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
  ...["icons", "editor", "images", "collections", "notifications", "typography", "interaction", "navigation", "language"]
    .flatMap((name) => [`dist/${name}.js`, `dist/${name}.d.ts`]),
  "web/tokens.css",
  "web/fonts.css",
  "packages/flutter/lib/src/foundation_tokens.dart",
  "packages/flutter/lib/src/wenyou_icons.dart",
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
    navigation: true,
    language: true,
  },
  artifactSha256,
  icons: {
    family: icons.source.family,
    version: icons.source.version,
    license: icons.source.license,
    glyphSha256,
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
