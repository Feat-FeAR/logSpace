// JavaScript code for the DateOperator MetaDataMaker (MDM) shortcode

// Set the default date to today's date
document.getElementById("today_date").valueAsDate = new Date();

// Function to generate drop-down field options
function generateFieldOptions(field_Id, optionArray) {
    const dropdown = document.getElementById(field_Id);
    for (let i = 0; i < optionArray.length; i++) {
        const option = document.createElement("option");
        option.value = optionArray[i];
        option.text = optionArray[i];
        dropdown.appendChild(option);
    }
}

// Generate the options for the drop-down menus at page startup
generateFieldOptions("dropdown_operator1", tcpLab.member);

// Add an operator field to the drop-down menu
let opCounter = 2; // Next operator's index
function addOp() {
    const op_section = document.getElementById("opFields");
    const new_field = document.createElement("div");
    new_field.innerHTML = `
        <label class="metalabel"
               for="dropdown_operator${opCounter}">
            Op. ${opCounter}:
        </label>
        <select id="dropdown_operator${opCounter}"></select>
    `;
    op_section.appendChild(new_field);
    // Generate the options for the newly created field
    generateFieldOptions(`dropdown_operator${opCounter}`, tcpLab.member);
    opCounter++;
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
