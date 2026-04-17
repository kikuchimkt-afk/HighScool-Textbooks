import fitz
import os
import shutil

src_dir = r"D:\Files\短期集中ゼミ_基礎からの数IA"
main_pdf = os.path.join(src_dir, "短期集中ゼミ_基礎からの数IA_本文.pdf")
bw_pdf = os.path.join(src_dir, "短期集中ゼミ_基礎からの数IA_解なし.pdf")
ans_pdf = os.path.join(src_dir, "短期集中ゼミ_基礎からの数IA_解答.pdf")
cover_jpg = os.path.join(src_dir, "20221028_035353_0001.jpg")

out_dir = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images\tanki_math1a"
bw_out_dir = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images\tanki_math1a_bw"
cover_dest = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images\tanki_math1a_cover.jpg"

os.makedirs(out_dir, exist_ok=True)
os.makedirs(bw_out_dir, exist_ok=True)

# 1. 表紙.jpg をコピー
if os.path.exists(cover_jpg):
    shutil.copy2(cover_jpg, cover_dest)
    print("表紙画像をコピーしました。")

DPI = 150
mat = fitz.Matrix(DPI / 72, DPI / 72)

# 2. 本文(カラー) と 解なし(白黒) の変換
# 同じページ数(88)であることが前提
doc_main = fitz.open(main_pdf)
doc_bw = fitz.open(bw_pdf)
total_main = doc_main.page_count
total_bw = doc_bw.page_count

print(f"本文変換開始: 本文={total_main}ページ, 解なし={total_bw}ページ (連番 1 ～ {total_main})")

for i in range(total_main):
    # カラー本編側
    page_main = doc_main.load_page(i)
    pix = page_main.get_pixmap(matrix=mat)
    out_path = os.path.join(out_dir, f"page_{i + 1:04d}.png")
    pix.save(out_path)
    
    # 白黒解なし側
    if i < total_bw:
        page_bw = doc_bw.load_page(i)
        pix_bw = page_bw.get_pixmap(matrix=mat, colorspace=fitz.csGRAY)
        out_bw_path = os.path.join(bw_out_dir, f"page_{i + 1:04d}.png")
        pix_bw.save(out_bw_path)

    if (i + 1) % 20 == 0:
        print(f"  [{i + 1}/{total_main}] processed.")

doc_main.close()
doc_bw.close()

# 3. 解答(共通) の変換
doc_ans = fitz.open(ans_pdf)
total_ans = doc_ans.page_count
offset = total_main # 88

print(f"解答変換開始: 解答={total_ans}ページ (連番 {offset + 1} ～ {offset + total_ans})")

for i in range(total_ans):
    page_ans = doc_ans.load_page(i)
    
    # カラー
    pix_ans = page_ans.get_pixmap(matrix=mat)
    out_path = os.path.join(out_dir, f"page_{offset + i + 1:04d}.png")
    pix_ans.save(out_path)
    
    # 白黒 (解答は同じ内容でカラーとモノクロに出力する)
    pix_ans_bw = page_ans.get_pixmap(matrix=mat, colorspace=fitz.csGRAY)
    out_bw_path = os.path.join(bw_out_dir, f"page_{offset + i + 1:04d}.png")
    pix_ans_bw.save(out_bw_path)
    
    if (i + 1) % 20 == 0:
        print(f"  [{i + 1}/{total_ans}] processed.")

doc_ans.close()
print("完了しました。")
