# -*- coding: utf-8 -*-
"""
定期テスト対策ワーク 中1〜中3理科: 元フォルダの表紙画像をコピーし、
ポータル用サムネ（cover jpg）と PWA アイコン PNG を生成する。

  pip install pillow

各フォルダ内の *.jpg（スキャン表紙）を 1 枚想定。複数ある場合は名前順で先頭。
"""
from __future__ import annotations

import shutil
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow が必要です: pip install pillow", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent
ICONS_DIR = ROOT / "icons"
IMAGES_DIR = ROOT / "images"
ICON_SIZES = (32, 180, 192, 512)

BOOKS = (
    {
        "book_id": "jhs_teiki_science1",
        "src_dir": Path(r"D:\Files\(2025)定期テスト対策ワーク\中1理科"),
    },
    {
        "book_id": "jhs_teiki_science2",
        "src_dir": Path(r"D:\Files\(2025)定期テスト対策ワーク\中2理科"),
    },
    {
        "book_id": "jhs_teiki_science3",
        "src_dir": Path(r"D:\Files\(2025)定期テスト対策ワーク\中3理科"),
    },
)


def find_cover_jpg(src_dir: Path) -> Path | None:
    if not src_dir.is_dir():
        return None
    jpgs = sorted(src_dir.glob("*.jpg")) + sorted(src_dir.glob("*.jpeg"))
    jpgs = [p for p in jpgs if p.is_file()]
    return jpgs[0] if jpgs else None


def square_thumbnail(im: Image.Image, size: int) -> Image.Image:
    im = im.convert("RGB")
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    im = im.crop((left, top, left + side, top + side))
    return im.resize((size, size), Image.Resampling.LANCZOS)


def main() -> int:
    ICONS_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    for spec in BOOKS:
        bid = spec["book_id"]
        src_dir = spec["src_dir"]
        src = find_cover_jpg(src_dir)
        if not src:
            print(f"スキップ（表紙 JPG なし）: {src_dir}", file=sys.stderr)
            continue

        cover_out = IMAGES_DIR / f"{bid}_cover.jpg"
        shutil.copy2(src, cover_out)
        print(f"表紙（サムネ）: {cover_out} <= {src.name}")

        base = Image.open(cover_out)
        for sz in ICON_SIZES:
            thumb = square_thumbnail(base, sz)
            icon_path = ICONS_DIR / f"{bid}_{sz}.png"
            thumb.save(icon_path, "PNG", optimize=True)
            print(f"  icon {sz}px -> {icon_path.name}")

    print("完了。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
