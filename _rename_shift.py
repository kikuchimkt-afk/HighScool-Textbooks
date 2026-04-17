import os
import shutil

# 各フォルダに対して一括で +3 リネーム処理を行う

def shift_images(directory, shift_amount):
    if not os.path.exists(directory):
        print(f"Directory not found: {directory}")
        return
        
    print(f"Processing {directory} ...")
    files = [f for f in os.listdir(directory) if f.startswith("page_") and f.endswith(".png")]
    # 逆順でリネーム（上書きを防ぐため）
    files.sort(reverse=True)
    
    max_num = 0
    for f in files:
        num_str = f.replace("page_", "").replace(".png", "")
        if num_str.isdigit():
            num = int(num_str)
            new_num = num + shift_amount
            if new_num > max_num:
                max_num = new_num
            old_path = os.path.join(directory, f)
            new_path = os.path.join(directory, f"page_{new_num:04d}.png")
            os.rename(old_path, new_path)
            
    print(f"Shifted {len(files)} files by +{shift_amount}. Max num = {max_num}")
    return max_num

# 実行するディレクトリ
base_dir = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images"
dirs_to_shift = [
    os.path.join(base_dir, "tanki_math1a"),
    os.path.join(base_dir, "tanki_math1a_bw"),
    os.path.join(base_dir, "tanki_math2b")
]

shift_value = 3

for d in dirs_to_shift:
    shift_images(d, shift_value)

# ダミー画像の作成（1〜3） - coverがあれば1にし、2,3はダミー白紙
from PIL import Image

def create_dummy(path):
    img = Image.new('RGB', (1000, 1400), color='white')
    img.save(path)

for d in dirs_to_shift:
    if os.path.exists(d):
        cover_path = ""
        # try to find cover.jpg in parent
        if "math1a" in d:
             cover_src = os.path.join(base_dir, "tanki_math1a_cover.jpg")
        else:
             cover_src = os.path.join(base_dir, "tanki_math2b_cover.jpg")
             
        if os.path.exists(cover_src):
            try:
                # convert jpg to png for page_0001
                img = Image.open(cover_src)
                img.save(os.path.join(d, "page_0001.png"))
            except:
                create_dummy(os.path.join(d, "page_0001.png"))
        else:
            create_dummy(os.path.join(d, "page_0001.png"))
            
        create_dummy(os.path.join(d, "page_0002.png"))
        create_dummy(os.path.join(d, "page_0003.png"))

print("Done!")
