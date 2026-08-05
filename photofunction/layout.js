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

        const paperKey = document.getElementById("paperSize").value;
        const photoKey = document.getElementById("photoSize").value;

        const rows = Math.max(
            1,
            Number(document.getElementById("rows").value)
        );

        const cols = Math.max(
            1,
            Number(document.getElementById("columns").value)
        );

        //--------------------------------------------------
        // Load Paper
        //--------------------------------------------------

        Canvas.loadPaper(paperKey);

        const paper = CONFIG.PAPER[paperKey].preview;

        const photo = CONFIG.PHOTO[photoKey];

        const photoWidth = mmToPx(photo.width);
        const photoHeight = mmToPx(photo.height);

        Canvas.begin();

        //--------------------------------------------------
        // Margins
        //--------------------------------------------------

        const margin = CONFIG.LAYOUT.margin;
        const gap = CONFIG.LAYOUT.gap;

        const usableWidth =
            paper.width - margin * 2;

        const usableHeight =
            paper.height - margin * 2;

        //--------------------------------------------------
        // Auto spacing
        //--------------------------------------------------

        const spacingX =
            cols > 1
                ? (usableWidth - (cols * photoWidth)) / (cols - 1)
                : 0;

        const spacingY =
            rows > 1
                ? (usableHeight - (rows * photoHeight)) / (rows - 1)
                : 0;

        //--------------------------------------------------
        // Draw Grid
        //--------------------------------------------------

        let index = 0;

        for (let row = 0; row < rows; row++) {

            for (let col = 0; col < cols; col++) {

                if (index >= images.length)
                    break;

                const left =
                    margin +
                    col * (photoWidth + spacingX);

                const top =
                    margin +
                    row * (photoHeight + spacingY);

                console.log(
                    "Drawing Photo",
                    {
                        index,
                        src: images[index].src,
                        left,
                        top,
                        width: photoWidth,
                        height: photoHeight
                    }
                );

                Canvas.addPhoto({

                    src: images[index].src,

                    left,

                    top,

                    width: photoWidth,

                    height: photoHeight,

                    fit: "cover"

                });

                index++;

            }

        }
        
        Canvas.finish();

    }

    return {

        arrange

    };

})();