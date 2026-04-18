import os
import fitz
import shutil

def extract_pdf(pdf_path, out_dir, prefix="page_", start_num=1, zoom=2.0):
    os.makedirs(out_dir, exist_ok=True)
    if not os.path.exists(pdf_path):
        print(f"Error: Not found {pdf_path}")
        return 0

    # ディレクトリをクリア
    print(f"Clearing output directory: {out_dir}")
    for f in os.listdir(out_dir):
        if f.endswith('.png'):
            os.remove(os.path.join(out_dir, f))

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

source_pdf = r"D:\教室テキスト_スキャン_未整理\新課程 チャート式 大学入学共通テスト対策 数学IA+IIBC\新課程 チャート式 大学入学共通テスト対策 数学IA+IIBC登録用\印刷用モノクロ_解なし.pdf"
dir_bw = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images\chart_kyotsu_math_bw"

# 本文白黒 (解なしバージョンのPDF)
pages_bw = extract_pdf(source_pdf, dir_bw, start_num=1)

print("印刷用PDFの入れ替え抽出が完了しました。")
