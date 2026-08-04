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

        Guides.draw();

    }

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

                    objectCaching: false

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

                canvas.renderAll();

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

    function clearPhotos(){

        canvas.getObjects().forEach(obj=>{

            if(obj.type==="image"){
                canvas.remove(obj);
            }

        });

        canvas.renderAll();

    }

    function fitCanvas(){

        const wrapper=document.getElementById("previewCanvas");

        if(!wrapper) return;

        const maxWidth=wrapper.clientWidth-40;

        const scale=maxWidth/canvas.width;

        canvas.setZoom(scale);

        canvas.setDimensions({

            width:canvas.width*scale,

            height:canvas.height*scale

        });

    }

    function getCanvas(){

        return canvas;

    }

    return{

        init,

        loadPaper,

        addPhoto,

        removeSelected,

        duplicateSelected,

        rotateSelected,

        clearCanvas,

        clearPhotos,

        getCanvas

    };

})();