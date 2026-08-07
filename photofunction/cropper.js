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

    let selectedPhoto = null;

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
        .onclick = () => {
            if (!cropper)
                return;
                flipX *= -1;
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
        document
        .getElementById("selectPhotoOkBtn")
        ?.addEventListener(
            "click",
            hideSelectPhotoModal
        );

    }

    function open() {

        console.log("Cropper.open()");

        selectedPhoto =
            Upload.getSelectedImage();

        if (!selectedPhoto) {

            showSelectPhotoModal();

            return;

        }

        const modal =
            document.getElementById("cropModal");

        const img =
            document.getElementById("cropImage");

        const size =
            document.getElementById("photoSize").value;

        modal.style.display = "flex";

        img.src = selectedPhoto.src;

        // Destroy old Cropper instance if necessary
        if (cropper) {

            cropper.destroy();

            cropper = null;

        }

        let aspectRatio =
            CropAspect[size] || NaN;

        // Custom plain-paper size
        if (size === "custom") {

            const width =
                Number(
                    document.getElementById(
                        "customWidth"
                    ).value
                );

            const height =
                Number(
                    document.getElementById(
                        "customHeight"
                    ).value
                );

            if (width > 0 && height > 0) {

                aspectRatio =
                    width / height;

            }

        }

        cropper = new Cropper(img, {

            aspectRatio,

            viewMode: 1,

            autoCropArea: 1,

            responsive: true,

            movable: true,

            zoomable: true,

            scalable: true,

            rotatable: true,

            background: false,

            guides: true,

            center: true,

            highlight: true

        });

    }

    async function apply() {

        if (!cropper || !selectedPhoto) {

            alert("No photo selected.");

            return;

        }

        const croppedCanvas =
            cropper.getCroppedCanvas({

                imageSmoothingEnabled: true,

                imageSmoothingQuality: "high"

            });

        if (!croppedCanvas) {

            alert("Unable to crop photo.");

            return;

        }

        const cropped =
            croppedCanvas.toDataURL(
                "image/png"
            );

        /*
        * Save back into imageLibrary.
        * Preview/PDF will automatically use it.
        */
        Upload.updateSelectedPhoto({

            src: cropped,

            originalSrc: cropped,

            // Previous transparent background no longer
            // matches this new crop.
            transparentSrc: null,

            cropped: true,

            backgroundRemoved: false

        });

        close();

        await Preview.refresh();

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

    /*Modal Crop*/

    function showSelectPhotoModal() {

        const modal =
            document.getElementById(
                "selectPhotoModal"
            );

        if (modal) {
            modal.style.display = "flex";
        }

    }

    function hideSelectPhotoModal() {

        const modal =
            document.getElementById(
                "selectPhotoModal"
            );

        if (modal) {
            modal.style.display = "none";
        }

    }

    return{

        init

    };

})();