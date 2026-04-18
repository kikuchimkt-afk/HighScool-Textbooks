# 実戦化学 重要問題集 — 追加・更新ワークフロー

書籍 ID: `jissen_chem_key`。初回登録済みの前提で、**素材からサムネイル・ファビコン・ビューア画像を再生成する手順**です。

## 前提

- Python 3.10+
- 依存: `pip install pillow pymupdf`

## 一括自動化（推奨）

既定の素材フォルダ:

`D:\Files\(2025版)実戦化学重要問題集`

内訳:

| ファイル | 用途 |
|---------|------|
| `61Fdxds4SWL._SL1376_.jpg`（または `--product-jpg`） | LP／目次の**表紙サムネイル**（フル）＋**ファビコン／PWA アイコン**（**上半分**を正方形化） |
| フォルダ内の **最新の `.pdf`** | ビューア用 `images/jissen_chem_key/page_0001.png` … |

### コマンド

```bash
# 表紙・ファビコン + PDF ページ画像（PDF がある場合）
python _workflow_jissen_chem_key_assets.py

# PDF が無い／後で入れる場合は表紙・ファビコンのみ
python _workflow_jissen_chem_key_assets.py --skip-pdf
# または
python _workflow_jissen_chem_key_assets.py --product-only
```

PDF まで出力したあと、**総ページを `hs_data.js` と目次 HTML に自動反映**する場合:

```bash
python _workflow_jissen_chem_key_assets.py --patch-sources
```

`--patch-sources` は PDF からページ画像を書き出せたときだけ有効です（`totalPages` と `jissen_chem_key_toc.html` の「全Nページ」を更新）。

### オプション

| オプション | 意味 |
|-----------|------|
| `--source-dir PATH` | 素材フォルダ（既定は上記 D パス） |
| `--product-jpg ファイル名` | `source-dir` 内の商品写真名 |
| `--skip-pdf` | PDF レンダリングを省略 |
| `--product-only` | `--skip-pdf` と同じ |
| `--patch-sources` | PDF 成功時に `js/hs_data.js` と `jissen_chem_key_toc.html` を更新 |

## 出力先

| 生成物 | パス |
|--------|------|
| サムネイル（カラー・全体） | `images/jissen_chem_key_cover.jpg` |
| ファビコン / PWA | `icons/jissen_chem_key_32.png` … `512.png` |
| ビューア | `images/jissen_chem_key/page_XXXX.png` |

## LP（ポータル）の表示

`index.html` / `hs_reference_catalog.html` のカードは `object-fit: contain` で**表紙全体**を表示します。サムネイルは **`jissen_chem_key_cover.jpg`（商品写真のフル）** です。ファビコン用の「上半分トリミング」は **アイコン専用**で、LP とは別ファイルです。

## 初回の書籍登録（既に完了している作業のメモ）

- `js/hs_data.js` に `jissen_chem_key` ブロック
- `jissen_chem_key_toc.html` / `jissen_chem_key_viewer.html` / `manifest_jissen_chem_key.json`
- `index.html` / `hs_reference_catalog.html` の書籍一覧
- 章データ: `data/jissen_chem_key_book_index.json`

新規の別書籍では同パターンで複製してください。

## 旧スクリプト

- `_gen_jissen_chem_key_from_pdf.py` → ワークフローに統合済み（単体実行も可）
- `_gen_jissen_chem_key_icons.py` → 同上
