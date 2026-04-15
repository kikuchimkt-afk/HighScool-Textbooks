const hsData = {
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
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { hsData };
}
