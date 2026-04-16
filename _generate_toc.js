/**
 * TOC HTMLファイル生成スクリプト
 * hs_data.js からデータを読み取り、5つのTOCファイルを生成する
 * 
 * 使い方: node _generate_toc.js
 */
const fs = require('fs');
const path = require('path');

// hs_data.js を読み込み
const { hsData } = require('./js/hs_data.js');

function generateTocHtml(bookId, bookData, portalData) {
    const viewerFile = `${bookId}_viewer.html`;
    const chapters = bookData.chapters || [];

    let tocItems = '';
    chapters.forEach(ch => {
        const hasSubsections = ch.subsections && ch.subsections.length > 0;
        
        tocItems += `
        <div class="toc-chapter">
            <a href="${viewerFile}?book=${bookId}&section=${ch.id}&page=1" class="toc-chapter-link">
                <span class="toc-chapter-title">${ch.title}</span>
                <span class="toc-chapter-pages">p.${ch.start}–${ch.end}</span>
            </a>`;

        if (hasSubsections) {
            tocItems += `
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
            </div>`;
        }

        tocItems += `
        </div>`;
    });

    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${bookData.title} | 目次</title>
    <meta name="description" content="${bookData.title} 目次一覧">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" sizes="32x32" href="icons/${bookId}_32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="icons/${bookId}_180.png">
    <link rel="manifest" href="manifest_${bookId}.json">
    <meta name="theme-color" content="#1e3c72">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Noto Sans JP', sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            min-height: 100vh; color: #fff;
        }
        .toc-header {
            text-align: center; padding: 2rem 1rem 1rem;
        }
        .toc-header h1 {
            font-size: 1.8rem; margin-bottom: 0.3rem;
        }
        .toc-header p {
            font-size: 0.95rem; opacity: 0.7;
        }
        .toc-back {
            display: inline-flex; align-items: center; gap: 6px;
            color: rgba(255,255,255,0.7); text-decoration: none;
            font-size: 0.9rem; margin-bottom: 1rem; transition: color 0.2s;
        }
        .toc-back:hover { color: #fff; }
        .toc-container {
            max-width: 800px; margin: 0 auto; padding: 0 1rem 3rem;
        }
        .toc-cover {
            display: block; max-width: 200px; margin: 0 auto 1.5rem;
            border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        .toc-chapter {
            margin-bottom: 0.5rem;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 12px; overflow: hidden;
        }
        .toc-chapter-link {
            display: flex; justify-content: space-between; align-items: center;
            padding: 0.8rem 1.2rem; text-decoration: none; color: #fff;
            font-weight: 700; font-size: 1.05rem;
            transition: background 0.2s;
        }
        .toc-chapter-link:hover {
            background: rgba(255,255,255,0.1);
        }
        .toc-chapter-pages {
            font-size: 0.8rem; opacity: 0.6; font-weight: 400; white-space: nowrap;
        }
        .toc-subsections {
            border-top: 1px solid rgba(255,255,255,0.1);
            padding: 0.3rem 0;
        }
        .toc-sub-link {
            display: flex; align-items: center; gap: 8px;
            padding: 0.4rem 1.2rem 0.4rem 1.8rem;
            text-decoration: none; color: rgba(255,255,255,0.85);
            font-size: 0.88rem; transition: background 0.2s;
        }
        .toc-sub-link:hover {
            background: rgba(255,255,255,0.08); color: #fff;
        }
        .toc-sub-num {
            min-width: 28px; text-align: right; font-weight: 600;
            color: rgba(79,172,254,0.9); font-size: 0.85rem;
        }
        .toc-sub-title { flex: 1; }
        .toc-sub-page {
            font-size: 0.78rem; opacity: 0.5; white-space: nowrap;
        }
        .toc-footer {
            text-align: center; padding: 2rem 1rem;
            font-size: 0.8rem; opacity: 0.4;
        }
        @media (max-width: 600px) {
            .toc-header h1 { font-size: 1.4rem; }
            .toc-sub-link { padding-left: 1.2rem; font-size: 0.82rem; }
        }
    </style>
</head>
<body>
    <div class="toc-header">
        <a href="index.html" class="toc-back">← ポータルに戻る</a>
        <h1>📖 ${bookData.title}</h1>
        <p>全${bookData.totalPages}ページ ─ 目次</p>
    </div>
    <div class="toc-container">
        <img src="${bookData.coverImage}" alt="${bookData.title} 表紙" class="toc-cover">
        ${tocItems}
    </div>
    <div class="toc-footer">© 2026 ECCベストワン藍住・北島中央</div>
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
