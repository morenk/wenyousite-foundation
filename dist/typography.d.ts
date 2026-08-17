/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export type TypographyRoleId = "pageTitle" | "sectionTitle" | "subsectionTitle" | "body" | "compactBody" | "label" | "caption" | "reading";
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
export declare const TYPOGRAPHY_USAGE: Readonly<{"displayContexts":["brand","page-title","section-title","detail-content-title","text-cover-title"],"bodySemiboldContexts":["list-item-title","dialog-title","sheet-title","popover-title","state-title"],"bodyOnlyContexts":["control","navigation","username","rich-text-heading"],"utilityContexts":["numeric","time","counter"],"displayWeight":500,"listTitleWeight":600}>;
export declare const WEB_TYPE_SCALE: Readonly<Record<TypographyRoleId, TypographyStyleContract>>;
export declare const MOBILE_TYPE_SCALE: Readonly<Record<TypographyRoleId, TypographyStyleContract>>;
