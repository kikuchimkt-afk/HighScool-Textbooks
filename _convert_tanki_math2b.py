import fitz
import os

pdf_dir = r"D:\Files\短期集中ゼミ_基礎からの数IIB"
out_dir_color = "images/tanki_math2b"
out_dir_bw = "images/tanki_math2b_bw"

os.makedirs(out_dir_color, exist_ok=True)
os.makedirs(out_dir_bw, exist_ok=True)

main_pdf = os.path.join(pdf_dir, "短期集中ゼミ_基礎からの数IIB_本文.pdf")
bw_pdf = os.path.join(pdf_dir, "短期集中ゼミ_基礎からの数IIB_解なし.pdf")
ans_pdf = os.path.join(pdf_dir, "短期集中ゼミ_基礎からの数IIB_解答.pdf")

doc_main = fitz.open(main_pdf)
doc_bw = fitz.open(bw_pdf)

total_main = doc_main.page_count

zoom_x = 2.0
zoom_y = 2.0
mat = fitz.Matrix(zoom_x, zoom_y)

print(f"本編変換開始: {total_main}ページ")
for i in range(total_main):
    # カラー
    page = doc_main.load_page(i)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    pix.save(os.path.join(out_dir_color, f"page_{i+1:04d}.png"))
    
    # モノクロ
    page_bw = doc_bw.load_page(i)
    pix_bw = page_bw.get_pixmap(matrix=mat, alpha=False, colorspace=fitz.csGRAY)
    pix_bw.save(os.path.join(out_dir_bw, f"page_{i+1:04d}.png"))
    
    if (i + 1) % 20 == 0:
        print(f"  [{i+1}/{total_main}] processed.")

doc_ans = fitz.open(ans_pdf)
total_ans = doc_ans.page_count
offset = total_main

print(f"解答変換開始: {total_ans}ページ (連番 {offset + 1} ～ {offset + total_ans})")
for i in range(total_ans):
    page = doc_ans.load_page(i)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    img_num = offset + i + 1
    # 解答はカラー・モノクロ両方に同じものを配置する (プリント用は任意だが、一応)
    pix.save(os.path.join(out_dir_color, f"page_{img_num:04d}.png"))
    
    # 白黒側はグレースケールで保存しておく（プリント統一感のため）
    pix_bw = page.get_pixmap(matrix=mat, alpha=False, colorspace=fitz.csGRAY)
    pix_bw.save(os.path.join(out_dir_bw, f"page_{img_num:04d}.png"))
    
    if (i + 1) % 20 == 0:
        print(f"  [{i+1}/{total_ans}] processed.")

print("完了。")
