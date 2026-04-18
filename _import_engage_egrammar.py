# -*- coding: utf-8 -*-
"""
英文法・語法 Engage 用: D:\\Files\\英文法_語法_Engage の PDF/JPG を
images/engage_egrammar/page_XXXX.png に連番出力し、hs_data 用の章境界を表示する。

使用: python _import_engage_egrammar.py [ソースフォルダ]
"""
from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

import fitz  # PyMuPDF

DEFAULT_SRC = Path(r"D:\Files\英文法_語法_Engage")
VIEWER_ROOT = Path(__file__).resolve().parent
OUT_DIR = VIEWER_ROOT / "images" / "engage_egrammar"
COVER_OUT = VIEWER_ROOT / "images" / "engage_egrammar_cover.jpg"
ZOOM = 2.0  # 72dpi 基準の倍率（約 144dpi）


def sort_key(path: Path) -> tuple:
    name = path.name
    lower = name.lower()
    if lower.endswith((".jpg", ".jpeg", ".png")):
        if "目次" in name:
            return (5, 99, name)
        return (0, 0, name)
    if "目次" in name and lower.endswith(".pdf"):
        return (1, 0, name)
    m = re.search(r"Feild\s*(\d+)|Field\s*(\d+)", name, re.I)
    if m:
        n = int(m.group(1) or m.group(2))
        return (2, n, name)
    return (9, 0, name)


def field_title(name: str) -> str:
    """ファイル名から章タイトル用の短いラベルを作る。"""
    base = Path(name).stem
    m = re.search(r"Feild\s*(\d+)|Field\s*(\d+)", name, re.I)
    if not m:
        return base
    n = m.group(1) or m.group(2)
    tail = re.sub(r"^.*?Feild\s*\d+\s*|^.*?Field\s*\d+\s*", "", base, flags=re.I).strip()
    tail = tail.strip(" -_　")
    if tail:
        return f"Field {n} {tail}"
    return f"Field {n}"


def page_count(path: Path) -> int:
    lower = path.suffix.lower()
    if lower in (".jpg", ".jpeg", ".png"):
        return 1
    doc = fitz.open(path)
    try:
        return len(doc)
    finally:
        doc.close()


def render_file(path: Path, global_start: int) -> int:
    """global_start は 1-based 連番の先頭。返り値は次の global ページ番号。"""
    lower = path.suffix.lower()
    mat = fitz.Matrix(ZOOM, ZOOM)
    idx = global_start

    if lower in (".jpg", ".jpeg", ".png"):
        doc = fitz.open(path)
        try:
            pix = doc[0].get_pixmap(matrix=mat, alpha=False)
            out = OUT_DIR / f"page_{idx:04d}.png"
            pix.save(out.as_posix())
            return idx + 1
        finally:
            doc.close()

    doc = fitz.open(path)
    try:
        for i in range(len(doc)):
            pix = doc.load_page(i).get_pixmap(matrix=mat, alpha=False)
            out = OUT_DIR / f"page_{idx:04d}.png"
            pix.save(out.as_posix())
            idx += 1
        return idx
    finally:
        doc.close()


def main() -> None:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC
    if not src.is_dir():
        print(f"ソースが見つかりません: {src}")
        sys.exit(1)

    files = [p for p in src.iterdir() if p.is_file() and p.suffix.lower() in (".pdf", ".jpg", ".jpeg", ".png")]
    files.sort(key=sort_key)
    if not files:
        print("PDF/JPG がありません")
        sys.exit(1)

    print("処理順:")
    for p in files:
        print(f"  {p.name} ({page_count(p)} ページ相当)")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob("page_*.png"):
        old.unlink()

    chapters: list[tuple[str, str, int, int]] = []  # id, title, start, end
    page = 1

    cover_jpgs = [p for p in files if p.suffix.lower() in (".jpg", ".jpeg", ".png") and "目次" not in p.name]
    rest = [p for p in files if p not in cover_jpgs]

    if cover_jpgs:
        cf = cover_jpgs[0]
        COVER_OUT.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(cf, COVER_OUT)
        n = render_file(cf, page)
        chapters.append(("cover", "表紙", page, n - 1))
        page = n
        rest.extend(cover_jpgs[1:])
    rest.sort(key=sort_key)

    for p in rest:
        title = field_title(p.name) if p.suffix.lower() == ".pdf" and re.search(r"Feild|Field", p.name, re.I) else Path(p.name).stem
        if "目次" in p.name and p.suffix.lower() == ".pdf":
            cid = "toc"
            title = "目次"
        elif p.suffix.lower() == ".pdf" and re.search(r"Feild|Field", p.name, re.I):
            m = re.search(r"Feild\s*(\d+)|Field\s*(\d+)", p.name, re.I)
            cid = f"field{m.group(1) or m.group(2)}"
            title = field_title(p.name)
        else:
            cid = re.sub(r"\W+", "_", Path(p.name).stem.lower())[:40]

        start = page
        page = render_file(p, page)
        chapters.append((cid, title, start, page - 1))

    total = page - 1
    print(f"\n合計 {total} ページ -> {OUT_DIR}")
    print(f"表紙コピー -> {COVER_OUT}")
    print("\n--- hs_data.js 用 chapters ---")
    print("[")
    for cid, title, s, e in chapters:
        esc = title.replace("\\", "\\\\").replace('"', '\\"')
        print(f'            {{ id: "{cid}", title: "{esc}", start: {s}, end: {e}, subsections: [] }},')
    print("]")
    print(f'\ntotalPages: {total},')


if __name__ == "__main__":
    main()
