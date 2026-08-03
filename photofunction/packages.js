/* ==========================================
   packages.js
========================================== */

const Packages = (() => {

    async function generate() {

        const canvas = Canvas.getCanvas();

        const images = Upload.getImages();

        if (!images.length) {

            alert("Upload photo first.");

            return;

        }

        Canvas.clearPhotos();

        const paperKey =
            document.getElementById("paperSize").value;

        Canvas.loadPaper(paperKey);

        const paper =
            CONFIG.PAPER[paperKey].preview;

        const packageKey =
            document.getElementById("photoSize").value;

        const config =
            CONFIG.PACKAGES[packageKey];

        if (!config) {

            alert("Unknown package.");

            return;

        }

        if (packageKey === "mixed") {

            drawMixed(canvas, paper, images[0], config);

        } else {

            drawGrid(canvas, paper, images[0], config);

        }

    }

    //--------------------------------------------------

    function drawGrid(canvas, paper, imageData, config) {

        const size =
            CONFIG.PHOTO[config.photo];

        const photoWidth =
            size.width * 3.779527559;

        const photoHeight =
            size.height * 3.779527559;

        const totalWidth =
            config.cols * photoWidth +
            (config.cols - 1) * config.gap;

        const startX =
            (paper.width - totalWidth) / 2;

        const startY =
            config.margin;

        let count = 0;

        for (let row = 0; row < config.rows; row++) {

            for (let col = 0; col < config.cols; col++) {

                if (count >= config.copies)
                    return;

                const left =
                    startX +
                    col * (photoWidth + config.gap);

                const top =
                    startY +
                    row * (photoHeight + config.gap);

                addPhoto(
                    canvas,
                    imageData.src,
                    left,
                    top,
                    photoWidth,
                    photoHeight
                );

                count++;

            }

        }

    }

    //--------------------------------------------------

    function drawMixed(canvas, paper, imageData) {

        const photo2 =
            CONFIG.PHOTO["2x2"];

        const photo1 =
            CONFIG.PHOTO["1x1"];

        const w2 = photo2.width * 3.779527559;
        const h2 = photo2.height * 3.779527559;

        const w1 = photo1.width * 3.779527559;
        const h1 = photo1.height * 3.779527559;

        const gap = 8;

        let x = 10;

        for (let i = 0; i < 4; i++) {

            addPhoto(canvas, imageData.src, x, 10, w2, h2);

            x += w2 + gap;

        }

        x = 10;

        for (let i = 0; i < 4; i++) {

            addPhoto(canvas, imageData.src, x, h2 + 20, w1, h1);

            x += w1 + gap;

        }

    }

    //--------------------------------------------------

    function addPhoto(canvas, src, left, top, width, height) {

        fabric.Image.fromURL(src, img => {

            img.set({

                left,

                top,

                selectable: true

            });

            img.scaleToWidth(width);

            img.scaleToHeight(height);

            canvas.add(img);

            canvas.renderAll();

        });

    }

    //--------------------------------------------------

    return {

        generate

    };

})();