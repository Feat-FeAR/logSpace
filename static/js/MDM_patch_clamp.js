// JavaScript code for the PatchClamp MetaDataMaker (MDM) shortcode

function toggleWholeCellFields() {
    const configuration = document.getElementById("configuration").value;
    const wholeCellFields = document.getElementsByClassName("wholeCellOnly");

    for (let i = 0; i < wholeCellFields.length; i++) {
        const field = wholeCellFields[i];

        if (configuration === "whole-cell") {
            field.disabled = false;
        } else {
            field.disabled = true;
            field.value = "";
        }
    }
}

function prettifyRecipeName(name) {
    return name.replaceAll("_", " ");
}

function populateRecipeDropdown(selectId) {
    const select = document.getElementById(selectId);
    if (!select || typeof recipeBook === "undefined") return;

    // Clear existing options
    select.innerHTML = "";

    // NULL / placeholder option (not the default)
    const nullOption = document.createElement("option");
    nullOption.value = "";  // important: maps to null later
    nullOption.textContent = "-- none / other --";
    select.appendChild(nullOption);

    const defaultKey = select.dataset.default;

    Object.keys(recipeBook).forEach(key => {
        if (key === "molecular_weights") return;

        const option = document.createElement("option");
        option.value = key;                       // keep original key internally
        option.textContent = prettifyRecipeName(key); // show user-friendly label
        select.appendChild(option);
    });

    // Set default (if valid), otherwise fall back to null option
    if (defaultKey && recipeBook[defaultKey]) {
        select.value = defaultKey;
    } else {
        select.value = "";
    }
}

// -----------------------------------------------------------------------------

// Shared PatchClamp API exposed to other modules
window.MDMPatchClamp = {
    toggleWholeCellFields
};

// -----------------------------------------------------------------------------

// Initialize at page startup
document.addEventListener("DOMContentLoaded", function () {
    toggleWholeCellFields();
    window.MDMUI?.injectUnits?.(document);

    populateRecipeDropdown("extracellular_solution");
    populateRecipeDropdown("intracellular_solution");
});
