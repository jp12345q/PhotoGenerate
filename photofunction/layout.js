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

                    const scale = Math.max(
                        photoWidth / img.width,
                        photoHeight / img.height
                    );

                    img.scale(scale);

                    img.set({

                        left: left + (photoWidth - img.getScaledWidth()) / 2,

                        top: top + (photoHeight - img.getScaledHeight()) / 2,

                        selectable: true,

                        cornerColor: "#000000",
                        borderColor: "#000000",
                        transparentCorners: false,
                        cornerSize: 10

                    });

                    // Crop everything outside the frame
                    img.clipPath = new fabric.Rect({

                        left: left,
                        top: top,

                        width: photoWidth,
                        height: photoHeight,

                        absolutePositioned: true,

                        fit: "cover"

                    });

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