# -*- coding: utf-8 -*-
"""
定期テスト対策ワーク 中1〜中3理科 TOC ページ整合チェック（改訂版）

チェック内容
  1. this_book_page の startPage が 1 以上 totalPages 以下か
  2. this_book_page の endPage が totalPages を超えていないか
  3. jhs_data.js の subsections に登録されたページが
     対応する TOC JSON の startPage と一致するか
     ※ 同名タイトルが複数ある場合は「ページ値の集合」で突合
"""
import json, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent
JS_TEXT = (ROOT / "js/jhs_data.js").read_text(encoding="utf-8")


def start_page(s: str):
    s = str(s or "").replace("~", "-")
    try:
        return int(s.split("-")[0].strip())
    except ValueError:
        return None


def end_page(s: str):
    s = str(s or "").replace("~", "-")
    try:
        return int(s.split("-")[-1].strip())
    except ValueError:
        return None


def get_subsections(book_id: str) -> list[tuple[str, int]]:
    """[(title, page), ...] を登録順で返す（重複タイトルを保持）"""
    m = re.search(
        rf'{re.escape(book_id)}.*?subsections:\s*\[(.+?)\]\s*\}}',
        JS_TEXT, re.DOTALL
    )
    if not m:
        return []
    return [
        (sub.group(1).strip(), int(sub.group(2)))
        for sub in re.finditer(
            r'\{\s*num:\s*[\w"]+,\s*title:\s*"([^"]+)",\s*page:\s*(\d+)',
            m.group(1)
        )
    ]


BOOKS = [("1", 148), ("2", 168), ("3", 168)]

all_ok = True

for grade, total in BOOKS:
    book_id = f"jhs_teiki_science{grade}"
    toc_path = ROOT / f"data/{book_id}_toc.json"
    toc = json.loads(toc_path.read_text(encoding="utf-8"))
    subs = get_subsections(book_id)

    # title → {page, page, ...} の集合辞書（重複タイトル対応）
    sub_page_set: dict[str, set] = {}
    for title, page in subs:
        sub_page_set.setdefault(title, set()).add(page)

    print(f"\n{'='*58}")
    print(f"  中{grade}  ({book_id}, totalPages={total})")
    print(f"{'='*58}")

    errors = []

    for block in toc["table_of_contents"]:
        for item in block.get("items", []):
            title = item["title"].strip()
            raw = item.get("this_book_page", "")
            sp = start_page(raw)
            ep = end_page(raw)

            # ① ページ値が取れるか
            if sp is None:
                errors.append(f"[ページ不明] \"{title}\" raw='{raw}'")
                continue

            # ② 範囲チェック
            if sp < 1:
                errors.append(f"[p<1]   \"{title}\" sp={sp}")
            if ep is not None and ep > total:
                errors.append(f"[超過]  \"{title}\" ep={ep} > totalPages={total}")

            # ③ subsections との突合（同名タイトルは集合で判定）
            pages_in_sub = sub_page_set.get(title)
            if pages_in_sub is not None:
                if sp not in pages_in_sub:
                    errors.append(
                        f"[不一致] \"{title}\" TOC startPage={sp} "
                        f"↔ jhs_data.js={sorted(pages_in_sub)}"
                    )

    if errors:
        all_ok = False
        for e in errors:
            print(f"  ❌ {e}")
    else:
        print("  ✅ 全件 OK")

    # 逆チェック: subsections に登録されているが TOC JSON に無いページ
    toc_sp_by_title: dict[str, set] = {}
    for block in toc["table_of_contents"]:
        for item in block.get("items", []):
            t = item["title"].strip()
            sp = start_page(item.get("this_book_page", ""))
            if sp is not None:
                toc_sp_by_title.setdefault(t, set()).add(sp)

    orphan = []
    for title, page in subs:
        toc_pages = toc_sp_by_title.get(title)
        if toc_pages is None:
            # "表紙・目次" のように TOC JSON に無いのは想定内
            pass
        elif page not in toc_pages:
            orphan.append(f"  ⚠️  jhs_data.js subsection \"{title}\" page={page} が TOC JSON に存在しない")
    for o in orphan:
        print(o)

print(f"\n{'='*58}")
print("総合:", "✅ 全チェック OK" if all_ok else "❌ 要修正あり（上記参照）")
print("=" * 58)
