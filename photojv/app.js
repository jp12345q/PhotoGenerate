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

    document
    .getElementById("paperType")
    .addEventListener(
        "change",

        updatePaperMode
    );

});

function updatePaperMode() {

    const paperType = document.getElementById("paperType").value;
    const plain = paperType === "plain";

    const photoSizeGroup = document.getElementById("photoSizeGroup");
    const plainOptions = document.getElementById("plainOptions");
    const packageGroup = document.getElementById("packageGroup");

    if (photoSizeGroup)
        photoSizeGroup.style.display = plain ? "block" : "none";

    if (plainOptions)
        plainOptions.style.display = plain ? "block" : "none";

    if (packageGroup)
        packageGroup.style.display = plain ? "none" : "block";
}