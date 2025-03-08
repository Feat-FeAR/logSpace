// JavaScript code for the MW report table

function generateMolecularWeightTable() {
    const tableBody = document.querySelector("#molecular-weight-table tbody");
    tableBody.innerHTML = ""; // Clear any existing data

    const molecularWeights = recipeBook.molecular_weights;

    for (let ingredient in molecularWeights) {
        let row = document.createElement("tr");

        // 'innerHTML' instead of 'textContent' to render HTML <sub> and <sup>
        let ingredientCell = document.createElement("td");
        ingredientCell.innerHTML = ingredient;

        let weightCell = document.createElement("td");
        weightCell.textContent = molecularWeights[ingredient];

        row.appendChild(ingredientCell);
        row.appendChild(weightCell);
        tableBody.appendChild(row);
    }
}

// Generate table on page load
generateMolecularWeightTable();
