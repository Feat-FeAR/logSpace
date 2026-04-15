// JavaScript code for the CellCultures MetaDataMaker (MDM) shortcode

function toggleCellLineFields() {
    const primary = document.getElementById("primary_culture").checked;
    const cellLineFields = document.getElementsByClassName("cellLineOnly");

    for (let i = 0; i < cellLineFields.length; i++) {
        const field = cellLineFields[i];

        if (primary) {
            field.disabled = true;
            field.value = "";
        } else {
            field.disabled = false;
        }
    }
}

// Initialize state at page startup
document.addEventListener("DOMContentLoaded", function () {
    toggleCellLineFields();
    window.MDMUI?.attachUnitStandardizationToAll?.(document);
});
