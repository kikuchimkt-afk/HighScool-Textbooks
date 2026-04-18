const jhsData = {
    jhs_iwork_science3: {
        id: "jhs_iwork_science3",
        title: "iワーク 中3理科",
        totalPages: 434,
        imagesPath: "images/jhs_iwork_science3/",
        printImagesPath: null,
        coverImage: "images/jhs_iwork_science3_cover.jpg",
        qrBase: "",
        chapters: [
            { id: "cover", title: "表紙", start: 1, end: 1, subsections: [] },
            { id: "main", title: "中3理科（本冊）", start: 2, end: 233, subsections: [] },
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
    }
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = { jhsData };
}
