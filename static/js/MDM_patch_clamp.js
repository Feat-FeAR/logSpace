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

// Initialize state at page startup
document.addEventListener("DOMContentLoaded", function () {
    toggleWholeCellFields();
});

// Auto-generate units from 'data-meta-unit' HTML attribute
document.addEventListener("DOMContentLoaded", function () {
    const fields = document.querySelectorAll(".withUnit");

    fields.forEach(field => {
        const unit = field.dataset.metaUnit;
        if (!unit) return;

        const wrapper = field.parentElement;

        // Safety: avoid duplicate insertion
        if (wrapper.querySelector(".unitInside")) return;

        const span = document.createElement("span");
        span.className = "unitInside";
        span.textContent = unit;

        wrapper.appendChild(span);
    });
});
