/* ==========================================
   guides.js
========================================== */

const Guides = (() => {

    let guides = [];

    function draw() {

        clear();

        const canvas = Canvas.getCanvas();

        const margin = CONFIG.MARGIN.preview;

        const safe = new fabric.Rect({

            left: margin,
            top: margin,

            width: canvas.width - margin * 2,
            height: canvas.height - margin * 2,

            fill: "",

            stroke: CONFIG.GUIDE.safe,

            strokeDashArray: [8, 5],

            selectable: false,
            evented: false

        });

        safe.excludeFromExport = true;

        canvas.add(safe);

        safe.sendToBack();

        guides.push(safe);

    }

    function clear() {

        const canvas = Canvas.getCanvas();

        guides.forEach(g => canvas.remove(g));

        guides = [];

    }

    return {

        draw,
        clear

    };

})();