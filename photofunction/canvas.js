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
        fit = "cover",
        rotation = 0
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

                    /*
                    * When rotated 90° / 270°,
                    * width and height are reversed.
                    */
                    const rotated =
                        Math.abs(rotation % 180) === 90;

                    const sourceWidth =
                        rotated
                            ? img.height
                            : img.width;

                    const sourceHeight =
                        rotated
                            ? img.width
                            : img.height;


                    if (fit === "contain") {

                        scale = Math.min(
                            width / sourceWidth,
                            height / sourceHeight
                        );

                    } else {

                        /*
                        * Cover is safest for rotation.
                        */
                        scale = Math.max(
                            width / sourceWidth,
                            height / sourceHeight
                        );

                    }

                    img.scale(scale);

                    img.set({

                        originX: "center",
                        originY: "center",

                        left:
                            left + width / 2,

                        top:
                            top + height / 2,

                        angle: rotation,

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

    function addBorder({

        left,
        top,

        width,
        height,

        color = "#444",

        thickness = 1

    }) {

        const border = new fabric.Rect({

            left,
            top,

            width,
            height,

            fill: "transparent",

            stroke: color,

            strokeWidth: thickness,

            selectable: false,

            evented: false,

            photo: true

        });

        canvas.add(border);

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

        const wrapper =
            document.getElementById("previewCanvas");

        if (!wrapper || !canvas || !currentPaper) {
            return;
        }

        const paper =
            CONFIG.PAPER[currentPaper].preview;

        /*
        * Fit paper to available WIDTH.
        *
        * Do not fit by height because Legal paper
        * should simply become taller and the user
        * can scroll vertically.
        */
        const availableWidth =
            Math.max(
                wrapper.clientWidth - 20,
                1
            );

        const scale =
            Math.min(
                availableWidth / paper.width,
                1
            );

        const displayWidth =
            paper.width * scale;

        const displayHeight =
            paper.height * scale;

        /*
        * Fabric internal coordinates stay at
        * the real preview paper size.
        */
        canvas.setZoom(scale);

        /*
        * Resize the visible lower/upper canvases.
        */
        canvas.setDimensions(
            {
                width: displayWidth,
                height: displayHeight
            },
            {
                cssOnly: true
            }
        );

        /*
        * VERY IMPORTANT:
        * Resize Fabric's canvas-container too.
        */
        if (canvas.wrapperEl) {

            canvas.wrapperEl.style.width =
                `${displayWidth}px`;

            canvas.wrapperEl.style.height =
                `${displayHeight}px`;

            canvas.wrapperEl.style.margin =
                "0 auto";

        }

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

    return {

        init,

        loadPaper,

        begin,

        finish,

        refresh,

        addPhoto,

        addBorder,

        clearCanvas,

        clearPhotos,

        removeSelected,

        duplicateSelected,

        rotateSelected,

        getCanvas,

        exportImage

    };

})();