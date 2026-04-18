"""
iワーク 中1〜中3 数学・理科: D:\\Files\\(2025)iワーク\\各フォルダ内の実物表紙スキャン（*.jpg）から
表紙画像・page_0001・icons を再生成する。

本冊PDFの1ページ目は「本書の構成」などになることがあり、従来の PDF 先頭ページ方式では
表紙にならない。そのためフォルダ内のスキャン JPG を正とする。

Requires: Pillow

既定ベース: D:\\Files\\(2025)iワーク
上書き: 環境変数 JHS_IWORK_SCAN_BASE

使い方:
  python _gen_jhs_iwork_covers_from_scans.py
  python _gen_jhs_iwork_covers_from_scans.py --only 中2数学
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path
from typing import TypedDict

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
DEFAULT_BASE = Path(os.environ.get("JHS_IWORK_SCAN_BASE", r"D:\Files\(2025)iワーク"))
SIZES = (32, 180, 192, 512)


class Book(TypedDict):
    folder: str
    cover_name: str  # under images/
    image_subdir: str
    icon_prefix: str
    cover_kind: str  # "png" | "jpg"


BOOKS: list[Book] = [
    {
        "folder": "中1数学",
        "cover_name": "jhs_iwork_math1_cover.png",
        "image_subdir": "jhs_iwork_math1",
        "icon_prefix": "jhs_iwork_math1",
        "cover_kind": "png",
    },
    {
        "folder": "中2数学",
        "cover_name": "jhs_iwork_math2_cover.png",
        "image_subdir": "jhs_iwork_math2",
        "icon_prefix": "jhs_iwork_math2",
        "cover_kind": "png",
    },
    {
        "folder": "中3数学",
        "cover_name": "jhs_iwork_math3_cover.png",
        "image_subdir": "jhs_iwork_math3",
        "icon_prefix": "jhs_iwork_math3",
        "cover_kind": "png",
    },
    {
        "folder": "中1理科",
        "cover_name": "jhs_iwork_science1_cover.jpg",
        "image_subdir": "jhs_iwork_science1",
        "icon_prefix": "jhs_iwork_science1",
        "cover_kind": "jpg",
    },
    {
        "folder": "中2理科",
        "cover_name": "jhs_iwork_science2_cover.jpg",
        "image_subdir": "jhs_iwork_science2",
        "icon_prefix": "jhs_iwork_science2",
        "cover_kind": "jpg",
    },
    {
        "folder": "中3理科",
        "cover_name": "jhs_iwork_science3_cover.jpg",
        "image_subdir": "jhs_iwork_science3",
        "icon_prefix": "jhs_iwork_science3",
        "cover_kind": "jpg",
    },
]


def find_scan_jpg(folder: Path) -> Path:
    jpgs = sorted(folder.glob("*.jpg")) + sorted(folder.glob("*.jpeg"))
    if not jpgs:
        raise FileNotFoundError(f"No .jpg in {folder}")
    if len(jpgs) == 1:
        return jpgs[0]
    # 複数ある場合は日付スキャン風ファイル名を優先
    dated = [p for p in jpgs if p.name[:2] == "20" and "_" in p.name]
    if len(dated) == 1:
        return dated[0]
    return jpgs[0]


def normalize_orientation(im: Image.Image) -> Image.Image:
    """EXIF 適用後、横長なら縦表紙向けに回転（従来 math1 調整と同様）。"""
    im = ImageOps.exif_transpose(im).convert("RGB")
    if im.width > im.height:
        im = im.rotate(90, expand=True, resample=Image.Resampling.BICUBIC)
    return im


def write_icons_upper_half(im: Image.Image, icon_prefix: str) -> None:
    w, h = im.size
    top = im.crop((0, 0, w, max(1, h // 2)))
    icon_dir = ROOT / "icons"
    icon_dir.mkdir(parents=True, exist_ok=True)
    for size in SIZES:
        thumb = ImageOps.fit(top, (size, size), method=Image.Resampling.LANCZOS)
        out = icon_dir / f"{icon_prefix}_{size}.png"
        thumb.save(out, format="PNG", optimize=True)
        print(out)


def process(book: Book, base: Path) -> None:
    folder = base / book["folder"]
    if not folder.is_dir():
        print(f"Skip (missing folder): {folder}", file=sys.stderr)
        return
    scan = find_scan_jpg(folder)
    im = normalize_orientation(Image.open(scan))

    cover_path = ROOT / "images" / book["cover_name"]
    cover_path.parent.mkdir(parents=True, exist_ok=True)
    if book["cover_kind"] == "png":
        im.save(cover_path, format="PNG", optimize=True)
    else:
        im.save(cover_path, format="JPEG", quality=95, optimize=True)
    print(cover_path)

    page1 = ROOT / "images" / book["image_subdir"] / "page_0001.png"
    page1.parent.mkdir(parents=True, exist_ok=True)
    im.save(page1, format="PNG", optimize=True)
    print(page1)

    write_icons_upper_half(im, book["icon_prefix"])
    print(f"Done: {book['folder']} ← {scan.name}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--only",
        type=str,
        default=None,
        help="フォルダ名のみ（例: 中2数学）",
    )
    args = ap.parse_args()
    base = DEFAULT_BASE
    if not base.is_dir():
        raise SystemExit(f"Scan base not found: {base}")

    books = BOOKS
    if args.only:
        books = [b for b in BOOKS if b["folder"] == args.only]
        if not books:
            raise SystemExit(f"No book matching --only {args.only!r}")

    for b in books:
        process(b, base)


if __name__ == "__main__":
    main()
