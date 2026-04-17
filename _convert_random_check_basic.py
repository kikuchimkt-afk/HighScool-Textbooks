import fitz
import os
import shutil

mondai_pdf = r"D:\Files\ランダム総点検 英文法・語法 最終チェック問題集 基礎レベル\問題.pdf"
cover_jpg = r"D:\Files\ランダム総点検 英文法・語法 最終チェック問題集 基礎レベル\表紙.jpg"
out_dir = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images\random_check_basic"
bw_out_dir = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images\random_check_basic_bw"
cover_dest = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images\random_check_basic_cover.jpg"

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
target_total_pages = 47 # 46 + 1(白紙)

print(f"変換開始: PDF枚数 {total_pdf_pages} ページ -> 変換後 {target_total_pages} ページ予定")

# 基準となる白紙のサイズを最初のページから取得
page0 = doc.load_page(0)
mat = fitz.Matrix(DPI / 72, DPI / 72)
sample_pix = page0.get_pixmap(matrix=mat)
w, h = sample_pix.width, sample_pix.height

# 白紙PixMapを作成
blank_color_pix = fitz.Pixmap(fitz.csRGB, (0, 0, w, h), False)
blank_color_pix.clear_with(255) # White

blank_bw_pix = fitz.Pixmap(fitz.csGRAY, (0, 0, w, h), False)
blank_bw_pix.clear_with(255) # White

pdf_idx = 0
for image_page in range(1, target_total_pages + 1):
    out_path = os.path.join(out_dir, f"page_{image_page:04d}.png")
    out_bw_path = os.path.join(bw_out_dir, f"page_{image_page:04d}.png")
    
    if image_page == 37:
        # 37ページ目: 欠落しているため白紙を挿入
        blank_color_pix.save(out_path)
        blank_bw_pix.save(out_bw_path)
        print(f"  [INSERT BLANK] image_page: {image_page}")
    else:
        # それ以外はPDFの該当ページを出力
        page = doc.load_page(pdf_idx)
        pix = page.get_pixmap(matrix=mat)
        pix.save(out_path)
        
        pix_bw = page.get_pixmap(matrix=mat, colorspace=fitz.csGRAY)
        pix_bw.save(out_bw_path)
        
        pdf_idx += 1
        
    if image_page % 10 == 0:
        print(f"  [{image_page}/{target_total_pages}] processed.")

doc.close()
print("完了しました。")
