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
        .getElementById("customWidth")
        ?.addEventListener(
            "input",
            refresh
        );

        document
        .getElementById("customHeight")
        ?.addEventListener(
            "input",
            refresh
        );

    }

    function refresh() {

        console.log("Preview clicked");

        const paperType =
            document.getElementById("paperType").value;

            console.log("Paper:", paperType);

        if (paperType === "glossy") {

            console.log("Running Packages.generate()");
            Packages.generate();

        } else {

            console.log("Running Layout.arrange()");
            Layout.resetPage();
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