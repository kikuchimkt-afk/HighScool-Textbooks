import fitz
import os

mondai_pdf = r"D:\pdf\Files\英語長文ポラリス1\ポラリス1_問題.pdf"
kaitou_pdf = r"D:\pdf\Files\英語長文ポラリス1\ポラリス1_解答.pdf"
out_dir = r"C:\Users\user\Documents\GitHub\HighScool-Textbooks\images\polaris1"
bw_out_dir = r"C:\Users\user\Documents\GitHub\HighScool-Textbooks\images\polaris1_bw"

os.makedirs(out_dir, exist_ok=True)
os.makedirs(bw_out_dir, exist_ok=True)

DPI = 150
global_page = 0
total_pages = 58 + 192

print(f"変換開始: 合計 {total_pages} ページ")

# 1. 問題部分の変換 (1〜58)
print("問題PDFを変換中...")
doc1 = fitz.open(mondai_pdf)
for page_num in range(doc1.page_count):
    global_page += 1
    page = doc1.load_page(page_num)
    mat = fitz.Matrix(DPI / 72, DPI / 72)
    pix = page.get_pixmap(matrix=mat)
    
    # カラー版（通常）
    out_path = os.path.join(out_dir, f"page_{global_page:04d}.png")
    pix.save(out_path)
    
    # モノクロ版（印刷用・ファイルサイズ縮小用）
    pix_bw = page.get_pixmap(matrix=mat, colorspace=fitz.csGRAY)
    out_bw_path = os.path.join(bw_out_dir, f"page_{global_page:04d}.png")
    pix_bw.save(out_bw_path)
    
    if global_page % 10 == 0:
        print(f"  [{global_page}/{total_pages}]")
doc1.close()

# 2. 解答部分の変換 (59〜250)
print("解答PDFを変換中...")
doc2 = fitz.open(kaitou_pdf)
for page_num in range(doc2.page_count):
    global_page += 1
    page = doc2.load_page(page_num)
    mat = fitz.Matrix(DPI / 72, DPI / 72)
    pix = page.get_pixmap(matrix=mat)
    
    out_path = os.path.join(out_dir, f"page_{global_page:04d}.png")
    pix.save(out_path)
    
    pix_bw = page.get_pixmap(matrix=mat, colorspace=fitz.csGRAY)
    out_bw_path = os.path.join(bw_out_dir, f"page_{global_page:04d}.png")
    pix_bw.save(out_bw_path)
    
    if global_page % 20 == 0:
        print(f"  [{global_page}/{total_pages}]")
doc2.close()

print(f"完了しました。生成された画像: {global_page} 枚")
