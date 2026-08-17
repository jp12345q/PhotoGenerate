/* ==========================================
   preview.js
========================================== */

const Preview = (() => {


    function init() {

        document
            .getElementById("previewBtn")
            .addEventListener("click", refresh);

        document
            .getElementById("paperSize")
            .addEventListener("change", refresh);

        document
            .getElementById("rows")
            .addEventListener("change", refresh);

        document
            .getElementById("columns")
            .addEventListener("change", refresh);

        document
            .getElementById("package")
            .addEventListener("change", refresh);

        document
            .getElementById("paperType")
            .addEventListener("change", refresh);

        document
        .getElementById("noPhotoOkBtn")
        ?.addEventListener(
            "click",
            hideNoPhotoModal
        );

    }

    async function refresh() {

        const images =
            Upload.getImages();

        if (!images.length) {

            showNoPhotoModal();

            return;

        }

        console.log("Preview clicked");

        const paperType =
            document.getElementById("paperType").value;

            console.log("Paper:", paperType);

        const packageKey =
        document.getElementById("package").value;

        if (
            paperType === "glossy" &&
            !packageKey
        ) {
            return;
        }

        if (paperType === "glossy") {

            await Packages.generate();

        } else {

            await Layout.arrange(
                Layout.getCurrentPage()
            );

        }

        const canvas = Canvas.getCanvas();

        const objects = canvas.getObjects()
        .filter(obj => obj.type === "image");

        console.log("Images on canvas:", objects.length);

    }

    function showNoPhotoModal() {

        const modal =
            document.getElementById(
                "noPhotoModal"
            );

        if (modal) {
            modal.style.display = "flex";
        }

    }

    function hideNoPhotoModal() {

        const modal =
            document.getElementById(
                "noPhotoModal"
            );

        if (modal) {
            modal.style.display = "none";
        }

    }

    return {

        init,
        refresh

    };

})();