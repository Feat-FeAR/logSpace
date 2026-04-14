// JavaScript code for the ChangeEvents MetaDataMaker (MDM) shortcode

let changeCounter = 2; // next file row index

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

// Add visible unit text inside all ".withUnit" inputs contained in root
// Auto-generate units from 'data-meta-unit' HTML attribute
function injectUnits(root = document) {
    const fields = root.querySelectorAll(".withUnit");

    fields.forEach(field => {
        const unit = field.dataset.metaUnit;
        if (!unit) return;

        const wrapper = field.parentElement;
        // Safety: avoid duplicate insertion
        if (!wrapper || wrapper.querySelector(".unitInside")) return;

        const span = document.createElement("span");
        span.className = "unitInside";
        span.textContent = unit;

        wrapper.appendChild(span);
    });
}

// Add one 'change event' row
function addChangeRow(fileName = "") {
    const section = document.getElementById("changeFields");
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
            Stimulus Change to:
        </label>
        <select id="name_change_${changeCounter}"
                class="metaValue"
                data-meta-info="New Stimulus ${changeCounter}"
                data-meta-group="stimulus_changes"
                data-meta-key="to_stimulus_${changeCounter}">
        </select>
    `;

    section.appendChild(newRow);

    // Fill this row's dropdown using the API from 'MDM_acute_stimuli.js' script
    window.MDMStimuli.populateStimulusDropdown(`name_change_${changeCounter}`);

    // Add visible unit for the newly created numeric field
    injectUnits(newRow);

    changeCounter++;
}

// Remove the last 'change event' row
function removeChangeRow() {
    if (changeCounter > 2) {
        changeCounter--;
        const section = document.getElementById("changeFields");
        section.removeChild(section.lastElementChild);
    }
}

// Populate rows automatically from files selected on the local filesystem
function setFileFromSelection(traceFile) {
    if (!traceFile || traceFile.length === 0) return;

    const fileInput = document.getElementById("full_trace_file");
    fileInput.value = traceFile[0].name;

    // Reset input so selecting the same files again still triggers onchange
    document.getElementById("local_files_picker_change").value = "";
}

// Expose button handlers used directly by HTML
window.addChangeRow = addChangeRow;
window.removeChangeRow = removeChangeRow;
window.setFileFromSelection = setFileFromSelection;

// Initialize at page startup
document.addEventListener("DOMContentLoaded", function () {
    // Populate the first 'change event' dropdown
    window.MDMStimuli.populateStimulusDropdown("name_change_1");

    // Add visible units to fields already present in the HTML
    injectUnits(document);
});
