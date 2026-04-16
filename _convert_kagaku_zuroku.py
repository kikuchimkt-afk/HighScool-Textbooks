# -*- coding: utf-8 -*-
"""化学図録PDFのページ数確認・画像変換スクリプト"""
import fitz  # PyMuPDF
import os

BASE_DIR = r"C:\Users\makoto\Documents\アプリ開発\HighScool Textbooks\化学図録"
OUT_DIR = r"C:\Users\makoto\Documents\アプリ開発\HighScool Textbooks\viewer_app\images\kagaku_zuroku"

pdfs = [
    "0_元素・実験の基本操作.pdf",
    "1_物質の構成.pdf",
    "2_物質の状態.pdf",
    "3_物質の反応.pdf",
    "4_無機化合物.pdf",
    "5_有機化合物.pdf",
    "6_人間生活と物質.pdf",
    "7_資料・索引.pdf",
]

# Step 1: Count pages
total = 0
sections = []
for pdf_name in pdfs:
    pdf_path = os.path.join(BASE_DIR, pdf_name)
    doc = fitz.open(pdf_path)
    count = doc.page_count
    sections.append((pdf_name, count))
    print(f"  {pdf_name}: {count} pages")
    total += count
    doc.close()

print(f"\n  合計: {total} ページ\n")

# Step 2: Convert all PDFs to sequential page images
os.makedirs(OUT_DIR, exist_ok=True)

global_page = 0
DPI = 150  # 画質とファイルサイズのバランス

for pdf_name, _ in sections:
    pdf_path = os.path.join(BASE_DIR, pdf_name)
    doc = fitz.open(pdf_path)
    for page_num in range(doc.page_count):
        global_page += 1
        page = doc[page_num]
        mat = fitz.Matrix(DPI / 72, DPI / 72)
        pix = page.get_pixmap(matrix=mat)
        out_path = os.path.join(OUT_DIR, f"page_{global_page:04d}.png")
        pix.save(out_path)
        if global_page % 20 == 0 or global_page == 1:
            print(f"  [{global_page}/{total}] {out_path}")
    doc.close()
    print(f"  [OK] {pdf_name} done")

print(f"\n[DONE] {global_page} pages -> {OUT_DIR}")
