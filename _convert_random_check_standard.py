import fitz
import os
import shutil

mondai_pdf = r"D:\Files\ランダム総点検 英文法・語法 最終チェック問題集 標準レベル\問題.pdf"
cover_jpg = r"D:\Files\ランダム総点検 英文法・語法 最終チェック問題集 標準レベル\表紙.jpg"
out_dir = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images\random_check_standard"
bw_out_dir = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images\random_check_standard_bw"
cover_dest = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images\random_check_standard_cover.jpg"

os.makedirs(out_dir, exist_ok=True)
os.makedirs(bw_out_dir, exist_ok=True)

# 1. 表紙.jpg をコピー
if os.path.exists(cover_jpg):
    shutil.copy2(cover_jpg, cover_dest)
    print("表紙画像をコピーしました。")
else:
    print("表紙画像が見つかりません。")

# 2. PDFの変換
DPI = 150
doc = fitz.open(mondai_pdf)
total_pdf_pages = doc.page_count

# PDFの1ページ目をスキップし、2ページ目(インデックス1)から開始
print(f"変換開始: PDF枚数 {total_pdf_pages} ページ -> 最初の1ページをスキップし {total_pdf_pages - 1} ページ分を抽出")

mat = fitz.Matrix(DPI / 72, DPI / 72)

image_num = 1
for pdf_idx in range(1, total_pdf_pages):
    page = doc.load_page(pdf_idx)
    
    # カラー
    pix = page.get_pixmap(matrix=mat)
    out_path = os.path.join(out_dir, f"page_{image_num:04d}.png")
    pix.save(out_path)
    
    # モノクロ
    pix_bw = page.get_pixmap(matrix=mat, colorspace=fitz.csGRAY)
    out_bw_path = os.path.join(bw_out_dir, f"page_{image_num:04d}.png")
    pix_bw.save(out_bw_path)
    
    if image_num % 10 == 0:
        print(f"  [{image_num}/{total_pdf_pages - 1}] processed.")
        
    image_num += 1

doc.close()
print("完了しました。")
