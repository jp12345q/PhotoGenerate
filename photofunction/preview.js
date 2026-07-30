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
            .getElementById("photoSize")
            .addEventListener("change", refresh);

        document
            .getElementById("spacing")
            .addEventListener("change", refresh);

        document
            .getElementById("package")
            .addEventListener("change", refresh);

        document
            .getElementById("paperType")
            .addEventListener("change", refresh);

    }

    function refresh() {

        console.log("Preview clicked");

        const paperType =
            document.getElementById("paperType").value;

            console.log("Paper:", paperType);

        if (paperType === "glossy") {

            console.log("Running Package.generate()");
            Package.generate();

        } else {

            console.log("Running Layout.arrange()");
            Layout.arrange();
            console.log("Layout.arrange()");

        }

        const canvas = Canvas.getCanvas();

        const objects = canvas.getObjects()
        .filter(obj => obj.type === "image");

        console.log("Images on canvas:", objects.length);

    }

    return {

        init,
        refresh

    };

})();