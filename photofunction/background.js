/* ==========================================
   background.js
========================================== */

const Background = (() => {

    let processing = false;
    let picker = null;

    function init() {

        const removeButton =
            document.getElementById("removeBgBtn");

        const colorSelect =
            document.getElementById("backgroundColor");

        if (!removeButton) {
            console.error("removeBgBtn not found.");
            return;
        }

        removeButton.addEventListener(
            "click",
            remove
        );

        colorSelect?.addEventListener(
            "change",
            () => applyColor(colorSelect.value)
        );

        const pickerElement =
            document.getElementById("colorPicker");

        if (pickerElement && window.iro) {

            picker = new iro.ColorPicker(
                pickerElement,
                {
                    width: 220,
                    color: "#ffffff",
                    borderWidth: 1,
                    borderColor: "#cccccc"
                }
            );

            picker.on(
                "input:end",
                color => applyColor(color.hexString)
            );

        }

    }

    async function remove() {

        if (!hasPhotos()) {
            return;
        }

        if (processing) {
            return;
        }

        const selectedPhoto =
            Upload.getSelectedImage();

        if (!selectedPhoto) {
            const modal =
                document.getElementById(
                    "selectPhotoModal"
                );

            if (modal) {
                modal.style.display = "flex";
            }
            return;
        }

        if (
            typeof window.removeBackground !==
            "function"
        ) {
            alert(
                "Background removal library is not ready."
            );
            return;
        }

        const button =
            document.getElementById("removeBgBtn");

            showProcessing(
                "Removing background..."
            );

            processing = true;
            button.disabled = true;
            button.textContent = "Removing...";

        try {

            const blob =
                await dataUrlToBlob(
                    selectedPhoto.src
                );

            const result =
                await window.removeBackground(
                    blob
                );

                showProcessing(
                    "Preparing edited photo..."
                );

            const transparentSrc =
                await blobToDataURL(result);

            Upload.updateSelectedPhoto({
                src: transparentSrc,
                transparentSrc,
                backgroundRemoved: true
            });

            // Apply the currently selected color

            const selectedColor =
                document
                    .getElementById("backgroundColor")
                    ?.value || "transparent";

            if (selectedColor !== "transparent") {
                await applyColor(selectedColor, false);
            } else {
                await Preview.refresh();
            }

            await Preview.refresh();

            } catch (error) {

                console.error(
                    "Background removal failed:",
                    error
                );

                alert(
                    "Background removal failed."
                );

            } finally {

                processing = false;
                button.disabled = false;
                button.textContent =
                    "Edit Background";
                
                hideProcessing();

            }

    }

    async function applyColor(
        color,
        showAlert = true
    ) {
        if (!hasPhotos()) {
            return;
        }
        const selectedPhoto =
            Upload.getSelectedImage();

        if (!selectedPhoto) {

            if (showAlert) {
                alert("Select a thumbnail first.");
            }

            return;
        }

        /*
        * Every photo now owns its own
        * transparent source.
        */
        const transparentSrc =
            selectedPhoto.transparentSrc;

        if (!transparentSrc) {

            if (showAlert) {
                alert(
                    "Click Edit Background for this photo first."
                );
            }

            return;
        }

        if (color === "transparent") {

            Upload.updateSelectedPhoto({
                src: transparentSrc
            });

            await Preview.refresh();
            return;
        }

        try {

            const coloredSrc =
                await addBackgroundColor(
                    transparentSrc,
                    color
                );

            Upload.updateSelectedPhoto({
                src: coloredSrc
            });

            await Preview.refresh();

        } catch (error) {

            console.error(
                "Unable to apply background color:",
                error
            );

            alert(
                "Unable to apply background color."
            );

        }

    }

    async function dataUrlToBlob(dataUrl) {

        const response =
            await fetch(dataUrl);

        if (!response.ok) {
            throw new Error(
                "Unable to read image."
            );
        }

        return response.blob();

    }

    function blobToDataURL(blob) {

        return new Promise(
            (resolve, reject) => {

                const reader =
                    new FileReader();

                reader.onload =
                    () => resolve(
                        reader.result
                    );

                reader.onerror =
                    () => reject(
                        new Error(
                            "Unable to convert image."
                        )
                    );

                reader.readAsDataURL(blob);

            }
        );

    }

    function addBackgroundColor(
        src,
        color
    ) {

        return new Promise(
            (resolve, reject) => {

                const img = new Image();

                img.onload = () => {

                    const output =
                        document.createElement(
                            "canvas"
                        );

                    output.width =
                        img.naturalWidth;

                    output.height =
                        img.naturalHeight;

                    const ctx =
                        output.getContext("2d");

                    ctx.fillStyle = color;

                    ctx.fillRect(
                        0,
                        0,
                        output.width,
                        output.height
                    );

                    ctx.drawImage(
                        img,
                        0,
                        0
                    );

                    resolve(
                        output.toDataURL(
                            "image/png"
                        )
                    );

                };

                img.onerror = () => {
                    reject(
                        new Error(
                            "Unable to load transparent image."
                        )
                    );
                };

                img.src = src;

            }
        );

    }
    function showProcessing(
        text = "Removing background..."
    ) {

        const modal =
            document.getElementById(
                "processingModal"
            );

        const message =
            document.getElementById(
                "processingText"
            );

        if (message) {
            message.textContent = text;
        }

        if (modal) {
            modal.style.display = "flex";
        }

    }

    function hideProcessing() {

        const modal =
            document.getElementById(
                "processingModal"
            );

        if (modal) {
            modal.style.display = "none";
        }

    }

    function hasPhotos() {

        const images = Upload.getImages();

        if (!images.length) {

            const modal =
                document.getElementById(
                    "noPhotoModal"
                );

            if (modal) {
                modal.style.display = "flex";
            }

            return false;
        }

        return true;
    }


    return {
        init
    };

})();