/* ==========================================
    Customize Package glossy
    package-settings.js
========================================== */

const PackageSettings = (() => {

    const STORAGE_KEY =
        "photoGenerateCustomPackages";

    let editingPackageId = null;


    function init() {

        document
            .getElementById("settingsBtn")
            ?.addEventListener(
                "click",
                open
            );

        document
            .getElementById("closePackageSettingsBtn")
            ?.addEventListener(
                "click",
                close
            );

        document
            .getElementById("addPackageRowBtn")
            ?.addEventListener(
                "click",
                () => addRow()
            );

        document
            .getElementById("savePackageBtn")
            ?.addEventListener(
                "click",
                savePackage
            );

        document
            .getElementById("deletePackageBtn")
            ?.addEventListener(
                "click",
                deletePackage
            );

        refreshPackageDropdown();

    }


    function open() {

        const modal =
            document.getElementById(
                "packageSettingsModal"
            );

        const packageSelect =
            document.getElementById(
                "package"
            );

        const packageId =
            packageSelect?.value || "";

        const savedPackage =
            getPackage(packageId);

        /*
        * Clear previous editor first
        */
        editingPackageId = null;

        document
            .getElementById(
                "customPackageName"
            )
            .value = "";

        document
            .getElementById(
                "packageRows"
            )
            .innerHTML = "";


        /*
        * Existing custom package selected
        */
        if (savedPackage) {

            editingPackageId =
                savedPackage.id;

            document
                .getElementById(
                    "customPackageName"
                )
                .value =
                savedPackage.name;

            savedPackage.items.forEach(
                item => {

                    addRow(
                        item.size,
                        item.copies
                    );

                }
            );

        } else {

            /*
            * Creating a new package
            */
            addRow();

        }

        modal.style.display = "flex";

    }


    function close() {

        document
            .getElementById(
                "packageSettingsModal"
            )
            .style.display = "none";

    }


    function getPackages() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    STORAGE_KEY
                )
            ) || [];

        } catch {

            return [];

        }

    }


    function savePackages(packages) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(packages)
        );

    }


    function addRow(
        size = "2x2",
        copies = 1
    ) {

        const container =
            document.getElementById(
                "packageRows"
            );

        const row =
            document.createElement("div");

        row.className =
            "package-builder-row";

        row.innerHTML = `

            <select class="package-size">

                <option value="1x1">
                    1x1
                </option>

                <option value="2x2">
                    2x2
                </option>

                <option value="Passport">
                    Passport
                </option>

                <option value="ID">
                    ID
                </option>

                <option value="Wallet">
                    Wallet
                </option>

                <option value="3R">
                    3R
                </option>

                <option value="4R">
                    4R
                </option>

            </select>

            <input
                class="package-copies"
                type="number"
                min="1"
                max="50"
                value="${copies}"
            >

            <button
                type="button"
                class="remove-package-row"
            >
                ×
            </button>

        `;

        row
            .querySelector(
                ".package-size"
            )
            .value = size;

        row
            .querySelector(
                ".remove-package-row"
            )
            .addEventListener(
                "click",
                () => row.remove()
            );

        container.appendChild(row);

    }


    function savePackage() {

        const name =
            document
                .getElementById(
                    "customPackageName"
                )
                .value
                .trim();

        if (!name) {

            alert(
                "Enter a package name."
            );

            return;

        }

        const rows =
            document.querySelectorAll(
                ".package-builder-row"
            );

        if (!rows.length) {

            alert(
                "Add at least one photo size."
            );

            return;

        }

        const items = [];

        rows.forEach(row => {

            const size =
                row
                    .querySelector(
                        ".package-size"
                    )
                    .value;

            const copies =
                Number(
                    row
                        .querySelector(
                            ".package-copies"
                        )
                        .value
                );

            if (copies > 0) {

                items.push({
                    size,
                    copies
                });

            }

        });

        if (!items.length) {

            alert(
                "Enter a valid number of copies."
            );

            return;

        }

        const packages =
            getPackages();

        const newPackage = {

            id:
                editingPackageId ||
                `custom_${Date.now()}`,

            name,

            items

        };

        const existingIndex =
            packages.findIndex(
                item =>
                    item.id ===
                    newPackage.id
            );

        if (existingIndex >= 0) {

            packages[existingIndex] =
                newPackage;

        } else {

            packages.push(
                newPackage
            );

        }

        savePackages(packages);

        editingPackageId =
            newPackage.id;

        refreshPackageDropdown();

    }


    function deletePackage() {

        if (!editingPackageId) {

            console.log(
                "No custom package selected for deletion."
            );

            return;
        }

        let packages =
            getPackages();

        packages =
            packages.filter(
                pkg =>
                    pkg.id !==
                    editingPackageId
            );

        savePackages(packages);

        editingPackageId = null;

        /*
        * Clear editor
        */
        document
            .getElementById(
                "customPackageName"
            )
            .value = "";

        document
            .getElementById(
                "packageRows"
            )
            .innerHTML = "";

        /*
        * Refresh dropdown
        */
        refreshPackageDropdown();

        const packageSelect =
            document.getElementById(
                "package"
            );

        if (packageSelect) {
            packageSelect.value = "";
        }

        /*
        * Put one blank row back
        */
        addRow();

        /*
        * Close settings
        */
        close();

        /*
        * Clear old glossy preview if needed
        */
        Canvas.clearPhotos();
        Canvas.finish();

    }


    function refreshPackageDropdown() {

        const select =
            document.getElementById(
                "package"
            );

        if (!select) {
            return;
        }

        /*
         * Remove old custom options only.
         */
        select
            .querySelectorAll(
                'option[data-custom="true"]'
            )
            .forEach(
                option =>
                    option.remove()
            );

        getPackages()
            .forEach(pkg => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    pkg.id;

                option.textContent =
                    pkg.name;

                option.dataset.custom =
                    "true";

                select.appendChild(
                    option
                );

            });

    }


    function getPackage(id) {

        return getPackages()
            .find(
                pkg =>
                    pkg.id === id
            ) || null;

    }


    return {

        init,
        getPackage,
        refreshPackageDropdown

    };

})();