/* ==========================================
   canvas.js
========================================== */

const Canvas = (() => {

    let canvas = null;

    let currentPaper = null;

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

        canvas.setBackgroundColor("white", () => {

            fitCanvas();

            canvas.requestRenderAll();

        });
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

        return new Promise((resolve, reject) => {

            fabric.Image.fromURL(

                src,

                function (img) {

                    if (!img || !img.width || !img.height) {
                        reject(new Error("Unable to load photo."));
                        return;
                    }

                    let scale;

                    if (fit === "contain") {

                        scale = Math.min(
                            width / img.width,
                            height / img.height
                        );

                    } else if (fit === "stretch") {

                        img.set({
                            scaleX: width / img.width,
                            scaleY: height / img.height
                        });

                        scale = null;

                    } else {

                        // Default: cover
                        scale = Math.max(
                            width / img.width,
                            height / img.height
                        );

                    }

                    if (scale !== null) {
                        img.scale(scale);
                    }

                    const scaledWidth = img.getScaledWidth();
                    const scaledHeight = img.getScaledHeight();

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

                    img.clipPath = new fabric.Rect({
                        left,
                        top,
                        width,
                        height,
                        absolutePositioned: true
                    });

                    canvas.add(img);

                    resolve(img);

                },

                {
                    crossOrigin: "anonymous"
                }

            );

        });

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

        if (!wrapper || !canvas || !currentPaper) {
            return;
        }

        const paper = CONFIG.PAPER[currentPaper].preview;
        const availableWidth = Math.max(wrapper.clientWidth - 40, 1);
        const scale = Math.min(availableWidth / paper.width, 1);

        canvas.setZoom(scale);

        canvas.setDimensions(
            {
                width: paper.width * scale,
                height: paper.height * scale
            },
            {
                cssOnly: true
            }
        );

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