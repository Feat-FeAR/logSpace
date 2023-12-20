/*
DESIGN NOTE
-----------
Within the MetaData Maker (MDM) framework, all HTML tags generating useful
values--such as <select> and <input>--are tagged by the `class="metaValue"`.
That attribute will be used by the `getAllMetaValues()` function to identify and
list all the value-generating fields in the document. In addition, those same
elements are provided with custom data attributes, which are attributes that you
can define yourself and start with the prefix `data-`. These attributes are not
intended for styling, but store additional information about the element, and
they are often used to associate metadata with specific elements for scripting
purposes. In MDM, we use the custom attribute `data-meta-info="..."` to store
the name of the key that will be used in the final object data structure to
store the `.value` from that same tag. In particular, the method
`.dataset.metaInfo` is used to retrieve the value of these custom data
attribute. Notice that, according to the JavaScript naming conventions for
properties, the `data-` prefix is removed when accessing the attribute and the
attribute name is converted from kebab-case (e.g., data-meta-info) to camelCase
(e.g., metaInfo).
*/

function getAllMetaValues() {
    // Select all elements with the class "metaValue"
    const elements = document.getElementsByClassName("metaValue");

    // Create an object to store values and metadata
    const metaValues = {};

    // Loop through the elements
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        // Get the value and data-meta-info attribute
        const value = element.value;
        let metaData = element.dataset.metaInfo;

        // Check if the key was set
        if (metaData === undefined) {
            throw new Error('Undefined \'data-meta-info\' attribute for element ' + i);
        }
        // Check if the key is duplicated
        if (metaValues[metaData] != undefined) {
            metaData = metaData + '_' + i;
        }
        // Store value and metaData as a key:value pair inside 'metaValues'
        metaValues[metaData] = value;
    }
    // Return the object
    return metaValues;
}

function downloadJsonData() {
    // Get the data
    const metaValues = getAllMetaValues();

    // Convert the object to a JSON string
    // The third parameter (2) is for indentation
    const jsonData = JSON.stringify(metaValues, null, 2);

    // Create a Blob containing the JSON data
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a download link
    const fileName = "metaValues.json";
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // Support for Internet Explorer and older versions of Microsoft Edge
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
        // Other browsers
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }
}
