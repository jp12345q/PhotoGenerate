/* ==========================================
   pdf.js
========================================== */

const PDF = (()=>{

    function init(){

        document
        .getElementById("pdfBtn")
        .addEventListener("click",exportPDF);

    }

    async function exportPDF(){

        const canvas =
            Canvas.getCanvas();

        const paper =
            document.getElementById("paperSize").value
            .toUpperCase();

        const printSize =
            CONFIG.PAPER[paper].print;

        const exportCanvas =
            document.createElement("canvas");

        exportCanvas.width =
            printSize.width;

        exportCanvas.height =
            printSize.height;

        const ctx =
            exportCanvas.getContext("2d");

        ctx.fillStyle="white";

        ctx.fillRect(
            0,
            0,
            exportCanvas.width,
            exportCanvas.height
        );

        const scaleX =
            printSize.width/canvas.width;

        const scaleY =
            printSize.height/canvas.height;

        ctx.scale(scaleX,scaleY);

        const image =
            canvas.toDataURL({

                format:"png",

                multiplier:1

            });

        const img =
            new Image();

        img.onload=function(){

            ctx.drawImage(img,0,0);

            createPDF(exportCanvas,paper);

        }

        img.src=image;

    }

    function createPDF(canvas,paper){

        const {jsPDF}=window.jspdf;

        const pdf=
            new jsPDF({

                orientation:

                    canvas.width>

                    canvas.height

                    ?"landscape"

                    :"portrait",

                unit:"px",

                format:[
                    canvas.width,
                    canvas.height
                ]

            });

        const image=
            canvas.toDataURL(
                "image/png",
                1.0
            );

        pdf.addImage(

            image,

            "PNG",

            0,

            0,

            canvas.width,

            canvas.height,

            undefined,

            "FAST"

        );

        const now =
            new Date();

        const filename =
            "PhotoLayout_" +

            now.getFullYear() +

            "-" +

            (now.getMonth()+1) +

            "-" +

            now.getDate() +

            ".pdf";

        pdf.save(filename);

    }

    return{

        init

    };

})();