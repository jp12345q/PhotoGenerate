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

        const paperType =
            document.getElementById("paperType").value;

        if (paperType === "glossy") {

            Packages.generate();

        } else {

            Layout.arrange();

        }

    }

    return {

        init,
        refresh

    };

})();