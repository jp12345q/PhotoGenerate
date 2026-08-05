/* ==========================================
   canvas.js
========================================== */

const Canvas = (() => {

    let canvas = null;

    let currentPaper = "A4";

    function init() {

        canvas = new fabric.Canvas("photoCanvas", {

            preserveObjectStacking: true,
            selection: true

        });

        loadPaper("A4");

        window.addEventListener("resize", fitCanvas);

        fitCanvas();

    }

    function loadPaper(size) {

        console.log("loadPaper:", size);
        console.log(CONFIG.PAPER);

        if (currentPaper === size)
            return;

        currentPaper = size;
    
        const config = CONFIG.PAPER[size];

        if (!config) {

            console.error("Unknown Paper Size:", size);

            return;

        }

        const paper = config.preview;

        canvas.setWidth(paper.width);

        canvas.setHeight(paper.height);

        canvas.setBackgroundColor("white", canvas.renderAll.bind(canvas)); 

    }

/*
    function drawMargin() {

        const margin = new fabric.Rect({

            left:20,
            top:20,

            width:canvas.width-40,
            height:canvas.height-40,

            fill:"",

            stroke:"#dddddd",

            selectable:false,
            evented:false

        });

        canvas.add(margin);

        margin.sendToBack();

    }
*/

/* ==========================================
   Draw Photo
========================================== */

    function addPhoto({

        src,
        left,
        top,
        width,
        height,
        fit = "cover"

    }) {

        fabric.Image.fromURL(

            src,

            function (img) {

                //--------------------------------------------------
                // Cover Fit
                //--------------------------------------------------

                let scale;

                if (fit === "cover") {

                    scale = Math.max(
                        width / img.width,
                        height / img.height
                    );

                } else if (fit === "contain") {

                    scale = Math.min(
                        width / img.width,
                        height / img.height
                    );

                } else {

                    scale = width / img.width;

                }

                img.scale(scale);

                const scaledWidth = img.width * scale;
                const scaledHeight = img.height * scale;

                //--------------------------------------------------
                // Center inside frame
                //--------------------------------------------------

                img.set({

                    left:
                        left +
                        (width - scaledWidth) / 2,

                    top:
                        top +
                        (height - scaledHeight) / 2,

                    selectable: false,

                    evented: false,

                    hasBorders: false,

                    hasControls: false,

                    objectCaching: false,

                    photo: true

                });

                //--------------------------------------------------
                // Crop Frame
                //--------------------------------------------------

                img.clipPath = new fabric.Rect({

                    left,
                    top,

                    width,
                    height,

                    absolutePositioned: true

                });

                canvas.add(img);

                console.log(
                    "Scaled:",
                    img.getScaledWidth(),
                    img.getScaledHeight()
                );

                canvas.requestRenderAll();

                canvas.getObjects().forEach((obj, i) => {

                    console.log(

                        i,

                        obj.type,

                        obj.photo,

                        obj.left,

                        obj.top,

                        obj.getScaledWidth(),

                        obj.getScaledHeight()

                    );

                });

            },

            {

                crossOrigin: "anonymous"

            }

        );

    }

    function removeSelected(){

        const obj=canvas.getActiveObject();

        if(obj){

            canvas.remove(obj);

        }

    }

    function duplicateSelected(){

        const obj=canvas.getActiveObject();

        if(!obj) return;

        obj.clone(function(clone){

            clone.set({

                left:obj.left+25,

                top:obj.top+25

            });

            canvas.add(clone);

            canvas.renderAll();

        });

    }

    function rotateSelected(){

        const obj=canvas.getActiveObject();

        if(!obj) return;

        obj.rotate(obj.angle+90);

        canvas.renderAll();

    }

    function clearCanvas(){

        canvas.clear();

        canvas.setBackgroundColor(
            "white",
            canvas.renderAll.bind(canvas)
        );

        Guides.draw();

    }

    function clearPhotos() {

        canvas.getObjects().forEach(obj => {

            if (obj.photo === true) {

                canvas.remove(obj);

            }

        });

    }

    function fitCanvas() {

        const wrapper = document.getElementById("previewCanvas");

        if (!wrapper || !canvas)
            return;

        const paper = CONFIG.PAPER[currentPaper].preview;

        const maxWidth = wrapper.clientWidth - 40;

        const scale = Math.min(maxWidth / paper.width, 1);

        canvas.setDimensions({

            width: paper.width * scale,
            height: paper.height * scale

        });

        canvas.setZoom(scale);

        canvas.requestRenderAll();

    }

    function getCanvas(){

        return canvas;

    }

    function begin(){

        clearPhotos();

    }
    
    function finish(){

        canvas.requestRenderAll();

    }

    function refresh(){
        canvas.requestRenderAll();
    }

    function exportImage(){
        return canvas.toDataURL({
            multiplier:2
        });
    }

    return{

        init,

        loadPaper,

        begin,

        finish,

        refresh,

        addPhoto,

        clearCanvas,

        clearPhotos,

        removeSelected,

        duplicateSelected,

        rotateSelected,

        getCanvas,

        exportImage

    };

})();