// JavaScript code for the TimeProtocolEvents MetaDataMaker (MDM) shortcode

let protoFileCounter = 2; // next file row index

// Small helper to safely place filenames inside HTML attribute values
function escapeHtmlAttribute(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

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

// Add one protocol-stimulus association row
function addProtocolRow(fileName = "") {
    const section = document.getElementById("fileProtocolFields");
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

    // Fill this row's dropdown using the API from 'MDM_acute_stimuli.js' script
    window.MDMStimuli.populateStimulusDropdown(`stimulus_proto-file_${protoFileCounter}`);

    // Add visible unit for the newly created numeric field
    injectUnits(newRow);

    protoFileCounter++;
}

// Remove the last protocol-stimulus association row
function removeProtocolRow() {
    if (protoFileCounter > 2) {
        protoFileCounter--;
        const section = document.getElementById("fileProtocolFields");
        section.removeChild(section.lastElementChild);
    }
}

// Populate rows automatically from files selected on the local filesystem
function populateFilesFromSelection(fileList) {
    if (!fileList || fileList.length === 0) return;

    let startIndex = 0;
    const firstFileInput = document.getElementById("name_proto-file_1");

    // Reuse the first row only if it exists and is still empty
    if (firstFileInput && firstFileInput.value.trim() === "") {
        firstFileInput.value = fileList[0].name;
        startIndex = 1;
    }

    // Add new rows for all remaining selected files
    for (let i = startIndex; i < fileList.length; i++) {
        addProtocolRow(fileList[i].name);
    }

    // Reset input so selecting the same files again still triggers onchange
    document.getElementById("local_files_picker").value = "";
}

// Expose button handlers used directly by HTML
window.addProtocolRow = addProtocolRow;
window.removeProtocolRow = removeProtocolRow;
window.populateFilesFromSelection = populateFilesFromSelection;

// Initialize at page startup
document.addEventListener("DOMContentLoaded", function () {
    // Populate the first protocol-stimulus dropdown
    window.MDMStimuli.populateStimulusDropdown("stimulus_proto-file_1");

    // Add visible units to fields already present in the HTML
    injectUnits(document);
});
