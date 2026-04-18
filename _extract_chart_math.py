import os
import fitz
from PIL import Image

def extract_pdf(pdf_path, out_dir, prefix="page_", start_num=1, zoom=2.0):
    os.makedirs(out_dir, exist_ok=True)
    if not os.path.exists(pdf_path):
        print(f"Error: Not found {pdf_path}")
        return 0

    print(f"Extracting {pdf_path} to {out_dir} ...")
    doc = fitz.open(pdf_path)
    mat = fitz.Matrix(zoom, zoom)
    
    count = 0
    for i in range(doc.page_count):
        page = doc[i]
        pix = page.get_pixmap(matrix=mat, alpha=False)
        out_name = f"{prefix}{(start_num + i):04d}.png"
        out_path = os.path.join(out_dir, out_name)
        
        # Save as PNG
        pix.save(out_path)
        count += 1
        
        if count % 50 == 0:
            print(f"  Processed {count}/{doc.page_count} pages...")
            
    doc.close()
    print(f"Done! {count} pages saved to {out_dir}\n")
    return count

source_dir = r"D:\教室テキスト_スキャン_未整理\新課程 チャート式 大学入学共通テスト対策 数学IA+IIBC\新課程 チャート式 大学入学共通テスト対策 数学IA+IIBC登録用"
out_base = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images"

color_pdf = os.path.join(source_dir, "新課程 チャート式 大学入学共通テスト対策 数学IA+IIBC.pdf")
bw_pdf = os.path.join(source_dir, "印刷用モノクロ.pdf")
answer_pdf = os.path.join(source_dir, "新課程 チャート式 大学入学共通テスト対策 数学IA+IIBC_解答カラー.pdf")
cover_img = os.path.join(source_dir, "新課程 チャート式 大学入学共通テスト対策 数学IA+IIBC.jpg")

dir_color = os.path.join(out_base, "chart_kyotsu_math")
dir_bw = os.path.join(out_base, "chart_kyotsu_math_bw")

# 表紙のコピー
if os.path.exists(cover_img):
    import shutil
    shutil.copy2(cover_img, os.path.join(out_base, "chart_kyotsu_math_cover.jpg"))
    print("Copied cover image.")

# 本文カラー
pages_color = extract_pdf(color_pdf, dir_color, start_num=1)
# 本文白黒
pages_bw = extract_pdf(bw_pdf, dir_bw, start_num=1)

# 解答カラーも連結する場合（本文の総ページ数＋1番から開始）
# 今回はTOCに別冊解答の目次設定がないため、とりあえず同じフォルダに後ろにくっつけておきます（不要ならのちほど削除・改変可能）
if pages_color > 0:
    extract_pdf(answer_pdf, dir_color, start_num=pages_color + 1)
    print("解答カラーも追加で抽出しました。白黒には追加していません（印刷用は本文のみを想定）。")

total = pages_color + fitz.open(answer_pdf).page_count if os.path.exists(answer_pdf) else pages_color
print(f"抽出完了! カラー版の合計ページ数は {total} (本文 {pages_color}), 白黒版は {pages_bw} です。")
print(f"TOCデータの totalPages と 答の部 の再確認が必要な場合は hs_data.js を更新してください。")
