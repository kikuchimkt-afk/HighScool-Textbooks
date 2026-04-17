import os

def unshift_images(directory, shift_amount):
    """shift_amountぶん番号を戻す（-3）"""
    if not os.path.exists(directory):
        print(f"Directory not found: {directory}")
        return

    print(f"Unshifting {directory} ...")

    # まずダミー画像(1,2,3)を削除
    for i in range(1, shift_amount + 1):
        dummy_path = os.path.join(directory, f"page_{i:04d}.png")
        if os.path.exists(dummy_path):
            os.remove(dummy_path)
            print(f"  Removed dummy: page_{i:04d}.png")

    # ファイルを昇順でリネーム（-3）
    files = [f for f in os.listdir(directory) if f.startswith("page_") and f.endswith(".png")]
    files.sort()  # 昇順（小さい番号から処理して衝突を避ける）

    count = 0
    for f in files:
        num_str = f.replace("page_", "").replace(".png", "")
        if num_str.isdigit():
            num = int(num_str)
            new_num = num - shift_amount
            if new_num < 1:
                print(f"  Skipping {f} (would become {new_num})")
                continue
            old_path = os.path.join(directory, f)
            new_path = os.path.join(directory, f"page_{new_num:04d}.png")
            os.rename(old_path, new_path)
            count += 1

    print(f"  Done: {count} files shifted by -{shift_amount}")

base_dir = r"c:\Users\makoto\Documents\GitHub\HighScool-Textbooks\images"

# tanki_math1a と bw の両方を戻す
for name in ["tanki_math1a", "tanki_math1a_bw"]:
    unshift_images(os.path.join(base_dir, name), 3)

print("\nAll done!")
