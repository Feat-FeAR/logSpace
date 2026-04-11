// JavaScript code for the TimeEvents MetaDataMaker (MDM) shortcode

let stimulusCounter = 2;    // next stimulus index
let fileEventCounter = 2;   // next file row index

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
    const dropdowns = document.querySelectorAll('#fileEventFields select');
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

    // As soon as the new field changes, update all file-event dropdowns
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

// Add one file/event association row
function addFileEventRow(fileName = "") {
    const section = document.getElementById("fileEventFields");
    const newRow = document.createElement("div");
    newRow.className = "fileEventRow";

    newRow.innerHTML = `
        <label class="metaLabel"
               for="name_file_${fileEventCounter}">
            File ${fileEventCounter}:
        </label>
        <input type="text"
               id="name_file_${fileEventCounter}"
               class="metaValue"
               data-meta-info="File ${fileEventCounter} Name"
               data-meta-group="events"
               data-meta-key="name_file_${fileEventCounter}"
               placeholder="filename.ext"
               value="${escapeHtmlAttribute(fileName)}">

        <label class="metaLabel"
               for="stimulus_file_${fileEventCounter}">
            Stimulus:
        </label>
        <select id="stimulus_file_${fileEventCounter}"
                class="metaValue"
                data-meta-info="File ${fileEventCounter} Stimulus"
                data-meta-group="events"
                data-meta-key="stimulus_file_${fileEventCounter}">
        </select>

        <label class="metaLabel" for="time_file_${fileEventCounter}">
            Time:
        </label>
        <input type="number"
               step="any"
               inputmode="decimal"
               id="time_file_${fileEventCounter}"
               class="metaValue withUnit"
               data-meta-info="Event Time"
               data-meta-group="patch_clamp"
               data-meta-key="time_file_${fileEventCounter}"
               data-meta-unit="s">
    `;

    section.appendChild(newRow);
    populateStimulusDropdown(`stimulus_file_${fileEventCounter}`);
    fileEventCounter++;
}

// Remove the last file/event association row
function removeFileEventRow() {
    if (fileEventCounter > 2) {
        fileEventCounter--;
        const section = document.getElementById("fileEventFields");
        section.removeChild(section.lastElementChild);
    }
}

// Populate rows automatically from files selected on the local filesystem
function populateFilesFromSelection(fileList) {
    if (!fileList || fileList.length === 0) return;

    let startIndex = 0;

    const firstFileInput = document.getElementById("name_file_1");

    // Reuse the first row only if it exists and is still empty
    if (firstFileInput && firstFileInput.value.trim() === "") {
        firstFileInput.value = fileList[0].name;
        startIndex = 1;
    }

    // Add new rows for all remaining selected files
    for (let i = startIndex; i < fileList.length; i++) {
        addFileEventRow(fileList[i].name);
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

// Initialize at page startup
document.addEventListener("DOMContentLoaded", function () {
    // Keep dropdowns synchronized when Stimulus 1 is edited
    const firstStimulusInput = document.getElementById("stimulus_1");
    if (firstStimulusInput) {
        firstStimulusInput.addEventListener("input", refreshAllStimulusDropdowns);
    }
    
    // Populate the first file-event dropdown
    populateStimulusDropdown("stimulus_file_1");
});
