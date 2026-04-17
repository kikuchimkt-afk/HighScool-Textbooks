import os
import shutil

def unshift_images(directory, shift_amount):
    if not os.path.exists(directory):
        return
        
    print(f"Unshifting {directory} ...")
    
    # ダミー画像の削除
    for i in range(1, shift_amount + 1):
        dummy_path = os.path.join(directory, f"page_{i:04d}.png")
        if os.path.exists(dummy_path):
            os.remove(dummy_path)
            
    # 全ファイルを -shift_amount してリネーム（昇順で行う）
    files = [f for f in os.listdir(directory) if f.startswith("page_") and f.endswith(".png")]
    files.sort()
    
    count = 0
    for f in files:
        num_str = f.replace("page_", "").replace(".png", "")
        if num_str.isdigit():
            num = int(num_str)
            new_num = num - shift_amount
            old_path = os.path.join(directory, f)
            new_path = os.path.join(directory, f"page_{new_num:04d}.png")
            os.rename(old_path, new_path)
            count += 1
            
    print(f"Unshifted {count} files by -{shift_amount}")

base_dir = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images"
dirs_to_unshift = [
    os.path.join(base_dir, "tanki_math2b"),
]

for d in dirs_to_unshift:
    unshift_images(d, 3)

import re
# hs_data.js の tanki_math2b 部分を復元する
with open(r'c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\js\hs_data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# tanki_math2b の totalPages を復元
content = content.replace('tanki_math2b: {\n        id: "tanki_math2b",\n        title: "短期集中ゼミ 基礎からの数学II+B Express",\n        totalPages: 189,', 'tanki_math2b: {\n        id: "tanki_math2b",\n        title: "短期集中ゼミ 基礎からの数学II+B Express",\n        totalPages: 186,')

# answers セクションの復元
old_answers = """            { id: "answers", title: "解答・解説編", start: 112, end: 189, subsections: [
                { num: 100, title: "こたえ (略解・本編末尾)", page: 103 },
                { num: 101, title: "複素数と方程式・式と証明", page: 112 },
                { num: 102, title: "図形と方程式", page: 122 },
                { num: 103, title: "三角関数", page: 135 },
                { num: 104, title: "指数・対数", page: 141 },
                { num: 105, title: "微分・積分", page: 150 },
                { num: 106, title: "数列", page: 160 },
                { num: 107, title: "ベクトル", page: 171 },
                { num: 108, title: "確率", page: 184 }
            ]}"""

new_answers = """            { id: "answers", title: "解答・解説編", start: 109, end: 186, subsections: [
                { num: 100, title: "こたえ (略解・本編末尾)", page: 100 },
                { num: 101, title: "複素数と方程式・式と証明", page: 109 },
                { num: 102, title: "図形と方程式", page: 119 },
                { num: 103, title: "三角関数", page: 132 },
                { num: 104, title: "指数・対数", page: 138 },
                { num: 105, title: "微分・積分", page: 147 },
                { num: 106, title: "数列", page: 157 },
                { num: 107, title: "ベクトル", page: 168 },
                { num: 108, title: "確率", page: 181 }
            ]}"""

content = content.replace(old_answers, new_answers)

with open(r'c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\js\hs_data.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Data restored.")
