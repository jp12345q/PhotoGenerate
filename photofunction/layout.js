/* ==========================================
   layout.js
   Multi-page plain-paper layout
========================================== */

const Layout = (() => {

    let currentPage = 0;
    let totalPages = 1;

    function mmToPx(mm) {
        return mm * 3.7795275591;
    }

    async function arrange(page = currentPage) {

        const images = Upload.getImages();

        if (!images.length) {
            alert("Please upload photos first.");
            return;
        }

        const paperKey =
            document.getElementById("paperSize").value;

        const photoKey =
            document.getElementById("photoSize").value;

        const rows = Math.max(
            1,
            Number(document.getElementById("rows").value)
        );

        const cols = Math.max(
            1,
            Number(document.getElementById("columns").value)
        );

        const photosPerPage = rows * cols;

        totalPages = Math.max(
            1,
            Math.ceil(images.length / photosPerPage)
        );

        currentPage = Math.min(
            Math.max(page, 0),
            totalPages - 1
        );

        Canvas.loadPaper(paperKey);
        Canvas.begin();

        const paper = CONFIG.PAPER[paperKey].preview;

        let photoWidth;
        let photoHeight;

        if (photoKey === "custom") {

            const widthInches =
                Number(
                    document.getElementById("customWidth").value
                );

            const heightInches =
                Number(
                    document.getElementById("customHeight").value
                );

            if (
                !Number.isFinite(widthInches) ||
                !Number.isFinite(heightInches) ||
                widthInches <= 0 ||
                heightInches <= 0
            ) {
                alert("Enter a valid custom width and height.");
                return;
            }

            // 1 inch = 96 pixels in the preview canvas
            photoWidth =
                widthInches * 96;

            photoHeight =
                heightInches * 96;

        } else {

            const photo =
                CONFIG.PHOTO[photoKey];

            if (!photo) {
                alert("Unknown photo size.");
                return;
            }

            photoWidth =
                mmToPx(photo.width);

            photoHeight =
                mmToPx(photo.height);

        }

        // ==========================================
        // Mixed per-photo layout
        // ==========================================

        const gap =
            CONFIG.LAYOUT.gap;

        const margin = 20;


        /*
        * Available area inside the paper
        */
        const usableWidth =
            paper.width -
            (margin * 2);

        const usableHeight =
            paper.height -
            (margin * 2);


        /*
        * Rows / Columns create fixed cells.
        */
        const cellWidth =
            (
                usableWidth -
                (cols - 1) * gap
            ) / cols;

        const cellHeight =
            (
                usableHeight -
                (rows - 1) * gap
            ) / rows;


        /*
        * Current page photos
        */
        const startIndex =
            currentPage *
            photosPerPage;

        const pageImages =
            images.slice(
                startIndex,
                startIndex + photosPerPage
            );


        const photoTasks =
            pageImages.map(
                (photoData, index) => {

                    const row =
                        Math.floor(
                            index / cols
                        );

                    const col =
                        index % cols;


                    // ==========================
                    // THIS PHOTO'S SIZE
                    // ==========================

                    const sizeKey =
                        photoData.photoSize ||
                        photoKey ||
                        "2x2";


                    let itemWidth;
                    let itemHeight;


                    /*
                    * Custom size
                    */
                    if (sizeKey === "custom") {

                        const widthInches =
                            Number(
                                photoData.customWidth || 2
                            );

                        const heightInches =
                            Number(
                                photoData.customHeight || 2
                            );

                        itemWidth =
                            widthInches * 96;

                        itemHeight =
                            heightInches * 96;

                    }else {

                        const size =
                            CONFIG.PHOTO[
                                sizeKey
                            ];

                        if (!size) {

                            console.warn(
                                "Unknown photo size:",
                                sizeKey
                            );

                            return Promise.resolve();

                        }

                        itemWidth =
                            mmToPx(
                                size.width
                            );

                        itemHeight =
                            mmToPx(
                                size.height
                            );

                    }


                    // ==========================
                    // ORIENTATION
                    // ==========================

                    const landscape =
                        photoData.orientation ===
                        "landscape";


                    /*
                    * Swap print box dimensions.
                    */
                    if (landscape) {

                        [
                            itemWidth,
                            itemHeight
                        ] = [
                            itemHeight,
                            itemWidth
                        ];

                    }

                    // ==========================
                    // CELL POSITION
                    // ==========================

                    const cellLeft =
                        margin +
                        col *
                        (cellWidth + gap);

                    const cellTop =
                        margin +
                        row *
                        (cellHeight + gap);


                    /*
                    * Center the REAL print size
                    * inside this row/column cell.
                    *
                    * Do NOT resize it.
                    */
                    const left =
                        cellLeft +
                        (cellWidth - itemWidth) / 2;

                    const top =
                        cellTop +
                        (cellHeight - itemHeight) / 2;


                    /*
                    * Draw this photo.
                    */
                    return Canvas.addPhoto({

                        src: photoData.src,

                        left,
                        top,

                        width: itemWidth,
                        height: itemHeight,

                        fit:
                            photoData.fit ||
                            "contain",

                        rotation:
                            photoData.rotation ||
                            0

                    });

                }
            );

        await Promise.all(photoTasks);

        Canvas.finish();

        updatePageControls();
        
    }

    function nextPage() {

        if (currentPage < totalPages - 1) {
            arrange(currentPage + 1);
        }

    }

    function previousPage() {

        if (currentPage > 0) {
            arrange(currentPage - 1);
        }

    }

    function resetPage() {

        currentPage = 0;

    }

    function updatePageControls() {

        const pageInfo =
            document.getElementById("pageInfo");

        const prevButton =
            document.getElementById("prevPageBtn");

        const nextButton =
            document.getElementById("nextPageBtn");

        if (pageInfo) {
            pageInfo.textContent =
                `Page ${currentPage + 1} of ${totalPages}`;
        }

        if (prevButton) {
            prevButton.disabled =
                currentPage === 0;
        }

        if (nextButton) {
            nextButton.disabled =
                currentPage >= totalPages - 1;
        }

    }

    function init() {

        document
            .getElementById("prevPageBtn")
            ?.addEventListener(
                "click",
                previousPage
            );

        document
            .getElementById("nextPageBtn")
            ?.addEventListener(
                "click",
                nextPage
            );

    }

    function getTotalPages() {
        return totalPages;
    }

    function getCurrentPage() {
        return currentPage;
    }

    return {

        init,
        arrange,
        nextPage,
        previousPage,
        resetPage,
        getTotalPages,
        getCurrentPage

    };

})();