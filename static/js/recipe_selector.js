// JavaScript code for the 'RecipeSelector.html' shortcode

const recipeSelect = document.getElementById("recipe-select");
const volumeSelect = document.getElementById("volume-select");
const recipeDescription = document.getElementById("recipe-description");
const recipeList = document.getElementById("recipe-list");
const clearBtn = document.getElementById("clear-btn");

let currentRecipe = null;

// Populate recipe dropdown (see 'const recipeBook' in RecipeSelector.html)
Object.keys(recipeBook).forEach(recipe => {
    if (recipe !== "molecular_weights") {
        let option = document.createElement("option");
        option.value = recipe;
        option.textContent = recipe.replace(/_/g, " "); // Formatting
        recipeSelect.appendChild(option);
    }
});

// Function to update ingredient list
function updateIngredientList() {
    if (!currentRecipe) return; // When no recipe is selected

    const ingredients = recipeBook[currentRecipe];
    const molecularWeights = recipeBook.molecular_weights;
    const selectedVolume = parseInt(volumeSelect.value); // (mL)

    // Clear previous ingredients and reset overall osmolarity
    recipeList.innerHTML = "";
    let osmolarityIdeal = 0;
    let osmolarityReal = 0;

    // Display description if available
    // Use 'innerHTML' instead of 'textContent' to render HTML <sub> and <sup>
    if (ingredients.description) {
        recipeDescription.innerHTML = ingredients.description;
        recipeDescription.style.display = "block"; // Show the description
    } else {
        recipeDescription.style.display = "none"; // Hide if no description
    }

    // Get entries, discard description, and sort pH to the end
    /*
    .sort() method sorts arrays in-place, based on the value returned by a
    generic comparator function provided by the user:
        return a negative number → a comes before b
        return zero → a and b stay the same
        return a positive number → b comes before a
    Then, under the hood, .sort() applies an efficient sorting algorithm (e.g.,
    Timsort) using that comparison criterium many times to figure out what
    belongs before/after.
    */
    const ingredientEntries = Object.entries(ingredients)
        .filter(([key]) => key !== "description")
        .sort(([keyA, valA], [keyB, valB]) => {
            const isAph = Array.isArray(valA) && valA[0] === "pH";
            const isBph = Array.isArray(valB) && valB[0] === "pH";
        return isAph - isBph;
    });

    // Generate ingredient list
    ingredientEntries.forEach(([ingredient, value]) => {

        // Handle pH value directly (no calculation needed)
        if (Array.isArray(value) && value[0] === "pH") {
            
            let iName = `${ingredient.replace(/_/g, " ")}`;
            let pHText = `${value.join(" ")}`;

            createIngredientElement(iName, pHText, "");

        // Handle liquid ingredients
        } else if (ingredient === "MgCl<sub>2</sub>") {
            let concentration = value; // (mM == mmol/L)
            let iName = `${ingredient.replace(/_/g, " ")}`;
            let iConc = `${concentration} mM`;
            let iVol = `${(concentration * selectedVolume)/2} μL <sub>(2M)</sub>\n${(concentration * selectedVolume)/5} μL <sub>(5M)</sub>`;

            createIngredientElement(iName, iConc, iVol);

            let nFactor = molecularWeights[ingredient][1]; // ideal factor
            let osmoCoeff = molecularWeights[ingredient][2]; // deviation
            osmolarityIdeal += concentration * nFactor;
            osmolarityReal += concentration * nFactor * osmoCoeff;

        // Handle salts (calculate mass if molecular weight exists)
        } else {
            if (molecularWeights[ingredient]) {
                let concentration = value; // (mM == mmol/L)
                let molecularWeight = molecularWeights[ingredient][0]; // (g/mol)
                let mass = (concentration * molecularWeight * selectedVolume); // (μg)
                
                // Convert to g and keep up to 3 meaningful decimal places
                mass = parseFloat((mass * 1e-6).toFixed(3)).toString();

                let iName = `${ingredient.replace(/_/g, " ")}`;
                let iConc = `${concentration} mM`;
                let iMass = `${mass} g`;
                
                createIngredientElement(iName, iConc, iMass);

                let nFactor = molecularWeights[ingredient][1]; // ideal factor
                let osmoCoeff = molecularWeights[ingredient][2]; // deviation
                osmolarityIdeal += concentration * nFactor;
                osmolarityReal += concentration * nFactor * osmoCoeff;
            } else {
                console.warn(`Molecular weight missing for: ${ingredient}`);
            }
        }
    });

    // Show button and update osmolarity display when a recipe is selected
    clearBtn.style.display = "block";
    document.getElementById("ideal-osmo-text").textContent = `Ideal osmolarity: `;
    document.getElementById("ideal-osmo-number").textContent = `${osmolarityIdeal.toFixed(2)} mOsm/L`;
    document.getElementById("real-osmo-text").textContent = `Real osmolarity: `;
    document.getElementById("real-osmo-number").textContent = `${osmolarityReal.toFixed(2)} mOsm/L`;
}

// Function to create ingredient elements with structured layout
function createIngredientElement(iName, iConc, iMass) {
    const div = document.createElement("div");
    div.classList.add("ingredient");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("ingredient-checkbox");

    // 'innerHTML' instead of 'textContent' to render HTML <sub> and <sup>
    const nameSpan = document.createElement("span");
    nameSpan.classList.add("ingredient-name");
    nameSpan.innerHTML = iName;

    const concentrationSpan = document.createElement("span");
    concentrationSpan.classList.add("ingredient-concentration");
    concentrationSpan.textContent = iConc;

    const quantitySpan = document.createElement("span");
    quantitySpan.classList.add("ingredient-quantity");
    quantitySpan.innerHTML = iMass;

    // Append elements
    div.appendChild(checkbox);
    div.appendChild(nameSpan);
    div.appendChild(concentrationSpan);
    div.appendChild(quantitySpan);
    recipeList.appendChild(div);
}

// Handle recipe selection
recipeSelect.addEventListener("change", function() {
    currentRecipe = this.value;
    updateIngredientList();
});

// Handle volume selection (update ingredients)
volumeSelect.addEventListener("change", updateIngredientList);

// Clear all checkboxes
clearBtn.addEventListener("click", function() {
    document.querySelectorAll(".ingredient-checkbox").forEach(checkbox => {
        checkbox.checked = false;
    });
});
