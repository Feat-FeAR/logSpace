/*
JavaScript code for the Molecular Weight Viewer
called from the "show-mw.html" shortcode
*/

function generateMolecularWeightTable() {
    const tableBody = document.querySelector("#molecular-weight-table tbody");
    tableBody.innerHTML = ""; // Clear any existing data

    // (see 'const recipeBook' in show-mw.html)
    const molecularWeights = recipeBook.molecular_weights;

    for (const ingredient in molecularWeights) {
        let row = document.createElement("tr");

        // 'innerHTML' instead of 'textContent' to render HTML <sub> and <sup>
        let ingredientCell = document.createElement("td");
        ingredientCell.innerHTML = ingredient;

        let weightCell = document.createElement("td");
        weightCell.textContent = molecularWeights[ingredient][0].toFixed(2);

        let nFactorCell = document.createElement("td");
        nFactorCell.classList.add("center-text");
        nFactorCell.textContent = molecularWeights[ingredient][1];

        let osmoCoeffCell = document.createElement("td");
        osmoCoeffCell.classList.add("center-text");
        osmoCoeffCell.textContent = molecularWeights[ingredient][2].toFixed(2);

        row.appendChild(ingredientCell);
        row.appendChild(weightCell);
        row.appendChild(nFactorCell);
        row.appendChild(osmoCoeffCell);
        tableBody.appendChild(row);
    }
}

// Generate table on page load
generateMolecularWeightTable();
