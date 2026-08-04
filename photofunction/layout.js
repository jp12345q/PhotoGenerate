/* ==========================================
   layout.js
   Layout Renderer v2
========================================== */

const Layout = (() => {

    function mmToPx(mm) {
        return mm * 3.7795275591;
    }

    async function arrange() {

        const canvas = Canvas.getCanvas();

        const images = Upload.getImages();

        if (!images.length) {
            alert("Please upload photos first.");
            return;
        }

        //--------------------------------------------------
        // Read Settings
        //--------------------------------------------------

        const paperKey =
            document.getElementById("paperSize").value;

        const photoKey =
            document.getElementById("photoSize").value;

        const spacing =
            mmToPx(
                Number(
                    document.getElementById("spacing").value
                )
            );

        //--------------------------------------------------
        // Load Paper
        //--------------------------------------------------

        Canvas.loadPaper(paperKey);

        const paper =
            CONFIG.PAPER[paperKey].preview;

        const photo =
            CONFIG.PHOTO[photoKey];

        const photoWidth =
            mmToPx(photo.width);

        const photoHeight =
            mmToPx(photo.height);

        //--------------------------------------------------
        // Clear Previous Photos
        //--------------------------------------------------

        Canvas.clearPhotos();

        //--------------------------------------------------
        // Layout Calculation
        //--------------------------------------------------

        const margin = 20;

        const usableWidth =
            paper.width - margin * 2;

        const cols = Math.max(
            1,
            Math.floor(
                (usableWidth + spacing) /
                (photoWidth + spacing)
            )
        );

        images.forEach((photoData, index) => {

            const col = index % cols;
            const row = Math.floor(index / cols);

            const left =
                margin +
                col * (photoWidth + spacing);

            const top =
                margin +
                row * (photoHeight + spacing);

            Canvas.addPhoto({

                src: photoData.src,

                left,

                top,

                width: photoWidth,

                height: photoHeight,

                fit: "cover"

            });

        });

        canvas.renderAll();

        console.log(
            "Layout Render Complete:",
            images.length
        );

    }

    return {

        arrange

    };

})();