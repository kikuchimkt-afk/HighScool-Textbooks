/**
 * 高校参考書ビューア (hs_app.js)
 * セクション別PDFからの連番ページ画像を表示
 */
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('book') || 'superquick_math1a';
    const sectionId = urlParams.get('section') || 'main';
    const initialPage = parseInt(urlParams.get('page')) || 1;

    // Book data
    const bookData = hsData[bookId];
    if (!bookData) {
        document.body.innerHTML = '<h1 style="color:#fff;text-align:center;padding:4rem;">参考書データが見つかりません</h1>';
        return;
    }

    const TOTAL_PAGES = bookData.totalPages;
    const IMAGE_DIR = bookData.imagesPath;
    const sections = bookData.sections;

    // Find initial section
    const initialSection = sections.find(s => s.id === sectionId) || sections[0];
    // URLの`page`パラメータがグローバルページ番号かセクション内ローカルページかを判定する
    // TOCリンクは?page=グローバルページ番号で渡す。
    // グローバルとして解釈: pageがsectionの有効範囲(start..end)内なら直接使う
    // ローカルとして解釈: pageが小さく相対値の場合は start + (page-1)
    let currentPage;
    if (initialPage >= initialSection.start) {
        // pageがsectionのstart以上 → グローバルページとして直接使う (TOCリンクからのジャンプ)
        currentPage = initialPage;
    } else {
        // pageがローカル相対値（セクション内1始まり）
        currentPage = initialSection.start + (initialPage - 1);
    }
    if (currentPage < 1) currentPage = 1;
    if (currentPage > TOTAL_PAGES) currentPage = TOTAL_PAGES;

    // DOM refs
    const imgEl = document.getElementById('textbook-img');
    const imgRightEl = document.getElementById('textbook-img-right');
    const imageWrapper = document.getElementById('image-wrapper');
    const pageInd = document.getElementById('page-indicator');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const fsIcon = document.getElementById('fs-icon');
    const fsLabel = document.getElementById('fs-label');
    const viewerContainer = document.getElementById('viewer-container');
    const floatingNav = document.getElementById('floating-nav');
    const floatPrev = document.getElementById('float-prev');
    const floatNext = document.getElementById('float-next');
    const floatPage = document.getElementById('float-page');
    const floatExitFs = document.getElementById('float-exit-fs');
    const chapterTitle = document.getElementById('chapter-title');
    const backLink = document.getElementById('back-link');
    const qrBar = document.getElementById('qr-bar');
    const qrLink = document.getElementById('qr-link');
    const qrLinkLabel = document.getElementById('qr-link-label');

    const iframeModalOverlay = document.getElementById('iframe-modal-overlay');
    const iframeModalFrame = document.getElementById('iframe-modal-frame');
    const iframeModalClose = document.getElementById('iframe-modal-close');
    const iframeModalTitle = document.getElementById('iframe-modal-title');
    const iframeModal = document.querySelector('.iframe-modal');
    const iframeModalHeader = document.querySelector('.iframe-modal-header');
    const iframeModalResize = document.getElementById('iframe-modal-resize');

    // Set back link
    backLink.href = `${bookId}_toc.html`;

    // View mode: 'viewer' or 'spread'
    let viewMode = 'viewer';
    let currentZoom = 1;

    // ===== Mode Tabs =====
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const newMode = tab.dataset.mode;
            if (newMode === viewMode) return;
            setViewMode(newMode);
        });
    });

    function setViewMode(mode) {
        viewMode = mode;
        document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
        const activeTab = document.querySelector(`.mode-tab[data-mode="${mode}"]`);
        if (activeTab) activeTab.classList.add('active');

        viewerContainer.classList.remove('spread-mode');
        if (mode === 'spread') {
            viewerContainer.classList.add('spread-mode');
            btnFullscreen.style.display = 'inline-flex';
            floatingNav.style.display = 'block';
        } else {
            btnFullscreen.style.display = 'none';
            floatingNav.style.display = 'none';
            if (document.fullscreenElement) document.exitFullscreen();
        }

        loadPage(currentPage);
    }

    // ===== Zoom =====
    document.getElementById('btn-zoom-in').addEventListener('click', () => {
        currentZoom = Math.min(3, currentZoom + 0.25);
        applyZoom();
    });
    document.getElementById('btn-zoom-out').addEventListener('click', () => {
        currentZoom = Math.max(0.5, currentZoom - 0.25);
        applyZoom();
    });
    document.getElementById('btn-zoom-reset').addEventListener('click', () => {
        currentZoom = 1;
        applyZoom();
    });

    function applyZoom() {
        if (viewMode === 'spread') {
            imageWrapper.style.transform = `scale(${currentZoom})`;
            imgEl.style.transform = 'none';
            imgRightEl.style.transform = 'none';
        } else {
            imageWrapper.style.transform = 'none';
            imgEl.style.transform = `scale(${currentZoom})`;
        }
    }

    function getImageSrc(globalPage) {
        return `${IMAGE_DIR}/page_${globalPage.toString().padStart(4, '0')}.png`;
    }

    function getSectionForPage(p) {
        for (const s of sections) {
            if (p >= s.start && p <= s.end) return s;
        }
        return null;
    }

    function animatePageTurn(direction) {
        imageWrapper.classList.remove('page-turn-left', 'page-turn-right');
        void imageWrapper.offsetWidth;
        imageWrapper.classList.add(direction > 0 ? 'page-turn-left' : 'page-turn-right');
    }

    let isNavigating = false;

    function preloadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
        });
    }

    // ===== 先読みキャッシュ =====
    const prefetchCache = new Map();   // src -> true (読み込み済み)
    const PREFETCH_AHEAD = 5;          // 現在ページから前方5ページ先読み
    const PREFETCH_BEHIND = 2;         // 現在ページから後方2ページ先読み
    const PREFETCH_DELAY = 80;         // 各画像の読み込み間隔(ms) — 帯域圧迫防止

    function prefetchNearbyPages(centerPage) {
        const pages = [];
        // 前方を優先的にキューに入れる
        for (let i = 1; i <= PREFETCH_AHEAD; i++) {
            const p = centerPage + i;
            if (p >= 1 && p <= TOTAL_PAGES) pages.push(p);
        }
        // 後方も追加
        for (let i = 1; i <= PREFETCH_BEHIND; i++) {
            const p = centerPage - i;
            if (p >= 1 && p <= TOTAL_PAGES) pages.push(p);
        }
        // 見開きモードの場合は隣接ページも追加
        if (viewMode === 'spread') {
            const extra = [centerPage + 1, centerPage - 1];
            extra.forEach(p => {
                if (p >= 1 && p <= TOTAL_PAGES && !pages.includes(p)) pages.push(p);
            });
        }

        pages.forEach((p, idx) => {
            const src = getImageSrc(p);
            if (prefetchCache.has(src)) return;  // 既にキャッシュ済み
            prefetchCache.set(src, true);
            setTimeout(() => {
                const img = new Image();
                img.src = src;  // ブラウザキャッシュに載せるだけ
            }, idx * PREFETCH_DELAY);
        });
    }

    function loadPage(pageNum, direction) {
        if (pageNum < 1) pageNum = 1;
        if (pageNum > TOTAL_PAGES) pageNum = TOTAL_PAGES;
        if (isNavigating) return;

        const imagesToPreload = [];
        let resolvedLeftPage = pageNum;

        if (viewMode === 'spread') {
            // 数学の横書き参考書：偶数ページが左、奇数ページが右になります
            resolvedLeftPage = pageNum % 2 === 0 ? pageNum : pageNum - 1;
            
            if (resolvedLeftPage >= 1) {
                imagesToPreload.push(getImageSrc(resolvedLeftPage));
            }
            const rightPage = resolvedLeftPage + 1;
            if (rightPage <= TOTAL_PAGES) {
                imagesToPreload.push(getImageSrc(rightPage));
            }
        } else {
            imagesToPreload.push(getImageSrc(pageNum));
        }

        isNavigating = true;

        Promise.all(imagesToPreload.map(preloadImage)).then(() => {
            currentPage = viewMode === 'spread' ? resolvedLeftPage : pageNum;

            // URL update
            const sec = getSectionForPage(currentPage);
            const localPage = sec ? (currentPage - sec.start + 1) : currentPage;
            const secId = sec ? sec.id : sectionId;
            const newUrl = `${window.location.pathname}?book=${bookId}&section=${secId}&page=${localPage}`;
            window.history.replaceState(null, '', newUrl);

            // Reset zoom
            currentZoom = 1;
            imgEl.style.transform = 'scale(1)';
            imgRightEl.style.transform = 'scale(1)';
            imageWrapper.style.transform = 'none';

            if (direction !== undefined) animatePageTurn(direction);

            if (viewMode === 'spread') {
                if (resolvedLeftPage >= 1) {
                    imgEl.src = getImageSrc(resolvedLeftPage);
                    imgEl.style.visibility = 'visible';
                } else {
                    // 左ページが存在しない(例: p.1のみ)場合は非表示
                    imgEl.style.visibility = 'hidden';
                }
                
                const rightPage = resolvedLeftPage + 1;
                if (rightPage <= TOTAL_PAGES) {
                    imgRightEl.src = getImageSrc(rightPage);
                    imgRightEl.style.display = 'block';
                } else {
                    imgRightEl.style.display = 'none';
                }
                const labelPage1 = Math.max(1, resolvedLeftPage);
                const label = `${labelPage1}–${Math.min(rightPage, TOTAL_PAGES)} / ${TOTAL_PAGES}`;
                pageInd.textContent = label;
                floatPage.textContent = label;
            } else {
                imgEl.src = getImageSrc(currentPage);
                imgEl.style.visibility = 'visible';
                imgRightEl.style.display = 'none';
                pageInd.textContent = `${currentPage} / ${TOTAL_PAGES}`;
            }

            // Update title
            updateTitle(currentPage);

            // Update QR link bar
            updateQrBar(currentPage);

            imageWrapper.scrollTop = 0;
            isNavigating = false;

            // バックグラウンドで前後のページを先読みキャッシュ
            prefetchNearbyPages(currentPage);
        });
    }

    function updateQrBar(p) {
        const sec = getSectionForPage(p);
        const pageQr = bookData.pageQrs && bookData.pageQrs[p];

        if (pageQr) {
            qrLink.dataset.url = pageQr;
            const isStep = pageQr.includes('_st');
            const suffix = isStep ? ' 音声・動画' : ' 音声・動画 (ページ専用)';
            qrLinkLabel.textContent = sec ? `${sec.title}${suffix}` : `音声・動画 (ページ専用)`;
            qrBar.style.display = 'block';
        } else if (sec && sec.qrUrl) {
            qrLink.dataset.url = sec.qrUrl;
            qrLinkLabel.textContent = `${sec.title} 音声・動画`;
            qrBar.style.display = 'block';
        } else {
            qrBar.style.display = 'none';
        }
    }

    // モーダルのドラッグ機構とサイズ変更 (マウス・タッチ両対応)
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let currentTx = 0, currentTy = 0;

    function handleDragStart(e) {
        if (e.target.tagName.toLowerCase() === 'button') return;
        isDragging = true;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        dragStartX = clientX - currentTx;
        dragStartY = clientY - currentTy;
        iframeModalFrame.style.pointerEvents = 'none'; // prevent iframe stealing mouse/touch
    }

    function handleDragMove(e) {
        if (!isDragging) return;
        // prevent background scrolling on touch devices
        if (e.type.includes('touch')) e.preventDefault(); 
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        currentTx = clientX - dragStartX;
        currentTy = clientY - dragStartY;
        iframeModal.style.transform = `translate(${currentTx}px, ${currentTy}px)`;
    }

    function handleDragEnd() {
        if (isDragging) {
            isDragging = false;
            iframeModalFrame.style.pointerEvents = 'auto';
        }
    }

    iframeModalHeader.addEventListener('mousedown', handleDragStart);
    iframeModalHeader.addEventListener('touchstart', handleDragStart, { passive: false });

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('touchmove', handleDragMove, { passive: false });

    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchend', handleDragEnd);
    window.addEventListener('touchcancel', handleDragEnd);

    iframeModalResize.addEventListener('click', () => {
        iframeModal.classList.toggle('modal-half');
    });

    qrLink.addEventListener('click', (e) => {
        e.preventDefault();
        const url = qrLink.dataset.url;
        if (url) {
            iframeModalTitle.textContent = qrLinkLabel.textContent;
            iframeModalFrame.src = url;
            iframeModalOverlay.style.display = 'flex';
            // reset position and size when opened
            currentTx = 0;
            currentTy = 0;
            iframeModal.style.transform = `translate(0px, 0px)`;
            iframeModal.classList.remove('modal-half');
        }
    });

    iframeModalClose.addEventListener('click', () => {
        iframeModalOverlay.style.display = 'none';
        iframeModalFrame.src = '';
    });

    function updateTitle(p) {
        const sec = getSectionForPage(p);
        const localPage = sec ? (p - sec.start + 1) : p;
        if (sec) {
            chapterTitle.textContent = `${sec.title} (${localPage}/${sec.pages})`;
        } else {
            chapterTitle.textContent = `Page ${p}`;
        }
    }

    function goNext() { loadPage(currentPage + (viewMode === 'spread' ? 2 : 1), 1); }
    function goPrev() { loadPage(currentPage - (viewMode === 'spread' ? 2 : 1), -1); }

    btnPrev.addEventListener('click', goPrev);
    btnNext.addEventListener('click', goNext);
    floatPrev.addEventListener('click', goPrev);
    floatNext.addEventListener('click', goNext);

    // ===== Fullscreen =====
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                document.body.classList.add('fullscreen-mode');
                btnFullscreen.classList.add('active');
                fsIcon.textContent = '↩️';
                fsLabel.textContent = '戻る';
                floatExitFs.style.display = 'block';
            });
        } else {
            exitFullscreen();
        }
    }

    function exitFullscreen() {
        if (document.fullscreenElement) document.exitFullscreen();
    }

    btnFullscreen.addEventListener('click', toggleFullscreen);
    floatExitFs.addEventListener('click', exitFullscreen);

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            document.body.classList.remove('fullscreen-mode');
            btnFullscreen.classList.remove('active');
            fsIcon.textContent = '📺';
            fsLabel.textContent = '全画面';
            floatExitFs.style.display = 'none';
        }
    });

    // ===== Keyboard =====
    document.addEventListener('keydown', (e) => {
        if (document.activeElement && document.activeElement.id === 'page-jump-input') return;
        if (e.key === 'ArrowLeft') goPrev();
        else if (e.key === 'ArrowRight') goNext();
        else if ((e.key === 'f' || e.key === 'F') && viewMode === 'spread') toggleFullscreen();
        else if (e.key === 'Escape') closePageJump();
    });

    // ===== Touch Swipe =====
    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    document.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 80) {
            if (diff > 0) goPrev();
            else goNext();
        }
    }, { passive: true });

    // ===== Page Jump Modal =====
    const jumpOverlay = document.getElementById('page-jump-overlay');
    const jumpInput = document.getElementById('page-jump-input');
    const jumpGo = document.getElementById('page-jump-go');
    const jumpClose = document.getElementById('page-jump-close');
    const jumpChapters = document.getElementById('page-jump-chapters');

    // Populate section buttons
    sections.forEach(sec => {
        const btn = document.createElement('button');
        btn.textContent = `${sec.title} (p.${sec.start})`;
        btn.dataset.page = sec.start;
        btn.addEventListener('click', () => {
            closePageJump();
            loadPage(parseInt(btn.dataset.page));
        });
        jumpChapters.appendChild(btn);
    });

    jumpInput.max = TOTAL_PAGES;
    jumpInput.placeholder = `1〜${TOTAL_PAGES}`;

    pageInd.addEventListener('click', () => {
        jumpOverlay.classList.add('active');
        jumpInput.value = currentPage;
        jumpInput.focus();
        jumpInput.select();
    });

    function doJump() {
        const p = parseInt(jumpInput.value);
        if (p >= 1 && p <= TOTAL_PAGES) {
            closePageJump();
            loadPage(p);
        }
    }

    jumpGo.addEventListener('click', doJump);
    jumpInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doJump();
        if (e.key === 'Escape') closePageJump();
    });

    jumpClose.addEventListener('click', closePageJump);
    jumpOverlay.addEventListener('click', (e) => {
        if (e.target === jumpOverlay) closePageJump();
    });

    function closePageJump() {
        jumpOverlay.classList.remove('active');
    }

    // ===== Ctrl + Wheel Zoom =====
    const imagePaneEl = document.getElementById('image-pane');
    imagePaneEl.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            if (e.deltaY < 0) currentZoom = Math.min(3, currentZoom + 0.1);
            else currentZoom = Math.max(0.5, currentZoom - 0.1);
            applyZoom();
        }
    }, { passive: false });

    // ===== Print Modal & Logic =====
    const printBtn = document.getElementById('btn-print');
    const printModalOverlay = document.getElementById('print-modal-overlay');
    const printModalClose = document.getElementById('print-modal-close');
    const printModalBody = document.getElementById('print-modal-body');
    const execPrintBtn = document.getElementById('btn-execute-print');
    const printRangePrev = document.getElementById('print-range-prev');
    const printRangeNext = document.getElementById('print-range-next');
    const printRangeLabel = document.getElementById('print-range-label');
    const printSelectedCount = document.getElementById('print-selected-count');
    const printZoomOverlay = document.getElementById('print-zoom-overlay');
    const printZoomImg = document.getElementById('print-zoom-img');

    let printRangeStart = 1;
    let printRangeEnd = 1;

    function getBwSrc(p) {
        const bwPath = bookData.printImagesPath || bookData.imagesPath;
        return `${bwPath}page_${p.toString().padStart(4, '0')}.png`;
    }

    function updatePrintSelectedCount() {
        if (!printSelectedCount) return;
        const count = printModalBody.querySelectorAll('input[type="checkbox"]:checked').length;
        printSelectedCount.textContent = `選択: ${count}ページ`;
    }

    function renderPrintPages() {
        printModalBody.innerHTML = '';
        printRangeLabel.textContent = `P.${printRangeStart} 〜 P.${printRangeEnd}`;
        printRangePrev.disabled = (printRangeStart <= 1);
        printRangeNext.disabled = (printRangeEnd >= TOTAL_PAGES);

        for (let p = printRangeStart; p <= printRangeEnd; p++) {
            const src = getBwSrc(p);
            const item = document.createElement('div');
            item.className = 'print-page-item selected';

            // サムネイル画像
            const img = document.createElement('img');
            img.src = src;
            img.className = 'print-thumb';
            img.title = 'クリックで拡大表示';
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                showPrintZoom(src);
            });

            // 情報エリア
            const info = document.createElement('div');
            info.className = 'print-page-info';

            const cbox = document.createElement('input');
            cbox.type = 'checkbox';
            cbox.value = src;
            cbox.checked = false;
            cbox.addEventListener('change', () => {
                item.classList.toggle('selected', cbox.checked);
                updatePrintSelectedCount();
            });

            const label = document.createElement('label');
            label.appendChild(cbox);
            label.appendChild(document.createTextNode(` P.${p}`));

            const zoomBtn = document.createElement('button');
            zoomBtn.className = 'print-zoom-btn';
            zoomBtn.textContent = '🔍 拡大表示';
            zoomBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showPrintZoom(src);
            });

            info.appendChild(label);
            info.appendChild(zoomBtn);

            item.appendChild(img);
            item.appendChild(info);

            // カード全体クリックでチェック切替
            item.addEventListener('click', (e) => {
                if (e.target === cbox || e.target === img || e.target === zoomBtn) return;
                cbox.checked = !cbox.checked;
                item.classList.toggle('selected', cbox.checked);
                updatePrintSelectedCount();
            });

            printModalBody.appendChild(item);
        }
        updatePrintSelectedCount();
    }

    function showPrintZoom(src) {
        if (!printZoomOverlay || !printZoomImg) return;
        printZoomImg.src = src;
        printZoomOverlay.style.display = 'flex';
    }

    if (printZoomOverlay) {
        printZoomOverlay.addEventListener('click', () => {
            printZoomOverlay.style.display = 'none';
            printZoomImg.src = '';
        });
    }

    if (printBtn) {
        if (bookData.printImagesPath === null) {
            printBtn.style.display = 'none';
        } else {
            printBtn.addEventListener('click', () => {
                // 現在表示中のページを基準に前後2ページずつ表示
                if (viewMode === 'spread') {
                    const lp = currentPage % 2 === 0 ? currentPage : currentPage - 1;
                    printRangeStart = Math.max(1, lp - 2);
                    printRangeEnd = Math.min(TOTAL_PAGES, lp + 3);
                } else {
                    printRangeStart = Math.max(1, currentPage - 2);
                    printRangeEnd = Math.min(TOTAL_PAGES, currentPage + 2);
                }
                renderPrintPages();
                printModalOverlay.style.display = 'flex';
            });
        }
    }

    if (printRangePrev) {
        printRangePrev.addEventListener('click', () => {
            printRangeStart = Math.max(1, printRangeStart - 3);
            renderPrintPages();
        });
    }

    if (printRangeNext) {
        printRangeNext.addEventListener('click', () => {
            printRangeEnd = Math.min(TOTAL_PAGES, printRangeEnd + 3);
            renderPrintPages();
        });
    }

    if (printModalClose) {
        printModalClose.addEventListener('click', () => {
            printModalOverlay.style.display = 'none';
        });
    }

    if (execPrintBtn) {
        execPrintBtn.addEventListener('click', () => {
            const checkedInputs = printModalBody.querySelectorAll('input[type="checkbox"]:checked');
            const sources = Array.from(checkedInputs).map(inp => inp.value);
            
            if (sources.length === 0) {
                alert('印刷するページが選択されていません。');
                return;
            }
            
            execPrintBtn.textContent = '準備中...';
            execPrintBtn.disabled = true;
            executePrint(sources);
        });
    }

    function executePrint(imageSources) {
        let iframe = document.getElementById('hidden-print-iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = 'hidden-print-iframe';
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            document.body.appendChild(iframe);
        }
        
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <base href="${document.baseURI}">
                <style>
                    @page { size: A4 portrait; margin: 5mm; }
                    html, body { margin: 0; padding: 0; background: #fff; }
                    img {
                        width: 100%;
                        max-height: calc(100vh - 10mm);
                        object-fit: contain;
                        display: block;
                        page-break-inside: avoid;
                        page-break-after: always;
                    }
                    img:last-child {
                        page-break-after: auto;
                    }
                </style>
            </head>
            <body>
            </body>
            </html>
        `);
        
        const total = imageSources.length;
        let loaded = 0;
        
        imageSources.forEach(src => {
            const imgEl = doc.createElement('img');
            imgEl.onload = () => {
                loaded++;
                if (loaded >= total) {
                    setTimeout(() => {
                        execPrintBtn.textContent = '選択したページを印刷';
                        execPrintBtn.disabled = false;
                        printModalOverlay.style.display = 'none';
                        iframe.contentWindow.focus();
                        iframe.contentWindow.print();
                    }, 500);
                }
            };
            imgEl.onerror = () => {
                loaded++;
                if (loaded >= total) {
                    setTimeout(() => {
                        execPrintBtn.textContent = '選択したページを印刷';
                        execPrintBtn.disabled = false;
                        iframe.contentWindow.focus();
                        iframe.contentWindow.print();
                    }, 500);
                }
            };
            imgEl.src = src;
            doc.body.appendChild(imgEl);
        });
        
        doc.close();
    }
    // ===== Answer Modal =====
    const answerBtn = document.getElementById('btn-answer');
    const answerOverlay = document.getElementById('answer-modal-overlay');
    const answerClose = document.getElementById('answer-close');
    const answerPrev = document.getElementById('answer-prev');
    const answerNext = document.getElementById('answer-next');
    const answerTitle = document.getElementById('answer-title');
    const answerImg = document.getElementById('answer-img');
    const answerBody = document.getElementById('answer-modal-body');

    // 解答ページ範囲（bookDataから動的取得）
    const answersSection = bookData.chapters ? bookData.chapters.find(ch => ch.id === 'answers') : null;
    const ANSWER_START = answersSection ? answersSection.start : TOTAL_PAGES;
    const ANSWER_END = answersSection ? answersSection.end : TOTAL_PAGES;
    const CONTENT_END = ANSWER_START - 1; // 本編最終ページ
    let answerCurrentPage = ANSWER_START;
    let answerZoom = 1;

    function estimateAnswerPage(viewPage) {
        // 詳細なサブセクション（Lessonごとのページ指定）がある場合はそれを利用
        if (bookData.chapters) {
            const mainChap = bookData.chapters.find(ch => viewPage >= ch.start && viewPage <= ch.end);
            const ansChap = bookData.chapters.find(ch => ch.id === 'answers');
            
            if (mainChap && mainChap.subsections && ansChap && ansChap.subsections) {
                // 現在のページがどのサブセクション（Lesson等）に属するか特定
                let qSubIdx = -1;
                for (let i = 0; i < mainChap.subsections.length; i++) {
                    if (viewPage >= mainChap.subsections[i].page) {
                        qSubIdx = i;
                    } else {
                        break;
                    }
                }
                
                if (qSubIdx !== -1) {
                    const qSub = mainChap.subsections[qSubIdx];
                    // 解答側の対応するサブセクションを番号で検索
                    const aSub = ansChap.subsections.find(s => s.num === qSub.num);
                    if (aSub) {
                        return aSub.page; // 正確な解答ページへ直接ジャンプ！
                    }
                }
            }
        }

        // サブセクションがない従来の本（数学など）用：比率計算による推測
        const questionStart = bookData.id === 'polaris1' ? 2 : 6;
        if (viewPage < questionStart) return ANSWER_START;
        if (viewPage >= ANSWER_START) return viewPage;
        const ratio = (viewPage - questionStart) / (CONTENT_END - questionStart);
        return Math.min(ANSWER_END, Math.max(ANSWER_START, Math.round(ANSWER_START + ratio * (ANSWER_END - ANSWER_START))));
    }

    function loadAnswerPage(page) {
        answerCurrentPage = Math.max(ANSWER_START, Math.min(ANSWER_END, page));
        answerZoom = 1;
        answerImg.style.transform = `scale(1)`;
        answerImg.src = getImageSrc(answerCurrentPage);
        answerTitle.textContent = `解答 P.${answerCurrentPage}`;
        answerPrev.disabled = (answerCurrentPage <= ANSWER_START);
        answerNext.disabled = (answerCurrentPage >= ANSWER_END);
        // スクロール位置をリセット
        if (answerBody) answerBody.scrollTop = 0;
    }

    function applyAnswerZoom(delta) {
        answerZoom = Math.max(0.5, Math.min(4, answerZoom + delta));
        answerImg.style.transform = `scale(${answerZoom})`;
        answerImg.style.transformOrigin = 'top center';
    }

    if (answerBtn) {
        if (!answersSection) {
            // 解答セクションがない書籍ではボタンを非表示
            answerBtn.style.display = 'none';
        } else {
            answerBtn.addEventListener('click', () => {
                const estimated = estimateAnswerPage(currentPage);
                loadAnswerPage(estimated);
                answerOverlay.style.display = 'flex';
            });
        }
    }

    if (answerClose) {
        answerClose.addEventListener('click', () => {
            answerOverlay.style.display = 'none';
        });
    }

    if (answerOverlay) {
        answerOverlay.addEventListener('click', (e) => {
            if (e.target === answerOverlay) answerOverlay.style.display = 'none';
        });
    }

    if (answerPrev) {
        answerPrev.addEventListener('click', () => {
            loadAnswerPage(answerCurrentPage - 1);
        });
    }

    if (answerNext) {
        answerNext.addEventListener('click', () => {
            loadAnswerPage(answerCurrentPage + 1);
        });
    }

    // Ctrl+Wheel でズーム（解答モーダル）
    if (answerBody) {
        answerBody.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                applyAnswerZoom(e.deltaY < 0 ? 0.15 : -0.15);
            }
        }, { passive: false });
    }

    // ダブルクリックでズームトグル
    if (answerImg) {
        answerImg.addEventListener('dblclick', () => {
            if (answerZoom > 1.2) {
                answerZoom = 1;
            } else {
                answerZoom = 2.5;
            }
            answerImg.style.transform = `scale(${answerZoom})`;
            answerImg.style.transformOrigin = 'top center';
        });
    }

    // ===== Initial Load =====
    loadPage(currentPage);
});
