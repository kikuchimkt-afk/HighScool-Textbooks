# -*- coding: utf-8 -*-
"""
実戦化学 重要問題集 — 表紙サムネイル・ファビコン・ビューア画像を一括生成する。

  pip install pillow pymupdf

例（既定パス）:
  python _workflow_jissen_chem_key_assets.py

  python _workflow_jissen_chem_key_assets.py --source-dir "D:\\Files\\(2025版)実戦化学重要問題集"

  python _workflow_jissen_chem_key_assets.py --skip-pdf
  python _workflow_jissen_chem_key_assets.py --product-only

処理内容:
  1) 商品写真 JPG（既定: 61Fdxds4SWL._SL1376_.jpg）
     - 全体を EXIF 補正のうえ images/jissen_chem_key_cover.jpg に保存（LP・目次のサムネイル）
     - 上半分を切り出して icons/jissen_chem_key_{32,180,192,512}.png（ファビコン・PWA）
  2) フォルダ内の最新 PDF（任意）
     - images/jissen_chem_key/page_0001.png … を出力
     - 表紙 JPG は 1) で既に書いた場合は上書きしない
  3) --patch-sources 指定時: js/hs_data.js の totalPages と jissen_chem_key_toc.html の「全Nページ」を更新
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent

DEFAULT_SOURCE_DIR = Path(r"D:\Files\(2025版)実戦化学重要問題集")
DEFAULT_PRODUCT_JPG = "61Fdxds4SWL._SL1376_.jpg"

COVER_REL = Path("images/jissen_chem_key_cover.jpg")
PAGES_DIR_REL = Path("images/jissen_chem_key")
ICONS_PREFIX = "jissen_chem_key"
ICON_SIZES = (32, 180, 192, 512)
PDF_ZOOM = 2.0


def _need_pillow():
    try:
        from PIL import Image, ImageOps  # noqa: F401
    except ImportError:
        print("Pillow が必要です: pip install pillow", file=sys.stderr)
        sys.exit(1)
    return Image, ImageOps


def _need_fitz():
    try:
        import fitz  # noqa: F401
    except ImportError:
        print("PyMuPDF が必要です: pip install pymupdf", file=sys.stderr)
        sys.exit(1)
    import fitz as fitz_mod
    return fitz_mod


def pick_pdf(src_dir: Path) -> Path | None:
    if not src_dir.is_dir():
        return None
    pdfs = sorted(src_dir.glob("*.pdf"), key=lambda p: p.stat().st_mtime, reverse=True)
    return pdfs[0] if pdfs else None


def resolve_product_jpg(source_dir: Path, filename: str) -> Path:
    return source_dir / filename


def generate_cover_and_icons_from_product(jpg_path: Path, root: Path) -> bool:
    """LP 用表紙（フル）とファビコン（上半分→正方形）。戻り値: 成功したか。"""
    Image, ImageOps = _need_pillow()
    if not jpg_path.is_file():
        print(f"[skip] 商品写真が見つかりません: {jpg_path}")
        return False

    im = Image.open(jpg_path)
    im = ImageOps.exif_transpose(im).convert("RGB")

    cover_path = root / COVER_REL
    cover_path.parent.mkdir(parents=True, exist_ok=True)
    im.save(cover_path, format="JPEG", quality=90, optimize=True)
    print(f"[ok] サムネイル（表紙・フル）: {cover_path}")

    w, h = im.size
    upper = im.crop((0, 0, w, h // 2))
    out_icons = root / "icons"
    out_icons.mkdir(parents=True, exist_ok=True)
    for size in ICON_SIZES:
        thumb = ImageOps.fit(
            upper, (size, size), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5)
        )
        dest = out_icons / f"{ICONS_PREFIX}_{size}.png"
        thumb.save(dest, format="PNG", optimize=True)
        print(f"[ok] ファビコン / PWA: {dest}")

    return True


def render_pdf_pages(pdf_path: Path, root: Path) -> int:
    fitz = _need_fitz()
    out_dir = root / PAGES_DIR_REL
    out_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path.as_posix())
    n = doc.page_count
    mat = fitz.Matrix(PDF_ZOOM, PDF_ZOOM)
    for i in range(n):
        page = doc.load_page(i)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        pix.save((out_dir / f"page_{i + 1:04d}.png").as_posix())
    doc.close()
    print(f"[ok] ビューア画像 {n} ページ: {out_dir} ← {pdf_path.name}")
    return n


def patch_hs_data_total_pages(root: Path, total_pages: int) -> bool:
    path = root / "js" / "hs_data.js"
    if not path.is_file():
        print(f"[warn] {path} がありません", file=sys.stderr)
        return False
    text = path.read_text(encoding="utf-8")
    pattern = (
        r'(jissen_chem_key:\s*\{\s*\n\s*id:\s*"jissen_chem_key",\s*\n'
        r'\s*title:\s*"実戦化学 重要問題集",\s*\n\s*totalPages:\s*)\d+'
    )
    new_text, n = re.subn(pattern, r"\g<1>" + str(total_pages), text, count=1)
    if n != 1:
        print("[warn] hs_data.js の jissen_chem_key.totalPages を置換できませんでした", file=sys.stderr)
        return False
    path.write_text(new_text, encoding="utf-8")
    print(f"[ok] js/hs_data.js totalPages = {total_pages}")
    return True


def patch_toc_page_line(root: Path, total_pages: int) -> bool:
    path = root / "jissen_chem_key_toc.html"
    if not path.is_file():
        print(f"[warn] {path} がありません", file=sys.stderr)
        return False
    text = path.read_text(encoding="utf-8")
    new_text, n = re.subn(r"全\d+ページ", f"全{total_pages}ページ", text, count=1)
    if n != 1:
        print("[warn] jissen_chem_key_toc.html の「全Nページ」を置換できませんでした", file=sys.stderr)
        return False
    path.write_text(new_text, encoding="utf-8")
    print(f"[ok] jissen_chem_key_toc.html → 全{total_pages}ページ")
    return True


def main() -> int:
    ap = argparse.ArgumentParser(description="実戦化学 重要問題集 — サムネ・ファビコン・PDF 画像の一括生成")
    ap.add_argument(
        "--source-dir",
        type=Path,
        default=DEFAULT_SOURCE_DIR,
        help=f"素材フォルダ（既定: {DEFAULT_SOURCE_DIR})",
    )
    ap.add_argument(
        "--product-jpg",
        default=DEFAULT_PRODUCT_JPG,
        help=f"商品写真ファイル名（source-dir 内、既定: {DEFAULT_PRODUCT_JPG})",
    )
    ap.add_argument("--skip-pdf", action="store_true", help="PDF からの page_*.png を生成しない")
    ap.add_argument(
        "--product-only",
        action="store_true",
        help="商品写真からの表紙・ファビコンのみ（PDF スキップと同義）",
    )
    ap.add_argument(
        "--patch-sources",
        action="store_true",
        help="PDF ページ数が分かったとき hs_data.js と toc の総ページ表記を更新（--skip-pdf 時は無効）",
    )
    args = ap.parse_args()
    if args.product_only:
        args.skip_pdf = True

    source_dir = args.source_dir
    product_path = resolve_product_jpg(source_dir, args.product_jpg)

    print("=== 1) サムネイル（表紙フル）+ ファビコン（上半分トリミング） ===")
    generate_cover_and_icons_from_product(product_path, ROOT)

    page_count: int | None = None
    if not args.skip_pdf:
        print("\n=== 2) PDF → ビューア画像 ===")
        pdf = pick_pdf(source_dir)
        if pdf:
            page_count = render_pdf_pages(pdf, ROOT)
        else:
            print(f"[skip] PDF が見つかりません: {source_dir}")

    if args.patch_sources and page_count is not None:
        print("\n=== 3) 総ページ数の反映 ===")
        patch_hs_data_total_pages(ROOT, page_count)
        patch_toc_page_line(ROOT, page_count)
    elif args.patch_sources and page_count is None:
        print("\n[skip] --patch-sources は PDF 出力が成功したときのみ有効です")

    print("\n完了。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
