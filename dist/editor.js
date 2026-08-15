/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const FOUNDATION_VERSION = "3.0.1";
export const EDITOR_CAPABILITY_LABELS = Object.freeze({
  "heading": "正文样式",
  "bold": "粗体",
  "italic": "斜体",
  "strikethrough": "删除线",
  "image": "图片",
  "draft": "正文草稿",
  "more": "更多",
  "link": "链接",
  "inline-code": "行内代码",
  "quote": "引用",
  "bullet-list": "无序列表",
  "ordered-list": "有序列表",
  "hr": "分隔线",
  "dice": "骰子",
  "mention": "提及",
  "sticker": "表情包"
});
export const EDITOR_PRIMARY_NARROW = Object.freeze([
  "heading",
  "bold",
  "italic",
  "image",
  "more"
]);
export const EDITOR_PRIMARY_WIDE = Object.freeze([
  "heading",
  "bold",
  "italic",
  "strikethrough",
  "inline-code",
  "bullet-list",
  "ordered-list",
  "link",
  "image",
  "quote",
  "hr",
  "dice",
  "draft"
]);
export const EDITOR_MORE_FALLBACK = Object.freeze([
  "link",
  "inline-code",
  "quote",
  "bullet-list",
  "ordered-list",
  "hr",
  "dice"
]);
export const EDITOR_MORE_PROGRESSIVE = Object.freeze([
  "draft",
  "strikethrough"
]);
export const EDITOR_DENSITY_ORDER = Object.freeze([
  "expanded",
  "with-more",
  "without-draft",
  "compact"
]);
export const EDITOR_PRIMARY_BY_DENSITY = Object.freeze({
  "expanded": [
    "heading",
    "bold",
    "italic",
    "strikethrough",
    "inline-code",
    "bullet-list",
    "ordered-list",
    "link",
    "image",
    "quote",
    "hr",
    "dice",
    "draft"
  ],
  "with-more": [
    "heading",
    "bold",
    "italic",
    "strikethrough",
    "link",
    "image",
    "quote",
    "hr",
    "dice",
    "draft",
    "more"
  ],
  "without-draft": [
    "heading",
    "bold",
    "italic",
    "strikethrough",
    "link",
    "image",
    "quote",
    "hr",
    "dice",
    "more"
  ],
  "compact": [
    "heading",
    "bold",
    "italic",
    "image",
    "more"
  ]
});
export const EDITOR_MORE_BY_DENSITY = Object.freeze({
  "expanded": [],
  "with-more": [
    "inline-code",
    "bullet-list",
    "ordered-list"
  ],
  "without-draft": [
    "inline-code",
    "bullet-list",
    "ordered-list",
    "draft"
  ],
  "compact": [
    "strikethrough",
    "link",
    "inline-code",
    "quote",
    "bullet-list",
    "ordered-list",
    "hr",
    "dice",
    "draft"
  ]
});
export const EDITOR_CONTEXTUAL_WEB = Object.freeze([
  "mention",
  "sticker"
]);
export const EDITOR_CONTEXTUAL_MOBILE = Object.freeze([
  "mention",
  "sticker"
]);
export const EDITOR_INVARIANTS = Object.freeze({
  "storageContractOwner": "backend-markdown-contract",
  "unsupportedMarkdown": "literal-text-client-reject-api",
  "unknownProtocol": "literal-text-client-reject-api",
  "editRenderTypography": "equivalent",
  "clipboardIdentityOwner": "backend-node-contract"
});
export const EDITOR_CONTENT_POLICY = Object.freeze({
  "markdownContractVersion": 3,
  "structuredCapabilitySource": "toolbar",
  "unsupportedClientBehavior": "literal-text-silent",
  "unsupportedApiBehavior": "reject",
  "maximumListDepth": 3
});
export const EDITOR_WEB_LAYOUT = Object.freeze({
  "frameMaxRem": 50,
  "textMeasurePx": 680,
  "contentInlinePaddingPx": 24,
  "toolbarInlinePaddingPx": 12,
  "firstControlInternalInsetPx": 12,
  "bodyPx": 17,
  "lineHeight": 1.9
});
export const EDITOR_MOBILE_LAYOUT = Object.freeze({
  "compactContentInlinePaddingDp": 4,
  "regularContentInlinePaddingDp": 16,
  "toolbarHorizontalPaddingDp": 4,
  "minimumActionExtentDp": 48,
  "bodySp": 17,
  "lineHeight": 1.8,
  "respectsSystemTextScale": true
});
export const EDITOR_MOBILE_SURFACES = Object.freeze([
  "page",
  "expandableSheet",
  "inline"
]);
export const EDITOR_MOBILE_TOOLBAR = Object.freeze({
  "placementWhenKeyboardVisible": "above-keyboard-dock",
  "primaryLayout": "responsive-single-row",
  "horizontalOverflow": "forbidden",
  "morePresentation": "inline"
});
export const EDITOR_MOBILE_MORE_INLINE = Object.freeze([
  "link",
  "inline-code",
  "quote",
  "bullet-list",
  "ordered-list",
  "hr",
  "dice",
  "sticker",
  "draft",
  "strikethrough"
]);
export const EDITOR_WEB_CAPABILITIES = Object.freeze({
  "heading": {
    "creation": "primary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "bold": {
    "creation": "primary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "italic": {
    "creation": "primary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "strikethrough": {
    "creation": "primary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "image": {
    "creation": "primary",
    "editing": "atomic",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "draft": {
    "creation": "secondary",
    "editing": "ui-only",
    "rendering": "not-applicable",
    "roundTrip": "not-applicable"
  },
  "more": {
    "creation": "primary",
    "editing": "ui-only",
    "rendering": "not-applicable",
    "roundTrip": "not-applicable"
  },
  "link": {
    "creation": "primary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "inline-code": {
    "creation": "primary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "quote": {
    "creation": "primary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "bullet-list": {
    "creation": "primary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "ordered-list": {
    "creation": "primary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "hr": {
    "creation": "primary",
    "editing": "atomic",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "dice": {
    "creation": "primary",
    "editing": "atomic",
    "rendering": "native",
    "roundTrip": "identity-preserving"
  },
  "mention": {
    "creation": "contextual",
    "editing": "atomic",
    "rendering": "native",
    "roundTrip": "identity-preserving"
  },
  "sticker": {
    "creation": "contextual",
    "editing": "atomic",
    "rendering": "native",
    "roundTrip": "identity-preserving"
  }
});
export const EDITOR_MOBILE_CAPABILITIES = Object.freeze({
  "heading": {
    "creation": "primary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "bold": {
    "creation": "primary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "italic": {
    "creation": "primary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "strikethrough": {
    "creation": "secondary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "image": {
    "creation": "primary",
    "editing": "atomic",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "draft": {
    "creation": "secondary",
    "editing": "ui-only",
    "rendering": "not-applicable",
    "roundTrip": "not-applicable"
  },
  "more": {
    "creation": "primary",
    "editing": "ui-only",
    "rendering": "not-applicable",
    "roundTrip": "not-applicable"
  },
  "link": {
    "creation": "secondary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "inline-code": {
    "creation": "secondary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "quote": {
    "creation": "secondary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "bullet-list": {
    "creation": "secondary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "ordered-list": {
    "creation": "secondary",
    "editing": "structured",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "hr": {
    "creation": "secondary",
    "editing": "atomic",
    "rendering": "native",
    "roundTrip": "structured"
  },
  "dice": {
    "creation": "secondary",
    "editing": "atomic",
    "rendering": "native",
    "roundTrip": "identity-preserving"
  },
  "mention": {
    "creation": "contextual",
    "editing": "atomic",
    "rendering": "native",
    "roundTrip": "identity-preserving"
  },
  "sticker": {
    "creation": "contextual",
    "editing": "atomic",
    "rendering": "native",
    "roundTrip": "identity-preserving"
  }
});
export const EDITOR_CREATABLE_HEADING_LEVELS = Object.freeze([
  2,
  3
]);
export function editorCapabilityLabels(ids) {
  return ids.map((id) => EDITOR_CAPABILITY_LABELS[id]);
}
