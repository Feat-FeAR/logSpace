// JavaScript code for the DateOperator MetaDataMaker (MDM) shortcode

// Set the default date to today's date
document.getElementById("today_date").valueAsDate = new Date();

// Function to generate drop-down field options
function generateFieldOptions(field_Id, optionArray) {

    const dropdown = document.getElementById(field_Id);
    dropdown.innerHTML = ''; // Clear previous options

    // Add predefined options
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

// Generate the options for the drop-down menus at page startup
generateFieldOptions("dropdown_operator1", tcpLab.member);

// Add an operator field to the drop-down menu
let opCounter = 2; // Next operator's index
function addOp() {
    const op_section = document.getElementById("opFields");
    const new_field = document.createElement("div");
    new_field.innerHTML = `
        <label class="metaLabel"
               for="dropdown_operator${opCounter}">
            Op. ${opCounter}:
        </label>
        <select id="dropdown_operator${opCounter}"
                onchange="toggleCustomInput(this)"
                class="metaValue"
                data-meta-info="Operator ${opCounter}">
        </select>
        <input type="text"
               id="guest_operator${opCounter}"
               placeholder="Name Surname"
               style="display: none;">
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
