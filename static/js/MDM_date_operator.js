// JavaScript code for the DateOperator MetaDataMaker (MDM) shortcode

let opCounter = 2; // Next operator's index to create (Op. 1 already exists)

// Function to generate drop-down field options
function generateFieldOptions(field_Id, optionArray) {

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
    
    // Add a "Guest" option
    const otherOption = document.createElement("option");
    otherOption.value = "GUEST";
    otherOption.text = "GUEST";
    dropdown.appendChild(otherOption);
}

// Add an operator field to the drop-down menu
function addOp() {
    const op_section = document.getElementById("opFields");
    const new_field = document.createElement("div");
    new_field.className = "stdMetaField operatorRow";
    new_field.innerHTML = `
        <label class="metaLabel" for="dropdown_operator${opCounter}">
            Operator ${opCounter}:
        </label>
        <select id="dropdown_operator${opCounter}"
                onchange="toggleCustomInput(this)"
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
    op_section.appendChild(new_field);
    // Generate the options for the newly created field
    generateFieldOptions(`dropdown_operator${opCounter}`, tcpLab.member);
    opCounter++;
}

// Function to toggle the display for the guest op. based on the selected option
function toggleCustomInput(selectElement) {
    const customInput = selectElement.nextElementSibling;
    customInput.style.display = selectElement.value === "GUEST" ? "inline-block" : "none";
}

// Remove an operator field from the drop-down menu
function removeOp() {
    if (opCounter > 2) {
        opCounter--;
        const op_section = document.getElementById("opFields");
        // Remove the last added field
        op_section.removeChild(op_section.lastElementChild);
    }
}

// -----------------------------------------------------------------------------

// Expose button handlers used directly by HTML onclick attributes
window.addOp = addOp;
window.removeOp = removeOp;
window.toggleCustomInput = toggleCustomInput;

// -----------------------------------------------------------------------------

// Initialize at page startup
document.addEventListener("DOMContentLoaded", function () {
    generateFieldOptions("dropdown_operator1", tcpLab.member);

    const today = new Date();

    const dateInput = document.getElementById("today_date");
    if (dateInput) {
        dateInput.valueAsDate = today;
    }

    const hint = document.getElementById("date_format_hint");
    if (hint) {
        hint.textContent = `Your locale format: ${window.MDMUI?.getLocaleDatePattern()}`;
    }
});
