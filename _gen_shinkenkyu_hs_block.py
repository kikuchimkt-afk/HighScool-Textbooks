import json
import os

repo = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(repo, "data", "shinkenkyu_chem_reference.json"), encoding="utf-8") as f:
    ch = json.load(f)["chapters"]
pj = json.dumps(ch, ensure_ascii=False, indent=4).split("\n")
lines = ["        chapters: " + pj[0]] + ["        " + line for line in pj[1:]]
ch_text = "\n".join(lines)
block = f"""    shinkenkyu_chem: {{
        id: "shinkenkyu_chem",
        title: "化学の新研究 改訂版",
        totalPages: 836,
        imagesPath: "images/shinkenkyu_chem/",
        printImagesPath: "images/shinkenkyu_chem/",
        coverImage: "images/shinkenkyu_chem_cover.jpg",
        qrBase: "",
{ch_text},
        get sections() {{
            return this.chapters.map(ch => ({{
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }}));
        }},
        pageQrs: {{}}
    }},

"""
outp = os.path.join(repo, "_shinkenkyu_chem_hs_block.txt")
with open(outp, "w", encoding="utf-8") as f:
    f.write(block)
print("wrote", outp, "chars", len(block))
