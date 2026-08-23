import path from "node:path";
import { fileURLToPath } from "node:url";
import * as fontkit from "fontkit";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sample = [..."温油站主题正文创作骰子列表消息注册登录"];
const fonts = new Map([
  ["Noto Sans SC", "packages/flutter/lib/fonts/NotoSansSC-Variable.ttf"],
  ["LXGW WenKai", "packages/flutter/lib/fonts/LXGWWenKaiLite-Medium.ttf"],
  ["Nunito", "packages/flutter/lib/fonts/Nunito-Variable.ttf"],
  ["LXGW WenKai Web", "web/fonts/LXGWWenKaiLite-Medium.woff2"],
]);

for (const [name, relativePath] of fonts) {
  const font = fontkit.openSync(path.join(root, relativePath));
  if (name !== "Nunito") {
    const missing = sample.filter((character) => !font.hasGlyphForCodePoint(character.codePointAt(0)));
    if (missing.length > 0) throw new Error(`${name} 缺少代表性中文字形：${missing.join("")}`);
  }
  if (["Noto Sans SC", "Nunito"].includes(name) && Object.keys(font.variationAxes ?? {}).length === 0) {
    throw new Error(`${name} 必须保留可变字体轴`);
  }
}

console.log("Font assets contain expected Chinese glyphs and variable axes");
