import fitz
import os

answer_pdf = r"D:\Files\ランダム総点検 英文法・語法 最終チェック問題集 基礎レベル\解答解説.pdf"
out_dir = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images\random_check_basic"
bw_out_dir = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images\random_check_basic_bw"

os.makedirs(out_dir, exist_ok=True)
os.makedirs(bw_out_dir, exist_ok=True)

DPI = 150
doc = fitz.open(answer_pdf)
total_pages = doc.page_count
offset = 47 # 前編（問題）が47ページあるため、解答は48ページ目から

print(f"変換開始: 解答PDF枚数 {total_pages} ページ -> 連番 {offset + 1} ～ {offset + total_pages}")

for i in range(total_pages):
    page = doc.load_page(i)
    mat = fitz.Matrix(DPI / 72, DPI / 72)
    
    # カラー
    pix = page.get_pixmap(matrix=mat)
    out_path = os.path.join(out_dir, f"page_{offset + i + 1:04d}.png")
    pix.save(out_path)
    
    # モノクロ
    pix_bw = page.get_pixmap(matrix=mat, colorspace=fitz.csGRAY)
    out_bw_path = os.path.join(bw_out_dir, f"page_{offset + i + 1:04d}.png")
    pix_bw.save(out_bw_path)
    
    if (i + 1) % 20 == 0:
        print(f"  [{i + 1}/{total_pages}] processed.")

doc.close()
print("完了しました。")
