/* ==========================================
   layout.js
========================================== */

const Layout = (() => {

    function mmToPx(mm) {
        return mm * 3.7795275591;
    }

    function getPhotoPixelSize(sizeName) {

        const photo = CONFIG.PHOTO[sizeName];

        return {

            width: mmToPx(photo.width),

            height: mmToPx(photo.height)

        };

    }

    function arrange() {

        const canvas = Canvas.getCanvas();

        if (!canvas) return;

        const sizeName = document.getElementById("photoSize").value;

        const spacingMM = parseFloat(document.getElementById("spacing").value);

        const spacing = mmToPx(spacingMM);

        const objects = canvas.getObjects().filter(obj => obj.type === "image");

        if (objects.length === 0) return;

        const photo = getPhotoPixelSize(sizeName);

        let x = 20;
        let y = 20;

        // Default position
        if (
            sizeName === "Passport" ||
            sizeName === "ID" ||
            sizeName === "Wallet" ||
            sizeName === "3R"
        ) {

            x = (canvas.width - photo.width) / 2;
            y = 20;

        }

        if (
            sizeName === "5R" ||
            sizeName === "6R"
        ) {

            x = (canvas.width - photo.height) / 2;
            y = 20;

        }

        if (
            sizeName === "8R"
        ) {

            x = (canvas.width - photo.width) / 2;
            y = (canvas.height - photo.height) / 2;

        }

        objects.forEach(image => {

            image.scaleToWidth(photo.width);

            image.scaleToHeight(photo.height);

            image.set({

                left: x,

                top: y

            });

            // Left-to-right flow
            x += photo.width + spacing;

            if (x + photo.width > canvas.width - 20) {

                x = 20;

                y += photo.height + spacing;

            }

        });

        canvas.renderAll();

    }

    return {

        arrange

    };

})();