/** 由 contracts/foundation.v1.json 生成，禁止手改。 */
export const FOUNDATION_VERSION = "1.0.1";
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
  "task-list": "任务列表",
  "code-block": "代码块",
  "table": "表格"
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
export const EDITOR_SYNTAX_ONLY = Object.freeze([
  "task-list",
  "code-block",
  "table"
]);
export const EDITOR_CREATABLE_HEADING_LEVELS = Object.freeze([
  2,
  3
]);
export function editorCapabilityLabels(ids) {
  return ids.map((id) => EDITOR_CAPABILITY_LABELS[id]);
}
