// JavaScript code for the RecipeSelector shortcode

const recipeSelect = document.getElementById("recipe-select");
const volumeSelect = document.getElementById("volume-select");
const recipeDescription = document.getElementById("recipe-description");
const recipeList = document.getElementById("recipe-list");
const clearBtn = document.getElementById("clear-btn");

let currentRecipe = null; // Store the selected recipe

// Populate recipe dropdown
Object.keys(recipeBook).forEach(recipe => {
    let option = document.createElement("option");
    option.value = recipe;
    option.textContent = recipe.replace("_", " "); // Formatting
    recipeSelect.appendChild(option);
});

// Function to update ingredient list
function updateIngredientList() {
    if (!currentRecipe) return;

    const ingredients = recipeBook[currentRecipe];
    const selectedVolume = parseInt(volumeSelect.value);
    const scaleFactor = selectedVolume / 500; // Scale relative to 500 mL

    recipeList.innerHTML = ""; // Clear previous ingredients

    // Display description if available
    if (ingredients.description) {
        recipeDescription.textContent = ingredients.description;
        recipeDescription.style.display = "block"; // Show the description
    } else {
        recipeDescription.style.display = "none"; // Hide if no description
    }
    
    // Generate ingredient list
    Object.keys(ingredients).forEach(ingredient => {
        if (ingredient === "description") return; // Skip description key

        let values = [...ingredients[ingredient]]; // Copy array to avoid modifying original

        // If the ingredient has a quantity (3rd element in the array), scale it
        if (values.length >= 3 && typeof values[2] === "number") {
            // Scale and keep up to 3 meaningful decimal places
            values[2] = parseFloat((values[2] * scaleFactor).toFixed(3)).toString();
        }
        
        // Create elements for structured layout
        const div = document.createElement("div");
        div.classList.add("ingredient");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("ingredient-checkbox");

        // 'innerHTML' to render HTML <sub> and <sup> properly
        const nameSpan = document.createElement("span");
        nameSpan.classList.add("ingredient-name");
        nameSpan.innerHTML = ingredient.replace("_", " ");

        const concentrationSpan = document.createElement("span");
        concentrationSpan.classList.add("ingredient-concentration");
        concentrationSpan.textContent = values.slice(0, 2).join(" ");

        const quantitySpan = document.createElement("span");
        quantitySpan.classList.add("ingredient-quantity");
        quantitySpan.textContent = values.slice(2).join(" ");

        // Append elements
        div.appendChild(checkbox);
        div.appendChild(nameSpan);
        div.appendChild(concentrationSpan);
        div.appendChild(quantitySpan);
        recipeList.appendChild(div);
    });

    // Show button when a recipe is selected
    clearBtn.style.display = "block";
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
    