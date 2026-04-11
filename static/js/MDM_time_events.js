// JavaScript code for the TimeEvents MetaDataMaker (MDM) shortcode

let stimulusCounter = 2;     // next stimulus index
let protoFileCounter = 2;    // next file row index

// Return the list of currently defined stimulus names.
// Empty fields are ignored. If nothing valid is present, fall back to S1.
function getCurrentStimuli() {
    const stimInputs = document.querySelectorAll('#stimulusFields input[type="text"]');
    const stimuli = [];

    for (let i = 0; i < stimInputs.length; i++) {
        const value = stimInputs[i].value.trim();
        if (value !== "") {
            stimuli.push(value);
        }
    }
    return stimuli;
}

// Fill one dropdown with the currently defined stimulus names
function populateStimulusDropdown(selectId) {
    const dropdown = document.getElementById(selectId);
    if (!dropdown) return;

    const currentValue = dropdown.value;
    const stimuli = getCurrentStimuli();

    dropdown.innerHTML = ""; // Clear previous options

    // Add placeholder option
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.text = "--";
    placeholder.disabled = true;
    placeholder.selected = true;

    dropdown.appendChild(placeholder);

    // Add real options
    for (let i = 0; i < stimuli.length; i++) {
        const option = document.createElement("option");
        option.value = stimuli[i];
        option.text = stimuli[i];
        dropdown.appendChild(option);
    }

    // Restore previously selected value if still available
    if (stimuli.includes(currentValue)) {
        dropdown.value = currentValue;
    }
}

// Refresh all file-row dropdowns after stimulus changes
function refreshAllStimulusDropdowns() {
    const dropdowns = document.querySelectorAll('#fileProtocolFields select');
    for (let i = 0; i < dropdowns.length; i++) {
        populateStimulusDropdown(dropdowns[i].id);
    }
}

// Add a new stimulus field
function addStimulus() {
    const section = document.getElementById("stimulusFields");
    const newField = document.createElement("div");

    newField.innerHTML = `
        <label class="metaLabel"
               for="stimulus_${stimulusCounter}">
            Stimulus ${stimulusCounter}:
        </label>
        <input type="text"
               id="stimulus_${stimulusCounter}"
               class="auxiliary"
               placeholder="S${stimulusCounter}">
    `;

    section.appendChild(newField);

    // As soon as the new field changes, update all file-stimulus dropdowns
    const newInput = newField.querySelector("input");
    newInput.addEventListener("input", refreshAllStimulusDropdowns);

    stimulusCounter++;
    refreshAllStimulusDropdowns();
}

// Remove the last stimulus field
function removeStimulus() {
    if (stimulusCounter > 2) {
        stimulusCounter--;
        const section = document.getElementById("stimulusFields");
        section.removeChild(section.lastElementChild);
        refreshAllStimulusDropdowns();
    }
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
    populateStimulusDropdown(`stimulus_proto-file_${protoFileCounter}`);
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

// Small helper to safely place filenames inside HTML attribute values
function escapeHtmlAttribute(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

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

// Initialize at page startup
document.addEventListener("DOMContentLoaded", function () {
    // Keep dropdowns synchronized when Stimulus 1 is edited
    const firstStimulusInput = document.getElementById("stimulus_1");
    if (firstStimulusInput) {
        firstStimulusInput.addEventListener("input", refreshAllStimulusDropdowns);
    }

    populateStimulusDropdown("stimulus_proto-file_1");
    injectUnits();
});
