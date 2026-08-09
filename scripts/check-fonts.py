from pathlib import Path

from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parent.parent
SAMPLE = set("温油站主题正文创作骰子列表消息注册登录")


def codepoints(font: TTFont) -> set[int]:
    result: set[int] = set()
    for table in font["cmap"].tables:
        result.update(table.cmap)
    return result


fonts = {
    "Noto Sans SC": ROOT / "packages/flutter/lib/fonts/NotoSansSC-Variable.ttf",
    "LXGW WenKai": ROOT / "packages/flutter/lib/fonts/LXGWWenKaiLite-Medium.ttf",
    "Nunito": ROOT / "packages/flutter/lib/fonts/Nunito-Variable.ttf",
    "LXGW WenKai Web": ROOT / "web/fonts/LXGWWenKaiLite-Medium.woff2",
}

for name, path in fonts.items():
    font = TTFont(path)
    if name != "Nunito":
        missing = sorted(
            character for character in SAMPLE if ord(character) not in codepoints(font)
        )
        if missing:
            raise SystemExit(f"{name} 缺少代表性中文字形：{''.join(missing)}")
    if name in {"Noto Sans SC", "Nunito"} and "fvar" not in font:
        raise SystemExit(f"{name} 必须保留可变字体轴")

print("Font assets contain expected Chinese glyphs and variable axes")

