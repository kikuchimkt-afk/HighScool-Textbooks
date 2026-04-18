# -*- coding: utf-8 -*-
"""卜部「化学の新研究 改訂版」: PDF結合順の確認・ページ画像export・参照JSON更新用。

  pip install pymupdf pillow

  実行（画像変換）:
    python _convert_shinkenkyu_chem.py --export

  表紙のみ（フォルダ内 表題.JPG → images/shinkenkyu_chem_cover.jpg）:
    python _convert_shinkenkyu_chem.py --cover-only
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys

try:
    import fitz  # PyMuPDF
except ImportError:
    print("PyMuPDF が必要です: pip install pymupdf", file=sys.stderr)
    sys.exit(1)

SOURCE_DIR = r"D:\pdf\Files\(卜部) 化学の新研究_改訂版"
OUT_IMAGES = os.path.join(os.path.dirname(__file__), "images", "shinkenkyu_chem")
OUT_COVER = os.path.join(os.path.dirname(__file__), "images", "shinkenkyu_chem_cover.jpg")
DPI = 150


def sorted_pdf_paths(base: str) -> list[str]:
    files = [f for f in os.listdir(base) if f.lower().endswith(".pdf")]

    def key(s: str):
        if s.startswith("_"):
            if "まえがき" in s:
                return (0, 0, s)
            if "さくいん" in s:
                return (2, 0, s)
            return (0, 1, s)
        m = re.match(r"^(\d+)-(\d+)", s)
        if m:
            return (1, int(m.group(1)), int(m.group(2)), s)
        return (1, 99, 0, s)

    files.sort(key=key)
    return [os.path.join(base, f) for f in files]


def title_from_filename(name: str) -> str:
    base = os.path.basename(name)
    base = re.sub(r"\.pdf$", "", base, flags=re.I)
    base = re.sub(r"^\d+-\d+\s*", "", base)
    return base.strip()


def build_layout(base: str) -> tuple[list[dict], int]:
    """各PDFの開始・終了ページ(1始まり連番)とタイトル。"""
    paths = sorted_pdf_paths(base)
    cur = 1
    items: list[dict] = []
    for p in paths:
        doc = fitz.open(p)
        n = doc.page_count
        doc.close()
        items.append(
            {
                "file": os.path.basename(p),
                "title": title_from_filename(p),
                "pages": n,
                "global_start": cur,
                "global_end": cur + n - 1,
            }
        )
        cur += n
    return items, cur - 1


def chapter_plan(items: list[dict]) -> list[dict]:
    """ビューア用の大章（hs_data / 目次と揃える）。"""
    # (id, display_title, first_file_prefix or special)
    major_groups: list[tuple[str, str, list[tuple[int, int]]]] = [
        ("intro", "まえがき・目次", []),
        ("part1", "第1章 物質の構成", [(1, 1), (1, 2), (1, 3), (1, 4), (1, 5)]),
        ("part2", "第2章 物質の状態と溶液", [(2, i) for i in range(1, 14)]),
        ("part3", "第3章 化学反応と平衡", [(3, i) for i in range(1, 9)]),
        ("part4", "第4章 無機物質", [(4, i) for i in range(1, 19)]),
        ("part5", "第5章 有機化合物", [(5, i) for i in range(1, 19)]),
        ("part6", "第6章 高分子化合物", [(6, i) for i in range(1, 13)]),
        ("index", "索引", []),
    ]

    def parse_prefix(fname: str) -> tuple[int, int] | None:
        m = re.match(r"^(\d+)-(\d+)", fname)
        if not m:
            return None
        return int(m.group(1)), int(m.group(2))

    intro_item = next(x for x in items if x["file"].startswith("_まえがき"))
    index_item = next(x for x in items if "さくいん" in x["file"])

    chapters: list[dict] = []

    chapters.append(
        {
            "id": "intro",
            "title": "まえがき・目次",
            "start": intro_item["global_start"],
            "end": intro_item["global_end"],
            "subsections": [{"num": 0, "title": "まえがき・目次", "page": intro_item["global_start"]}],
        }
    )

    by_prefix: dict[tuple[int, int], dict] = {}
    for x in items:
        pr = parse_prefix(x["file"])
        if pr:
            by_prefix[pr] = x

    for ch_id, ch_title, pairs in major_groups[1:-1]:
        if not pairs:
            continue
        segs = [by_prefix[k] for k in pairs]
        start = segs[0]["global_start"]
        end = segs[-1]["global_end"]
        subs = []
        for i, seg in enumerate(segs, start=1):
            subs.append({"num": i, "title": seg["title"], "page": seg["global_start"]})
        chapters.append({"id": ch_id, "title": ch_title, "start": start, "end": end, "subsections": subs})

    chapters.append(
        {
            "id": "index",
            "title": "索引",
            "start": index_item["global_start"],
            "end": index_item["global_end"],
            "subsections": [{"num": 0, "title": "索引", "page": index_item["global_start"]}],
        }
    )
    return chapters


def write_reference_json(base: str, out_path: str) -> None:
    items, total = build_layout(base)
    chapters = chapter_plan(items)
    doc = {
        "source_dir": base.replace("/", "\\"),
        "total_pages": total,
        "pdf_order": [{"file": x["file"], "pages": x["pages"]} for x in items],
        "chapters": chapters,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"[OK] wrote {out_path} ({total} pages)")


def export_cover_jpg(base: str) -> None:
    from PIL import Image

    candidates = ["表題.JPG", "表題.jpg", "hyoshi.jpg"]
    src = None
    for c in candidates:
        p = os.path.join(base, c)
        if os.path.isfile(p):
            src = p
            break
    if not src:
        for f in os.listdir(base):
            if f.lower().endswith((".jpg", ".jpeg")) and "表" in f:
                src = os.path.join(base, f)
                break
    if not src:
        print("表紙画像が見つかりません（表題.JPG 想定）", file=sys.stderr)
        return
    os.makedirs(os.path.dirname(OUT_COVER), exist_ok=True)
    im = Image.open(src).convert("RGB")
    im.save(OUT_COVER, quality=92)
    print(f"[OK] cover -> {OUT_COVER}")


def export_pages(base: str) -> None:
    items, total = build_layout(base)
    os.makedirs(OUT_IMAGES, exist_ok=True)
    global_page = 0
    mat = fitz.Matrix(DPI / 72, DPI / 72)
    for it in items:
        path = os.path.join(base, it["file"])
        doc = fitz.open(path)
        for page_num in range(doc.page_count):
            global_page += 1
            page = doc[page_num]
            pix = page.get_pixmap(matrix=mat)
            out_path = os.path.join(OUT_IMAGES, f"page_{global_page:04d}.png")
            pix.save(out_path)
            if global_page == 1 or global_page % 40 == 0 or global_page == total:
                print(f"  [{global_page}/{total}] {out_path}")
        doc.close()
    print(f"[DONE] {global_page} pages -> {OUT_IMAGES}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--export", action="store_true", help="全ページを PNG 出力")
    ap.add_argument("--cover-only", action="store_true", help="表紙 JPG のみ")
    ap.add_argument("--write-reference", action="store_true", help="data/shinkenkyu_chem_reference.json を更新")
    args = ap.parse_args()

    base = SOURCE_DIR
    if not os.path.isdir(base):
        print(f"ソースフォルダがありません: {base}", file=sys.stderr)
        sys.exit(1)

    repo = os.path.dirname(os.path.abspath(__file__))
    ref_path = os.path.join(repo, "data", "shinkenkyu_chem_reference.json")

    if args.export:
        export_cover_jpg(base)
        export_pages(base)
        write_reference_json(base, ref_path)
        return

    if args.cover_only:
        export_cover_jpg(base)
        return

    if args.write_reference:
        write_reference_json(base, ref_path)
        return

    items, total = build_layout(base)
    print(f"total_pages={total}")
    for x in items:
        print(f"  {x['global_start']:4}-{x['global_end']:4}  {x['pages']:3}  {x['file']}")


if __name__ == "__main__":
    main()
