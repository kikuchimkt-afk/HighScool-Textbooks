# -*- coding: utf-8 -*-
"""
HighScool-Textbooks を高校向け・中学向けの2ディレクトリに複製し、それぞれ不要ファイルを削除して調整する。

出力先（既定）:
  ../Highschool_text
  ../JuniorHigh_text

使い方:
  python tools/split_portal_repos.py
"""
from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEST_HS = ROOT.parent / "Highschool_text"
DEST_JH = ROOT.parent / "JuniorHigh_text"

IGNORE_COPY = shutil.ignore_patterns(
    ".git",
    ".cursor",
    "__pycache__",
    ".DS_Store",
    "Thumbs.db",
    "*.pyc",
)


def _clear_dest_keep_git(dest: Path) -> None:
    """既存フォルダは .git 以外を削除（ロックで失敗しにくくする）。"""
    if not dest.exists():
        dest.mkdir(parents=True)
        return
    for child in dest.iterdir():
        if child.name == ".git":
            continue
        if child.is_dir():
            shutil.rmtree(child, ignore_errors=True)
        else:
            try:
                child.unlink()
            except OSError:
                pass


def copy_source(dest: Path) -> None:
    print(f"  コピー: {ROOT} -> {dest}")
    _clear_dest_keep_git(dest)
    shutil.copytree(ROOT, dest, dirs_exist_ok=True, ignore=IGNORE_COPY)


def patch_hs_app(data_map_line: str, dest: Path) -> None:
    p = dest / "js" / "hs_app.js"
    text = p.read_text(encoding="utf-8")
    old = "const dataMap = Object.assign({}, (typeof hsData !== 'undefined' ? hsData : {}), (typeof jhsData !== 'undefined' ? jhsData : {}));"
    if old not in text:
        raise SystemExit(f"hs_app.js の dataMap 行が想定と異なります: {p}")
    text = text.replace(old, data_map_line, 1)
    p.write_text(text, encoding="utf-8")


def filter_index_books_html(html: str, keep_jhs: bool) -> str:
    start = html.find("const books = [")
    if start < 0:
        raise ValueError("const books = [ が見つかりません")
    end = html.find("\n    ];", start)
    if end < 0:
        raise ValueError("books 配列の終端が見つかりません")
    inner_start = start + len("const books = [")
    head = html[:inner_start]
    tail = html[end:]
    block = html[inner_start:end]
    lines_out = []
    for line in block.splitlines(keepends=True):
        s = line.strip()
        if not s.startswith("{ id:"):
            lines_out.append(line)
            continue
        is_jhs = "cat: 'jhs'" in line
        if keep_jhs:
            if is_jhs:
                lines_out.append(line)
        else:
            if not is_jhs:
                lines_out.append(line)
    return head + "".join(lines_out) + tail


def patch_index_high_school(dest: Path) -> None:
    p = dest / "index.html"
    html = p.read_text(encoding="utf-8")
    html = filter_index_books_html(html, keep_jhs=False)
    html = html.replace("<title>教材 ビューア ポータル</title>", "<title>高校向け 教材ビューア</title>")
    html = html.replace(
        "<h1>教材<br>電子ビューア</h1>",
        "<h1>高校向け<br>電子ビューア</h1>",
    )
    html = html.replace(
        '<div class="header-badge">Digital Textbook Viewer</div>',
        '<div class="header-badge">High School</div>',
    )
    html = html.replace(
        '\n        <button class="tab-btn" data-cat="jhs">中学生</button>',
        "",
    )
    html = re.sub(
        r'\s*<span style="color:rgba\(255,255,255,0.25\);margin:0 0.5rem;">·</span>\s*\n\s*<a href="jhs_reference_catalog.html"[^>]*>[^<]*</a>',
        "",
        html,
        count=1,
    )
    p.write_text(html, encoding="utf-8")


JH_BOOKS_BODY = """
        { id: 'jhs_iwork_english3', cat: 'jeng', title: 'iワーク 中3英語', desc: '開隆堂「SUNSHINE ENGLISH COURSE 3」本冊・解答・iワークプラス', cover: 'images/jhs_iwork_english3_cover.jpg', toc: 'jhs_iwork_english3_toc.html' },
        { id: 'jhs_iwork_english2', cat: 'jeng', title: 'iワーク 中2英語', desc: '開隆堂「SUNSHINE ENGLISH COURSE 2」本冊・解答・iワークプラス', cover: 'images/jhs_iwork_english2_cover.jpg', toc: 'jhs_iwork_english2_toc.html' },
        { id: 'jhs_iwork_english1', cat: 'jeng', title: 'iワーク 中1英語', desc: '啓林館「SUNSHINE ENGLISH COURSE 1」本冊・解答・iワークプラス', cover: 'images/jhs_iwork_english1_cover.jpg', toc: 'jhs_iwork_english1_toc.html' },
        { id: 'jhs_iwork_math1', cat: 'jmath', title: 'iワーク 中1数学', desc: '啓林館「未来へひろがる数学1」本冊・解答・iワークプラス', cover: 'images/jhs_iwork_math1_cover.png', toc: 'jhs_iwork_math1_toc.html' },
        { id: 'jhs_iwork_math2', cat: 'jmath', title: 'iワーク 中2数学', desc: '啓林館「未来へひろがる数学2」本冊・解答・iワークプラス', cover: 'images/jhs_iwork_math2_cover.png', toc: 'jhs_iwork_math2_toc.html' },
        { id: 'jhs_iwork_math3', cat: 'jmath', title: 'iワーク 中3数学', desc: '啓林館「未来へひろがる数学3」本冊・解答・iワークプラス', cover: 'images/jhs_iwork_math3_cover.png', toc: 'jhs_iwork_math3_toc.html' },
        { id: 'jhs_iwork_science1', cat: 'jsci', title: 'iワーク 中1理科', desc: '本冊・解答解説・iワークプラスをまとめた中学生向け教材', cover: 'images/jhs_iwork_science1_cover.jpg', toc: 'jhs_iwork_science1_toc.html' },
        { id: 'jhs_teiki_science1', cat: 'jsci', title: '定期テスト対策ワーク 理科 中1', desc: '啓林館 定期テスト対策ワーク（中1理科）', cover: 'images/jhs_teiki_science1_cover.jpg', toc: 'jhs_teiki_science1_toc.html' },
        { id: 'jhs_teiki_science2', cat: 'jsci', title: '定期テスト対策ワーク 理科 中2', desc: '啓林館 定期テスト対策ワーク（中2理科）', cover: 'images/jhs_teiki_science2_cover.jpg', toc: 'jhs_teiki_science2_toc.html' },
        { id: 'jhs_teiki_science3', cat: 'jsci', title: '定期テスト対策ワーク 理科 中3', desc: '啓林館 定期テスト対策ワーク（中3理科）', cover: 'images/jhs_teiki_science3_cover.jpg', toc: 'jhs_teiki_science3_toc.html' },
        { id: 'jhs_iwork_science2', cat: 'jsci', title: 'iワーク 中2理科', desc: '本冊・解答解説・iワークプラスをまとめた中学生向け教材', cover: 'images/jhs_iwork_science2_cover.jpg', toc: 'jhs_iwork_science2_toc.html' },
        { id: 'jhs_iwork_science3', cat: 'jsci', title: 'iワーク 中3理科', desc: '本冊・解答解説・iワークプラスをまとめた中学生向け教材', cover: 'images/jhs_iwork_science3_cover.jpg', toc: 'jhs_iwork_science3_toc.html' }
"""


def patch_jh_viewer_default_book(dest: Path) -> None:
    p = dest / "js" / "hs_app.js"
    text = p.read_text(encoding="utf-8")
    text = text.replace(
        "const bookId = urlParams.get('book') || 'superquick_math1a';",
        "const bookId = urlParams.get('book') || 'jhs_iwork_math1';",
    )
    p.write_text(text, encoding="utf-8")


def patch_index_junior_high(dest: Path) -> None:
    p = dest / "index.html"
    html = p.read_text(encoding="utf-8")
    start = html.find("const books = [")
    end = html.find("\n    ];", start)
    if start < 0 or end < 0:
        raise ValueError("books 配列が見つかりません")
    inner_start = start + len("const books = [")
    head = html[:inner_start]
    tail = html[end:]
    html = head + "\n" + JH_BOOKS_BODY.strip() + "\n    " + tail

    html = html.replace("<title>教材 ビューア ポータル</title>", "<title>中学向け 教材ビューア</title>")
    html = html.replace(
        "<h1>教材<br>電子ビューア</h1>",
        "<h1>中学向け<br>電子ビューア</h1>",
    )
    html = html.replace(
        '<div class="header-badge">Digital Textbook Viewer</div>',
        '<div class="header-badge">Junior High</div>',
    )
    html = re.sub(
        r'<div class="tabs" id="category-tabs">.*?</div>',
        """<div class="tabs" id="category-tabs">
        <button class="tab-btn active" data-cat="all">すべて</button>
        <button class="tab-btn" data-cat="jmath">数学</button>
        <button class="tab-btn" data-cat="jsci">理科</button>
        <button class="tab-btn" data-cat="jeng">英語</button>
    </div>""",
        html,
        count=1,
        flags=re.DOTALL,
    )
    html = re.sub(
        r'<p style="text-align:center[^>]*>.*?</p>',
        """<p style="text-align:center;margin:-0.5rem 0 1.25rem;font-size:0.88rem;line-height:1.6;">
        <a href="jhs_reference_catalog.html" style="color:rgba(180,230,200,0.9);text-decoration:none;border-bottom:1px solid rgba(180,230,200,0.35);">中学参考書を表紙全体で一覧</a>
    </p>""",
        html,
        count=1,
        flags=re.DOTALL,
    )
    html = html.replace(
        "const SESSION_KEY = 'hs_portal_auth';",
        "const SESSION_KEY = 'jh_portal_auth';",
    )
    p.write_text(html, encoding="utf-8")


def delete_hs_artifacts(dest: Path) -> None:
    for f in dest.glob("jhs_*.html"):
        f.unlink()
    ref = dest / "jhs_reference_catalog.html"
    if ref.exists():
        ref.unlink()
    jd = dest / "js" / "jhs_data.js"
    if jd.exists():
        jd.unlink()
    data = dest / "data"
    if data.is_dir():
        for f in data.glob("jhs_*.json"):
            f.unlink()
    ic = dest / "icons"
    if ic.is_dir():
        for f in ic.glob("jhs_*"):
            f.unlink()
    for f in dest.glob("manifest_jhs*.json"):
        f.unlink()
    im = dest / "images"
    if im.is_dir():
        for f in im.glob("jhs_*"):
            if f.is_file():
                f.unlink()
            else:
                shutil.rmtree(f)


def delete_jh_artifacts(dest: Path) -> None:
    keep = {"index.html", "jhs_reference_catalog.html"}
    for f in dest.glob("*.html"):
        if f.name in keep:
            continue
        if f.name.startswith("jhs_"):
            continue
        f.unlink()
    hs = dest / "hs_reference_catalog.html"
    if hs.exists():
        hs.unlink()
    hd = dest / "js" / "hs_data.js"
    if hd.exists():
        hd.unlink()
    data = dest / "data"
    if data.is_dir():
        for f in data.iterdir():
            if f.suffix.lower() != ".json":
                continue
            if f.name.startswith("jhs_"):
                continue
            f.unlink()
    for f in dest.glob("manifest*.json"):
        if "jhs" not in f.name.lower():
            f.unlink()
    ic = dest / "icons"
    if ic.is_dir():
        for f in ic.iterdir():
            if f.name.startswith("jhs_"):
                continue
            if f.is_file():
                f.unlink()
    im = dest / "images"
    if im.is_dir():
        for f in im.iterdir():
            if f.name == "portal_bg.png":
                continue
            if f.name.startswith("jhs_"):
                continue
            if f.is_file():
                f.unlink()
            else:
                shutil.rmtree(f)


def main() -> int:
    print("=== 高校向け: Highschool_text ===")
    copy_source(DEST_HS)
    delete_hs_artifacts(DEST_HS)
    patch_hs_app(
        "const dataMap = Object.assign({}, (typeof hsData !== 'undefined' ? hsData : {}));",
        DEST_HS,
    )
    patch_index_high_school(DEST_HS)

    print("=== 中学向け: JuniorHigh_text ===")
    copy_source(DEST_JH)
    delete_jh_artifacts(DEST_JH)
    patch_hs_app(
        "const dataMap = Object.assign({}, (typeof jhsData !== 'undefined' ? jhsData : {}));",
        DEST_JH,
    )
    patch_jh_viewer_default_book(DEST_JH)
    patch_index_junior_high(DEST_JH)

    print("完了.")
    print(f"  {DEST_HS}")
    print(f"  {DEST_JH}")
    print("各フォルダで git init し、新規リポジトリとして push してください。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
