/* ==========================================
   pdf.js
   Multi-page PDF Export
========================================== */

const PDF = (() => {

    let exporting = false;

    function init() {

        const pdfButton =
            document.getElementById("pdfBtn");

        if (!pdfButton) {
            console.error("pdfBtn not found.");
            return;
        }

        pdfButton.addEventListener(
            "click",
            exportPDF
        );

        document
        .getElementById("noPhotoPdfOkBtn")
        ?.addEventListener(
            "click",
            () => {

                const modal =
                    document.getElementById(
                        "noPhotoPdfModal"
                    );

                if (modal) {
                    modal.style.display = "none";
                }

            }
        );

    }

    async function exportPDF() {

        if (exporting) {
            return;
        }

        const images = Upload.getImages();

            if (!images.length) {

            const modal =
                document.getElementById(
                    "noPhotoPdfModal"
                );

            if (modal) {
                modal.style.display = "flex";
            }

            return;
        }

        const paperType =
            document.getElementById("paperType").value;

        const button =
            document.getElementById("pdfBtn");

        exporting = true;
        button.disabled = true;
        button.textContent = "Creating PDF...";

        try {

            if (paperType === "glossy") {

                // Glossy packages currently use one page.
                await exportGlossyPDF();

            } else {

                await exportPlainPDF();

            }

        } catch (error) {

            console.error(
                "PDF export failed:",
                error
            );

            alert("Unable to create the PDF.");

        } finally {

            exporting = false;
            button.disabled = false;
            button.textContent = "Export PDF";

        }

    }

    async function exportPlainPDF() {

        const { jsPDF } = window.jspdf;

        const paperKey =
            document.getElementById("paperSize").value;

        const printSize =
            CONFIG.PAPER[paperKey].print;

        const orientation =
            printSize.width > printSize.height
                ? "landscape"
                : "portrait";

        const pdf = new jsPDF({
            orientation,
            unit: "px",
            format: [
                printSize.width,
                printSize.height
            ],
            compress: true
        });

        const originalPage =
            Layout.getCurrentPage();

        /*
         * Render page 1 first so Layout calculates
         * the correct total number of pages.
         */
        await Layout.arrange(0);

        const totalPages =
            Layout.getTotalPages();

        for (
            let page = 0;
            page < totalPages;
            page++
        ) {

            if (page > 0) {

                pdf.addPage(
                    [
                        printSize.width,
                        printSize.height
                    ],
                    orientation
                );

            }

            await Layout.arrange(page);

            const pageImage =
                createPrintImage(
                    paperKey
                );

            pdf.addImage(
                pageImage,
                "PNG",
                0,
                0,
                printSize.width,
                printSize.height,
                undefined,
                "FAST"
            );

        }

        pdf.save(createFilename());

        /*
         * Restore the page the user was viewing
         * before PDF generation.
         */
        await Layout.arrange(
            Math.min(
                originalPage,
                totalPages - 1
            )
        );

    }

    async function exportGlossyPDF() {

        const { jsPDF } = window.jspdf;

        const paperKey =
            document.getElementById("paperSize").value;

        const printSize =
            CONFIG.PAPER[paperKey].print;

        await Packages.generate();

        const orientation =
            printSize.width > printSize.height
                ? "landscape"
                : "portrait";

        const pdf = new jsPDF({
            orientation,
            unit: "px",
            format: [
                printSize.width,
                printSize.height
            ],
            compress: true
        });

        const pageImage =
            createPrintImage(paperKey);

        pdf.addImage(
            pageImage,
            "PNG",
            0,
            0,
            printSize.width,
            printSize.height,
            undefined,
            "FAST"
        );

        pdf.save(createFilename());

    }

    function createPrintImage(paperKey) {

        const fabricCanvas =
            Canvas.getCanvas();

        const previewSize =
            CONFIG.PAPER[paperKey].preview;

        const printSize =
            CONFIG.PAPER[paperKey].print;

        /*
        * Save the responsive/mobile zoom.
        */
        const originalZoom =
            fabricCanvas.getZoom();

        const originalViewport =
            fabricCanvas.viewportTransform
                ? [...fabricCanvas.viewportTransform]
                : null;

        /*
        * IMPORTANT:
        * PDF must always render at 100% paper scale,
        * regardless of phone/tablet/desktop preview.
        */
        fabricCanvas.setZoom(1);

        fabricCanvas.setViewportTransform([
            1, 0,
            0, 1,
            0, 0
        ]);

        fabricCanvas.renderAll();

        const multiplier = Math.max(
            printSize.width / previewSize.width,
            printSize.height / previewSize.height
        );

        const image =
            fabricCanvas.toDataURL({

                format: "png",

                quality: 1,

                multiplier,

                enableRetinaScaling: false

            });

        /*
        * Restore responsive preview after export.
        */
        if (originalViewport) {

            fabricCanvas.setViewportTransform(
                originalViewport
            );

        } else {

            fabricCanvas.setZoom(
                originalZoom
            );

        }

        fabricCanvas.requestRenderAll();

        return image;

    }

    function createFilename() {

        const now = new Date();

        const year =
            now.getFullYear();

        const month =
            String(
                now.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                now.getDate()
            ).padStart(2, "0");

        return (
            `PhotoLayout_${year}-${month}-${day}.pdf`
        );

    }

    return {
        init
    };

})();