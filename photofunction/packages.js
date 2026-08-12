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
        document.getElementById("package").value;

        console.log("Selected glossy package:", packageKey);

        const config =
            CONFIG.PACKAGES[packageKey];

        const customPackage =
            PackageSettings.getPackage(
                packageKey
            );

        /*
        * Nothing selected
        */
        if (!config && !customPackage) {

            console.log(
                "Waiting for glossy package selection..."
            );

            return;
        }


        /*
        * CUSTOM GLOSSY PACKAGE
        */
        if (customPackage) {

            await drawCustomPackage(
                canvas,
                paper,
                images,
                customPackage
            );

            return;
        }


        /*
        * BUILT-IN PACKAGES
        */
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
                images,
                config
            );

        }

    }

    //--------------------------------------------------

    async function drawGrid(canvas, paper, images, config) {

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

        const first = images[0];

        const second =
            images.length > 1
                ? images[1]
                : first;

        const halfCopies =
            Math.floor(config.copies / 2);

        const packagePhotos = [];

        for (let i = 0; i < halfCopies; i++) {
            packagePhotos.push(first);
        }

        for (
            let i = packagePhotos.length;
            i < config.copies;
            i++
        ) {
            packagePhotos.push(second);
        }

        const tasks = [];

        packagePhotos.forEach((photo, index) => {

            const row =
                Math.floor(index / config.cols);

            const col =
                index % config.cols;

            const left =
                startX +
                col * (photoWidth + config.gap);

            const top =
                startY +
                row * (photoHeight + config.gap);

            tasks.push(
                Canvas.addPhoto({
                    src: photo.src,
                    left,
                    top,
                    width: photoWidth,
                    height: photoHeight,
                    fit: "cover"
                })
            );

        });

        await Promise.all(tasks);

        // Draw cut lines
        packagePhotos.forEach((photo, index) => {

            const row =
                Math.floor(index / config.cols);

            const col =
                index % config.cols;

            const left =
                startX +
                col * (photoWidth + config.gap);

            const top =
                startY +
                row * (photoHeight + config.gap);

            Canvas.addBorder({

                left,
                top,

                width: photoWidth,
                height: photoHeight,

                color: "#555",
                thickness: 1

            });

        });

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

        const topPhotos = [
            first,
            first,
            second,
            second
        ];

        const bottomPhotos = [
            first,
            first,
            second,
            second
        ];

        // Four 2x2 copies
        topPhotos.forEach((photo, index) => {

            tasks.push(
                Canvas.addPhoto({
                    src: photo.src,

                    left:
                        topX +
                        index * (w2 + gap),

                    top: topY,

                    width: w2,
                    height: h2,

                    fit: "cover"
                })
            );

        });

        // Four 1x1 copies
        bottomPhotos.forEach((photo, index) => {

            tasks.push(
                Canvas.addPhoto({
                    src: photo.src,

                    left:
                        bottomX +
                        index * (w1 + gap),

                    top: bottomY,

                    width: w1,
                    height: h1,

                    fit: "cover"
                })
            );

        });

        await Promise.all(tasks);

        /* ---------------------------
        2x2 Borders
        ---------------------------- */

        topPhotos.forEach((photo, index) => {

            Canvas.addBorder({

                left:
                    topX +
                    index * (w2 + gap),

                top: topY,

                width: w2,
                height: h2

            });

        });

        /* ---------------------------
        1x1 Borders
        ---------------------------- */

        bottomPhotos.forEach((photo, index) => {

            Canvas.addBorder({

                left:
                    bottomX +
                    index * (w1 + gap),

                top: bottomY,

                width: w1,
                height: h1

            });

        });

        Canvas.finish();

    }

    async function drawCustomPackage(
        canvas,
        paper,
        images,
        customPackage
    ) {

        if (
            !customPackage ||
            !customPackage.items ||
            !customPackage.items.length
        ) {

            console.error(
                "Custom package has no items."
            );

            return;
        }

        const GAP = 8;

        const MARGIN = 20;

        let currentX = MARGIN;
        let currentY = MARGIN;

        let rowHeight = 0;

        let imageIndex = 0;


        /*
        * Example:
        *
        * items = [
        *   { size:"2x2", copies:4 },
        *   { size:"Wallet", copies:2 }
        * ]
        */

        for (
            const item of customPackage.items
        ) {

            const photoConfig =
                CONFIG.PHOTO[item.size];

            if (!photoConfig) {

                console.warn(
                    "Unknown photo size:",
                    item.size
                );

                continue;
            }


            const photoWidth =
                photoConfig.width *
                3.779527559;

            const photoHeight =
                photoConfig.height *
                3.779527559;


            for (
                let copy = 0;
                copy < item.copies;
                copy++
            ) {

                /*
                * If the next photo no longer
                * fits horizontally, start a
                * new row.
                */
                if (
                    currentX +
                    photoWidth >
                    paper.width - MARGIN
                ) {

                    currentX = MARGIN;

                    currentY +=
                        rowHeight + GAP;

                    rowHeight = 0;

                }


                /*
                * Stop if we've reached the
                * bottom of the A4 paper.
                */
                if (
                    currentY +
                    photoHeight >
                    paper.height - MARGIN
                ) {

                    console.warn(
                        "Custom package does not fit on the page."
                    );

                    Canvas.finish();

                    return;

                }


                /*
                * Cycle through uploaded photos.
                *
                * 1 photo:
                * photo1 photo1 photo1...
                *
                * 2 photos:
                * photo1 photo2 photo1 photo2...
                */
                const photo =
                    images[
                        imageIndex %
                        images.length
                    ];


                await Canvas.addPhoto({

                    src: photo.src,

                    left: currentX,

                    top: currentY,

                    width: photoWidth,

                    height: photoHeight,

                    fit: "cover"

                });


                /*
                * Glossy cutting line
                */
                Canvas.addBorder({

                    left: currentX,

                    top: currentY,

                    width: photoWidth,

                    height: photoHeight,

                    color: "#555",

                    thickness: 1

                });


                /*
                * Keep tallest photo in this row
                */
                rowHeight =
                    Math.max(
                        rowHeight,
                        photoHeight
                    );


                currentX +=
                    photoWidth + GAP;


                imageIndex++;

            }

        }


        Canvas.finish();

    }
    
    //--------------------------------------------------

    return {

        generate

    };

})();