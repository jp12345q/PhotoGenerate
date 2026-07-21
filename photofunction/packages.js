/* ==========================================
   packages.js
========================================== */

const Packages = (() => {

    function mmToPx(mm) {
        return mm * 3.7795275591;
    }

    function duplicate(source, copies, widthMM, heightMM, startX, startY) {

        const canvas = Canvas.getCanvas();

        let x = startX;
        let y = startY;

        const spacing = mmToPx(
            Number(document.getElementById("spacing").value)
        );

        const w = mmToPx(widthMM);
        const h = mmToPx(heightMM);

        for (let i = 0; i < copies; i++) {

            fabric.Image.fromURL(source.src,function(img){

                img.scaleToWidth(w);

                img.scaleToHeight(h);

                img.set({

                    left:x,

                    top:y

                });

                canvas.add(img);

                //canvas.renderAll();

            });

            x += w + spacing;

            if(x + w > canvas.width - 20){

                x = 20;

                y += h + spacing;

            }

        }

    }

    function clearImages(){

        const canvas = Canvas.getCanvas();

        canvas.getObjects().forEach(obj=>{

            if(obj.type==="image"){

                canvas.remove(obj);

            }

        });

    }

    function generate(){

        const canvas = Canvas.getCanvas();

        const images = Upload.getImages().filter(img => img.src);

        if(images.length===0){

            alert("Upload photo first.");

            return;

        }

        const pkg =
            document.getElementById("package").value;

        Canvas.clearPhotos();

        if(pkg==="1x1 Package (10 pcs)"){

            packageOneByOne(images);

        }

        else if(pkg==="2x2 Package (6 pcs)"){

            packageTwoByTwo(images);

        }

        else if(pkg==="Mixed Package"){

            mixedPackage(images);

        }

    }

    function packageOneByOne(images){

        if(images.length===1){

            duplicate(images[0],10,25.4,25.4,20,20);

        }

        else{

            duplicate(images[0],5,25.4,25.4,20,20);

            duplicate(images[1],5,25.4,25.4,20,180);

        }

    }

    function packageTwoByTwo(images){

        if(images.length===1){

            duplicate(images[0],6,50.8,50.8,20,20);

        }

        else{

            duplicate(images[0],3,50.8,50.8,20,20);

            duplicate(images[1],3,50.8,50.8,20,250);

        }

    }

    function mixedPackage(images){

        if(images.length===1){

            duplicate(images[0],4,25.4,25.4,20,20);

            duplicate(images[0],4,50.8,50.8,20,180);

        }

        else{

            duplicate(images[0],2,25.4,25.4,20,20);

            duplicate(images[0],2,50.8,50.8,20,150);

            duplicate(images[1],2,25.4,25.4,350,20);

            duplicate(images[1],2,50.8,50.8,350,150);

        }

    }

    return{

        generate

    };

})();