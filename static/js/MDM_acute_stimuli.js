// JavaScript code for the AcuteStimuli MetaDataMaker (MDM) shortcode
//
// DESIGN NOTE
// This module keeps all stimulus-dependent dropdowns synchronized from one
// place by
// 1. managing the "Stimulus Panel" rows (add/remove stimulus names).
// 2. reading the currently defined stimulus names.
// 3. populating any dependent <select> dropdown that must offer those names.
// 4. refreshing all dependent dropdowns whenever the stimulus list changes.
//
// Other modules (for example TimeProtocolEvents and ChangeEvents) should NOT
// duplicate stimulus-list logic. Instead, they should call the shared API:
//     window.MDMStimuli.refreshAllStimulusDropdowns();

let stimulusCounter = 2; // Next stimulus index to create (Stimulus 1 already exists)

// Return the list of currently defined stimulus names.
// Empty fields are ignored. If nothing valid is present, fall back to S1.
function getCurrentStimuli() {
    const stimInputs = document.querySelectorAll('#stimulusFields input[type="text"]');
    const stimuli = [];

    for (let i = 0; i < stimInputs.length; i++) {
        let value = stimInputs[i].value.trim();

        if (window.MDMUI?.standardizeUnits) {
            value = window.MDMUI.standardizeUnits(value);
        }

        if (value !== "") {
            stimuli.push(value);
        }
    }

    return stimuli;
}

// Fill one dropdown (i.e., <select> element) with the current stimulus names
function populateStimulusDropdown(selectId) {
    const dropdown = document.getElementById(selectId);
    if (!dropdown) return;

    const currentValue = dropdown.value;
    const stimuli = getCurrentStimuli();

    // Remove all existing options before rebuilding the list
    dropdown.innerHTML = "";

    // Insert a placeholder option "--" as first entry
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.text = "--";
    placeholder.disabled = true;
    placeholder.selected = true;
    dropdown.appendChild(placeholder);

    // Add real options (one per currently defined stimulus)
    for (let i = 0; i < stimuli.length; i++) {
        const option = document.createElement("option");
        option.value = stimuli[i];
        option.text = stimuli[i];
        dropdown.appendChild(option);
    }

    // Preserve the previously selected value, if that value still exists among
    // current stimuli. Otherwise, leave the dropdown on the placeholder.
    if (stimuli.includes(currentValue)) {
        dropdown.value = currentValue;
    }
}

// Refresh all stimulus-dependent dropdowns after stimulus changes. Currently,
// 'stimulusEventFields' class is used to target both TimeProtocolEvents and
// ChangeEvents modules. Any future module that needs automatic stimulus
// dropdown updates should place its relevant <select> elements inside a
// container with that class!!
function refreshAllStimulusDropdowns() {
    const dropdowns = document.querySelectorAll('.stimulusEventFields select');

    for (let i = 0; i < dropdowns.length; i++) {
        const dropdown = dropdowns[i];

        // Populate only elements that actually have an id
        if (dropdown.id) {
            populateStimulusDropdown(dropdown.id);
        }
    }
}

// Add a new stimulus text field to the Stimulus Panel
function addStimulusRow() {
    const section = document.getElementById("stimulusFields");
    if (!section) return;

    const newField = document.createElement("div");
    newField.className = "stimulusRow stdMetaField";

    newField.innerHTML = `
        <label class="metaLabel" for="stimulus_${stimulusCounter}">
            Stimulus ${stimulusCounter}:
        </label>
        <input type="text"
               id="stimulus_${stimulusCounter}"
               class="auxiliary standardizeUnits hardField"
               placeholder="S${stimulusCounter}">
    `;
    
    section.appendChild(newField);

    // Any change in the new input must refresh all dependent dropdowns
    const newInput = newField.querySelector("input");
    window.MDMUI?.attachUnitStandardizationToAll?.(newField);
    // This runs later, every time the user changes the text...
    newInput?.addEventListener("input", refreshAllStimulusDropdowns);
    // ...this one runs immediately after adding the row.
    refreshAllStimulusDropdowns();
    
    stimulusCounter++;
}

// Remove the last stimulus field (but never remove Stimulus 1)
function removeStimulusRow() {
    if (stimulusCounter > 2) {
        stimulusCounter--;

        const section = document.getElementById("stimulusFields");
        if (!section || !section.lastElementChild) return;

        section.removeChild(section.lastElementChild);
        refreshAllStimulusDropdowns();
    }
}

// -----------------------------------------------------------------------------

// Shared stimulus API exposed to other modules that require stimulus panel
window.MDMStimuli = {
    getCurrentStimuli,
    populateStimulusDropdown,
    refreshAllStimulusDropdowns
};

// Expose button handlers used directly by HTML onclick attributes
window.addStimulusRow = addStimulusRow;
window.removeStimulusRow = removeStimulusRow;

// -----------------------------------------------------------------------------

// Initialize at page startup
document.addEventListener("DOMContentLoaded", function () {
    // Attach the "input" listener to the pre-existing Stimulus 1 field, since
    // that field is already present in HTML (not created by 'addStimulusRow').
    const firstStimulusInput = document.getElementById("stimulus_1");
    // The 'input' event fires immediately whenever the value changes.
    // The 'blur' event fires only when leaving the field.
    firstStimulusInput?.addEventListener("input", refreshAllStimulusDropdowns);

    window.MDMUI?.attachUnitStandardizationToAll?.(document);
    refreshAllStimulusDropdowns();
});
