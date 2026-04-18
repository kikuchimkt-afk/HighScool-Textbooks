# -*- coding: utf-8 -*-
"""
定期テスト対策ワーク 中3理科 — PDF をビューア用 PNG にレンダリングする。

既定ソース: D:\\Files\\(2025)定期テスト対策ワーク\\中3理科 内の最新 .pdf
出力: images/jhs_teiki_science3/page_0001.png …

  pip install pymupdf pillow

*本文.pdf を優先。表紙・サムネ・アイコンは _sync_jhs_teiki_covers_and_icons.py を実行。
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
DEFAULT_SRC_DIR = Path(r"D:\Files\(2025)定期テスト対策ワーク\中3理科")
OUT_DIR = ROOT / "images" / "jhs_teiki_science3"
ZOOM = 2.0


def pick_pdf(src_dir: Path):
    if not src_dir.is_dir():
        return None
    preferred = [p for p in src_dir.glob("*.pdf") if "本文" in p.name]
    if preferred:
        return sorted(preferred, key=lambda p: p.stat().st_mtime, reverse=True)[0]
    pdfs = sorted(src_dir.glob("*.pdf"), key=lambda p: p.stat().st_mtime, reverse=True)
    return pdfs[0] if pdfs else None


def main() -> int:
    src_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC_DIR
    pdf_path = pick_pdf(src_dir)
    if not pdf_path:
        print(f"PDF が見つかりません: {src_dir}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path.as_posix())
    n = doc.page_count
    mat = fitz.Matrix(ZOOM, ZOOM)
    for i in range(n):
        pix = doc.load_page(i).get_pixmap(matrix=mat, alpha=False)
        pix.save((OUT_DIR / f"page_{i + 1:04d}.png").as_posix())
    doc.close()
    print(f"Wrote {n} pages -> {OUT_DIR}")
    print(f"totalPages を {n} に設定: js/jhs_data.js の jhs_teiki_science3")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
