# -*- coding: utf-8 -*-
"""
iワーク 中2英語 — 4 つの PDF を結合してビューア用 PNG にレンダリングする。

既定ソース: D:\\Files\\(2025)iワーク\\中2英語

  本冊         中2英簿.pdf                    176 pp → page_0001 〜 page_0176
  解答解説      中2英語_解答解説.pdf            89 pp → page_0177 〜 page_0265
  プラス        中2英語_プラス.pdf              72 pp → page_0266 〜 page_0337
  プラス解答    中2英語_プラス_解答解説.pdf      34 pp → page_0338 〜 page_0371

  ※ 本冊は「中2英簿.pdf」という名称（元ファイルのまま）

  pip install pymupdf pillow
"""
from __future__ import annotations

import sys
from pathlib import Path

try:
    import fitz
except ImportError:
    print("PyMuPDF が必要です: pip install pymupdf", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent
DEFAULT_SRC_DIR = Path(r"D:\Files\(2025)iワーク\中2英語")
OUT_DIR = ROOT / "images" / "jhs_iwork_english2"
ZOOM = 2.0

PDF_ORDER = [
    "中2英簿.pdf",
    "中2英語_解答解説.pdf",
    "中2英語_プラス.pdf",
    "中2英語_プラス_解答解説.pdf",
]


def main() -> int:
    src_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC_DIR
    if not src_dir.is_dir():
        print(f"フォルダが見つかりません: {src_dir}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    mat = fitz.Matrix(ZOOM, ZOOM)

    global_page = 0
    for pdf_name in PDF_ORDER:
        pdf_path = src_dir / pdf_name
        if not pdf_path.exists():
            print(f"  スキップ（見つからない）: {pdf_name}", file=sys.stderr)
            continue
        doc = fitz.open(str(pdf_path))
        n = doc.page_count
        print(f"  {pdf_name}: {n} pages -> page_{global_page+1:04d} 〜 page_{global_page+n:04d}")
        for i in range(n):
            global_page += 1
            pix = doc.load_page(i).get_pixmap(matrix=mat, alpha=False)
            pix.save(str(OUT_DIR / f"page_{global_page:04d}.png"))
        doc.close()

    print(f"\n合計 {global_page} pages -> {OUT_DIR}")
    print(f"totalPages を {global_page} に設定: js/jhs_data.js の jhs_iwork_english2")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
