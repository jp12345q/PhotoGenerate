/* ==========================================
   upload.js
========================================== */

const Upload = (()=>{

    let imageLibrary=[];

    const fileInput=document.getElementById("photoUpload");

    const counter=document.getElementById("imageCount");

    const thumbContainer=document.getElementById("thumbnailContainer");

    function init(){

        if(!fileInput) return;

        fileInput.addEventListener("change",handleFiles);

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

                createThumbnail(imageLibrary[imageLibrary.length-1]);
        
                updateCounter();
            };

            reader.readAsDataURL(file);

        });

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
            Canvas.addImage(photo.src);
        };

        thumbContainer.appendChild(img);

    }

    function getImages(){

        return imageLibrary;

    }

    function clear(){

        files=[];

        thumbContainer.innerHTML="";

        counter.innerHTML="No photos selected.";

    }

    return{

        init,

        getImages,

        clear

    }

})();