const hsData = {
    // 英語長文ポラリス1
    polaris1: {
        id: "polaris1",
        title: "英語長文ポラリス1",
        totalPages: 252,
        imagesPath: "images/polaris1/",
        printImagesPath: "images/polaris1_bw/",
        coverImage: "images/polaris1_cover.jpg",
        qrBase: "",
        chapters: [
            { id: "intro", title: "はじめに・目次", start: 1, end: 1, subsections: [] },
            { id: "chap1", title: "問題", start: 2, end: 60, subsections: [
                { num: 1, title: "Lesson 1", page: 2 },
                { num: 2, title: "Lesson 2", page: 6 },
                { num: 3, title: "Lesson 3", page: 14 },
                { num: 4, title: "Lesson 4", page: 20 },
                { num: 5, title: "Lesson 5", page: 24 },
                { num: 6, title: "Lesson 6", page: 28 },
                { num: 7, title: "Lesson 7", page: 34 },
                { num: 8, title: "Lesson 8", page: 38 },
                { num: 9, title: "Lesson 9", page: 42 },
                { num: 10, title: "Lesson 10", page: 48 },
                { num: 11, title: "Lesson 11", page: 52 },
                { num: 12, title: "Lesson 12", page: 58 },
            ]},
            { id: "answers", title: "解答・解説", start: 61, end: 252, subsections: [
                { num: 1, title: "Lesson 1", page: 14 + 60 },
                { num: 2, title: "Lesson 2", page: 26 + 60 },
                { num: 3, title: "Lesson 3", page: 47 + 60 },
                { num: 4, title: "Lesson 4", page: 64 + 60 },
                { num: 5, title: "Lesson 5", page: 79 + 60 },
                { num: 6, title: "Lesson 6", page: 90 + 60 },
                { num: 7, title: "Lesson 7", page: 104 + 60 },
                { num: 8, title: "Lesson 8", page: 118 + 60 },
                { num: 9, title: "Lesson 9", page: 128 + 60 },
                { num: 10, title: "Lesson 10", page: 149 + 60 },
                { num: 11, title: "Lesson 11", page: 164 + 60 },
                { num: 12, title: "Lesson 12", page: 183 + 60 },
            ]}
        ],
        get sections() {
            return this.chapters.map(ch => ({
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }));
        },
        pageQrs: {}
    },

    polaris2: {
        id: "polaris2",
        title: "英語長文ポラリス2",
        totalPages: 286,
        imagesPath: "images/polaris2/",
        printImagesPath: "images/polaris2_bw/",
        coverImage: "images/polaris2_cover.jpg",
        qrBase: "",
        chapters: [
            { id: "intro", title: "はじめに・目次", start: 1, end: 1, subsections: [] },
            { id: "chap1", title: "問題", start: 2, end: 62, subsections: [
                { num: 1, title: "Lesson 1", page: 2 },
                { num: 2, title: "Lesson 2", page: 10 },
                { num: 3, title: "Lesson 3", page: 14 },
                { num: 4, title: "Lesson 4", page: 20 },
                { num: 5, title: "Lesson 5", page: 24 },
                { num: 6, title: "Lesson 6", page: 30 },
                { num: 7, title: "Lesson 7", page: 34 },
                { num: 8, title: "Lesson 8", page: 38 },
                { num: 9, title: "Lesson 9", page: 44 },
                { num: 10, title: "Lesson 10", page: 50 },
                { num: 11, title: "Lesson 11", page: 56 },
                { num: 12, title: "Lesson 12", page: 60 },
            ]},
            { id: "answers", title: "解答・解説", start: 63, end: 286, subsections: [
                { num: 1, title: "Lesson 1", page: 14 + 62 },
                { num: 2, title: "Lesson 2", page: 40 + 62 },
                { num: 3, title: "Lesson 3", page: 54 + 62 },
                { num: 4, title: "Lesson 4", page: 72 + 62 },
                { num: 5, title: "Lesson 5", page: 88 + 62 },
                { num: 6, title: "Lesson 6", page: 106 + 62 },
                { num: 7, title: "Lesson 7", page: 122 + 62 },
                { num: 8, title: "Lesson 8", page: 142 + 62 },
                { num: 9, title: "Lesson 9", page: 162 + 62 },
                { num: 10, title: "Lesson 10", page: 180 + 62 },
                { num: 11, title: "Lesson 11", page: 198 + 62 },
                { num: 12, title: "Lesson 12", page: 210 + 62 },
            ]}
        ],
        get sections() {
            return this.chapters.map(ch => ({
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }));
        },
        pageQrs: {}
    },

    rules1: {
        id: "rules1",
        title: "関正生の英語長文 Rules 1",
        totalPages: 256,
        imagesPath: "images/rules1/",
        printImagesPath: "images/rules1_bw/",
        coverImage: "images/rules1_cover.jpg",
        qrBase: "",
        chapters: [
            { id: "intro", title: "はじめに・目次", start: 1, end: 2, subsections: [] },
            { id: "chap1", title: "問題", start: 3, end: 48, subsections: [
                { num: 1, title: "Lesson 1", page: 3 },
                { num: 2, title: "Lesson 2", page: 7 },
                { num: 3, title: "Lesson 3", page: 9 },
                { num: 4, title: "Lesson 4", page: 13 },
                { num: 5, title: "Lesson 5", page: 17 },
                { num: 6, title: "Lesson 6", page: 21 },
                { num: 7, title: "Lesson 7", page: 25 },
                { num: 8, title: "Lesson 8", page: 29 },
                { num: 9, title: "Lesson 9", page: 33 },
                { num: 10, title: "Lesson 10", page: 37 },
                { num: 11, title: "Lesson 11", page: 41 },
                { num: 12, title: "Lesson 12", page: 45 }
            ]},
            { id: "answers", title: "解答・解説", start: 49, end: 256, subsections: [
                { num: 1, title: "Lesson 1", page: 14 + 48 },
                { num: 2, title: "Lesson 2", page: 32 + 48 },
                { num: 3, title: "Lesson 3", page: 44 + 48 },
                { num: 4, title: "Lesson 4", page: 64 + 48 },
                { num: 5, title: "Lesson 5", page: 76 + 48 },
                { num: 6, title: "Lesson 6", page: 88 + 48 },
                { num: 7, title: "Lesson 7", page: 102 + 48 },
                { num: 8, title: "Lesson 8", page: 116 + 48 },
                { num: 9, title: "Lesson 9", page: 138 + 48 },
                { num: 10, title: "Lesson 10", page: 150 + 48 },
                { num: 11, title: "Lesson 11", page: 170 + 48 },
                { num: 12, title: "Lesson 12", page: 190 + 48 }
            ]}
        ],
        get sections() {
            return this.chapters.map(ch => ({
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }));
        },
        pageQrs: {}
    },

    rules2: {
        id: "rules2",
        title: "関正生の英語長文 Rules 2",
        totalPages: 280,
        imagesPath: "images/rules2/",
        printImagesPath: "images/rules2_bw/",
        coverImage: "images/rules2_cover.jpg",
        qrBase: "",
        chapters: [
            { id: "intro", title: "はじめに・目次", start: 1, end: 2, subsections: [] },
            { id: "chap1", title: "問題", start: 3, end: 56, subsections: [
                { num: 1, title: "Lesson 1", page: 3 },
                { num: 2, title: "Lesson 2", page: 5 },
                { num: 3, title: "Lesson 3", page: 9 },
                { num: 4, title: "Lesson 4", page: 13 },
                { num: 5, title: "Lesson 5", page: 17 },
                { num: 6, title: "Lesson 6", page: 23 },
                { num: 7, title: "Lesson 7", page: 29 },
                { num: 8, title: "Lesson 8", page: 33 },
                { num: 9, title: "Lesson 9", page: 37 },
                { num: 10, title: "Lesson 10", page: 41 },
                { num: 11, title: "Lesson 11", page: 45 },
                { num: 12, title: "Lesson 12", page: 51 }
            ]},
            { id: "answers", title: "解答・解説", start: 57, end: 280, subsections: [
                { num: 1, title: "Lesson 1", page: 14 + 56 },
                { num: 2, title: "Lesson 2", page: 26 + 56 },
                { num: 3, title: "Lesson 3", page: 42 + 56 },
                { num: 4, title: "Lesson 4", page: 58 + 56 },
                { num: 5, title: "Lesson 5", page: 76 + 56 },
                { num: 6, title: "Lesson 6", page: 98 + 56 },
                { num: 7, title: "Lesson 7", page: 116 + 56 },
                { num: 8, title: "Lesson 8", page: 136 + 56 },
                { num: 9, title: "Lesson 9", page: 149 + 56 },
                { num: 10, title: "Lesson 10", page: 160 + 56 },
                { num: 11, title: "Lesson 11", page: 176 + 56 },
                { num: 12, title: "Lesson 12", page: 202 + 56 }
            ]}
        ],
        get sections() {
            return this.chapters.map(ch => ({
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }));
        },
        pageQrs: {}
    },

    solution1: {
        id: "solution1",
        title: "肘井学の読解のための英文法 Solution 1",
        totalPages: 154,
        imagesPath: "images/solution1/",
        printImagesPath: "images/solution1_bw/",
        coverImage: "images/solution1_cover.jpg",
        qrBase: "",
        chapters: [
            { id: "intro", title: "はじめに・目次", start: 1, end: 1, subsections: [] },
            { id: "chap1", title: "問題", start: 2, end: 37, subsections: [
                { num: 1, title: "Lesson 1", page: 2 },
                { num: 2, title: "Lesson 2", page: 4 },
                { num: 3, title: "Lesson 3", page: 8 },
                { num: 4, title: "Lesson 4", page: 12 },
                { num: 5, title: "Lesson 5", page: 16 },
                { num: 6, title: "Lesson 6", page: 18 },
                { num: 7, title: "Lesson 7", page: 22 },
                { num: 8, title: "Lesson 8", page: 26 },
                { num: 9, title: "Lesson 9", page: 30 },
                { num: 10, title: "Lesson 10", page: 34 }
            ]},
            { id: "answers", title: "解答・解説", start: 38, end: 154, subsections: [
                { num: 1, title: "Lesson 1", page: 16 + 37 },
                { num: 2, title: "Lesson 2", page: 26 + 37 },
                { num: 3, title: "Lesson 3", page: 34 + 37 },
                { num: 4, title: "Lesson 4", page: 44 + 37 },
                { num: 5, title: "Lesson 5", page: 54 + 37 },
                { num: 6, title: "Lesson 6", page: 64 + 37 },
                { num: 7, title: "Lesson 7", page: 76 + 37 },
                { num: 8, title: "Lesson 8", page: 86 + 37 },
                { num: 9, title: "Lesson 9", page: 96 + 37 },
                { num: 10, title: "Lesson 10", page: 106 + 37 }
            ]}
        ],
        get sections() {
            return this.chapters.map(ch => ({
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }));
        },
        pageQrs: {}
    },

    solution2: {
        id: "solution2",
        title: "肘井学の読解のための英文法 Solution 2",
        totalPages: 154,
        imagesPath: "images/solution2/",
        printImagesPath: "images/solution2_bw/",
        coverImage: "images/solution2_cover.jpg",
        qrBase: "",
        chapters: [
            { id: "intro", title: "はじめに・目次", start: 1, end: 1, subsections: [] },
            { id: "chap1", title: "問題", start: 2, end: 34, subsections: [
                { num: 1, title: "Lesson 1", page: 2 },
                { num: 2, title: "Lesson 2", page: 6 },
                { num: 3, title: "Lesson 3", page: 8 },
                { num: 4, title: "Lesson 4", page: 12 },
                { num: 5, title: "Lesson 5", page: 14 },
                { num: 6, title: "Lesson 6", page: 18 },
                { num: 7, title: "Lesson 7", page: 20 },
                { num: 8, title: "Lesson 8", page: 24 },
                { num: 9, title: "Lesson 9", page: 28 },
                { num: 10, title: "Lesson 10", page: 32 }
            ]},
            { id: "answers", title: "解答・解説", start: 35, end: 154, subsections: [
                { num: 1, title: "Lesson 1", page: 16 + 34 },
                { num: 2, title: "Lesson 2", page: 26 + 34 },
                { num: 3, title: "Lesson 3", page: 36 + 34 },
                { num: 4, title: "Lesson 4", page: 48 + 34 },
                { num: 5, title: "Lesson 5", page: 58 + 34 },
                { num: 6, title: "Lesson 6", page: 68 + 34 },
                { num: 7, title: "Lesson 7", page: 78 + 34 },
                { num: 8, title: "Lesson 8", page: 88 + 34 },
                { num: 9, title: "Lesson 9", page: 98 + 34 },
                { num: 10, title: "Lesson 10", page: 108 + 34 }
            ]}
        ],
        get sections() {
            return this.chapters.map(ch => ({
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }));
        },
        pageQrs: {}
    },

    // SuperQuick 数IA
    superquick_math1a: {
        id: "superquick_math1a",
        title: "SuperQuick 数IA",
        totalPages: 288,
        imagesPath: "images/superquick_math1a/",
        printImagesPath: "images/superquick_math1a_bw/",
        coverImage: "images/superquick_math1a_cover.jpg",
        qrBase: "",
        chapters: [
            {
                id: "intro", title: "前書き・目次", start: 1, end: 5,
                subsections: []
            },
            {
                id: "chap1", title: "第1章 数と式", start: 6, end: 31,
                subsections: [
                    { num: 1,  title: "多項式の加法と減法", page: 6 },
                    { num: 2,  title: "多項式の乗法", page: 7 },
                    { num: 3,  title: "式の展開", page: 8 },
                    { num: 4,  title: "式の展開の工夫", page: 10 },
                    { num: 5,  title: "因数分解（たすき掛け, 3次式の公式）", page: 11 },
                    { num: 6,  title: "因数分解（おき換え, ある文字について整理）", page: 12 },
                    { num: 7,  title: "やや複雑な因数分解", page: 14 },
                    { num: 8,  title: "循環小数と分数", page: 15 },
                    { num: 9,  title: "文字式の平方根", page: 16 },
                    { num: 10, title: "分母の有理化", page: 17 },
                    { num: 11, title: "平方根と式の値（対称式）", page: 18 },
                    { num: 12, title: "平方根と式の値（x^n+1/x^nの値, 次数下げ）", page: 19 },
                    { num: 13, title: "整数部分, 小数部分", page: 20 },
                    { num: 14, title: "2重根号", page: 21 },
                    { num: 15, title: "1次不等式の解法", page: 22 },
                    { num: 16, title: "連立不等式の解法", page: 23 },
                    { num: 17, title: "文字係数の不等式", page: 24 },
                    { num: 18, title: "不等式を満たす自然数", page: 25 },
                    { num: 19, title: "不等式の解の条件を満たす定数", page: 26 },
                    { num: 20, title: "1次不等式の文章題", page: 27 },
                    { num: 21, title: "絶対値を含む方程式", page: 28 },
                    { num: 22, title: "絶対値を含む不等式", page: 30 }
                ]
            },
            {
                id: "chap2", title: "第2章 集合と命題", start: 32, end: 41,
                subsections: [
                    { num: 23, title: "集合と要素", page: 32 },
                    { num: 24, title: "実数の集合", page: 34 },
                    { num: 25, title: "命題の真偽", page: 35 },
                    { num: 26, title: "必要条件と十分条件", page: 36 },
                    { num: 27, title: "条件の否定, 命題の逆・対偶・裏", page: 38 },
                    { num: 28, title: "対偶を利用した命題の証明", page: 39 },
                    { num: 29, title: "背理法による命題の証明", page: 40 }
                ]
            },
            {
                id: "chap3", title: "第3章 2次関数", start: 42, end: 81,
                subsections: [
                    { num: 30, title: "関数の値域, 最大値, 最小値", page: 42 },
                    { num: 31, title: "2次関数 y=a(x-p)²+q のグラフ", page: 43 },
                    { num: 32, title: "2次関数 y=ax²+bx+c のグラフ", page: 44 },
                    { num: 33, title: "グラフの平行移動", page: 46 },
                    { num: 34, title: "グラフの対称移動", page: 47 },
                    { num: 35, title: "2次関数の係数の符号とグラフ", page: 48 },
                    { num: 36, title: "2次関数の最大・最小", page: 49 },
                    { num: 37, title: "定義域に制限がある場合の最大と最小", page: 50 },
                    { num: 38, title: "最大と最小の応用", page: 51 },
                    { num: 39, title: "定義域が動く場合の最大と最小", page: 52 },
                    { num: 40, title: "グラフが動く場合の最大と最小", page: 54 },
                    { num: 41, title: "4次関数の最大と最小", page: 56 },
                    { num: 42, title: "2変数関数の最大と最小", page: 57 },
                    { num: 43, title: "条件つきの2変数関数の最大と最小", page: 58 },
                    { num: 44, title: "2次関数の決定", page: 60 },
                    { num: 45, title: "2次関数の決定（放物線の平行移動）", page: 62 },
                    { num: 46, title: "2次方程式の解法", page: 63 },
                    { num: 47, title: "2次不等式の解法", page: 64 },
                    { num: 48, title: "連立不等式の解法（2次）", page: 66 },
                    { num: 49, title: "文字係数の2次不等式の解", page: 67 },
                    { num: 50, title: "2次方程式が実数解をもつ条件", page: 68 },
                    { num: 51, title: "2つの2次方程式の実数解の条件", page: 69 },
                    { num: 52, title: "2次関数のグラフとx軸の共有点", page: 70 },
                    { num: 53, title: "放物線と直線の共有点", page: 72 },
                    { num: 54, title: "不等式が常に成り立つ条件", page: 74 },
                    { num: 55, title: "ある変域で不等式が常に成り立つ条件", page: 75 },
                    { num: 56, title: "2次方程式の解の存在範囲", page: 76 },
                    { num: 57, title: "絶対値を含む関数のグラフ", page: 78 },
                    { num: 58, title: "絶対値を含む2次不等式", page: 80 }
                ]
            },
            {
                id: "chap4", title: "第4章 図形と計量", start: 82, end: 113,
                subsections: [
                    { num: 59, title: "直角三角形と三角比", page: 82 },
                    { num: 60, title: "三角比の拡張", page: 84 },
                    { num: 61, title: "三角比の相互関係", page: 86 },
                    { num: 62, title: "三角比の式の計算", page: 88 },
                    { num: 63, title: "三角比の対称式の値", page: 89 },
                    { num: 64, title: "三角比を含む方程式", page: 90 },
                    { num: 65, title: "三角比を含む方程式（2次）", page: 92 },
                    { num: 66, title: "三角比を含む不等式", page: 93 },
                    { num: 67, title: "三角比を含む不等式（2次）", page: 94 },
                    { num: 68, title: "三角比の2次関数の最大と最小", page: 95 },
                    { num: 69, title: "正弦定理", page: 96 },
                    { num: 70, title: "余弦定理", page: 97 },
                    { num: 71, title: "三角形の辺と角の決定", page: 98 },
                    { num: 72, title: "三角形の内角の二等分線の長さ（余弦定理の利用）", page: 100 },
                    { num: 73, title: "三角形の最大角", page: 101 },
                    { num: 74, title: "鈍角三角形となる条件", page: 102 },
                    { num: 75, title: "三角形の形状決定", page: 104 },
                    { num: 76, title: "三角形の面積", page: 105 },
                    { num: 77, title: "三角形の内角の二等分線の長さ（面積の利用）", page: 106 },
                    { num: 78, title: "三角形と内接円の半径", page: 107 },
                    { num: 79, title: "円に内接する四角形の面積", page: 108 },
                    { num: 80, title: "測量の問題", page: 110 },
                    { num: 81, title: "正四面体の体積", page: 111 },
                    { num: 82, title: "正四面体と球", page: 112 }
                ]
            },
            {
                id: "chap5", title: "第5章 データの分析", start: 114, end: 135,
                subsections: [
                    { num: 83, title: "データの代表値", page: 114 },
                    { num: 84, title: "データの散らばりと四分位範囲", page: 116 },
                    { num: 85, title: "箱ひげ図の読み取り", page: 118 },
                    { num: 86, title: "箱ひげ図とヒストグラム", page: 119 },
                    { num: 87, title: "分散と標準偏差", page: 120 },
                    { num: 88, title: "分散と平均値の関係", page: 122 },
                    { num: 89, title: "データの修正による平均値, 分散の変化", page: 124 },
                    { num: 90, title: "変量の変換", page: 126 },
                    { num: 91, title: "散布図と相関関係", page: 128 },
                    { num: 92, title: "共分散, 相関係数", page: 130 },
                    { num: 93, title: "変量の変換と共分散, 相関係数", page: 132 },
                    { num: 94, title: "仮説検定の考え方", page: 134 }
                ]
            },
            {
                id: "chap6", title: "第6章 場合の数と確率", start: 136, end: 187,
                subsections: [
                    { num: 95,  title: "集合の要素の個数", page: 136 },
                    { num: 96,  title: "樹形図", page: 138 },
                    { num: 97,  title: "和の法則", page: 139 },
                    { num: 98,  title: "積の法則", page: 140 },
                    { num: 99,  title: "約数の個数と総和", page: 141 },
                    { num: 100, title: "支払いに関する場合の数", page: 142 },
                    { num: 101, title: "順列の総数", page: 143 },
                    { num: 102, title: "順列（人の並び）", page: 144 },
                    { num: 103, title: "順列（数字の並び）", page: 146 },
                    { num: 104, title: "円順列", page: 148 },
                    { num: 105, title: "重複順列", page: 150 },
                    { num: 106, title: "組合せの総数", page: 152 },
                    { num: 107, title: "図形と組合せ", page: 154 },
                    { num: 108, title: "組合せと和の法則・積の法則", page: 155 },
                    { num: 109, title: "組分けの総数", page: 156 },
                    { num: 110, title: "同じものを含む順列", page: 158 },
                    { num: 111, title: "最短経路", page: 160 },
                    { num: 112, title: "重複組合せ", page: 162 },
                    { num: 113, title: "重複組合せの応用", page: 164 },
                    { num: 114, title: "確率の考え方", page: 165 },
                    { num: 115, title: "確率と順列・組合せ", page: 166 },
                    { num: 116, title: "確率の加法定理（排反）", page: 167 },
                    { num: 117, title: "余事象の確率", page: 168 },
                    { num: 118, title: "一般の和事象の確率", page: 169 },
                    { num: 119, title: "さいころの出る目の最大値", page: 170 },
                    { num: 120, title: "独立な試行の確率", page: 171 },
                    { num: 121, title: "反復試行の確率", page: 172 },
                    { num: 122, title: "点の移動", page: 174 },
                    { num: 123, title: "ゲームが終わる確率", page: 175 },
                    { num: 124, title: "反復試行の確率 pn を最大にする n", page: 176 },
                    { num: 125, title: "条件付き確率", page: 178 },
                    { num: 126, title: "確率の乗法定理", page: 180 },
                    { num: 127, title: "じゃんけんの確率", page: 182 },
                    { num: 128, title: "原因の確率", page: 184 },
                    { num: 129, title: "期待値", page: 185 },
                    { num: 130, title: "期待値の利用", page: 186 }
                ]
            },
            {
                id: "chap7", title: "第7章 図形の性質", start: 188, end: 217,
                subsections: [
                    { num: 131, title: "線分の内分・外分", page: 188 },
                    { num: 132, title: "平行線と線分の比", page: 189 },
                    { num: 133, title: "三角形の角の二等分線と比", page: 190 },
                    { num: 134, title: "三角形の外心・内心", page: 192 },
                    { num: 135, title: "三角形の重心・垂心", page: 194 },
                    { num: 136, title: "三角形の面積比", page: 196 },
                    { num: 137, title: "三角形の垂心などに関する証明", page: 198 },
                    { num: 138, title: "チェバの定理", page: 200 },
                    { num: 139, title: "メネラウスの定理", page: 201 },
                    { num: 140, title: "円周角の定理とその逆", page: 202 },
                    { num: 141, title: "円に内接する四角形", page: 203 },
                    { num: 142, title: "円の接線", page: 204 },
                    { num: 143, title: "円の接線と弦の作る角（接弦定理）", page: 206 },
                    { num: 144, title: "方べきの定理とその逆", page: 208 },
                    { num: 145, title: "2つの円の位置関係, 共通接線", page: 210 },
                    { num: 146, title: "作図", page: 212 },
                    { num: 147, title: "直線と平面", page: 214 },
                    { num: 148, title: "多面体", page: 216 }
                ]
            },
            {
                id: "chap8", title: "第8章 整数の性質", start: 218, end: 241,
                subsections: [
                    { num: 149, title: "倍数であることの証明", page: 218 },
                    { num: 150, title: "倍数の判定法", page: 219 },
                    { num: 151, title: "nを含む式が自然数となる条件", page: 220 },
                    { num: 152, title: "正の約数の個数と総和", page: 221 },
                    { num: 153, title: "最大公約数, 最小公倍数の性質", page: 222 },
                    { num: 154, title: "自然数の積の末尾に並ぶ0の個数", page: 224 },
                    { num: 155, title: "互いに素であることの証明", page: 225 },
                    { num: 156, title: "余りによる整数の分類", page: 226 },
                    { num: 157, title: "連続する整数の積", page: 228 },
                    { num: 158, title: "等式 a²+b²=c² に関する証明問題", page: 229 },
                    { num: 159, title: "積が素数となる条件", page: 230 },
                    { num: 160, title: "方程式の整数解", page: 231 },
                    { num: 161, title: "分数方程式の自然数解（2文字）", page: 232 },
                    { num: 162, title: "1次不定方程式の自然数解", page: 233 },
                    { num: 163, title: "分数方程式の自然数解（3文字）", page: 234 },
                    { num: 164, title: "ユークリッドの互除法", page: 236 },
                    { num: 165, title: "1次不定方程式の整数解", page: 238 },
                    { num: 166, title: "n進法とその計算", page: 240 }
                ]
            },
            {
                id: "answers", title: "練習の解答", start: 242, end: 288,
                subsections: []
            }
        ],
        // 後方互換: sections配列 (章のみのフラット版)
        get sections() {
            return this.chapters.map(ch => ({
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }));
        },
        pageQrs: {}
    },

    // SuperQuick 数IIBC
    superquick_math2bc: {
        id: "superquick_math2bc",
        title: "SuperQuick 数IIBC",
        totalPages: 368,
        imagesPath: "images/superquick_math2bc/",
        printImagesPath: "images/superquick_math2bc_bw/",
        coverImage: "images/superquick_math2bc_cover.jpg",
        qrBase: "",
        chapters: [
            {
                id: "intro", title: "前書き・目次", start: 1, end: 5,
                subsections: []
            },
            {
                id: "chap1", title: "第1章 式と証明", start: 6, end: 27,
                subsections: [
                    { num: 1,  title: "3次式の展開", page: 6 },
                    { num: 2,  title: "3次式の因数分解", page: 7 },
                    { num: 3,  title: "二項定理, (a+b+c)^nの展開式", page: 8 },
                    { num: 4,  title: "多項式の割り算", page: 10 },
                    { num: 5,  title: "分数式の四則計算", page: 12 },
                    { num: 6,  title: "繁分数式の計算", page: 13 },
                    { num: 7,  title: "分数式の計算：分数式の差, 分子の次数下げ", page: 14 },
                    { num: 8,  title: "恒等式の係数決定：係数比較法", page: 16 },
                    { num: 9,  title: "恒等式の係数決定：数値代入法", page: 17 },
                    { num: 10, title: "分数式の恒等式", page: 18 },
                    { num: 11, title: "等式の証明", page: 19 },
                    { num: 12, title: "条件つきの等式の証明", page: 20 },
                    { num: 13, title: "比例式の値", page: 21 },
                    { num: 14, title: "不等式の証明：実数の平方と大小関係", page: 22 },
                    { num: 15, title: "不等式の証明：絶対値と不等式", page: 24 },
                    { num: 16, title: "不等式の証明：3文字の不等式", page: 25 },
                    { num: 17, title: "相加平均と相乗平均", page: 26 }
                ]
            },
            {
                id: "chap2", title: "第2章 複素数と方程式", start: 28, end: 48,
                subsections: [
                    { num: 18, title: "複素数の計算", page: 28 },
                    { num: 19, title: "複素数の相等", page: 29 },
                    { num: 20, title: "2次方程式の解", page: 30 },
                    { num: 21, title: "2次方程式の解の種類の判別", page: 31 },
                    { num: 22, title: "虚数を係数とする2次方程式", page: 32 },
                    { num: 23, title: "解と係数の関係：対称式の値", page: 34 },
                    { num: 24, title: "2数α,βを解とする2次方程式", page: 35 },
                    { num: 25, title: "2次方程式の解の存在範囲", page: 36 },
                    { num: 26, title: "剰余の定理", page: 37 },
                    { num: 27, title: "2次式で割った余り：剰余の定理の利用", page: 38 },
                    { num: 28, title: "高次式の値", page: 39 },
                    { num: 29, title: "高次方程式の解法：因数定理の利用", page: 40 },
                    { num: 30, title: "1の3乗根とその性質", page: 42 },
                    { num: 31, title: "高次方程式の係数決定：実数解", page: 43 },
                    { num: 32, title: "高次方程式の係数決定：虚数解", page: 44 },
                    { num: 33, title: "2重解をもつ条件", page: 46 },
                    { num: 34, title: "3次方程式の解と係数の関係", page: 48 }
                ]
            },
            {
                id: "chap3", title: "第3章 図形と方程式", start: 49, end: 80,
                subsections: [
                    { num: 35, title: "座標平面上の2点間の距離", page: 49 },
                    { num: 36, title: "座標を利用した証明", page: 50 },
                    { num: 37, title: "平行四辺形の頂点の座標", page: 51 },
                    { num: 38, title: "内分点・外分点の座標", page: 52 },
                    { num: 39, title: "直線の方程式", page: 54 },
                    { num: 40, title: "2直線の平行・垂直", page: 55 },
                    { num: 41, title: "直線に関して対称な点", page: 56 },
                    { num: 42, title: "定点を通る直線の方程式", page: 58 },
                    { num: 43, title: "点と直線の距離", page: 59 },
                    { num: 44, title: "円の方程式", page: 60 },
                    { num: 45, title: "円と直線の位置関係", page: 62 },
                    { num: 46, title: "円の接線の方程式", page: 64 },
                    { num: 47, title: "2つの円の交点を通る図形", page: 66 },
                    { num: 48, title: "2つの円の共通接線", page: 68 },
                    { num: 49, title: "座標平面上の点の軌跡", page: 69 },
                    { num: 50, title: "直線に関して対称な点の軌跡", page: 70 },
                    { num: 51, title: "放物線の頂点の軌跡", page: 71 },
                    { num: 52, title: "放物線の弦の中点の軌跡", page: 72 },
                    { num: 53, title: "2直線の交点の軌跡", page: 74 },
                    { num: 54, title: "不等式の表す領域", page: 76 },
                    { num: 55, title: "領域と最大・最小", page: 78 },
                    { num: 56, title: "領域の利用：文章題", page: 80 }
                ]
            },
            {
                id: "chap4", title: "第4章 三角関数", start: 81, end: 105,
                subsections: [
                    { num: 57, title: "弧度法と扇形", page: 81 },
                    { num: 58, title: "三角関数の値", page: 82 },
                    { num: 59, title: "三角関数の相互関係", page: 84 },
                    { num: 60, title: "三角関数の対称式の値", page: 85 },
                    { num: 61, title: "三角関数を解とする2次方程式", page: 86 },
                    { num: 62, title: "三角関数のグラフ", page: 88 },
                    { num: 63, title: "三角方程式・不等式：角のおき換え", page: 90 },
                    { num: 64, title: "正弦, 余弦の加法定理", page: 92 },
                    { num: 65, title: "正接の加法定理と2直線のなす角", page: 93 },
                    { num: 66, title: "2倍角, 半角, 3倍角の公式", page: 94 },
                    { num: 67, title: "三角関数の合成", page: 96 },
                    { num: 68, title: "三角方程式・不等式：2倍角, 合成利用", page: 98 },
                    { num: 69, title: "三角関数を含む関数の最大・最小(1)", page: 100 },
                    { num: 70, title: "三角関数を含む関数の最大・最小(2)", page: 102 },
                    { num: 71, title: "和と積の公式", page: 104 }
                ]
            },
            {
                id: "chap5", title: "第5章 指数関数と対数関数", start: 106, end: 133,
                subsections: [
                    { num: 72, title: "指数法則と累乗根の計算", page: 106 },
                    { num: 73, title: "指数の計算と式の値", page: 107 },
                    { num: 74, title: "指数関数 y=a^x のグラフ", page: 108 },
                    { num: 75, title: "指数関数を含む方程式・不等式", page: 110 },
                    { num: 76, title: "指数関数を含む関数の最大値, 最小値", page: 112 },
                    { num: 77, title: "対数の性質", page: 114 },
                    { num: 78, title: "底の変換公式", page: 115 },
                    { num: 79, title: "底の変換公式の利用", page: 116 },
                    { num: 80, title: "対数を利用した等式の証明", page: 117 },
                    { num: 81, title: "対数関数 y=log_a x のグラフ", page: 118 },
                    { num: 82, title: "対数関数を含む方程式", page: 120 },
                    { num: 83, title: "対数関数を含む不等式", page: 122 },
                    { num: 84, title: "対数関数を含む関数の最大値, 最小値", page: 124 },
                    { num: 85, title: "対数関数を含む2変数関数の最大値, 最小値", page: 125 },
                    { num: 86, title: "累乗・対数の大小比較", page: 126 },
                    { num: 87, title: "対数不等式と領域の図示", page: 128 },
                    { num: 88, title: "常用対数を利用した桁数, 小数首位", page: 130 },
                    { num: 89, title: "最高位の数字", page: 132 },
                    { num: 90, title: "常用対数を利用する文章題", page: 133 }
                ]
            },
            {
                id: "chap6", title: "第6章 微分法と積分法", start: 134, end: 177,
                subsections: [
                    { num: 91,  title: "平均変化率と微分係数", page: 134 },
                    { num: 92,  title: "導関数の計算", page: 136 },
                    { num: 93,  title: "導関数と微分係数", page: 138 },
                    { num: 94,  title: "関数の極限値と微分係数", page: 139 },
                    { num: 95,  title: "曲線上の点における接線", page: 140 },
                    { num: 96,  title: "曲線上にない点から引いた接線", page: 141 },
                    { num: 97,  title: "共通接線", page: 142 },
                    { num: 98,  title: "2曲線が接する条件", page: 144 },
                    { num: 99,  title: "3次関数の極値とグラフ", page: 146 },
                    { num: 100, title: "4次関数の極値とグラフ", page: 148 },
                    { num: 101, title: "極値から3次関数の係数決定", page: 149 },
                    { num: 102, title: "3次関数が極値をもつ条件", page: 150 },
                    { num: 103, title: "関数の最大値, 最小値", page: 152 },
                    { num: 104, title: "関数の最大値, 最小値：文章題", page: 153 },
                    { num: 105, title: "文字係数の関数の最大値, 最小値", page: 154 },
                    { num: 106, title: "3次方程式の実数解の個数", page: 156 },
                    { num: 107, title: "導関数を利用した不等式の証明", page: 158 },
                    { num: 108, title: "不等式が成り立つ条件", page: 159 },
                    { num: 109, title: "3次関数のグラフに引ける接線の本数", page: 160 },
                    { num: 110, title: "不定積分の計算", page: 162 },
                    { num: 111, title: "導関数から関数の決定", page: 164 },
                    { num: 112, title: "定積分の計算", page: 165 },
                    { num: 113, title: "定積分の計算：∫(x-α)(x-β)dx", page: 166 },
                    { num: 114, title: "定積分で表された関数", page: 168 },
                    { num: 115, title: "定積分と微分法", page: 169 },
                    { num: 116, title: "絶対値のついた関数の定積分", page: 170 },
                    { num: 117, title: "定積分と恒等式", page: 171 },
                    { num: 118, title: "曲線とx軸の間の面積", page: 172 },
                    { num: 119, title: "2つの曲線の間の面積", page: 173 },
                    { num: 120, title: "曲線と接線で囲まれた図形の面積", page: 174 },
                    { num: 121, title: "放物線と直線で囲まれた図形の面積の最小値", page: 176 }
                ]
            },
            {
                id: "chap7", title: "第7章 数列", start: 178, end: 217,
                subsections: [
                    { num: 122, title: "等差数列の一般項", page: 178 },
                    { num: 123, title: "等差数列の和とその最大", page: 180 },
                    { num: 124, title: "等比数列の一般項", page: 182 },
                    { num: 125, title: "等比数列の和", page: 184 },
                    { num: 126, title: "複利計算", page: 186 },
                    { num: 127, title: "Σの計算", page: 188 },
                    { num: 128, title: "階差数列", page: 190 },
                    { num: 129, title: "分数の数列の和", page: 192 },
                    { num: 130, title: "数列の和と一般項", page: 194 },
                    { num: 131, title: "(等差)×(等比)型の数列の和", page: 195 },
                    { num: 132, title: "群数列", page: 196 },
                    { num: 133, title: "格子点の個数", page: 198 },
                    { num: 134, title: "漸化式の基本", page: 200 },
                    { num: 135, title: "a_{n+1}=pa_n+(nの1次式)型の漸化式", page: 202 },
                    { num: 136, title: "a_{n+1}=pa_n+q^n型の漸化式", page: 204 },
                    { num: 137, title: "分数型の漸化式", page: 206 },
                    { num: 138, title: "和S_nを含む漸化式", page: 207 },
                    { num: 139, title: "隣接3項間の漸化式", page: 208 },
                    { num: 140, title: "図形と漸化式", page: 210 },
                    { num: 141, title: "確率と漸化式", page: 212 },
                    { num: 142, title: "数学的帰納法と等式の証明", page: 214 },
                    { num: 143, title: "数学的帰納法と整数の性質", page: 215 },
                    { num: 144, title: "数学的帰納法と不等式の証明", page: 216 },
                    { num: 145, title: "数列の一般項と数学的帰納法", page: 217 }
                ]
            },
            {
                id: "chap8", title: "第8章 統計的な推測", start: 218, end: 251,
                subsections: [
                    { num: 146, title: "確率変数, 確率分布と期待値", page: 218 },
                    { num: 147, title: "確率変数の分散, 標準偏差", page: 221 },
                    { num: 148, title: "確率変数の変換", page: 222 },
                    { num: 149, title: "独立な確率変数と期待値, 分散", page: 224 },
                    { num: 150, title: "二項分布", page: 226 },
                    { num: 151, title: "確率密度関数", page: 228 },
                    { num: 152, title: "正規分布と確率", page: 230 },
                    { num: 153, title: "正規分布の利用", page: 232 },
                    { num: 154, title: "二項分布の正規分布による近似", page: 234 },
                    { num: 155, title: "標本平均の期待値と標準偏差", page: 236 },
                    { num: 156, title: "標本平均と正規分布", page: 239 },
                    { num: 157, title: "標本比率と正規分布", page: 240 },
                    { num: 158, title: "母平均の推定", page: 242 },
                    { num: 159, title: "母比率の推定", page: 244 },
                    { num: 160, title: "信頼区間の幅と標本の大きさ", page: 245 },
                    { num: 161, title: "母比率の検定（両側検定）", page: 246 },
                    { num: 162, title: "母比率の検定（片側検定）", page: 249 },
                    { num: 163, title: "母平均の検定", page: 250 }
                ]
            },
            {
                id: "chap9", title: "第9章 平面上のベクトル", start: 252, end: 283,
                subsections: [
                    { num: 164, title: "ベクトルの演算", page: 252 },
                    { num: 165, title: "ベクトルの成分", page: 254 },
                    { num: 166, title: "ベクトルの内積（定義）", page: 256 },
                    { num: 167, title: "ベクトルの内積（成分）", page: 257 },
                    { num: 168, title: "内積の性質", page: 258 },
                    { num: 169, title: "ベクトルの平行条件・垂直条件", page: 260 },
                    { num: 170, title: "ベクトルの内積と垂直", page: 262 },
                    { num: 171, title: "ベクトルの大きさと垂直", page: 263 },
                    { num: 172, title: "三角形の面積", page: 264 },
                    { num: 173, title: "ベクトルの大きさの最小値", page: 266 },
                    { num: 174, title: "位置ベクトル", page: 268 },
                    { num: 175, title: "内心の位置ベクトル", page: 270 },
                    { num: 176, title: "共線条件", page: 271 },
                    { num: 177, title: "ベクトルの等式と三角形の面積比", page: 272 },
                    { num: 178, title: "直線のベクトル方程式", page: 274 },
                    { num: 179, title: "交点の位置ベクトル", page: 276 },
                    { num: 180, title: "垂心の位置ベクトル", page: 278 },
                    { num: 181, title: "ベクトルの条件と三角形の形状", page: 279 },
                    { num: 182, title: "平面上の点の存在範囲", page: 280 },
                    { num: 183, title: "円のベクトル方程式", page: 282 }
                ]
            },
            {
                id: "chap10", title: "第10章 空間のベクトル", start: 284, end: 303,
                subsections: [
                    { num: 184, title: "空間の点の座標, 2点間の距離", page: 284 },
                    { num: 185, title: "空間のベクトルの成分", page: 286 },
                    { num: 186, title: "空間のベクトルの内積となす角", page: 287 },
                    { num: 187, title: "空間のベクトルの垂直", page: 288 },
                    { num: 188, title: "三角形の面積（空間）", page: 289 },
                    { num: 189, title: "交点の位置ベクトル（空間）", page: 290 },
                    { num: 190, title: "同じ平面上にある条件", page: 292 },
                    { num: 191, title: "直線と平面の交点の位置ベクトル", page: 294 },
                    { num: 192, title: "分点の座標（空間）", page: 296 },
                    { num: 193, title: "座標平面に平行な平面", page: 297 },
                    { num: 194, title: "球面の方程式", page: 298 },
                    { num: 195, title: "球面とその切り口", page: 300 },
                    { num: 196, title: "直線のベクトル方程式（空間）", page: 301 },
                    { num: 197, title: "座標空間における四面体の体積", page: 302 }
                ]
            },
            {
                id: "answers", title: "練習の解答", start: 304, end: 368,
                subsections: []
            }
        ],
        get sections() {
            return this.chapters.map(ch => ({
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }));
        },
        pageQrs: {}
    },

    // スピードチェック 理論化学
    speedcheck_chem: {
        id: "speedcheck_chem",
        title: "スピードチェック 理論化学",
        totalPages: 152,
        imagesPath: "images/speedcheck_chem/",
        printImagesPath: "images/speedcheck_chem_bw/",
        coverImage: "images/speedcheck_chem_cover.jpg",
        qrBase: "",
        chapters: [
            {
                id: "intro", title: "表紙・目次", start: 1, end: 3,
                subsections: []
            },
            {
                id: "part1", title: "物質の構成", start: 4, end: 44,
                subsections: [
                    { num: 1,  title: "原子の構造", page: 4 },
                    { num: 2,  title: "原子の電子配置", page: 7 },
                    { num: 3,  title: "元素の周期表と電子配置", page: 12 },
                    { num: 4,  title: "化学結合", page: 18 },
                    { num: 5,  title: "結晶の種類", page: 25 },
                    { num: 6,  title: "原子量・分子量と物質量", page: 31 },
                    { num: 7,  title: "化学反応式と量的関係", page: 37 },
                    { num: 8,  title: "溶液の濃度", page: 41 }
                ]
            },
            {
                id: "part2", title: "物質の変化", start: 45, end: 85,
                subsections: [
                    { num: 9,  title: "酸・塩基とその量的関係", page: 45 },
                    { num: 10, title: "pHと滴定曲線", page: 53 },
                    { num: 11, title: "酸化還元反応", page: 60 },
                    { num: 12, title: "金属のイオン化傾向と電池", page: 67 },
                    { num: 13, title: "電気分解", page: 73 },
                    { num: 14, title: "化学反応とエンタルピー", page: 78 }
                ]
            },
            {
                id: "part3", title: "物質の状態", start: 86, end: 119,
                subsections: [
                    { num: 15, title: "物質の三態", page: 86 },
                    { num: 16, title: "気体の法則", page: 91 },
                    { num: 17, title: "混合気体と全圧・分圧", page: 95 },
                    { num: 18, title: "固体の溶解度", page: 100 },
                    { num: 19, title: "気体の溶解度", page: 106 },
                    { num: 20, title: "沸点上昇・凝固点降下", page: 109 },
                    { num: 21, title: "浸透圧", page: 113 },
                    { num: 22, title: "コロイド溶液", page: 115 }
                ]
            },
            {
                id: "part4", title: "反応の速さと化学平衡", start: 120, end: 141,
                subsections: [
                    { num: 23, title: "反応の速さと進み方", page: 120 },
                    { num: 24, title: "化学平衡と移動", page: 124 },
                    { num: 25, title: "平衡定数", page: 128 },
                    { num: 26, title: "電離平衡", page: 132 },
                    { num: 27, title: "2段階電離と溶解度積", page: 137 }
                ]
            },
            {
                id: "appendix", title: "索引・付録", start: 142, end: 152,
                subsections: []
            }
        ],
        get sections() {
            return this.chapters.map(ch => ({
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }));
        },
        pageQrs: {}
    },

    // スピードチェック 化学基礎
    speedcheck_chem_basic: {
        id: "speedcheck_chem_basic",
        title: "スピードチェック 化学基礎",
        totalPages: 88,
        imagesPath: "images/speedcheck_chem_basic/",
        printImagesPath: "images/speedcheck_chem_basic_bw/",
        coverImage: "images/speedcheck_chem_basic_cover.jpg",
        qrBase: "",
        chapters: [
            {
                id: "intro", title: "表紙・目次", start: 1, end: 3,
                subsections: []
            },
            {
                id: "part1", title: "物質の構成と化学結合", start: 4, end: 33,
                subsections: [
                    { num: 1,  title: "物質の三態", page: 4 },
                    { num: 2,  title: "原子の構造", page: 10 },
                    { num: 3,  title: "元素の周期表と電子配置", page: 16 },
                    { num: 4,  title: "化学結合", page: 22 },
                    { num: 5,  title: "結晶の種類", page: 29 }
                ]
            },
            {
                id: "part2", title: "物質量と化学反応式", start: 34, end: 48,
                subsections: [
                    { num: 6,  title: "原子量・分子量と物質量", page: 34 },
                    { num: 7,  title: "化学反応式と量的関係", page: 40 },
                    { num: 8,  title: "溶液の濃度", page: 44 }
                ]
            },
            {
                id: "part3", title: "酸・塩基の反応", start: 49, end: 62,
                subsections: [
                    { num: 9,  title: "酸・塩基とその量的関係", page: 49 },
                    { num: 10, title: "pHと滴定曲線", page: 56 }
                ]
            },
            {
                id: "part4", title: "酸化還元反応", start: 63, end: 83,
                subsections: [
                    { num: 11, title: "酸化還元反応", page: 63 },
                    { num: 12, title: "金属のイオン化傾向と電池", page: 70 },
                    { num: 13, title: "電気分解と金属の製錬", page: 76 }
                ]
            },
            {
                id: "appendix", title: "元素の周期表・索引", start: 84, end: 88,
                subsections: []
            }
        ],
        get sections() {
            return this.chapters.map(ch => ({
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }));
        },
        pageQrs: {}
    },

    // 理解しやすい化学・化学基礎
    rikeishiyasui_chem: {
        id: "rikeishiyasui_chem",
        title: "理解しやすい化学・化学基礎",
        totalPages: 577,
        imagesPath: "images/rikeishiyasui_chem/",
        printImagesPath: null, // 印刷非対応
        coverImage: "images/rikeishiyasui_chem_cover.jpg",
        qrBase: "",
        chapters: [
            { id: "intro", title: "目次", start: 1, end: 8, subsections: [] },
            { id: "part1", title: "第1編 物質の構成", start: 9, end: 72, subsections: [] },
            { id: "part2", title: "第2編 物質の変化", start: 73, end: 177, subsections: [] },
            { id: "part3", title: "第3編 物質の状態と平衡", start: 178, end: 245, subsections: [] },
            { id: "part4", title: "第4編 物質の変化と平衡", start: 246, end: 299, subsections: [] },
            { id: "part5", title: "第5編 無機物質", start: 300, end: 365, subsections: [] },
            { id: "part6", title: "第6編 有機化合物", start: 366, end: 437, subsections: [] },
            { id: "part7", title: "第7編 高分子化合物", start: 438, end: 492, subsections: [] },
            { id: "part8", title: "第8編 化学が果たす役割", start: 493, end: 530, subsections: [] },
            { id: "answers", title: "問題の解答", start: 531, end: 562, subsections: [] },
            { id: "index1", title: "索引", start: 563, end: 574, subsections: [] },
            { id: "index2", title: "索引（化学式）", start: 575, end: 577, subsections: [] }
        ],
        get sections() {
            return this.chapters.map(ch => ({
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }));
        },
        pageQrs: {}
    },

    // 化学図録
    kagaku_zuroku: {
        id: "kagaku_zuroku",
        title: "化学図録",
        totalPages: 141,
        imagesPath: "images/kagaku_zuroku/",
        printImagesPath: null, // 印刷非対応
        coverImage: "images/kagaku_zuroku_cover.jpg",
        qrBase: "",
        chapters: [
            { id: "chap0", title: "元素・実験の基本操作", start: 1, end: 14, subsections: [] },
            { id: "chap1", title: "物質の構成", start: 15, end: 30, subsections: [] },
            { id: "chap2", title: "物質の状態", start: 31, end: 40, subsections: [] },
            { id: "chap3", title: "物質の反応", start: 41, end: 59, subsections: [] },
            { id: "chap4", title: "無機化合物", start: 60, end: 86, subsections: [] },
            { id: "chap5", title: "有機化合物", start: 87, end: 106, subsections: [] },
            { id: "chap6", title: "人間生活と物質", start: 107, end: 123, subsections: [] },
            { id: "chap7", title: "資料・索引", start: 124, end: 141, subsections: [] }
        ],
        get sections() {
            return this.chapters.map(ch => ({
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }));
        },
        pageQrs: {}
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { hsData };
}
