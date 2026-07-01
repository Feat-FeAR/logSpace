// JavaScript code for the DateOperatorAUX MetaDataMaker (MDM) shortcode

let opCounter = 2; // Next operator's index to create (Op. 1 already exists)

// Function to generate drop-down field options
function populateOperatorDropdown(field_Id, optionArray) {

    const dropdown = document.getElementById(field_Id);
    dropdown.innerHTML = ''; // Clear previous options

    // Add placeholder option
    const placeholder = document.createElement("option");
    placeholder.value = "";  // important: maps to null later
    placeholder.text = "--";
    placeholder.disabled = false;
    placeholder.selected = true;

    dropdown.appendChild(placeholder);

    // Add real options
    for (let i = 0; i < optionArray.length; i++) {
        const option = document.createElement("option");
        option.value = optionArray[i];
        option.text = optionArray[i];
        dropdown.appendChild(option);
    }
    
    // Add a "GUEST" option
    const otherOption = document.createElement("option");
    otherOption.value = "GUEST";
    otherOption.text = "GUEST";
    dropdown.appendChild(otherOption);
}

// Add an operator field to the drop-down menu
function addOperatorRow() {
    const section = document.getElementById("operatorFields");
    if (!section) return;

    const newRow = document.createElement("div");
    newRow.className = "operatorRow stdMetaField";

    newRow.innerHTML = `
        <label class="metaLabel" for="dropdown_operator${opCounter}">
            Operator ${opCounter}:
        </label>
        <select id="dropdown_operator${opCounter}"
                onchange="toggleGuestOperator(this)"
                class="metaValue hardField"
                data-meta-info="Operator ${opCounter}"
                data-meta-group="general"
                data-meta-key="operator_${opCounter}">
        </select>
        <input type="text"
               id="guest_operator${opCounter}"
               class="hidden hardField"
               placeholder="Name Surname">
    `;

    section.appendChild(newRow);

    // Generate the options for the newly created field
    populateOperatorDropdown(`dropdown_operator${opCounter}`, tcpLab.member);

    opCounter++;
}

// Function to toggle the display for the guest op. based on the selected option
function toggleGuestOperator(selectElement) {
    const customInput = selectElement.nextElementSibling;
    customInput.style.display = (selectElement.value === "GUEST" ? "inline-block" : "none");
}

// Remove an operator field from the drop-down menu
function removeOperatorRow() {
    if (opCounter > 2) {
        opCounter--;

        const section = document.getElementById("operatorFields");
        if (!section || !section.lastElementChild) return;
        
        // Remove the last added field
        section.removeChild(section.lastElementChild);
    }
}

// -----------------------------------------------------------------------------

// Expose button handlers used directly by HTML onclick attributes
window.addOperatorRow = addOperatorRow;
window.removeOperatorRow = removeOperatorRow;
window.toggleGuestOperator = toggleGuestOperator;

// -----------------------------------------------------------------------------

// Initialize at page startup (i.e., add an event listener to the document that
// executes the function once the DOM has been fully constructed).
document.addEventListener("DOMContentLoaded", function () {
    populateOperatorDropdown("dropdown_operator1", tcpLab.member);

    const today = new Date();
    const dateInput = document.getElementById("today_date");
    if (dateInput) {
        dateInput.valueAsDate = today;
    }
    const hint = document.getElementById("date_format_hint");
    if (hint) {
        // NOTE: For an HTML <input type="date">, browser's submitted/internal
        // value format is always YYYY-MM-DD. The browser UI may display the
        // date according to locale, but element.value is standardized as
        // year-month-day, which is crucial for MDM Finder module.
        hint.textContent = `Your locale format: ${window.MDMUI?.getLocaleDatePattern()}`;
    }
});
