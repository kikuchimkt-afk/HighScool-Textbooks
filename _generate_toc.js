/**
 * TOC HTMLファイル生成スクリプト (Apple風デザイン)
 * hs_data.js からデータを読み取り、5つのTOCファイルを生成する
 * 
 * 使い方: node _generate_toc.js
 */
const fs = require('fs');
const path = require('path');

// hs_data.js を読み込み
const { hsData } = require('./js/hs_data.js');

function generateTocHtml(bookId, bookData) {
    const viewerFile = `${bookId}_viewer.html`;
    const chapters = bookData.chapters || [];

    let tocItems = '';
    chapters.forEach(ch => {
        const hasSubsections = ch.subsections && ch.subsections.length > 0;

        if (hasSubsections) {
            // 折りたたみ式（アコーディオン）
            tocItems += `
        <div class="toc-chapter">
            <details class="toc-accordion">
                <summary class="toc-chapter-link">
                    <span class="toc-chapter-title">${ch.title}</span>
                    <span class="toc-chapter-meta">
                        <span class="toc-chapter-pages">p.${ch.start}–${ch.end}</span>
                        <span class="toc-chevron">▶</span>
                    </span>
                </summary>
                <div class="toc-subsections">`;
            ch.subsections.forEach(sub => {
                tocItems += `
                    <a href="${viewerFile}?book=${bookId}&page=${sub.page}" class="toc-sub-link">
                        <span class="toc-sub-num">${sub.num}</span>
                        <span class="toc-sub-title">${sub.title}</span>
                        <span class="toc-sub-page">p.${sub.page}</span>
                    </a>`;
            });
            tocItems += `
                </div>
            </details>
        </div>`;
        } else {
            // サブセクションなし - 通常リンク
            tocItems += `
        <div class="toc-chapter">
            <a href="${viewerFile}?book=${bookId}&section=${ch.id}&page=1" class="toc-chapter-link toc-chapter-link-plain">
                <span class="toc-chapter-title">${ch.title}</span>
                <span class="toc-chapter-pages">p.${ch.start}–${ch.end}</span>
            </a>
        </div>`;
        }
    });

    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${bookData.title} | 目次</title>
    <meta name="description" content="${bookData.title} 目次一覧">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" sizes="32x32" href="icons/${bookId}_32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="icons/${bookId}_180.png">
    <link rel="manifest" href="manifest_${bookId}.json">
    <meta name="theme-color" content="#000000">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #000;
            min-height: 100vh; color: #f5f5f7;
        }
        .bg-layer {
            position: fixed; inset: 0; z-index: 0;
        }
        .bg-layer img {
            width: 100%; height: 100%; object-fit: cover;
            filter: brightness(0.5) saturate(1.2);
        }
        .bg-overlay {
            position: fixed; inset: 0; z-index: 1;
            background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);
        }
        .toc-page { position: relative; z-index: 2; }
        .toc-header {
            text-align: center; padding: 3rem 1.5rem 1.5rem;
        }
        .toc-back {
            display: inline-flex; align-items: center; gap: 6px;
            color: rgba(255,255,255,0.4); text-decoration: none;
            font-size: 0.85rem; margin-bottom: 1.5rem;
            transition: color 0.25s; font-weight: 400;
        }
        .toc-back:hover { color: rgba(255,255,255,0.8); }
        .toc-header h1 {
            font-size: 2.2rem; font-weight: 700;
            letter-spacing: -0.03em; margin-bottom: 0.3rem;
            background: linear-gradient(135deg, #fff, rgba(255,255,255,0.6));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .toc-header p {
            font-size: 0.9rem; color: rgba(255,255,255,0.35);
            font-weight: 300;
        }
        .toc-container {
            max-width: 720px; margin: 0 auto; padding: 0 1rem 4rem;
        }
        .toc-cover {
            display: block; max-width: 180px; margin: 0 auto 2rem;
            border-radius: 14px;
            box-shadow: 0 12px 40px rgba(0,0,0,0.5);
        }
        .toc-chapter {
            margin-bottom: 0.6rem;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(40px) saturate(1.5);
            -webkit-backdrop-filter: blur(40px) saturate(1.5);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 16px; overflow: hidden;
            box-shadow: 0 2px 12px rgba(0,0,0,0.15),
                        inset 0 1px 0 rgba(255,255,255,0.05);
        }
        /* --- Accordion --- */
        .toc-accordion { border: none; }
        .toc-accordion summary { list-style: none; cursor: pointer; }
        .toc-accordion summary::-webkit-details-marker { display: none; }
        .toc-accordion summary::marker { display: none; content: ''; }
        .toc-chapter-link {
            display: flex; justify-content: space-between; align-items: center;
            padding: 0.85rem 1.2rem; text-decoration: none; color: #f5f5f7;
            font-weight: 600; font-size: 0.95rem;
            transition: background 0.25s;
            letter-spacing: -0.01em;
        }
        .toc-chapter-link:hover {
            background: rgba(255,255,255,0.06);
        }
        .toc-chapter-meta {
            display: flex; align-items: center; gap: 8px;
        }
        .toc-chevron {
            font-size: 0.65rem; color: rgba(255,255,255,0.3);
            transition: transform 0.3s ease;
            display: inline-block;
        }
        .toc-accordion[open] .toc-chevron {
            transform: rotate(90deg);
        }
        .toc-chapter-pages {
            font-size: 0.75rem; color: rgba(255,255,255,0.3);
            font-weight: 400; white-space: nowrap;
        }
        .toc-subsections {
            border-top: 1px solid rgba(255,255,255,0.06);
            padding: 0.2rem 0;
            animation: tocSlideDown 0.25s ease;
        }
        @keyframes tocSlideDown {
            from { opacity: 0; max-height: 0; }
            to { opacity: 1; max-height: 2000px; }
        }
        .toc-sub-link {
            display: flex; align-items: center; gap: 8px;
            padding: 0.45rem 1.2rem 0.45rem 1.6rem;
            text-decoration: none; color: rgba(255,255,255,0.65);
            font-size: 0.84rem; transition: all 0.25s;
            font-weight: 400;
        }
        .toc-sub-link:hover {
            background: rgba(255,255,255,0.05);
            color: rgba(255,255,255,0.9);
        }
        .toc-sub-num {
            min-width: 26px; text-align: right; font-weight: 500;
            color: rgba(160,140,255,0.7); font-size: 0.82rem;
            font-variant-numeric: tabular-nums;
        }
        .toc-sub-title { flex: 1; }
        .toc-sub-page {
            font-size: 0.72rem; color: rgba(255,255,255,0.2);
            white-space: nowrap; font-variant-numeric: tabular-nums;
        }
        .toc-footer {
            text-align: center; padding: 2rem 1rem;
            font-size: 0.7rem; color: rgba(255,255,255,0.2);
        }
        @media (max-width: 600px) {
            .toc-header h1 { font-size: 1.6rem; }
            .toc-header { padding: 2rem 1rem 1rem; }
            .toc-sub-link { padding-left: 1rem; font-size: 0.8rem; }
            .toc-chapter-link { font-size: 0.9rem; }
        }
    </style>
</head>
<body>
    <div class="bg-layer">
        <img src="images/portal_bg.png" alt="" loading="eager">
    </div>
    <div class="bg-overlay"></div>
    <div class="toc-page">
        <div class="toc-header">
            <a href="index.html" class="toc-back">← ポータルに戻る</a>
            <h1>${bookData.title}</h1>
            <p>全${bookData.totalPages}ページ</p>
        </div>
        <div class="toc-container">
            <img src="${bookData.coverImage}" alt="${bookData.title} 表紙" class="toc-cover">
            ${tocItems}
        </div>
        <div class="toc-footer">© 2026 ECCベストワン藍住・北島中央</div>
    </div>
    <script>
        // 同時に1つだけ開くアコーディオン制御
        document.querySelectorAll('.toc-accordion').forEach(det => {
            det.addEventListener('toggle', () => {
                if (det.open) {
                    document.querySelectorAll('.toc-accordion').forEach(other => {
                        if (other !== det) other.open = false;
                    });
                }
            });
        });
    </script>
</body>
</html>`;
}

// 全書籍のTOC生成
const bookIds = Object.keys(hsData);

bookIds.forEach(bookId => {
    const bookData = hsData[bookId];
    const html = generateTocHtml(bookId, bookData);
    const outPath = path.join(__dirname, `${bookId}_toc.html`);
    fs.writeFileSync(outPath, html, 'utf-8');
    console.log(`✅ ${outPath} (${(html.length / 1024).toFixed(1)} KB)`);
});

console.log(`\n🎉 ${bookIds.length}件のTOCファイルを生成しました`);
