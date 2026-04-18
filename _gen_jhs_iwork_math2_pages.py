"""
Render iワーク 中2数学 PDFs to images/jhs_iwork_math2/page_0001.png … page_0473.png
matching js/jhs_data.js (cover 1, main 2–233, main_answers 234–353, plus 354–430, plus_answers 431–473).

Requires: PyMuPDF (fitz), Pillow

Default PDF source: D:\\Files\\(2025)iワーク\\中2数学\\
Override: set JHS_MATH2_PDF_DIR to the folder containing the four PDFs.

表紙・ファビコンを PDF 先頭ページから揃える: _gen_jhs_iwork_math2_cover_and_icons.py を先に実行し、
images/jhs_iwork_math2_cover.png と page_0001.png・icons を更新してから本スクリプトを回す。
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "images" / "jhs_iwork_math2"
DEFAULT_PDF_DIR = Path(r"D:\Files\(2025)iワーク\中2数学")

PDF_NAMES = (
    ("中2数学.pdf", 2),  # 232 pages → global 2–233
    ("中2数学_解答解説.pdf", 234),  # 120 pages
    ("中2数学_プラス.pdf", 354),  # 77 pages
    ("中2数学_プラス_解答解説.pdf", 431),  # 43 pages
)

COVER_SRC = ROOT / "images" / "jhs_iwork_math2_cover.png"
ZOOM = 2.0


def main() -> None:
    pdf_dir = Path(os.environ.get("JHS_MATH2_PDF_DIR", str(DEFAULT_PDF_DIR)))
    if not pdf_dir.is_dir():
        raise SystemExit(f"PDF folder not found: {pdf_dir}")

    OUT.mkdir(parents=True, exist_ok=True)

    main_path = pdf_dir / PDF_NAMES[0][0]
    if not main_path.is_file():
        raise SystemExit(f"Missing: {main_path}")

    main_doc = fitz.open(main_path)
    try:
        mat = fitz.Matrix(ZOOM, ZOOM)
        p0 = main_doc.load_page(0)
        pix0 = p0.get_pixmap(matrix=mat, alpha=False)
        target_w = pix0.width
    finally:
        main_doc.close()

    # p.1 表紙: リポジトリのカバー画像を、本冊1ページ目と同じ幅に合わせる
    if not COVER_SRC.is_file():
        raise SystemExit(f"Missing cover image: {COVER_SRC}")
    cov = Image.open(COVER_SRC).convert("RGB")
    ratio = target_w / cov.width
    new_h = max(1, int(cov.height * ratio))
    cov_r = cov.resize((target_w, new_h), Image.Resampling.LANCZOS)
    out1 = OUT / "page_0001.png"
    cov_r.save(out1, format="PNG", optimize=True)
    print(out1)

    total = 0
    for filename, start_global in PDF_NAMES:
        path = pdf_dir / filename
        if not path.is_file():
            raise SystemExit(f"Missing PDF: {path}")
        doc = fitz.open(path)
        try:
            n = doc.page_count
            for i in range(n):
                g = start_global + i
                page = doc.load_page(i)
                pix = page.get_pixmap(matrix=mat, alpha=False)
                dest = OUT / f"page_{g:04d}.png"
                pix.save(dest)
                total += 1
                if total % 50 == 0:
                    print(f"  … {total} pages written ({dest.name})", flush=True)
        finally:
            doc.close()
        print(f"{filename}: {n} pages → global {start_global}–{start_global + n - 1}")

    expected = 473
    existing = len(list(OUT.glob("page_*.png")))
    if existing != expected:
        print(f"Warning: expected {expected} PNG files, found {existing}", file=sys.stderr)
    else:
        print(f"Done: {existing} files in {OUT}")


if __name__ == "__main__":
    main()
