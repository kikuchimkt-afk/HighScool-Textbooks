"""
iワーク 中1〜中3 理科: 本冊PDFの1ページ目を表紙（.jpg）と page_0001.png に書き出す。
ファビコン／PWA用アイコンは表紙画像の上半分をトリミングしてから正方形にフィットする（数学と同様）。

Requires: PyMuPDF (fitz), Pillow

既定の PDF フォルダ（各フォルダに「中N理科.pdf」がある想定）:
  D:\\Files\\(2025)iワーク\\中1理科
  D:\\Files\\(2025)iワーク\\中2理科
  D:\\Files\\(2025)iワーク\\中3理科

上書き: 環境変数 JHS_SCIENCE1_PDF_DIR / JHS_SCIENCE2_PDF_DIR / JHS_SCIENCE3_PDF_DIR

使い方:
  python _gen_jhs_iwork_science_cover_and_icons.py          # 3冊まとめて（PDF があるものだけ）
  python _gen_jhs_iwork_science_cover_and_icons.py --grade 2  # 中2のみ
"""
from __future__ import annotations

import argparse
import io
import os
import sys
from pathlib import Path
from typing import TypedDict

import fitz
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
ZOOM = 2.0
SIZES = (32, 180, 192, 512)
DEFAULT_BASE = Path(r"D:\Files\(2025)iワーク")


class BookCfg(TypedDict):
    grade: int
    pdf_subdir: str
    pdf_name: str
    image_subdir: str
    cover_filename: str
    icon_prefix: str


BOOKS: list[BookCfg] = [
    {
        "grade": 1,
        "pdf_subdir": "中1理科",
        "pdf_name": "中1理科.pdf",
        "image_subdir": "jhs_iwork_science1",
        "cover_filename": "jhs_iwork_science1_cover.jpg",
        "icon_prefix": "jhs_iwork_science1",
    },
    {
        "grade": 2,
        "pdf_subdir": "中2理科",
        "pdf_name": "中2理科.pdf",
        "image_subdir": "jhs_iwork_science2",
        "cover_filename": "jhs_iwork_science2_cover.jpg",
        "icon_prefix": "jhs_iwork_science2",
    },
    {
        "grade": 3,
        "pdf_subdir": "中3理科",
        "pdf_name": "中3理科.pdf",
        "image_subdir": "jhs_iwork_science3",
        "cover_filename": "jhs_iwork_science3_cover.jpg",
        "icon_prefix": "jhs_iwork_science3",
    },
]


def env_pdf_dir(grade: int) -> Path | None:
    key = f"JHS_SCIENCE{grade}_PDF_DIR"
    v = os.environ.get(key)
    return Path(v) if v else None


def pdf_path(cfg: BookCfg) -> Path:
    d = env_pdf_dir(cfg["grade"])
    if d is None:
        d = DEFAULT_BASE / cfg["pdf_subdir"]
    return d / cfg["pdf_name"]


def render_page0_pil(path: Path) -> Image.Image:
    doc = fitz.open(path)
    try:
        mat = fitz.Matrix(ZOOM, ZOOM)
        page = doc.load_page(0)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        return Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
    finally:
        doc.close()


def write_icons_from_upper_half(im_rgb: Image.Image, icon_prefix: str) -> None:
    w, h = im_rgb.size
    top = im_rgb.crop((0, 0, w, max(1, h // 2)))
    icon_dir = ROOT / "icons"
    icon_dir.mkdir(parents=True, exist_ok=True)
    for size in SIZES:
        thumb = ImageOps.fit(top, (size, size), method=Image.Resampling.LANCZOS)
        out = icon_dir / f"{icon_prefix}_{size}.png"
        thumb.save(out, format="PNG", optimize=True)
        print(out)


def process_book(cfg: BookCfg) -> None:
    pdf = pdf_path(cfg)
    if not pdf.is_file():
        print(f"Skip (missing PDF): {pdf}", file=sys.stderr)
        return

    im = render_page0_pil(pdf)

    cover_path = ROOT / "images" / cfg["cover_filename"]
    cover_path.parent.mkdir(parents=True, exist_ok=True)
    im.save(cover_path, format="JPEG", quality=95, optimize=True)
    print(cover_path)

    page1 = ROOT / "images" / cfg["image_subdir"] / "page_0001.png"
    page1.parent.mkdir(parents=True, exist_ok=True)
    im.save(page1, format="PNG", optimize=True)
    print(page1)

    write_icons_from_upper_half(im, cfg["icon_prefix"])
    print(f"Done: 中{cfg['grade']}理科 (cover + page_0001 + icons)")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--grade",
        type=int,
        choices=(1, 2, 3),
        default=None,
        help="中1〜中3 のいずれかだけ処理（省略時は3冊とも試行）",
    )
    args = ap.parse_args()
    cfgs = [b for b in BOOKS if args.grade is None or b["grade"] == args.grade]
    for cfg in cfgs:
        process_book(cfg)


if __name__ == "__main__":
    main()
