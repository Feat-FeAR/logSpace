/*
DESIGN NOTE
-----------
Within MetaDataMaker (MDM), every field that must be exported to JSON must have
`class="metaValue"`. `getAllMetaValues()` scans the document for that class and
reads the value of each matching element (`<input>`, `<select>`, `<textarea>`,
etc.). This is the core contract that makes a form field visible to MDM.

In addition, MDM uses HTML `data-*` custom attributes to attach extra-metadata
to each field. These user-defined attributes starting with the prefix `data-`
are not intended for styling, but, being accessible in JS through
`element.dataset.*`, are often used for scripting purposes to associate
additional information with specific HTML elements. In MDM, they are used to
store the name of the keys that will be used in the final object data structure.

Specifically:
 - `data-meta-group`: parent block/group name for nested JSON exports;
 - `data-meta-key`: field key inside that group;
 - `data-meta-unit`: optional measurement unit associated with the stored value;
 - `data-meta-info`: human-facing label layer (for future UI automation).

Notice that, according to the JavaScript naming conventions for properties, the
`data-` prefix is removed when accessing the attribute and the attribute name is
systematically converted from kebab-case (e.g., data-meta-info) to camelCase
(e.g., metaInfo -> element.dataset.metaInfo).
*/

// Function to create 'time_events' top-level JSON block lazily (i.e., when the
// first related field is encountered in the DOM)
function ensureTimeEventsBlock(metadata) {
    if (!("time_events" in metadata)) {
        metadata.time_events = {};
    }
    if (!("full_time_course" in metadata.time_events)) {
        metadata.time_events.full_time_course = null;
    }
    if (!("stimulus_changes" in metadata.time_events)) {
        metadata.time_events.stimulus_changes = [];
    }
    if (!("protocol_applications" in metadata.time_events)) {
        metadata.time_events.protocol_applications = [];
    }
}

// Same thing for the 'general' block.
function ensureGeneralBlock(metadata) {
    if (!("general" in metadata)) {
        metadata.general = {};
    }
    if (!("operators" in metadata.general)) {
        metadata.general.operators = [];
    }
}

function getAllMetaValues() {
    // Select all exportable metadata fields in DOM order
    const elements = document.querySelectorAll(".metaValue");

    // Create an object to store metadata
    /*
    Note on schema semantic versioning:
    MAJOR.MINOR.PATCH
        PATCH (1.0.0 → 1.0.1): bug fixes, no structure change
        MINOR (1.0.0 → 1.1.0): new fields added (backward compatible)
        MAJOR (1.0.0 → 2.0.0): breaking changes (renamed keys, structure change)
    */
    const metadata = {
        schema_version: "1.0.0",
        generated_by: "MetaDataMaker",
        generated_at: new Date().toISOString()
    };

    // Temporary stores for the nested 'time_events' content.
    const protocolRows = {};
    const changeRows = {};

    // Loop through every exportable field in DOM order.
    elements.forEach(element => {
        // Read from data-* attributes to get keys and values
        //const metaInfo = element.dataset.metaInfo || "";
        const group = element.dataset.metaGroup || "general";
        const key = element.dataset.metaKey || element.id;
        const unit = element.dataset.metaUnit || null;

        // Retrieve the values
        let value;
        if (element.value === "GUEST") {
            const opNumMatch = element.id.match(/\d+$/);
            const opNum = opNumMatch ? opNumMatch[0] : null;
            const guestField = opNum ? document.getElementById(`guest_operator${opNum}`) : null;
            value = guestField && guestField.value.trim() !== ""
                ? guestField.value
                : null;
        } else if (element.type === "checkbox") {
            value = element.checked;
        } else if (element.type === "number") {
            value = element.value === "" ? null : Number(element.value);
        } else {
            value = element.value === "" ? null : element.value;
        }
        
        // SPECIAL CASE 1
        // --------------
        // operators are exported as an array under: metadata.general.operators
        if (key.startsWith("operator")) {
            ensureGeneralBlock(metadata);
            if (value !== null && value !== "") {
                metadata.general.operators.push(value);
            }
            return;
        }

        // SPECIAL CASE 2
        // --------------
        // protocol application rows belong to the nested
        // "time_events.protocol_applications" array.
        if (group === "protocol_applications") {
            ensureTimeEventsBlock(metadata);
            const match = key.match(/_(\d+)$/);
            if (!match) return;

            const rowIndex = match[1];

            if (!(rowIndex in protocolRows)) {
                protocolRows[rowIndex] = {
                    file: null,
                    stimulus: null,
                    time: {
                        value: null,
                        unit: "s"
                    }
                };
            }

            // Map flat HTML field keys into the nested row structure
            if (key.startsWith("name_proto-file_")) {
                protocolRows[rowIndex].file = value;
            } else if (key.startsWith("stimulus_proto-file_")) {
                protocolRows[rowIndex].stimulus = value;
            } else if (key.startsWith("time_proto-file_")) {
                protocolRows[rowIndex].time = unit
                    ? { value: value, unit: unit }
                    : value;
            }

            return;
        }

        // SPECIAL CASE 3
        // --------------
        // stimulus-change rows also belong to the nested "time_events" block
        if (group === "stimulus_changes") {
            ensureTimeEventsBlock(metadata);

            // The full trace filename is stored as a scalar field
            if (key === "full_trace_file") {
                metadata.time_events.full_time_course = value;
                return;
            }

            // All other stimulus_changes fields are row-based
            const match = key.match(/_(\d+)$/);
            if (!match) return;

            const rowIndex = match[1];

            if (!(rowIndex in changeRows)) {
                changeRows[rowIndex] = {
                    time: {
                        value: null,
                        unit: "s"
                    },
                    stimulus: null
                };
            }

            // Map flat HTML field keys into the nested row structure
            if (key.startsWith("to_stimulus_")) {
                changeRows[rowIndex].stimulus = value;
            } else if (key.startsWith("time_change_")) {
                changeRows[rowIndex].time = unit
                    ? { value: value, unit: unit }
                    : value;
            }

            return;
        }

        // SPECIAL CASE 4
        // --------------
        // saline-solution dropdowns: export full recipe from RecipeBook.json
        if (element.dataset.metaRecipeBook === "true") {
            if (value === null || value === "") {
                value = null;
            } else {
                value = {
                    name: value.replaceAll("_", " "),
                    recipe: recipeBook[value] || null
                };
            }
        }

        // STANDARD CASE
        // -------------
        // Any other field is stored directly under its top-level group
        if (!(group in metadata)) {
            metadata[group] = {};
        }

        metadata[group][key] = unit
            ? { value: value, unit: unit }
            : value;
    });

    // POST-PROCESSING
    // ---------------
    // Convert temporary row stores into ordered arrays, and normalize empty
    // sections to null where needed

    // If the General module exists but no operators were collected, export null
    if ("general" in metadata && metadata.general.operators.length === 0) {
        metadata.general.operators = null;
    }

    // Finalize protocol_applications and stimulus_changes as ordered arrays
    if ("time_events" in metadata) {
        metadata.time_events.protocol_applications = Object.keys(protocolRows)
            .sort((a, b) => Number(a) - Number(b))
            .map(index => protocolRows[index]);

        if (metadata.time_events.protocol_applications.length === 0) {
            metadata.time_events.protocol_applications = null;
        }

        metadata.time_events.stimulus_changes = Object.keys(changeRows)
            .sort((a, b) => Number(a) - Number(b))
            .map(index => changeRows[index]);

        if (metadata.time_events.stimulus_changes.length === 0) {
            metadata.time_events.stimulus_changes = null;
        }
    }

    // Return the fully assembled metadata object
    return metadata;
}

function downloadJsonData() {
    // Get the data
    const metadata = getAllMetaValues();

    // Retrieve some fields to build filename
    function sanitize(str) {
        return str.replace(/\s+/g, "_").replace(/[^\w\-.()\[\]+]/g, "")
    }
    const cellType = metadata.cell_cultures.cell_type || "unknown";
    const condition = metadata.cell_cultures.experimental_condition || "unknown"; 
    const generatedAt = metadata.generated_at.replace(/[:.]/g, "-");
    const filename = `metadata_${sanitize(cellType)}_${sanitize(condition)}_${generatedAt}.json`;

    // Convert the object to a JSON string
    // The third parameter (4) is for indentation
    const jsonString = JSON.stringify(metadata, null, 4);

    // Create a Blob containing the JSON data
    const blob = new Blob([jsonString], { type: "application/json" });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}

// Main clearing function
function clearMetadataForm(hard = false) {
    const fields = document.querySelectorAll("input, select, textarea");

    fields.forEach(field => {
        // Soft Clear -> leaves hardField values untouched
        if (!hard && field.classList.contains("hardField")) {
            return; // Exits the function (to skip iteration in 'forEach')
        }

        // NON-DATA INPUTS: Some elements are not real metadata fields, such as:
        // buttons, submit controls, file pickers...
        // For file inputs, assigning "" clears the current file selection.
        // For buttons/submit inputs, this has no real harmful effect and
        // simply ensures they are ignored as metadata content.
        if (field.type === "button" || field.type === "submit" || field.type === "file") {
            field.value = "";
            return;
        }

        // Read the optional default value declared in HTML
        const defaultValue = field.dataset.default;

        if (field.type === "checkbox") {
            field.checked = (defaultValue !== undefined)
                ? (defaultValue === "true")
                : false;
        } else if (field.tagName === "SELECT") {
            if (defaultValue !== undefined) {
                field.value = defaultValue;
            } else {
                field.selectedIndex = 0; // first option in the list
            }
        } else { // TEXT / NUMBER / TEXTAREA / OTHER VALUE-BASED FIELDS
            if (defaultValue !== undefined) {
                field.value = defaultValue;
            } else {
                field.value = "";
            }
        }
    });

    // Restore default structural state (dynamically generated soft-fields)
    resetDynamicSectionsToBaseState(hard);

    // Re-run module-dependent UI logic
    document.getElementById("today_date").valueAsDate = new Date();
    window.MDMCellCultures?.toggleCellLineFields?.();
    window.MDMPatchClamp?.toggleWholeCellFields?.();
    window.MDMStimuli?.refreshAllStimulusDropdowns?.();
}

function resetDynamicSectionsToBaseState(hard = false) {
    // Add here all the dynamically generated fields, together with their
    // combinator selector and their (exposed) removal function
    const groups = [
        {
            rowSelector: "#operatorFields > .operatorRow",
            removeFun: removeOperatorRow
        },
        {
            rowSelector: "#stimulusFields > .stimulusRow",
            removeFun: removeStimulusRow
        },
        {
            rowSelector: "#fileProtocolFields > .fileProtocolRow",
            removeFun: removeProtocolRow
        },
        {
            rowSelector: "#changeFields > .changeRow",
            removeFun: removeChangeRow
        }
    ];

    groups.forEach(group => {
        let rows = Array.from(document.querySelectorAll(group.rowSelector));

        // keep at least the base row
        while (rows.length > 1) {
            const lastRow = rows[rows.length - 1];
            const hasHardField = lastRow.querySelector(".hardField") !== null;

            if (!hard && hasHardField) {
                break;
            }

            group.removeFun();
            rows = Array.from(document.querySelectorAll(group.rowSelector));
        }
    });
}
