"""
中3数学: 本冊PDFの1ページ目を表紙として書き出し、page_0001 と一致させる。
ファビコン／PWA用アイコンは表紙の上半分をトリミングしてから正方形にフィットする。

Requires: PyMuPDF (fitz), Pillow

PDF: JHS_MATH3_PDF_DIR または既定 D:\\Files\\(2025)iワーク\\中3数学\\中3数学.pdf
"""
from __future__ import annotations

import os
import shutil
from pathlib import Path

import fitz
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
PDF_DIR = Path(os.environ.get("JHS_MATH3_PDF_DIR", r"D:\Files\(2025)iワーク\中3数学"))
MAIN_PDF = PDF_DIR / "中3数学.pdf"
COVER_OUT = ROOT / "images" / "jhs_iwork_math3_cover.png"
PAGE1_OUT = ROOT / "images" / "jhs_iwork_math3" / "page_0001.png"
ICON_DIR = ROOT / "icons"
ICON_PREFIX = "jhs_iwork_math3"
ZOOM = 2.0
SIZES = (32, 180, 192, 512)


def render_main_pdf_page0_png(dest: Path) -> tuple[int, int]:
    """本冊PDFの先頭ページを PNG で保存。返り値は (width, height)。"""
    if not MAIN_PDF.is_file():
        raise SystemExit(f"Missing PDF: {MAIN_PDF}")
    dest.parent.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(MAIN_PDF)
    try:
        mat = fitz.Matrix(ZOOM, ZOOM)
        page = doc.load_page(0)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        pix.save(str(dest))
        return pix.width, pix.height
    finally:
        doc.close()


def write_icons_from_cover_upper_half(cover_path: Path) -> None:
    im = Image.open(cover_path).convert("RGB")
    w, h = im.size
    top = im.crop((0, 0, w, max(1, h // 2)))
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    for size in SIZES:
        thumb = ImageOps.fit(top, (size, size), method=Image.Resampling.LANCZOS)
        out = ICON_DIR / f"{ICON_PREFIX}_{size}.png"
        thumb.save(out, format="PNG", optimize=True)
        print(out)


def main() -> None:
    if not PDF_DIR.is_dir():
        raise SystemExit(f"PDF folder not found: {PDF_DIR}")

    render_main_pdf_page0_png(COVER_OUT)
    print(COVER_OUT)

    PAGE1_OUT.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(COVER_OUT, PAGE1_OUT)
    print(PAGE1_OUT)

    write_icons_from_cover_upper_half(COVER_OUT)
    print("Done: cover + page_0001 + icons (upper-half crop → square fit)")


if __name__ == "__main__":
    main()
