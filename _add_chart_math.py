import json
import codecs

toc_data = {
  "目次": [
    { "章番号": "第1章", "タイトル": "数と式, 集合と命題", "科目": "数学Ⅰ", "ページ": 13 },
    { "章番号": "第2章", "タイトル": "2次関数", "科目": "数学Ⅰ", "ページ": 28 },
    { "章番号": "第3章", "タイトル": "図形と計量", "科目": "数学Ⅰ", "ページ": 49 },
    { "章番号": "第4章", "タイトル": "データの分析", "科目": "数学Ⅰ", "ページ": 66 },
    { "章番号": "第5章", "タイトル": "場合の数と確率", "科目": "数学A", "ページ": 88 },
    { "章番号": "第6章", "タイトル": "図形の性質", "科目": "数学A", "ページ": 115 },
    { "章番号": "第7章", "タイトル": "式と証明, 複素数と方程式", "科目": "数学Ⅱ", "ページ": 132 },
    { "章番号": "第8章", "タイトル": "図形と方程式", "科目": "数学Ⅱ", "ページ": 150 },
    { "章番号": "第9章", "タイトル": "三角関数", "科目": "数学Ⅱ", "ページ": 167 },
    { "章番号": "第10章", "タイトル": "指数関数・対数関数", "科目": "数学Ⅱ", "ページ": 184 },
    { "章番号": "第11章", "タイトル": "微分法・積分法", "科目": "数学Ⅱ", "ページ": 200 },
    { "章番号": "第12章", "タイトル": "数列", "科目": "数学B", "ページ": 225 },
    { "章番号": "第13章", "タイトル": "統計的な推測", "科目": "数学B", "ページ": 247 },
    { "章番号": "第14章", "タイトル": "ベクトル", "科目": "数学C", "ページ": 267 },
    { "章番号": "第15章", "タイトル": "平面上の曲線と複素数平面", "科目": "数学C", "ページ": 286 },
    { "タイトル": "実践模試", "ページ": 311 },
    { "タイトル": "指針一覧", "ページ": 348 },
    { "タイトル": "答の部", "ページ": 370 }
  ]
}

# グループ化
groups = {}
for item in toc_data["目次"]:
    subject = item.get("科目", "その他")
    if subject not in groups:
        groups[subject] = []
    groups[subject].append(item)

chapters_str = ""
group_keys = list(groups.keys())
for i, subj in enumerate(group_keys):
    items = groups[subj]
    start_page = items[0]["ページ"]
    
    # 次の科目の最初のページから-1をendとする。最後のタブの場合は仮置きして+50
    if i < len(group_keys) - 1:
        end_page = groups[group_keys[i+1]][0]["ページ"] - 1
    else:
        end_page = 450 # 仮の終端

    chapters_str += f"""            {{ id: "ch{i+1}", title: "{subj}", start: {start_page}, end: {end_page}, subsections: [\n"""
    
    for j, item in enumerate(items):
        title = item.get("章番号", "") + " " + item["タイトル"] if "章番号" in item else item["タイトル"]
        num = j + 1
        page = item["ページ"]
        chapters_str += f"""                {{ num: {num}, title: "{title.strip()}", page: {page} }},\n"""
    
    # 最後のカンマを取る
    chapters_str = chapters_str.rstrip(",\n") + "\n"
    chapters_str += "            ]},\n"

chapters_str = chapters_str.rstrip(",\n") + "\n"

hs_data_snippet = f"""    chart_kyotsu_math: {{
        id: "chart_kyotsu_math",
        title: "新課程 チャート式 大学入学共通テスト対策 数学IA+IIBC",
        totalPages: 450, // 仮
        imagesPath: "images/chart_kyotsu_math/",
        printImagesPath: "images/chart_kyotsu_math_bw/",
        coverImage: "images/chart_kyotsu_math_cover.jpg",
        qrBase: "",
        chapters: [
{chapters_str}        ],
        get sections() {{
            return this.chapters.map(ch => ({{
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }}));
        }},
        pageQrs: {{}}
    }},
"""

with codecs.open("js/hs_data.js", "r", "utf-8") as f:
    content = f.read()

if "chart_kyotsu_math:" not in content:
    # const hsData = { の直後に追加
    content = content.replace("const hsData = {", "const hsData = {\n" + hs_data_snippet)
    with codecs.open("js/hs_data.js", "w", "utf-8") as f:
        f.write(content)
    print("Added chart_kyotsu_math to hs_data.js")
else:
    print("Already exists")
