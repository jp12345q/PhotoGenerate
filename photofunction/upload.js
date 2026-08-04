/* ==========================================
   upload.js
========================================== */

const Upload = (()=>{

    let imageLibrary=[];

    let fileInput;
    let counter;
    let thumbContainer;

    function init(){
        
        fileInput = document.getElementById("photoUpload");
        counter = document.getElementById("imageCount");
        thumbContainer = document.getElementById("thumbnailContainer");

        if (!fileInput) {
            console.error("photoUpload input not found.");
            return;
        }

        fileInput.addEventListener("change", handleFiles);

    }

    function handleFiles(e){

        const files = Array.from(e.target.files);

        files.forEach (file => {

            const reader = new FileReader();

            reader.onload = function(e){
                imageLibrary.push({
                    id: Date.now() + Math.random(),
                    name: file.name,
                    src: e.target.result,
                    width: 0,
                    height: 0,
                    cropped: false,
                    backgroundRemoved: false
                });

                console.log(imageLibrary.length);

                createThumbnail(imageLibrary[imageLibrary.length-1]);
        
                updateCounter();
            };

            reader.readAsDataURL(file);

        });

        console.log("handleFiles()");

    }

    function validate(file){

        if(!CONFIG.ACCEPTED.includes(file.type)){

            alert(file.name+" is not supported.");

            return false;

        }

        return true;

    }

    function updateCounter(){

        counter.innerHTML = imageLibrary.length + " image(s) selected"

    }

    function createThumbnail(photo){

        const img = document.createElement("img");

        img.src = photo.src;
        img.className = "thumbnail";

        img.onclick = function () {
            Canvas.addPhoto(photo.src);
        };

        thumbContainer.appendChild(img);

    }

    function getImages(){

        return imageLibrary;

    }

    function clear(){

        imageLibrary = [];

        thumbContainer.innerHTML="";

        counter.innerHTML="No photos selected.";

    }

    return{

        init,

        getImages,

        clear

    }

})();