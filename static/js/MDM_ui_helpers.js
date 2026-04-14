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

/*
// Small helper to safely place filenames inside HTML attribute values
function escapeHtmlAttribute(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
*/

window.MDMUI = {
    injectUnits
};
