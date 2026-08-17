/*==========================================
Main
app.js
==========================================*/

document.addEventListener("DOMContentLoaded", () => {

    Canvas.init();
    Upload.init();
    CropperTool.init();
    Background.init();
    PackageSettings.init();
    Layout.init();
    Preview.init();
    PDF.init();

    console.log("Upload.init()");
    updatePaperMode();
    updateCustomSizeVisibility();

    document
    .getElementById("paperType")
    .addEventListener("change",updatePaperMode);

    const photoSizeSelect =
        document.getElementById(
            "photoSize"
        );

    photoSizeSelect
        ?.addEventListener(
            "change",
            async () => {

                /*
                * Keep your existing
                * custom-size behavior
                */
                updateCustomSizeVisibility();


                /*
                * Get selected thumbnail
                */
                const photo =
                    Upload.getSelectedImage();

                if (!photo) {

                    const modal =
                        document.getElementById(
                            "selectPhotoModal"
                        );

                    if (modal) {
                        modal.style.display =
                            "flex";
                    }

                    return;
                }


                /*
                * Save size ONLY to
                * selected photo
                */
                Upload.updateSelectedPhoto({

                    photoSize:
                        photoSizeSelect.value

                });


                /*
                * Refresh preview
                */
                await Layout.arrange(
                    Layout.getCurrentPage()
                );

            }
        );

        // ==========================
        // Custom Size Per Photo
        // PUT THE NEW CODE HERE
        // ==========================

        const customWidth =
            document.getElementById(
                "customWidth"
            );

        const customHeight =
            document.getElementById(
                "customHeight"
            );


        customWidth
            ?.addEventListener(
                "input",
                async () => {

                    const photo =
                        Upload.getSelectedImage();

                    if (!photo) {
                        return;
                    }

                    Upload.updateSelectedPhoto({

                        customWidth:
                            Number(
                                customWidth.value
                            )

                    });

                    await Layout.arrange(
                        Layout.getCurrentPage()
                    );

                }
            );


        customHeight
            ?.addEventListener(
                "input",
                async () => {

                    const photo =
                        Upload.getSelectedImage();

                    if (!photo) {
                        return;
                    }

                    Upload.updateSelectedPhoto({

                        customHeight:
                            Number(
                                customHeight.value
                            )

                    });

                    await Layout.arrange(
                        Layout.getCurrentPage()
                    );

                }
            );


        // ==========================
        // Photo Orientation
        // ==========================

        const orientationSelect =
            document.getElementById(
                "photoOrientation"
            );

        orientationSelect
            ?.addEventListener(
                "change",
                async () => {

                    const photo =
                        Upload.getSelectedImage();

                    if (!photo) {

                        const modal =
                            document.getElementById(
                                "selectPhotoModal"
                            );

                        if (modal) {
                            modal.style.display =
                                "flex";
                        }

                        orientationSelect.value =
                            "auto";

                        return;
                    }

                    const orientation =
                        orientationSelect.value;

                    let rotation = 0;

                    if (
                        orientation ===
                        "landscape"
                    ) {
                        rotation = 90;
                    }

                    Upload.updateSelectedPhoto({
                        orientation,
                        rotation
                    });

                    await Layout.arrange(
                        Layout.getCurrentPage()
                    );

                }
            );

});

function updatePaperMode() {

    const paperType =
        document.getElementById("paperType").value;

    const paperSizeGroup =
        document.getElementById("paperSizeGroup");

    const photoSizeGroup =
        document.getElementById("photoSizeGroup");

    const orientationGroup =
        document.getElementById("orientationGroup");

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
        showCard(orientationGroup);
        showCard(plainOptions);

    } else {

        paperSize.value = "A4";

        hideCard(paperSizeGroup);
        hideCard(photoSizeGroup);
        hideCard(orientationGroup);
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