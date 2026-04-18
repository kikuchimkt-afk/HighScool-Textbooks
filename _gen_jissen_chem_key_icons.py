# -*- coding: utf-8 -*-
"""実戦化学の表紙画像（上半分トリミング）から PWA / ファビコン用アイコンを生成する。"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
DEFAULT_SRC = Path(r"D:\Files\(2025版)実戦化学重要問題集\61Fdxds4SWL._SL1376_.jpg")
OUT_DIR = ROOT / "icons"
PREFIX = "jissen_chem_key"
SIZES = (32, 180, 192, 512)


def main() -> int:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC
    if not src.is_file():
        print(f"Source not found: {src}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    im = Image.open(src)
    im = ImageOps.exif_transpose(im)
    im = im.convert("RGB")

    w, h = im.size
    upper = im.crop((0, 0, w, h // 2))

    for size in SIZES:
        thumb = ImageOps.fit(
            upper, (size, size), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5)
        )
        dest = OUT_DIR / f"{PREFIX}_{size}.png"
        thumb.save(dest, format="PNG", optimize=True)
        print(dest)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
