import codecs

with codecs.open('js/hs_data.js', 'r', 'utf-8') as f:
    text = f.read()

text = text.replace('id: "ch6", title: "その他", start: 311, end: 659', 'id: "ch6", title: "その他", start: 311, end: 387')

old_part = '                { num: 3, title: "答の部", page: 370 }\r\n            ]}\r\n        ],\r\n        get sections()'
new_part = '                { num: 3, title: "答の部", page: 370 }\r\n            ]},\r\n            { id: "answers", title: "別冊解答編", start: 388, end: 659, subsections: [\r\n                { num: 4, title: "解答・解説（カラー）", page: 388 }\r\n            ]}\r\n        ],\r\n        get sections()'

text = text.replace(old_part, new_part)

with codecs.open('js/hs_data.js', 'w', 'utf-8') as f:
    f.write(text)

print("Updated hs_data.js")
