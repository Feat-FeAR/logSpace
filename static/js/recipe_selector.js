// JavaScript code for the RecipeSelector shortcode

const recipeSelect = document.getElementById("recipe-select");
const volumeSelect = document.getElementById("volume-select");
const recipeDescription = document.getElementById("recipe-description");
const recipeList = document.getElementById("recipe-list");
const clearBtn = document.getElementById("clear-btn");

let currentRecipe = null; // Store the selected recipe

// Populate recipe dropdown
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
    if (!currentRecipe) return;

    const ingredients = recipeBook[currentRecipe];
    const molecularWeights = recipeBook.molecular_weights;
    const selectedVolume = parseInt(volumeSelect.value) / 1e3; // in L

    recipeList.innerHTML = ""; // Clear previous ingredients

    // Display description if available
    if (ingredients.description) {
        recipeDescription.textContent = ingredients.description;
        recipeDescription.style.display = "block"; // Show the description
    } else {
        recipeDescription.style.display = "none"; // Hide if no description
    }
    
    // Generate ingredient list
    Object.entries(ingredients).forEach(([ingredient, values]) => {
        if (ingredient === "description") return; // Skip description key
        
        // Handle pH values directly (no calculation needed)
        if (Array.isArray(values) && values[0] === "pH") {
            let iName = `${ingredient.replace(/_/g, " ")}`;
            let pHText = `${values.join(" ")}`;
            createIngredientElement(iName, pHText, "");
        } else {
            // Calculate mass if molecular weight exists
            if (molecularWeights[ingredient]) {
                let concentration = values; // in mM == mmol/L
                let molecularWeight = molecularWeights[ingredient]; // g/mol
                let mass = (concentration * molecularWeight * selectedVolume);
                
                // Convert to g and keep up to 3 meaningful decimal places
                mass = parseFloat((mass / 1e3).toFixed(3)).toString();

                let iName = `${ingredient.replace(/_/g, " ")}`;
                let iConc = `${concentration} mM`;
                let iMass = `${mass} g`;
                createIngredientElement(iName, iConc, iMass);
            } else {
                console.warn(`Molecular weight missing for: ${ingredient}`);
            }
        }
    });

    // Show button when a recipe is selected
    clearBtn.style.display = "block";
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
    quantitySpan.textContent = iMass;

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
