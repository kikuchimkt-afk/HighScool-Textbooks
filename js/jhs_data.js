const jhsData = {
    jhs_iwork_science3: {
        id: "jhs_iwork_science3",
        title: "iワーク 中3理科",
        totalPages: 434,
        imagesPath: "images/jhs_iwork_science3/",
        printImagesPath: null,
        spreadEvenLeftBySection: true,
        coverImage: "images/jhs_iwork_science3_cover.jpg",
        qrBase: "",
        chapters: [
            { id: "cover", title: "表紙", start: 1, end: 1, subsections: [] },
            { id: "main", title: "中3理科（本冊）", start: 2, end: 233, subsections: [
                { num: 1, title: "いろいろな生物とその共通点", page: 5 },
                { num: 2, title: "活きている地球", page: 9 },
                { num: 3, title: "身のまわりの物質", page: 13 },
                { num: 4, title: "光・音・力による現象", page: 17 },
                { num: 5, title: "生物の体のつくりとはたらき", page: 21 },
                { num: 6, title: "地球の大気と天気の変化", page: 25 },
                { num: 7, title: "化学変化と原子・分子", page: 29 },
                { num: 8, title: "電流とその利用", page: 33 },
                { num: 9, title: "生物のふえ方と成長", page: 37 },
                { num: 10, title: "遺伝の規則性と遺伝子", page: 41 },
                { num: 11, title: "生物の種類の実多様性と進化", page: 45 },
                { num: 12, title: "宇宙の天体", page: 63 },
                { num: 13, title: "太陽の動き", page: 67 },
                { num: 14, title: "星座の星の動き", page: 73 },
                { num: 15, title: "月と金星の動きと見え方", page: 77 },
                { num: 16, title: "水溶液とイオン", page: 99 },
                { num: 17, title: "電池とイオン", page: 105 },
                { num: 18, title: "酸とアルカリ", page: 111 },
                { num: 19, title: "中和と塩", page: 115 },
                { num: 20, title: "水中の物体にはたらく力", page: 139 },
                { num: 21, title: "力の合成と分解", page: 143 },
                { num: 22, title: "物体の運動", page: 147 },
                { num: 23, title: "水平面上での物体の運動", page: 155 },
                { num: 24, title: "斜面上の物体の運動", page: 159 },
                { num: 25, title: "仕事", page: 169 },
                { num: 26, title: "エネルギー", page: 175 },
                { num: 27, title: "多様なエネルギーとその移り変わり", page: 181 },
                { num: 28, title: "エネルギー資源とその利用", page: 185 },
                { num: 29, title: "生物どうしのつながり", page: 209 },
                { num: 30, title: "生物の遺骸のゆくえと物質の循環", page: 213 },
                { num: 31, title: "自然と人間", page: 217 },
                { num: "資料", title: "元素周期表", page: 233 }
            ] },
            { id: "main_answers", title: "中3理科 解答解説", start: 234, end: 315, subsections: [] },
            { id: "plus", title: "iワークプラス", start: 316, end: 409, subsections: [] },
            { id: "plus_answers", title: "iワークプラス 解答解説", start: 410, end: 434, subsections: [] }
        ],
        get sections() {
            return this.chapters.map(ch => ({
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }));
        },
        pageQrs: {}
    },
    jhs_iwork_science2: {
        id: "jhs_iwork_science2",
        title: "iワーク 中2理科",
        totalPages: 426,
        imagesPath: "images/jhs_iwork_science2/",
        printImagesPath: null,
        spreadEvenLeftBySection: true,
        coverImage: "images/jhs_iwork_science2_cover.jpg",
        qrBase: "",
        chapters: [
            { id: "cover", title: "表紙", start: 1, end: 1, subsections: [] },
            { id: "main", title: "中2理科（本冊）", start: 2, end: 233, subsections: [
                { num: 1, title: "いろいろな生物とその共通点", page: 5 },
                { num: 2, title: "活きている地球", page: 9 },
                { num: 3, title: "身のまわりの物質", page: 13 },
                { num: 4, title: "光・音・力による現象", page: 17 },
                { num: 5, title: "生物の体をつくるもの", page: 21 },
                { num: 6, title: "光合成と呼吸", page: 25 },
                { num: 7, title: "根と茎のつくり", page: 31 },
                { num: 8, title: "葉のつくりとはたらき", page: 35 },
                { num: 9, title: "栄養分をとり入れるしくみ", page: 41 },
                { num: 10, title: "動物の呼吸", page: 45 },
                { num: 11, title: "動物の行動のしくみ", page: 49 },
                { num: 12, title: "大気の中ではたらく力", page: 73 },
                { num: 13, title: "気象観測", page: 77 },
                { num: 14, title: "雲のでき方", page: 83 },
                { num: 15, title: "空気中にふくまれる水蒸気の量", page: 87 },
                { num: 16, title: "気圧配置と天気の変化", page: 95 },
                { num: 17, title: "大気の動き", page: 99 },
                { num: 18, title: "日本の天気", page: 105 },
                { num: 19, title: "物質の分解", page: 125 },
                { num: 20, title: "物質の成り立ち", page: 129 },
                { num: 21, title: "物質どうしが結びつく変化", page: 137 },
                { num: 22, title: "酸化と還元", page: 141 },
                { num: 23, title: "化学変化と熱の出入り", page: 145 },
                { num: 24, title: "化学変化の前後の物質の質量", page: 153 },
                { num: 25, title: "反応する物質どうしの質量の割合", page: 157 },
                { num: 26, title: "回路と電流・電圧", page: 181 },
                { num: 27, title: "電圧と電流の関係", page: 187 },
                { num: 28, title: "電流のはたらきを表す量", page: 193 },
                { num: 29, title: "電流の正体", page: 201 },
                { num: 30, title: "電流がつくる磁界", page: 205 },
                { num: 31, title: "発電機のしくみ", page: 209 },
                { num: "資料", title: "元素周期表", page: 233 }
            ] },
            { id: "main_answers", title: "中2理科 解答解説", start: 234, end: 307, subsections: [] },
            { id: "plus", title: "iワークプラス", start: 308, end: 401, subsections: [] },
            { id: "plus_answers", title: "iワークプラス 解答解説", start: 402, end: 426, subsections: [] }
        ],
        get sections() {
            return this.chapters.map(ch => ({
                id: ch.id, title: ch.title, start: ch.start, end: ch.end,
                pages: ch.end - ch.start + 1
            }));
        },
        pageQrs: {}
    },
    jhs_iwork_science1: {
        id: "jhs_iwork_science1",
        title: "iワーク 中1理科",
        totalPages: 386,
        imagesPath: "images/jhs_iwork_science1/",
        printImagesPath: null,
        spreadEvenLeftBySection: true,
        coverImage: "images/jhs_iwork_science1_cover.jpg",
        qrBase: "",
        chapters: [
            { id: "cover", title: "表紙", start: 1, end: 1, subsections: [] },
            { id: "main", title: "中1理科（本冊）", start: 2, end: 208, subsections: [
                { num: 1, title: "自然の中にあふれる生命", page: 5 },
                { num: 2, title: "花のつくり", page: 11 },
                { num: 3, title: "子葉、葉、根のつくり", page: 17 },
                { num: 4, title: "植物の分類", page: 21 },
                { num: 5, title: "背骨のある動物", page: 29 },
                { num: 6, title: "背骨のない動物と動物の分類", page: 33 },
                { num: 7, title: "身近な大地と地震のゆれ", page: 53 },
                { num: 8, title: "地震のゆれの大きさ", page: 59 },
                { num: 9, title: "火山の噴火", page: 67 },
                { num: 10, title: "マグマからできた岩石", page: 71 },
                { num: 11, title: "地層のでき方と広がり", page: 77 },
                { num: 12, title: "地層・化石と大地の歴史", page: 81 },
                { num: 13, title: "物質の区別", page: 103 },
                { num: 14, title: "重さ・体積と物質の区別", page: 107 },
                { num: 15, title: "いろいろな気体とその性質", page: 115 },
                { num: 16, title: "物質のとけ方", page: 121 },
                { num: 17, title: "溶質のとり出し方", page: 125 },
                { num: 18, title: "物質のすがたの変化", page: 133 },
                { num: 19, title: "状態変化と温度", page: 137 },
                { num: 20, title: "光の進み方", page: 159 },
                { num: 21, title: "光が通りぬけるときのようす", page: 163 },
                { num: 22, title: "レンズのはたらき", page: 169 },
                { num: 23, title: "音による現象", page: 177 },
                { num: 24, title: "力のはたらき", page: 183 },
                { num: 25, title: "力のつり合い", page: 189 },
                { num: "資料", title: "実験・観察の基本操作", page: 209 }
            ] },
            { id: "main_answers", title: "中1理科 解答解説", start: 209, end: 279, subsections: [] },
            { id: "plus", title: "iワークプラス", start: 280, end: 357, subsections: [] },
            { id: "plus_answers", title: "iワークプラス 解答解説", start: 358, end: 386, subsections: [] }
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

if (typeof module !== "undefined" && module.exports) {
    module.exports = { jhsData };
}
