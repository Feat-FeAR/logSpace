// JavaScript code for the ChangeEvents MetaDataMaker (MDM) shortcode
//
// DESIGN NOTE
// This module does NOT own the list of available stimuli.
// The stimulus list is owned by MDM_acute_stimuli.js and exposed through:
//     window.MDMStimuli
//
// This module assumes that MDM_acute_stimuli.js is loaded on the page too.

let changeCounter = 2; // Next change-row index to create (row 1 already exists)

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

// Add one 'change event' row containing:
// - a numeric time field
// - a dropdown to select the new stimulus at that time
function addChangeRow() {
    const section = document.getElementById("changeFields");
    if (!section) return;

    const newRow = document.createElement("div");
    newRow.className = "changeRow";

    newRow.innerHTML = `
        <label class="metaLabel" for="time_change_${changeCounter}">
            Time:
        </label>
        <div class="inputWithUnit">
            <input type="number"
                   step="any"
                   inputmode="decimal"
                   id="time_change_${changeCounter}"
                   class="metaValue withUnit"
                   data-meta-info="Change Time ${changeCounter}"
                   data-meta-group="stimulus_changes"
                   data-meta-key="time_change_${changeCounter}"
                   data-meta-unit="s">
        </div>

        <label class="metaLabel" for="name_change_${changeCounter}">
            Change to Stimulus:
        </label>
        <select id="name_change_${changeCounter}"
                class="metaValue"
                data-meta-info="New Stimulus ${changeCounter}"
                data-meta-group="stimulus_changes"
                data-meta-key="to_stimulus_${changeCounter}">
        </select>
    `;

    section.appendChild(newRow);

    // Add visible unit text to the newly created numeric field
    injectUnits(newRow);

    // Ask the shared stimulus module to refresh ALL dependent dropdowns,
    // including the one we just created.
    if (window.MDMStimuli) {
        window.MDMStimuli.refreshAllStimulusDropdowns();
    }

    changeCounter++;
}

// Remove the last "change event" row, but never remove row 1.
function removeChangeRow() {
    if (changeCounter > 2) {
        changeCounter--;

        const section = document.getElementById("changeFields");
        if (!section || !section.lastElementChild) return;

        section.removeChild(section.lastElementChild);
    }
}

// Fill the "Full Trace File" input from a file selected in the hidden picker.
function setFileFromSelection(traceFile) {
    if (!traceFile || traceFile.length === 0) return;

    const fileInput = document.getElementById("full_trace_file");
    if (!fileInput) return;

    fileInput.value = traceFile[0].name;

    // Reset the hidden picker so selecting the same file again still fires
    // the "change" event next time.
    const picker = document.getElementById("local_files_picker_change");
    if (picker) {
        picker.value = "";
    }
}

// -----------------------------------------------------------------------------

// Expose button/file-picker handlers used directly by HTML onclick/onchange
window.addChangeRow = addChangeRow;
window.removeChangeRow = removeChangeRow;
window.setFileFromSelection = setFileFromSelection;

// -----------------------------------------------------------------------------

// Initialize at page startup
document.addEventListener("DOMContentLoaded", function () {
    injectUnits(document);
});
