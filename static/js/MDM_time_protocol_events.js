// JavaScript code for the TimeProtocolEvents MetaDataMaker (MDM) shortcode
//
// DESIGN NOTE
// This module does NOT own the list of available stimuli.
// The stimulus list is owned by MDM_acute_stimuli.js and exposed through:
//     window.MDMStimuli
//
// This module assumes that MDM_acute_stimuli.js is loaded on the page too.

let protoFileCounter = 2; // Next protocol-row index to create (row 1 already exists)

// Small helper to safely place filenames inside HTML attribute values
// Without escaping, those characters could break the generated HTML string.
function escapeHtmlAttribute(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

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
               placeholder="filename.ext"
               value="${escapeHtmlAttribute(fileName)}">

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

    let startIndex = 0;
    const firstFileInput = document.getElementById("name_proto-file_1");

    // Reuse the first existing row only if still empty
    if (firstFileInput && firstFileInput.value.trim() === "") {
        firstFileInput.value = fileList[0].name;
        startIndex = 1;
    }

    // Create one additional row for each remaining file
    for (let i = startIndex; i < fileList.length; i++) {
        addProtocolRow(fileList[i].name);
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
    if (window.MDMUI) {
        window.MDMUI.injectUnits(document);
    }
});
