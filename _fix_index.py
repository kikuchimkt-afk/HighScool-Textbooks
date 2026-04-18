import os

# Read the correct UTF-8 version of index.html from git
data = open('index_restored.html', 'rb').read()

# The entry to add
new_entry = "        { id: 'chart_kyotsu_math', cat: 'math', title: '新課程 チャート式 大学入学共通テスト対策 数学IA+IIBC', desc: '共通テスト対策向けの網羅型問題集', cover: 'images/chart_kyotsu_math_cover.jpg', toc: 'chart_kyotsu_math_toc.html' },\r\n"
new_entry_bytes = new_entry.encode('utf-8')

# Find the insertion point: before superquick_math2bc
target = b"{ id: 'superquick_math2bc'"
idx = data.find(target)
if idx < 0:
    print("ERROR: target not found")
else:
    # Find the start of the line (go back to find the whitespace)
    line_start = data.rfind(b'\n', 0, idx) + 1
    # Insert before this line
    new_data = data[:line_start] + new_entry_bytes + data[line_start:]
    
    with open('index.html', 'wb') as f:
        f.write(new_data)
    
    # Verify
    check = open('index.html', 'rb').read()
    print("chart_kyotsu_math present:", b'chart_kyotsu_math' in check)
    print("UTF-8 管理者 present:", '管理者'.encode('utf-8') in check)
    print("UTF-8 パスワード present:", 'パスワード'.encode('utf-8') in check)
    print("Done!")
