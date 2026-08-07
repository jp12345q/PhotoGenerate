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

            await drawMixed(
                canvas,
                paper,
                images,
                config
            );

        } else {

            await drawGrid(
                canvas,
                paper,
                images[0],
                config
            );

        }

    }

    //--------------------------------------------------

    async function drawGrid(canvas, paper, imageData, config) {

        const size = CONFIG.PHOTO[config.photo];

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

        const tasks = [];

        for (let row = 0; row < config.rows; row++) {

            for (let col = 0; col < config.cols; col++) {

                if (count >= config.copies) {
                    break;
                }

                const left =
                    startX +
                    col * (photoWidth + config.gap);

                const top =
                    startY +
                    row * (photoHeight + config.gap);

                tasks.push(
                    Canvas.addPhoto({
                        src: imageData.src,
                        left,
                        top,
                        width: photoWidth,
                        height: photoHeight,
                        fit: "cover"
                    })
                );

                count++;

            }

            if (count >= config.copies) {
                break;
            }

        }

        await Promise.all(tasks);

        Canvas.finish();

    }

    //--------------------------------------------------

    async function drawMixed(canvas, paper, images) {

        const p2 = CONFIG.PHOTO["2x2"];
        const p1 = CONFIG.PHOTO["1x1"];

        const w2 = p2.width * 3.779527559;
        const h2 = p2.height * 3.779527559;

        const w1 = p1.width * 3.779527559;
        const h1 = p1.height * 3.779527559;

        const gap = 8;
        const rowGap = 20;

        const topWidth =
            (w2 * 4) + (gap * 3);

        const bottomWidth =
            (w1 * 4) + (gap * 3);

        const topX =
            (paper.width - topWidth) / 2;

        const bottomX =
            (paper.width - bottomWidth) / 2;

        const topY = 20;
        const bottomY =
            topY + h2 + rowGap;

        const first = images[0];

        const second =
            images.length > 1
                ? images[1]
                : first;

        const tasks = [];

        // Photo #1: four 2x2 copies
        for (let i = 0; i < 4; i++) {

            tasks.push(
                Canvas.addPhoto({
                    src: first.src,
                    left: topX + i * (w2 + gap),
                    top: topY,
                    width: w2,
                    height: h2,
                    fit: "cover"
                })
            );

        }

        // Photo #2: four 1x1 copies
        for (let i = 0; i < 4; i++) {

            tasks.push(
                Canvas.addPhoto({
                    src: second.src,
                    left: bottomX + i * (w1 + gap),
                    top: bottomY,
                    width: w1,
                    height: h1,
                    fit: "cover"
                })
            );

        }

        await Promise.all(tasks);

        Canvas.finish();

    }
    
    //--------------------------------------------------

    return {

        generate

    };

})();