/**
 * 軽量書き込み試作 — 河合 英語長文300 問題1のみ（PDF p.2–3）
 * ストロークは画像の論理ピクセル座標。拡大・蛍光・消しゴム・図形対応。
 */
(function () {
    const DB_NAME = 'annotate-kawai300-p1';
    const DB_VER = 1;
    const STORE = 'pages';
    const DOC_KEY = 'kawai300-p1';
    const ZOOM_KEY = 'annotate-kawai300-p1-zoom';

    const PAGES = [
        { pdfPage: 2, label: '問題1 · PDF p.2（本誌目安 p.2）' },
        { pdfPage: 3, label: '問題1 · PDF p.3（本誌目安 p.3）' },
    ];

    const IMG_BASE = '../images/kawai_300/page_';

    const mainEl = document.getElementById('main');
    const drawModeEl = document.getElementById('draw-mode');
    const toolModeEl = document.getElementById('tool-mode');
    const colorEl = document.getElementById('pen-color');
    const widthEl = document.getElementById('pen-width');
    const btnUndo = document.getElementById('btn-undo');
    const btnClear = document.getElementById('btn-clear-page');
    const btnExport = document.getElementById('btn-export');
    const importFile = document.getElementById('import-file');
    const statusEl = document.getElementById('status');
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnZoomReset = document.getElementById('btn-zoom-reset');
    const zoomLabel = document.getElementById('zoom-label');

    /** @type {Map<number, { history: object[][], img: HTMLImageElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, stage: HTMLElement }>} */
    const state = new Map();

    let db = null;
    let activePdfPage = PAGES[0].pdfPage;
    let viewZoom = 1;

    try {
        const z = Number(localStorage.getItem(ZOOM_KEY));
        if (!Number.isNaN(z) && z >= 0.5 && z <= 2.5) viewZoom = z;
    } catch (_) { /* ignore */ }

    function pad4(n) {
        return String(n).padStart(4, '0');
    }

    function getTool() {
        return toolModeEl ? toolModeEl.value : 'pen';
    }

    function hexToRgba(hex, alpha) {
        const h = (hex || '#ffff00').replace('#', '');
        const r = parseInt(h.slice(0, 2), 16) || 255;
        const g = parseInt(h.slice(2, 4), 16) || 255;
        const b = parseInt(h.slice(4, 6), 16) || 0;
        return `rgba(${r},${g},${b},${alpha})`;
    }

    function applyViewZoom() {
        const z = Math.min(2.5, Math.max(0.5, Math.round(viewZoom * 100) / 100));
        viewZoom = z;
        mainEl.style.transform = z === 1 ? 'none' : `scale(${z})`;
        mainEl.style.transformOrigin = 'top left';
        mainEl.style.width = z === 1 ? '100%' : `${100 / z}%`;
        zoomLabel.textContent = `${Math.round(z * 100)}%`;
        try {
            localStorage.setItem(ZOOM_KEY, String(z));
        } catch (_) { /* ignore */ }
    }

    btnZoomIn.addEventListener('click', () => {
        viewZoom = Math.min(2.5, viewZoom + 0.1);
        applyViewZoom();
    });
    btnZoomOut.addEventListener('click', () => {
        viewZoom = Math.max(0.5, viewZoom - 0.1);
        applyViewZoom();
    });
    btnZoomReset.addEventListener('click', () => {
        viewZoom = 1;
        applyViewZoom();
    });
    applyViewZoom();

    function openDb() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VER);
            req.onerror = () => reject(req.error);
            req.onsuccess = () => resolve(req.result);
            req.onupgradeneeded = (e) => {
                const d = e.target.result;
                if (!d.objectStoreNames.contains(STORE)) {
                    d.createObjectStore(STORE, { keyPath: 'key' });
                }
            };
        });
    }

    function loadPageData(pdfPage) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE, 'readonly');
            const st = tx.objectStore(STORE);
            const key = `${DOC_KEY}-${pdfPage}`;
            const req = st.get(key);
            req.onerror = () => reject(req.error);
            req.onsuccess = () => {
                const v = req.result;
                if (!v || !v.history) {
                    resolve([[]]);
                    return;
                }
                const h = v.history;
                if (Array.isArray(h) && h.length && Array.isArray(h[0])) {
                    resolve(h);
                    return;
                }
                if (Array.isArray(h) && h.length && h[0] && h[0].points) {
                    resolve([h]);
                    return;
                }
                resolve([[]]);
            };
        });
    }

    function savePageData(pdfPage, history) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE, 'readwrite');
            const st = tx.objectStore(STORE);
            const key = `${DOC_KEY}-${pdfPage}`;
            st.put({
                key,
                pdfPage,
                doc: DOC_KEY,
                updated: Date.now(),
                history,
            });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    function syncCanvasPixels(pdfPage) {
        const s = state.get(pdfPage);
        if (!s) return;
        const { ctx, canvas, img } = s;
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) return;
        canvas.width = w;
        canvas.height = h;
    }

    function normalizeBox(x0, y0, x1, y1) {
        return {
            x: Math.min(x0, x1),
            y: Math.min(y0, y1),
            w: Math.abs(x1 - x0),
            h: Math.abs(y1 - y0),
        };
    }

    /** 確定オブジェクトおよび描画中プレビューを描画 */
    function drawMarking(ctx, st) {
        if (!st) return;

        if (st.type === 'line') {
            if (Math.abs(st.x1 - st.x0) + Math.abs(st.y1 - st.y0) < 0.5) return;
            ctx.save();
            ctx.lineCap = 'round';
            ctx.strokeStyle = st.color;
            ctx.lineWidth = st.width;
            ctx.beginPath();
            ctx.moveTo(st.x0, st.y0);
            ctx.lineTo(st.x1, st.y1);
            ctx.stroke();
            ctx.restore();
            return;
        }

        if (st.type === 'rect') {
            const r = normalizeBox(st.x0, st.y0, st.x1, st.y1);
            if (r.w < 0.5 || r.h < 0.5) return;
            ctx.save();
            ctx.strokeStyle = st.color;
            ctx.lineWidth = st.width;
            ctx.strokeRect(r.x, r.y, r.w, r.h);
            ctx.restore();
            return;
        }

        if (st.type === 'ellipse') {
            const r = normalizeBox(st.x0, st.y0, st.x1, st.y1);
            if (r.w < 0.5 || r.h < 0.5) return;
            const cx = r.x + r.w / 2;
            const cy = r.y + r.h / 2;
            const rx = Math.max(r.w / 2 - st.width / 2, 0.5);
            const ry = Math.max(r.h / 2 - st.width / 2, 0.5);
            ctx.save();
            ctx.strokeStyle = st.color;
            ctx.lineWidth = st.width;
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
            return;
        }

        if (st.type === 'erase') {
            if (!st.points || st.points.length < 2) return;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.lineWidth = st.width || 20;
            ctx.beginPath();
            ctx.moveTo(st.points[0].x, st.points[0].y);
            for (let i = 1; i < st.points.length; i++) {
                ctx.lineTo(st.points[i].x, st.points[i].y);
            }
            ctx.stroke();
            ctx.restore();
            return;
        }

        /* path: type==='path' または従来データ（points のみ） */
        if (st.points && st.points.length >= 2) {
            ctx.save();
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            if (st.highlighter) {
                ctx.globalCompositeOperation = 'multiply';
                ctx.strokeStyle = hexToRgba(st.color, 0.42);
                ctx.lineWidth = Math.max(st.width * 1.35, 4);
            } else {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = st.color;
                ctx.lineWidth = st.width;
            }
            ctx.beginPath();
            ctx.moveTo(st.points[0].x, st.points[0].y);
            for (let i = 1; i < st.points.length; i++) {
                ctx.lineTo(st.points[i].x, st.points[i].y);
            }
            ctx.stroke();
            ctx.restore();
        }
    }

    function paintStrokes(pdfPage, partial) {
        const s = state.get(pdfPage);
        if (!s) return;
        const { ctx, canvas } = s;
        const w = canvas.width;
        const h = canvas.height;
        if (!w || !h) return;
        ctx.clearRect(0, 0, w, h);
        const hist = s.history;
        const strokes = hist[hist.length - 1] || [];
        for (const st of strokes) {
            drawMarking(ctx, normalizeLegacyStroke(st));
        }
        if (partial) {
            drawMarking(ctx, partial);
        }
    }

    /** 旧形式 { points, color, width } → path として扱う */
    function normalizeLegacyStroke(st) {
        if (!st || st.type) return st;
        if (st.points) return { type: 'path', points: st.points, color: st.color, width: st.width };
        return st;
    }

    function redraw(pdfPage) {
        syncCanvasPixels(pdfPage);
        paintStrokes(pdfPage);
    }

    function fitCanvasToImage(img, canvas) {
        const stage = canvas.parentElement;
        const w = img.clientWidth;
        const h = img.clientHeight;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        stage.style.width = `${w}px`;
        const pdfPage = parseInt(canvas.dataset.pdfPage, 10);
        syncCanvasPixels(pdfPage);
        paintStrokes(pdfPage);
    }

    function lineWidthForCanvas(canvas) {
        const nw = Math.max(canvas.width, 1);
        const base = parseInt(widthEl.value, 10) * Math.max(0.8, nw / 900);
        const tool = getTool();
        if (tool === 'eraser') return base * 2.8;
        if (tool === 'highlighter') return base * 2.2;
        return base;
    }

    function setupCanvasDrawing(pdfPage, canvas) {
        let current = null;

        function posFromEvent(ev) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            return {
                x: (ev.clientX - rect.left) * scaleX,
                y: (ev.clientY - rect.top) * scaleY,
            };
        }

        function shapeStroke(c) {
            return {
                type: c.shape,
                x0: c.x0,
                y0: c.y0,
                x1: c.x1,
                y1: c.y1,
                color: c.color,
                width: c.width,
            };
        }

        function start(ev) {
            if (!drawModeEl.checked) return;
            if (ev.pointerType === 'mouse' && ev.buttons !== 1) return;
            canvas.setPointerCapture(ev.pointerId);
            const p = posFromEvent(ev);
            const tool = getTool();

            if (tool === 'line' || tool === 'rect' || tool === 'ellipse') {
                const w = lineWidthForCanvas(canvas);
                current = {
                    kind: 'shape',
                    shape: tool,
                    x0: p.x,
                    y0: p.y,
                    x1: p.x,
                    y1: p.y,
                    color: colorEl.value,
                    width: w,
                };
            } else {
                current = {
                    kind: 'path',
                    tool,
                    color: colorEl.value,
                    width: lineWidthForCanvas(canvas),
                    points: [p],
                };
            }
            ev.preventDefault();
        }

        function move(ev) {
            if (!current) return;
            const p = posFromEvent(ev);

            if (current.kind === 'shape') {
                current.x1 = p.x;
                current.y1 = p.y;
                paintStrokes(pdfPage, shapeStroke(current));
                ev.preventDefault();
                return;
            }

            const last = current.points[current.points.length - 1];
            const dx = p.x - last.x;
            const dy = p.y - last.y;
            if (dx * dx + dy * dy < 2) return;
            current.points.push(p);

            let partial;
            if (current.tool === 'eraser') {
                partial = { type: 'erase', points: current.points, width: current.width };
            } else if (current.tool === 'highlighter') {
                partial = {
                    type: 'path',
                    points: current.points,
                    color: current.color,
                    width: current.width,
                    highlighter: true,
                };
            } else {
                partial = {
                    type: 'path',
                    points: current.points,
                    color: current.color,
                    width: current.width,
                };
            }
            paintStrokes(pdfPage, partial);
            ev.preventDefault();
        }

        function end(ev) {
            if (!current) return;
            try {
                canvas.releasePointerCapture(ev.pointerId);
            } catch (_) { /* ignore */ }

            if (current.kind === 'shape') {
                const dx = current.x1 - current.x0;
                const dy = current.y1 - current.y0;
                if (dx * dx + dy * dy >= 9) {
                    const s = state.get(pdfPage);
                    const prev = s.history[s.history.length - 1] || [];
                    const stroke = shapeStroke(current);
                    s.history.push([...prev, stroke]);
                    if (s.history.length > 40) s.history.shift();
                    savePageData(pdfPage, s.history).then(updateStatus).catch((e) => console.error(e));
                }
            } else if (current.points && current.points.length >= 2) {
                const s = state.get(pdfPage);
                const prev = s.history[s.history.length - 1] || [];
                let stroke;
                if (current.tool === 'eraser') {
                    stroke = { type: 'erase', points: JSON.parse(JSON.stringify(current.points)), width: current.width };
                } else if (current.tool === 'highlighter') {
                    stroke = {
                        type: 'path',
                        points: JSON.parse(JSON.stringify(current.points)),
                        color: current.color,
                        width: current.width,
                        highlighter: true,
                    };
                } else {
                    stroke = {
                        type: 'path',
                        points: JSON.parse(JSON.stringify(current.points)),
                        color: current.color,
                        width: current.width,
                    };
                }
                s.history.push([...prev, stroke]);
                if (s.history.length > 40) s.history.shift();
                savePageData(pdfPage, s.history).then(updateStatus).catch((e) => console.error(e));
            }

            current = null;
            paintStrokes(pdfPage);
            ev.preventDefault();
        }

        canvas.addEventListener('pointerdown', start);
        canvas.addEventListener('pointermove', move);
        canvas.addEventListener('pointerup', end);
        canvas.addEventListener('pointercancel', end);
    }

    async function buildPage(meta) {
        const { pdfPage, label } = meta;
        const block = document.createElement('div');
        block.className = 'page-block';
        block.innerHTML = `<div class="page-label">${label}</div>`;
        const stage = document.createElement('div');
        stage.className = 'stage';
        stage.dataset.pdfPage = String(pdfPage);

        const img = document.createElement('img');
        img.alt = label;
        img.src = `${IMG_BASE}${pad4(pdfPage)}.png`;
        img.decoding = 'async';
        img.loading = 'lazy';

        const canvas = document.createElement('canvas');
        canvas.dataset.pdfPage = String(pdfPage);

        stage.appendChild(img);
        stage.appendChild(canvas);
        block.appendChild(stage);
        mainEl.appendChild(block);

        stage.addEventListener('pointerdown', () => {
            activePdfPage = pdfPage;
        });

        const ctx = canvas.getContext('2d');
        const history = await loadPageData(pdfPage);
        if (!history.length) history.push([]);

        state.set(pdfPage, { history, img, canvas, ctx, stage });

        img.onload = () => {
            fitCanvasToImage(img, canvas);
        };
        if (img.complete && img.naturalWidth) {
            fitCanvasToImage(img, canvas);
        }

        img.addEventListener('load', () => fitCanvasToImage(img, canvas));
        window.addEventListener('resize', () => fitCanvasToImage(img, canvas));

        setupCanvasDrawing(pdfPage, canvas);
    }

    function syncDrawModeClass() {
        const on = drawModeEl.checked;
        document.querySelectorAll('.stage').forEach((el) => {
            el.classList.toggle('drawing-off', !on);
        });
        statusEl.textContent = on ? '描画中（スクロールはオフ）' : '閲覧モード（スクロール可）';
    }

    drawModeEl.addEventListener('change', syncDrawModeClass);

    btnUndo.addEventListener('click', () => {
        const s = state.get(activePdfPage);
        if (!s || s.history.length <= 1) return;
        s.history.pop();
        redraw(activePdfPage);
        savePageData(activePdfPage, s.history).then(updateStatus).catch((e) => console.error(e));
    });

    btnClear.addEventListener('click', () => {
        if (!confirm(`PDF p.${activePdfPage} の書き込みを消しますか？`)) return;
        const s = state.get(activePdfPage);
        s.history = [[]];
        redraw(activePdfPage);
        savePageData(activePdfPage, s.history).then(updateStatus).catch((e) => console.error(e));
    });

    btnExport.addEventListener('click', async () => {
        const payload = { doc: DOC_KEY, exported: new Date().toISOString(), pages: {} };
        for (const p of PAGES) {
            const s = state.get(p.pdfPage);
            payload.pages[p.pdfPage] = s ? s.history : [[]];
        }
        const blob = new Blob([JSON.stringify(payload, null, 0)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `annotate-${DOC_KEY}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
        statusEl.textContent = 'JSON をダウンロードしました';
    });

    importFile.addEventListener('change', async () => {
        const f = importFile.files && importFile.files[0];
        importFile.value = '';
        if (!f) return;
        try {
            const text = await f.text();
            const data = JSON.parse(text);
            if (!data.pages) throw new Error('形式が不正です');
            for (const p of PAGES) {
                const h = data.pages[p.pdfPage];
                if (Array.isArray(h) && h.length) {
                    const s = state.get(p.pdfPage);
                    s.history = h;
                    redraw(p.pdfPage);
                    await savePageData(p.pdfPage, s.history);
                }
            }
            statusEl.textContent = 'JSON から復元しました';
        } catch (e) {
            alert('読み込み失敗: ' + e.message);
        }
    });

    async function updateStatus() {
        let extra = '';
        try {
            if (navigator.storage && navigator.storage.estimate) {
                const est = await navigator.storage.estimate();
                const used = est.usage != null ? (est.usage / (1024 * 1024)).toFixed(1) : '?';
                extra = ` · サイト使用目安 ${used} MB`;
            }
        } catch (_) { /* ignore */ }
        statusEl.textContent = (drawModeEl.checked ? '描画中' : '閲覧モード') + extra;
    }

    mainEl.addEventListener('click', (e) => {
        const stage = e.target.closest && e.target.closest('.stage');
        if (stage && stage.dataset.pdfPage) {
            activePdfPage = parseInt(stage.dataset.pdfPage, 10);
        }
    });

    openDb()
        .then((d) => {
            db = d;
            return Promise.all(PAGES.map((m) => buildPage(m)));
        })
        .then(() => {
            syncDrawModeClass();
            updateStatus();
        })
        .catch((err) => {
            mainEl.innerHTML = `<p style="padding:1rem;color:#f88;">IndexedDB を開けませんでした: ${err.message}</p>`;
        });
})();
