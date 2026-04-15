// Shared utility file

// Add visible unit text inside all ".withUnit" inputs contained inside "root".
// Auto-generate units from 'data-meta-unit' HTML attribute
function injectUnits(root = document) {
    const fields = root.querySelectorAll(".withUnit");

    fields.forEach(field => {
        const unit = field.dataset.metaUnit;
        if (!unit) return;

        const wrapper = field.parentElement;
        // Safety: avoid duplicate insertion (safe to call multiple times)
        if (!wrapper || wrapper.querySelector(".unitInside")) return;

        const span = document.createElement("span");
        span.className = "unitInside";
        span.textContent = unit;

        wrapper.appendChild(span);
    });
}

// Safely place filenames inside HTML attribute values (when using 'innerHTML')
// CURRENTLY UNUSED
function escapeHtmlAttribute(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// Uniform common scientific unit notations in a text string ("10 uM" → "10 µM")
function standardizeUnits(text) {
    if (!text) return text;
    return text
        .replace(/\buM\b/g, "µM")
        .replace(/\bum\b/g, "µm")
        .replace(/\bumol\b/g, "µmol")
        .replace(/\bug\b/g, "µg")
        .replace(/\bu[Ll]\b/g, "µL")
        .replace(/\buS\b/g, "µS")
        .replace(/\bus\b/g, "µs")
        .replace(/\buV\b/g, "µV")
        .replace(/\bdegC\b/g, "°C")
        .replace(/ohm/gi, "Ω");
}

function attachUnitStandardization(input) {
    if (!input || input.dataset.unitStandardized === "true") return;

    input.addEventListener("blur", function () {
        input.value = standardizeUnits(input.value);
    });

    // Mark already-initialized inputs to avoid attaching duplicate blur listeners
    input.dataset.unitStandardized = "true";
}

function attachUnitStandardizationToAll(root = document) {
    const inputs = root.querySelectorAll(".standardizeUnits");
    inputs.forEach(input => {
        attachUnitStandardization(input);
    });
}

// -----------------------------------------------------------------------------

window.MDMUI = {
    injectUnits,
    standardizeUnits,
    attachUnitStandardization,
    attachUnitStandardizationToAll
};
