import re

with open(r'js\hs_data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# tanki_math2b の totalPages を書き換え
content = content.replace('totalPages: 186,', 'totalPages: 189,')

# answers の start/end, subsections 内の page を +3 して書き換え
old_answers = """            { id: "answers", title: "解答・解説編", start: 109, end: 186, subsections: [
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

new_answers = """            { id: "answers", title: "解答・解説編", start: 112, end: 189, subsections: [
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

content = content.replace(old_answers, new_answers)

with open(r'js\hs_data.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done.")
