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

        currentPaper = size;

        const paper = CONFIG.PAPER[size].preview;

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

    function addImage(src) {

        fabric.Image.fromURL(src,function(img){

            img.set({

                left:60,

                top:60,

                cornerColor:"#3498db",

                borderColor:"#3498db",

                cornerSize:10,

                transparentCorners:false

            });

            img.scaleToWidth(180);

            canvas.add(img);

            canvas.setActiveObject(img);

            canvas.renderAll();

        },{

            crossOrigin:"anonymous"

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

        addImage,

        removeSelected,

        duplicateSelected,

        rotateSelected,

        clearCanvas,

        clearPhotos,

        getCanvas

    };

})();