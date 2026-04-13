// JavaScript code for the AcuteStimuli MetaDataMaker (MDM) shortcode

let stimulusCounter = 2; // next stimulus index

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
        <label class="metaLabel" for="stimulus_${stimulusCounter}">
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

// Expose a tiny shared API for all other modules that require stimulus panel
window.MDMStimuli = {
    getCurrentStimuli,
    populateStimulusDropdown,
    refreshAllStimulusDropdowns
};

// Expose button handlers used directly by HTML
window.addStimulus = addStimulus;
window.removeStimulus = removeStimulus;

// Initialize at page startup
document.addEventListener("DOMContentLoaded", function () {
    // Keep dropdowns synchronized when Stimulus 1 is edited
    const firstStimulusInput = document.getElementById("stimulus_1");
    if (firstStimulusInput) {
        firstStimulusInput.addEventListener("input", refreshAllStimulusDropdowns);
    }
});
