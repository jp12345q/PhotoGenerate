/* ==========================================
   Photo Print Studio
   config.js
========================================== */

const CONFIG = {

    // Canvas Size (Pixels @96dpi)
    PAPER:{

        A4:{
            preview:{
                width:794,
                height:1123
            },
            print:{
                width:2480,
                height:3508
            }
        },

        LETTER:{
            preview:{
                width:816,
                height:1056
            },
            print:{
                width:2550,
                height:3300
            }
        },

        LEGAL:{
            preview:{
                width:816,
                height:1344
            },
            print:{
                width:2550,
                height:4200
            }
        }

    },

    // Millimeter spacing options
    SPACING:[

        1,
        2,
        3,
        5

    ],

    // Each side have space 
    MARGIN:{

        preview: 20,
        print:35
    },

    // Photo Sizes (millimeters)
    PHOTO:{

        "1x1":{
            width:25.4,
            height:25.4
        },

        "2x2":{
            width:50.8,
            height:50.8
        },

        "Passport":{
            width:35,
            height:45
        },

        "ID":{
            width:54,
            height:86
        },

        "Wallet":{
            width:63,
            height:89
        },

        "3R":{
            width:89,
            height:127
        },

        "4R":{
            width:102,
            height:152
        },

        "5R":{
            width:127,
            height:178
        },

        "6R":{
            width:152,
            height:203
        },

        "8R":{
            width:203,
            height:254
        }

    },

    // Glossy Packages
    PACKAGES:{

        oneByOne10:{
            copies:10
        },

        twoByTwo6:{
            copies:6
        },

        mixed:{
            oneByOne:4,
            twoByTwo:4
        }

    },

    GUIDE:{

        safe:"#ffffff",

        bleed:"#ff5252",

        cut:"#00c853"
    },

    MAX_UPLOAD:50,

    ACCEPTED:["image/jpeg","image/png"]

};

/* ==========================================
   Glossy Package Templates
========================================== */

CONFIG.PACKAGES = {

    "2x2": {

        photo: "2x2",

        rows: 2,

        cols: 3,

        copies: 6,

        margin: 15,

        gap: 8

    },

    "1x1": {

        photo: "1x1",

        rows: 2,

        cols: 5,

        copies: 10,

        margin: 10,

        gap: 6

    },

    "mixed": {

        margin: 10,

        gap: 6,

        items: [

            { photo: "2x2" },
            { photo: "2x2" },
            { photo: "2x2" },
            { photo: "2x2" },

            { photo: "1x1" },
            { photo: "1x1" },
            { photo: "1x1" },
            { photo: "1x1" }

        ]

    }

};