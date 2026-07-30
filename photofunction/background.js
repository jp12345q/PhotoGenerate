/*==========================================
background.js
==========================================*/

const Background = (() => {

    let processing = false;

    function init() {

        document
        .getElementById("removeBgBtn")
        .addEventListener("click", remove);

    }

    async function remove() {

        if (processing) return;

        const canvas = Canvas.getCanvas();

        const image = canvas.getActiveObject();
        console.log("Active Object:", image);

        if (!image || image.type !== "image") {

            alert("Select a photo first.");

            return;

        }

        processing = true;

        document.getElementById("removeBgBtn").innerText =
            "Removing...";

        try {

            const blob = await fetch(image.getSrc())
                .then(r => r.blob());

                console.log("Calling removeBackground...");

            const result =
                await window.removeBackground(blob);
                
                console.log("Background removed.");

            const url =
                URL.createObjectURL(result);

            fabric.Image.fromURL(url, function(newImg) {

                newImg.set({

                    left:image.left,

                    top:image.top,

                    scaleX:image.scaleX,

                    scaleY:image.scaleY,

                    angle:image.angle

                });

                canvas.remove(image);

                canvas.add(newImg);

                canvas.setActiveObject(newImg);

                canvas.renderAll();

            });

        }

        catch(err){

            console.error(err);

            alert("Background removal failed.");

        }

        document.getElementById("removeBgBtn").innerText =
            "🪄 Remove Background";

        processing = false;

    }

    return{

        init

    };

})();