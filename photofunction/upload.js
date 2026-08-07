/* ==========================================
   upload.js
========================================== */

const Upload = (()=>{

    let selectedIndex = -1;

    let imageLibrary=[];

    let fileInput;
    let counter;
    let thumbContainer;

    let deleteCallback = null;

    function init() {

        fileInput =
            document.getElementById("photoUpload");

        counter =
            document.getElementById("imageCount");

        thumbContainer =
            document.getElementById(
                "thumbnailContainer"
            );

        const deleteButton =
            document.getElementById(
                "deletePhotoBtn"
            );

        if (!fileInput) {
            console.error(
                "photoUpload input not found."
            );
            return;
        }

        if (!deleteButton) {
            console.error(
                "deletePhotoBtn not found."
            );
        } else {

            console.log(
                "Delete button found:",
                deleteButton
            );

            deleteButton.addEventListener(
                "click",
                deleteSelected
            );

        }

        fileInput.addEventListener(
            "change",
            handleFiles
        );

        document
        .getElementById("deleteConfirmBtn")
        .addEventListener("click",()=>{

            hideDeleteModal();

            if(deleteCallback){

                deleteCallback();

                deleteCallback=null;

            }

        });

        document
        .getElementById("deleteCancelBtn")
        .addEventListener("click",()=>{

            deleteCallback=null;

            hideDeleteModal();

        });

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

                    originalSrc: e.target.result,
                    transparentSrc: null,

                    width: 0,
                    height: 0,
                    cropped: false,
                    backgroundRemoved: false
                });
                console.log(imageLibrary.length);

                createThumbnail(
                    imageLibrary[imageLibrary.length - 1],
                    imageLibrary.length - 1
                );

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

    function updateCounter() {

        if (imageLibrary.length === 0) {

            counter.textContent =
                "No photos selected.";

        } else {

            counter.textContent =
                `${imageLibrary.length} image(s) selected`;

        }

    }

    function createThumbnail(
        photo,
        index
    ) {

        const img =
            document.createElement("img");

        img.src = photo.src;
        img.className = "thumbnail";

        img.addEventListener(
            "click",
            () => {

                selectedIndex = index;

                document
                    .querySelectorAll(
                        ".thumbnail"
                    )
                    .forEach(item => {
                        item.classList.remove(
                            "selected"
                        );
                    });

                img.classList.add(
                    "selected"
                );

                console.log(
                    "Selected image:",
                    selectedIndex
                );

            }
        );

        thumbContainer.appendChild(img);
    }

    function getImages(){

        return imageLibrary;

    }

    function getSelectedImage() {
        if (selectedIndex < 0) {
            return null;
        }
        
        return imageLibrary[selectedIndex];
        
    }   

    function updateSelectedImage(newSrc) {

        if (selectedIndex < 0) {
            return false;
        }

        imageLibrary[selectedIndex].src = newSrc;

        const thumbnails =
            document.querySelectorAll(".thumbnail");

        if (thumbnails[selectedIndex]) {
            thumbnails[selectedIndex].src = newSrc;
        }

        return true;
    }

    function updateSelectedPhoto(changes) {

        if (
            selectedIndex < 0 ||
            !imageLibrary[selectedIndex]
        ) {
            return false;
        }

        Object.assign(
            imageLibrary[selectedIndex],
            changes
        );

        const thumbnails =
            document.querySelectorAll(".thumbnail");

        if (
            changes.src &&
            thumbnails[selectedIndex]
        ) {
            thumbnails[selectedIndex].src =
                changes.src;
        }

        return true;
    }

    function deleteSelected() {

        if (
            selectedIndex < 0 ||
            !imageLibrary[selectedIndex]
        ) {

            const modal =
                document.getElementById(
                    "selectPhotoModal"
                );

            if (modal) {
                modal.style.display = "flex";
            }

            return;

        }

        // IMPORTANT:
        // Do NOT splice/delete here.

        showDeleteModal(() => {

            // Delete only AFTER user confirms
            imageLibrary.splice(
                selectedIndex,
                1
            );

            selectedIndex = -1;

            rebuildThumbnails();
            updateCounter();

            if (imageLibrary.length === 0) {

                Canvas.clearPhotos();
                Canvas.finish();

                fileInput.value = "";

            } else {

                Preview.refresh();

            }

        });

    }

    function rebuildThumbnails() {

        thumbContainer.innerHTML = "";

        imageLibrary.forEach(
            (photo, index) => {
                createThumbnail(
                    photo,
                    index
                );
            }
        );
    }

    function showDeleteModal(callback){

        deleteCallback = callback;

        const modal =
            document.getElementById("deleteModal");

        modal.style.display = "flex";

    }

    function hideDeleteModal(){

        document
            .getElementById("deleteModal")
            .style.display="none";

    }

    function clear(){

        imageLibrary = [];

        thumbContainer.innerHTML="";

        counter.innerHTML="No photos selected.";

    }

    return{

        init,

        getImages,

        getSelectedImage,

        updateSelectedImage,

        updateSelectedPhoto,

        deleteSelected,

        rebuildThumbnails,

        clear

    }

})();