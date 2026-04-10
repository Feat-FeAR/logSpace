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

function getAllMetaValues() {
    // Select all elements with the class "metaValue"
    const elements = document.querySelectorAll(".metaValue");

    // Create an object to store metadata
    const metadata = {
        schema_version: "0.9.0",
        generated_by: "MetaDataMaker",
        generated_at: new Date().toISOString(),
        general: {
            operators: []
        }
    };

    // Loop through the elements
    elements.forEach(element => {
        // Get keys and values
        const metaInfo = element.dataset.metaInfo || "";
        const group = element.dataset.metaGroup || "general";
        const key = element.dataset.metaKey || element.id;
        const unit = element.dataset.metaUnit || null;

        let value;

        if (element.value === "GUEST") {
            const opNum = element.id.match(/\d+$/)[0];
            const guestField = document.getElementById(`guest_operator${opNum}`);
            value = guestField.value === "" ? null : guestField.value;
        } else if (element.type === "checkbox") {
            value = element.checked;
        } else if (element.type === "number") {
            value = element.value === "" ? null : Number(element.value);
        } else {
            value = element.value === "" ? null : element.value;
        }

        // Operators as an array
        if (key.startsWith("operator")) {
            if (value !== null && value !== "") {
                metadata.general.operators.push(value);
            }
            return;
        }

        // Create the group in the JSON if still does not exist
        if (!(group in metadata)) {
            metadata[group] = {};
        }

        // Store the metadata
        if (unit) {
            metadata[group][key] = {
                value: value,
                unit: unit
            };
        } else {
            metadata[group][key] = value;
        }
    });

    if (metadata.general.operators.length === 0) {
        metadata.general.operators = null;
    }

    // Return the object
    return metadata;
}

function downloadJsonData() {
    // Get the data
    const metadata = getAllMetaValues();

    // Convert the object to a JSON string
    // The third parameter (4) is for indentation
    const jsonString = JSON.stringify(metadata, null, 4);

    // Create a Blob containing the JSON data
    const blob = new Blob([jsonString], { type: "application/json" });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "metadata.json";
    a.click();

    URL.revokeObjectURL(url);
}
