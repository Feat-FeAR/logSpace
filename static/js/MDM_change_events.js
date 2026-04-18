// JavaScript code for the ChangeEvents MetaDataMaker (MDM) shortcode
//
// DESIGN NOTE
// This module does NOT own the list of available stimuli, which, on the
// contrary, is owned by MDM_acute_stimuli.js and exposed through:
//     window.MDMStimuli
//
// This module assumes that MDM_acute_stimuli.js is loaded on the page too.

let changeCounter = 2; // Next change-row index to create (row 1 already exists)

// Add one 'change event' row containing:
// - a numeric time field
// - a dropdown to select the new stimulus at that time
function addChangeRow() {
    const section = document.getElementById("changeFields");
    if (!section) return;

    const newRow = document.createElement("div");
    newRow.className = "changeRow stdMetaField";

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
        <div></div>
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
    if (window.MDMUI) {
        window.MDMUI.injectUnits(newRow);
    }

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

// Fill the "Full Trace File" input from a file selected in the hidden picker
function setFileFromSelection(traceFile) {
    if (!traceFile) return;

    const fileInput = document.getElementById("full_trace_file");
    if (!fileInput) return;

    fileInput.value = traceFile.name;

    // Reset the hidden picker so selecting the same file again still fires
    // the "change" event next time.
    const picker = document.getElementById("axoFile_picker");
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
    window.MDMUI?.injectUnits?.(document);
});
