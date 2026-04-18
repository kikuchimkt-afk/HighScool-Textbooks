import subprocess

# Get the correct tanki_math1a viewer as template
data = subprocess.run(['git', 'show', '898d201:tanki_math1a_viewer.html'], capture_output=True).stdout
text = data.decode('utf-8')

# Replace all references
text = text.replace('tanki_math1a', 'chart_kyotsu_math')
text = text.replace('短期集中ゼミ 基礎からの数学I+A', '新課程 チャート式 大学入学共通テスト対策 数学IA+IIBC')

# Write as UTF-8
with open('chart_kyotsu_math_viewer.html', 'wb') as f:
    f.write(text.encode('utf-8'))

# Verify
check = open('chart_kyotsu_math_viewer.html', 'rb').read()
print("chart_kyotsu_math:", b'chart_kyotsu_math' in check)
print("UTF-8 title:", 'チャート式'.encode('utf-8') in check)
print("UTF-8 ビューア:", 'ビューア'.encode('utf-8') in check)
print("Done!")
