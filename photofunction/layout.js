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

        let loaded = 0;

        images.forEach((photoData, index) => {

            fabric.Image.fromURL(
                photoData.src,

                img => {

                    const col = index % cols;
                    const row = Math.floor(index / cols);

                    const left =
                        margin +
                        col * (photoWidth + spacing);

                    const top =
                        margin +
                        row * (photoHeight + spacing);

                    img.set({

                        left,
                        top,

                        selectable: true,

                        cornerColor: "#3498db",
                        borderColor: "#3498db",
                        transparentCorners: false,
                        cornerSize: 10

                    });

                    img.scaleToWidth(photoWidth);
                    img.scaleToHeight(photoHeight);

                    canvas.add(img);

                    loaded++;

                    if (loaded === images.length) {

                        canvas.renderAll();

                        console.log(
                            "Layout Render Complete:",
                            loaded
                        );

                    }

                },

                {
                    crossOrigin: "anonymous"
                }

            );

        });

    }

    return {

        arrange

    };

})();