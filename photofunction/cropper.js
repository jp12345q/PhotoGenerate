/*==========================================
cropper.js
==========================================*/

const CropperTool = (() => {

    const CropAspect = {

        "1x1": 1,

        "2x2": 1,

        "Passport": 35 / 45,

        "ID": 54 / 86,

        "Wallet": 63 / 89,

        "3R": 89 / 127,

        "4R": 102 / 152,

        "5R": 127 / 178,

        "6R": 152 / 203,

        "8R": 203 / 254

    };

    let cropper = null;

    let selectedObject = null;

    function init(){

        let flipX = 1;

        let flipY = 1;

        document
        .getElementById("editBtn")
        .addEventListener("click",open);

        document
        .getElementById("cropApply")
        .addEventListener("click",apply);

        document
        .getElementById("cropCancel")
        .addEventListener("click",close);

        document
        .getElementById("zoomInBtn")
        .onclick=()=>cropper.zoom(.1);

        document
        .getElementById("zoomOutBtn")
        .onclick=()=>cropper.zoom(-.1);

        document
        .getElementById("rotateLeftBtn")
        .onclick=()=>cropper.rotate(-90);

        document
        .getElementById("rotateRightBtn")
        .onclick=()=>cropper.rotate(90);

        document
        .getElementById("flipXBtn")
        .onclick=()=>{

            flipX*=-1;

            cropper.scaleX(flipX);

        };

        document
        .getElementById("flipYBtn")
        .onclick=()=>{

            flipY*=-1;

            cropper.scaleY(flipY);

        };

        document
        .getElementById("resetCropBtn")
        .onclick=()=>{

            cropper.reset();

            flipX=1;

            flipY=1;

        };

    }

    function open(){

        const canvas = Canvas.getCanvas();
        console.log("Cropper.open()");

        selectedObject = canvas.getActiveObject();

        if(!selectedObject){

            alert("Select a photo first.");

            return;

        }

        document
        .getElementById("cropModal")
        .style.display="flex";

        const size = document.getElementById("photoSize").value;
        
        const img = document.getElementById("cropImage");

        console.log("Selected Object:", selectedObject);

        img.src = selectedObject.getSrc();

        console.log("Image Source:", img.src);

        cropper = new Cropper(img, {

            aspectRatio: CropAspect[size] || NaN,

            viewMode:1,

            autoCropArea:1,

            responsive:true,

            movable:true,

            zoomable:true,

            scalable:true,

            rotatable:true,

            background:false,

            guides:true,

            center:true,

            highlight:true


        });


    }

    function apply(){

        const cropped =
        cropper
        .getCroppedCanvas({

            imageSmoothingEnabled:true,

            imageSmoothingQuality:"high"

        })

        .toDataURL("image/png");
        
        fabric.Image.fromURL(cropped,function(img){

            img.left = selectedObject.left;

            img.top = selectedObject.top;

            img.scaleX = selectedObject.scaleX;

            img.scaleY = selectedObject.scaleY;

            const canvas =
            Canvas.getCanvas();

            canvas.remove(selectedObject);

            canvas.add(img);

            canvas.setActiveObject(img);

            canvas.renderAll();

        });

        close();

    }

    function close(){

        if(cropper){

            cropper.destroy();

            cropper = null;

        }

        document
        .getElementById("cropModal")
        .style.display="none";

    }

    return{

        init

    };

})();