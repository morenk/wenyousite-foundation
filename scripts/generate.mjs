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

const editor = contract.experiences.editor;
const images = contract.experiences.images;
const collections = contract.experiences.collections;
write("dist/editor.js", `/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const FOUNDATION_VERSION = ${JSON.stringify(contract.version)};
export const EDITOR_CAPABILITY_LABELS = Object.freeze(${js(editor.labels)});
export const EDITOR_PRIMARY_NARROW = Object.freeze(${js(editor.web.collapsedPrimary)});
export const EDITOR_PRIMARY_WIDE = Object.freeze(${js(editor.web.widePrimary)});
export const EDITOR_MORE_FALLBACK = Object.freeze(${js(editor.web.moreFallback)});
export const EDITOR_MORE_PROGRESSIVE = Object.freeze(${js(editor.web.progressiveCollapse)});
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
  --sticker-display-max: 8rem;
  --wenyou-shadow-popover: 0 12px 32px rgb(52 47 62 / 12%);
  --wenyou-shadow-dialog: 0 24px 64px rgb(52 47 62 / 16%);
  --wenyou-shadow-floating: 0 10px 28px rgb(52 47 62 / 14%);
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
}

abstract final class WenyouCollectionContract {
  static const bool fillAvailableWidth = ${collections.invariants.itemWidth === "available"};
  static const bool narrowContentKeepsItemWidth = ${collections.invariants.narrowContentDoesNotChangeItemWidth};
  static const Set<String> contentSizedExceptions = <String>{${collections.invariants.contentSizedExceptions.map(dartString).join(", ")}};
}

abstract final class WenyouEditorContract {
  static const Map<String, String> labels = <String, String>{
${labelEntries}
  };
  static const List<String> primary = <String>${dartList(editor.mobile.primary)};
  static const List<String> wideAdditions = <String>${dartList(editor.mobile.wideAdditions)};
  static const List<String> moreSheet = <String>${dartList(editor.mobile.moreSheet)};
  static const List<String> syntaxOnly = <String>${dartList(editor.syntaxOnly)};
  static const List<int> creatableHeadingLevels = <int>${dartList(editor.creatableHeadingLevels, String)};
}

abstract final class WenyouImageContract {
  static const Map<String, String> roleFits = <String, String>{
${Object.entries(images.roles).map(([role, value]) => `    ${dartString(role)}: ${dartString(value.fit)},`).join("\n")}
  };
  static const Set<String> cropAllowed = <String>{${Object.entries(images.roles).filter(([, value]) => value.crop === "allowed").map(([role]) => dartString(role)).join(", ")}};
  static const List<String> states = <String>${dartList(images.states)};
  static const double stickerDisplayMax = ${images.mobile.stickerDisplayMaxDp}.0;
}`);

const manifest = JSON.stringify({
  version: contract.version,
  schemaVersion: contract.schemaVersion,
  contract: "contracts/foundation.v1.json",
  contractSha256,
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
write("packages/flutter/LICENSE", flutterLicense);

if (!checkOnly) console.log(`Generated foundation ${contract.version} artifacts`);
