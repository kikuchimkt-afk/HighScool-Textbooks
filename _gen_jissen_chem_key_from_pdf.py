# -*- coding: utf-8 -*-
"""
実戦化学重要問題集 PDF からビューア用画像を生成する。
既定ソース: D:\\Files\\(2025版)実戦化学重要問題集 内の .pdf（最新1件）
出力: images/jissen_chem_key/page_0001.png … , images/jissen_chem_key_cover.jpg（1ページ目）

使用前: pip install pymupdf pillow

生成後、PDFの実ページ数に合わせて js/hs_data.js の jissen_chem_key.totalPages を更新してください。
"""
from __future__ import annotations

import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    print("PyMuPDF が必要です: pip install pymupdf", file=sys.stderr)
    sys.exit(1)

try:
    from PIL import Image
except ImportError:
    Image = None

ROOT = Path(__file__).resolve().parent
DEFAULT_SRC_DIR = Path(r"D:\Files\(2025版)実戦化学重要問題集")
OUT_DIR = ROOT / "images" / "jissen_chem_key"
COVER_PATH = ROOT / "images" / "jissen_chem_key_cover.jpg"
ZOOM = 2.0


def pick_pdf(src_dir: Path) -> Path | None:
    if not src_dir.is_dir():
        return None
    pdfs = sorted(src_dir.glob("*.pdf"), key=lambda p: p.stat().st_mtime, reverse=True)
    return pdfs[0] if pdfs else None


def main() -> int:
    src_dir = DEFAULT_SRC_DIR
    if len(sys.argv) > 1:
        src_dir = Path(sys.argv[1])
    pdf_path = pick_pdf(src_dir)
    if not pdf_path:
        print(f"PDF が見つかりません: {src_dir}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    n = doc.page_count
    mat = fitz.Matrix(ZOOM, ZOOM)

    for i in range(n):
        page = doc.load_page(i)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        out_png = OUT_DIR / f"page_{i + 1:04d}.png"
        pix.save(out_png.as_posix())

    doc.close()
    print(f"Wrote {n} pages from {pdf_path} -> {OUT_DIR}")

    if Image is not None:
        first = OUT_DIR / "page_0001.png"
        if first.exists():
            im = Image.open(first).convert("RGB")
            im.save(COVER_PATH, quality=88)
            print(f"Cover: {COVER_PATH}")
    else:
        print("Pillow があれば表紙を jissen_chem_key_cover.jpg に保存します (pip install pillow)")

    print(f"hs_data.js の totalPages を {n} に設定してください。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
