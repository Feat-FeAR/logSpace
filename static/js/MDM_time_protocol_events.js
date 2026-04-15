// JavaScript code for the TimeProtocolEvents MetaDataMaker (MDM) shortcode
//
// DESIGN NOTE
// This module does NOT own the list of available stimuli.
// The stimulus list is owned by MDM_acute_stimuli.js and exposed through:
//     window.MDMStimuli
//
// This module assumes that MDM_acute_stimuli.js is loaded on the page too.

let protoFileCounter = 2; // Next protocol-row index to create (row 1 already exists)

// Add one protocol-stimulus association row
// 'fileName' parameter: optional filename to prefill the text input
function addProtocolRow(fileName = "") {
    const section = document.getElementById("fileProtocolFields");
    if (!section) return;

    const newRow = document.createElement("div");
    newRow.className = "fileProtocolRow";

    newRow.innerHTML = `
        <label class="metaLabel" for="name_proto-file_${protoFileCounter}">
            File ${protoFileCounter}:
        </label>
        <input type="text"
               id="name_proto-file_${protoFileCounter}"
               class="metaValue"
               data-meta-info="Protocol File Name ${protoFileCounter}"
               data-meta-group="protocol_applications"
               data-meta-key="name_proto-file_${protoFileCounter}"
               placeholder="filename.ext">

        <label class="metaLabel" for="stimulus_proto-file_${protoFileCounter}">
            Stimulus:
        </label>
        <select id="stimulus_proto-file_${protoFileCounter}"
                class="metaValue"
                data-meta-info="Protocol File Stimulus ${protoFileCounter}"
                data-meta-group="protocol_applications"
                data-meta-key="stimulus_proto-file_${protoFileCounter}">
        </select>

        <label class="metaLabel" for="time_proto-file_${protoFileCounter}">
            Time:
        </label>
        <div class="inputWithUnit">
            <input type="number"
                   step="any"
                   inputmode="decimal"
                   id="time_proto-file_${protoFileCounter}"
                   class="metaValue withUnit"
                   data-meta-info="Protocol File Time ${protoFileCounter}"
                   data-meta-group="protocol_applications"
                   data-meta-key="time_proto-file_${protoFileCounter}"
                   data-meta-unit="s">
        </div>
    `;
    
    section.appendChild(newRow);

    // Set the filename through the DOM API instead of embedding it in innerHTML
    const fileInput = newRow.querySelector(`#name_proto-file_${protoFileCounter}`);
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

    protoFileCounter++;
}

// Remove the last protocol-stimulus association row, but never remove row 1.
function removeProtocolRow() {
    if (protoFileCounter > 2) {
        protoFileCounter--;

        const section = document.getElementById("fileProtocolFields");
        if (!section || !section.lastElementChild) return;

        section.removeChild(section.lastElementChild);
    }
}

// Create or fill rows automatically from files chosen in the hidden picker.
function populateFilesFromSelection(fileList) {
    if (!fileList || fileList.length === 0) return;

    // Collect all existing filename inputs, in DOM order
    const existingInputs = document.querySelectorAll(
        '#fileProtocolFields input[type="text"][id^="name_proto-file_"]'
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
        addProtocolRow(fileList[fileIndex].name);
        fileIndex++;
    }

    // Reset the hidden picker so selecting the same files again still fires
    // the "change" event next time.
    const picker = document.getElementById("local_files_picker_proto");
    if (picker) {
        picker.value = "";
    }
}

// -----------------------------------------------------------------------------

// Expose button/file-picker handlers used directly by HTML onclick/onchange
window.addProtocolRow = addProtocolRow;
window.removeProtocolRow = removeProtocolRow;
window.populateFilesFromSelection = populateFilesFromSelection;

// -----------------------------------------------------------------------------

// Initialize at page startup
document.addEventListener("DOMContentLoaded", function () {
    window.MDMUI?.injectUnits?.(document);
});
