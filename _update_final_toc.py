import json
import codecs
import re

ans_json = """
{
  "第1章 数と式、集合と命題": { "Check": "P1", "練習": "P3", "問題": "P7", "実戦問題": "P8" },
  "第2章 2次関数": { "Check": "P11", "練習": "P17", "問題": "P21", "実戦問題": "P24" },
  "第3章 図形と計量": { "Check": "P31", "練習": "P34", "問題": "P37", "実戦問題": "P39" },
  "第4章 データの分析": { "Check": "P46", "練習": "P47", "問題": "P52", "実戦問題": "P53" },
  "第5章 場合の数と確率": { "Check": "P57", "練習": "P61", "問題": "P66", "実戦問題": "P67" },
  "第6章 図形の性質": { "Check": "P76", "練習": "P79", "問題": "P82", "実戦問題": "P83" },
  "第7章 式と証明、複素数と方程式": { "Check": "P88", "練習": "P92", "問題": "P95", "実戦問題": "P97" },
  "第8章 図形と方程式": { "Check": "P101", "練習": "P104", "問題": "P110", "実戦問題": "P112" },
  "第9章 三角関数": { "Check": "P118", "練習": "P121", "問題": "P124", "実戦問題": "P127" },
  "第10章 指数関数・対数関数": { "Check": "P131", "練習": "P135", "問題": "P138", "実戦問題": "P139" },
  "第11章 微分法・積分法": { "Check": "P144", "練習": "P149", "問題": "P151", "実戦問題": "P161" },
  "第12章 数列": { "Check": "P167", "練習": "P170", "問題": "P176", "実戦問題": "P178" },
  "第13章 統計的な推測": { "Check": "P184", "練習": "P187", "問題": "P191", "実戦問題": "P193" },
  "第14章 ベクトル": { "Check": "P197", "練習": "P201", "問題": "P206", "実戦問題": "P208" },
  "第15章 平面上の曲線と複素数平面": { "Check": "P215", "練習": "P222", "問題": "P226", "実戦問題": "P231" },
  "付録": { "実践模試": "P238" }
}
"""
ans_data = json.loads(ans_json)

OFFSET = 387
chapters_str = """
            { id: "ch1", title: "数学Ⅰ", start: 13, end: 87, subsections: [
                { num: 1, title: "第1章 数と式, 集合と命題", page: 13 },
                { num: 2, title: "第2章 2次関数", page: 28 },
                { num: 3, title: "第3章 図形と計量", page: 49 },
                { num: 4, title: "第4章 データの分析", page: 66 }
            ]},
            { id: "ch2", title: "数学A", start: 88, end: 131, subsections: [
                { num: 1, title: "第5章 場合の数と確率", page: 88 },
                { num: 2, title: "第6章 図形の性質", page: 115 }
            ]},
            { id: "ch3", title: "数学Ⅱ", start: 132, end: 224, subsections: [
                { num: 1, title: "第7章 式と証明, 複素数と方程式", page: 132 },
                { num: 2, title: "第8章 図形と方程式", page: 150 },
                { num: 3, title: "第9章 三角関数", page: 167 },
                { num: 4, title: "第10章 指数関数・対数関数", page: 184 },
                { num: 5, title: "第11章 微分法・積分法", page: 200 }
            ]},
            { id: "ch4", title: "数学B", start: 225, end: 266, subsections: [
                { num: 1, title: "第12章 数列", page: 225 },
                { num: 2, title: "第13章 統計的な推測", page: 247 }
            ]},
            { id: "ch5", title: "数学C", start: 267, end: 310, subsections: [
                { num: 1, title: "第14章 ベクトル", page: 267 },
                { num: 2, title: "第15章 平面上の曲線と複素数平面", page: 286 }
            ]},
            { id: "ch6", title: "その他", start: 311, end: 387, subsections: [
                { num: 1, title: "実践模試", page: 311 },
                { num: 2, title: "指針一覧", page: 348 },
                { num: 3, title: "答の部", page: 370 }
            ]},
"""

# 解答用の章を構築
ans_idx = 7
for ch_title, items in ans_data.items():
    subsections = ""
    start_page = 9999
    num = 1
    for k, v in items.items():
        page_val = int(v.replace("P", ""))
        real_page = offset_page = page_val + OFFSET
        if real_page < start_page:
            start_page = real_page
        subsections += f'                {{ num: {num}, title: "{k}", page: {real_page} }},\n'
        num += 1
    
    subsections = subsections.rstrip(",\n") + "\n"
    # End page calculation (just using max page for now, global end will be fixed at 659)
    chapters_str += f'            {{ id: "answers_ch{ans_idx}", title: "[解答] {ch_title}", start: {start_page}, end: 659, subsections: [\n{subsections}            ]}},\n'
    ans_idx += 1

chapters_str = chapters_str.rstrip(",\n")

block = f"""    chart_kyotsu_math: {{
        id: "chart_kyotsu_math",
        title: "新課程 チャート式 大学入学共通テスト対策 数学IA+IIBC",
        totalPages: 659,
        imagesPath: "images/chart_kyotsu_math/",
        printImagesPath: "images/chart_kyotsu_math_bw/",
        coverImage: "images/chart_kyotsu_math_cover.jpg",
        qrBase: "",
        chapters: [
{chapters_str}
        ],
        get sections() {{
            return this.chapters.map(ch => ({{
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }}));
        }},
        pageQrs: {{}}
    }},"""

with codecs.open("js/hs_data.js", "r", "utf-8") as f:
    text = f.read()

# 正規表現で chart_kyotsu_math のブロックを書き換え
pattern = re.compile(r'chart_kyotsu_math:\s*\{.*?pageQrs:\s*\{\}\s*\},', re.DOTALL)
if pattern.search(text):
    new_text = pattern.sub(block + "\n", text)
    with codecs.open("js/hs_data.js", "w", "utf-8") as f:
        f.write(new_text)
    print("Success: Updated hs_data.js with the final clean TOC.")
else:
    print("Error: Could not find chart_kyotsu_math block.")
