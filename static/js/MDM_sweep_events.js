// JavaScript code for the SweepEvents MetaDataMaker (MDM) shortcode
//
// DESIGN NOTE
// This module does NOT own the list of available stimuli, which, on the
// contrary, is owned by MDM_acute_stimuli.js and exposed through:
//     window.MDMStimuli
//
// This module assumes that MDM_acute_stimuli.js is loaded on the page too.

let sweepCounter = 2; // Next sweep-row index to create (row 1 already exists)

// Add one sweep-stimulus association row
// 'fileName' parameter: optional filename to prefill the text input
function addSweepRow(fileName = "") {
    const section = document.getElementById("sweepFields");
    if (!section) return;

    const newRow = document.createElement("div");
    newRow.className = "sweepRow stdMetaField";

    newRow.innerHTML = `
        <label class="metaLabel" for="file_sweep_${sweepCounter}">
            File ${sweepCounter}:
        </label>
        <input type="text"
               id="file_sweep_${sweepCounter}"
               class="metaValue"
               data-meta-info="Sweep File ${sweepCounter}"
               data-meta-group="episodic_sweeps"
               data-meta-key="file_sweep_${sweepCounter}"
               placeholder="filename.ext">

        <label class="metaLabel" for="stimulus_sweep_${sweepCounter}">
            Stimulus:
        </label>
        <select id="stimulus_sweep_${sweepCounter}"
                class="metaValue"
                data-meta-info="Sweep Stimulus ${sweepCounter}"
                data-meta-group="episodic_sweeps"
                data-meta-key="stimulus_sweep_${sweepCounter}">
        </select>

        <label class="metaLabel" for="time_sweep_${sweepCounter}">
            Time:
        </label>
        <div class="inputWithUnit">
            <input type="number"
                   step="any"
                   inputmode="decimal"
                   id="time_sweep_${sweepCounter}"
                   class="metaValue withUnit"
                   data-meta-info="Sweep Time ${sweepCounter}"
                   data-meta-group="episodic_sweeps"
                   data-meta-key="time_sweep_${sweepCounter}"
                   data-meta-unit="s">
        </div>
    `;
    
    section.appendChild(newRow);

    // Set the filename through the DOM API instead of embedding it in innerHTML
    const fileInput = newRow.querySelector(`#file_sweep_${sweepCounter}`);
    if (fileInput) {
        fileInput.value = fileName;
    }

    // Add visible unit text to the new numeric field
    if (window.MDMUI) {
        window.MDMUI.injectUnits(newRow);
    }

    // Ask the shared stimulus module to refresh ALL dependent dropdowns,
    // including the one we just created.
    if (window.MDMStimuli) {
        window.MDMStimuli.refreshAllStimulusDropdowns();
    }

    sweepCounter++;
}

// Remove the last sweep-stimulus association row, but never remove row 1.
function removeSweepRow() {
    if (sweepCounter > 2) {
        sweepCounter--;

        const section = document.getElementById("sweepFields");
        if (!section || !section.lastElementChild) return;

        section.removeChild(section.lastElementChild);
    }
}

// Create or fill rows automatically from files chosen in the hidden picker.
function populateFilesFromSelection(fileList) {
    if (!fileList || fileList.length === 0) return;

    // Collect all existing filename inputs, in DOM order
    const existingInputs = document.querySelectorAll(
        '#sweepFields input[type="text"][id^="file_sweep_"]'
    );

    let fileIndex = 0;

    // First, reuse all currently empty fields
    existingInputs.forEach(input => {
        if (fileIndex >= fileList.length) return;

        if (input.value.trim() === "") {
            input.value = fileList[fileIndex].name;
            fileIndex++;
        }
    });

    // Then create new rows for any remaining files
    while (fileIndex < fileList.length) {
        addSweepRow(fileList[fileIndex].name);
        fileIndex++;
    }

    // Reset the hidden picker so selecting the same files again still fires
    // the "change" event next time.
    const picker = document.getElementById("clampexFile_picker");
    if (picker) {
        picker.value = "";
    }
}

// -----------------------------------------------------------------------------

// Expose button/file-picker handlers used directly by HTML onclick/onchange
window.addSweepRow = addSweepRow;
window.removeSweepRow = removeSweepRow;
window.populateFilesFromSelection = populateFilesFromSelection;

// -----------------------------------------------------------------------------

// Initialize at page startup
document.addEventListener("DOMContentLoaded", function () {
    window.MDMUI?.injectUnits?.(document);
});
