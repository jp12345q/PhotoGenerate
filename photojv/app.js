/*==========================================
Main
app.js
==========================================*/

document.addEventListener("DOMContentLoaded", () => {

    Canvas.init();
    Upload.init();
    CropperTool.init();
    Background.init();
    Layout.init();
    Preview.init();
    PDF.init();

    console.log("Upload.init()");
    updatePaperMode();
    updateCustomSizeVisibility();

    document
    .getElementById("paperType")
    .addEventListener("change",updatePaperMode);

    document
    .getElementById("photoSize")
    .addEventListener("change",updateCustomSizeVisibility);

});

function updatePaperMode() {

    const paperType =
        document.getElementById("paperType").value;

    const paperSizeGroup =
        document.getElementById("paperSizeGroup");

    const photoSizeGroup =
        document.getElementById("photoSizeGroup");

    const plainOptions =
        document.getElementById("plainOptions");

    const packageGroup =
        document.getElementById("packageGroup");

    const paperSize =
        document.getElementById("paperSize");

    if (paperType === "plain") {

        hideCard(packageGroup);

        showCard(paperSizeGroup);
        showCard(photoSizeGroup);
        showCard(plainOptions);

    } else {

        paperSize.value = "A4";

        hideCard(paperSizeGroup);
        hideCard(photoSizeGroup);
        hideCard(plainOptions);

        showCard(packageGroup);

    }

}

function showCard(element) {

    if (!element) {
        return;
    }

    element.classList.remove("hide");

    requestAnimationFrame(() => {

        element.classList.remove("hiding");

    });

}

function hideCard(element) {

    if (!element) {
        return;
    }

    element.classList.add("hiding");

    element.addEventListener(
        "transitionend",
        function handler(event) {

            if (event.propertyName !== "max-height") {
                return;
            }

            element.classList.add("hide");

            element.removeEventListener(
                "transitionend",
                handler
            );

        }
    );

}

function updateCustomSizeVisibility() {

    const photoSize =
        document.getElementById("photoSize").value;

    const customGroup =
        document.getElementById("customSizeGroup");

    customGroup.style.display =
        photoSize === "custom"
            ? "block"
            : "none";

}