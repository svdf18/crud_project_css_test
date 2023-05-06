import { createInputElement, createButtonElement, showDetailView, showFormView } from "./script.js";

 export function createSidebar() {
  // Create sidebar container
  const sidebar = document.createElement("div");
  sidebar.classList.add("sidebar");

  // Create input fields container
  const inputFieldsContainer = document.createElement("div");
  inputFieldsContainer.classList.add("input-fields-container");

  // Create search results container
  const searchResultsContainer = document.createElement("div");
  searchResultsContainer.classList.add("search-results-container");

  // Create input fields
  const atomicNumberInput = createInputElement("text", "atomic-number", "Atomic Number");
  const elementInput = createInputElement("text", "element", "Element");
  const elementSymbolInput = createInputElement("text", "element-symbol", "Element Symbol");

  // Create search button
  const searchButton = createButtonElement("search-button", "");

  // Create sort dropdown container
  const sortDropdownContainer = document.createElement("div");
  sortDropdownContainer.classList.add("sort-dropdown-container");

  // Create sort label
  const sortLabel = document.createElement("span");
  sortLabel.classList.add("sort-label");
  sortLabel.textContent = "Sort By: ";

  // Create sort dropdown select element
  const sortDropdownSelect = document.createElement("select");
  sortDropdownSelect.classList.add("sort-dropdown-select");

  // Create sort options
  const sortOptions = [
    { value: "alphabetical", label: "Element" },
    { value: "numeric", label: "Atomic number" }
  ];

  sortOptions.forEach((option) => {
    const sortOption = document.createElement("option");
    sortOption.value = option.value;
    sortOption.textContent = option.label;
    sortDropdownSelect.appendChild(sortOption);
  });

  // Add event listener to sort dropdown
  sortDropdownSelect.addEventListener("change", handleSortSelection);

  // Add input fields and search button to input fields container
  inputFieldsContainer.appendChild(atomicNumberInput);
  inputFieldsContainer.appendChild(elementInput);
  inputFieldsContainer.appendChild(elementSymbolInput);
  inputFieldsContainer.appendChild(searchButton);

  // Add sort label and dropdown select to sort dropdown container
  sortDropdownContainer.appendChild(sortLabel);
  sortDropdownContainer.appendChild(sortDropdownSelect);

  // Add input fields container, sort dropdown container, and search results container to sidebar container
  sidebar.appendChild(inputFieldsContainer);
  sidebar.appendChild(sortDropdownContainer);
  sidebar.appendChild(searchResultsContainer);

  // Add live search functionality
  atomicNumberInput.addEventListener("input", () => liveSearch(atomicNumberInput, elementInput, elementSymbolInput));
  elementInput.addEventListener("input", () => liveSearch(atomicNumberInput, elementInput, elementSymbolInput));
  elementSymbolInput.addEventListener("input", () => liveSearch(atomicNumberInput, elementInput, elementSymbolInput));

  // Create toggle button to show/hide sidebar
  const toggleButton = document.createElement("button");
  toggleButton.classList.add("toggle-button");
  const arrow = document.createElement("span");
  arrow.classList.add("arrow");
  toggleButton.appendChild(arrow);
  sidebar.appendChild(toggleButton);

  // Add event listener to toggle button
  toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("show");
    arrow.classList.toggle("up");
  });

  // Add sidebar container and search button event listener to body
  document.body.appendChild(sidebar);
  searchButton.addEventListener("click", performSearch);

  // Function to handle sort selection
  function handleSortSelection() {
    const selectedValue = sortDropdownSelect.value;
    if (selectedValue === "alphabetical") {
      sortElementsAlphabetically();
   
    } else if (selectedValue === "numeric") {
      sortElementsNumerically();
    }
  }

  // Function to sort elements alphabetically
  function sortElementsAlphabetically() {
    const searchResultsContainer = document.querySelector(".search-results-container");
    const searchResultItems = Array.from(searchResultsContainer.querySelectorAll(".search-result-item"));

    searchResultItems.sort((a, b) => {
      const nameA = a.querySelector(".element-name-main-view").textContent.toLowerCase();
      const nameB = b.querySelector(".element-name-main-view").textContent.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    // Clear the search results container
    searchResultsContainer.innerHTML = "";

    // Append the sorted search result items back to the container
    searchResultItems.forEach((item) => {
      searchResultsContainer.appendChild(item);
    });
  }

  // Function to sort elements numerically
  function sortElementsNumerically() {
    const searchResultsContainer = document.querySelector(".search-results-container");
    const searchResultItems = Array.from(searchResultsContainer.querySelectorAll(".search-result-item"));

    searchResultItems.sort((a, b) => {
      const numberA = Number(a.querySelector(".element-number-main-view").textContent);
      const numberB = Number(b.querySelector(".element-number-main-view").textContent);
      return numberA - numberB;
    });

    // Clear the search results container
    searchResultsContainer.innerHTML = "";

    // Append the sorted search result items back to the container
    searchResultItems.forEach((item) => {
      searchResultsContainer.appendChild(item);
    });
  }

   // Add event listener to input fields to clear search results container when input fields are cleared
  atomicNumberInput.addEventListener("input", checkClearSearchResults);
  elementInput.addEventListener("input", checkClearSearchResults);
  elementSymbolInput.addEventListener("input", checkClearSearchResults);

  function checkClearSearchResults() {
    if (atomicNumberInput.value === "" && elementInput.value === "" && elementSymbolInput.value === "") {
      searchResultsContainer.innerHTML = "";
    }
  }
}


export function liveSearch(atomicNumberInput, elementInput, elementSymbolInput) {
  const atomicNumberValue = atomicNumberInput.value.trim();
  const elementValue = elementInput.value.trim().toLowerCase();
  const elementSymbolValue = elementSymbolInput.value.trim();

  const searchResultsContainer = document.querySelector(".search-results-container");
  searchResultsContainer.innerHTML = ""; // Clear previous search results

  // Get all empty elements in the periodic table
  const periodicTable = document.querySelector(".periodic-table");
  const emptyElements = periodicTable.querySelectorAll(".empty-element");

  let resultCount = 0;

  // Loop through empty elements and add matching ones to search results container
  emptyElements.forEach((emptyElement) => {
    const elementName = emptyElement.querySelector(".element-name-main-view").textContent;
    const elementNumber = emptyElement.querySelector(".element-number-main-view").textContent;
    const elementSymbol = emptyElement.querySelector(".element-symbol-main-view").textContent;

    const matchFound =
      (elementValue === "" || elementName.toLowerCase().includes(elementValue)) &&
      (atomicNumberValue === "" || elementNumber.includes(atomicNumberValue)) &&
      (elementSymbolValue === "" || elementSymbol.toLowerCase().includes(elementSymbolValue.toLowerCase()));

    if (matchFound) {
      // If we have reached the maximum number of results, stop adding search result items
      if (resultCount >= 10) {
        return;
      }

      // Clone the emptyElement and append it to the search results container
      const searchResultItem = emptyElement.cloneNode(true);
      searchResultItem.classList.add("search-result-item");
      searchResultsContainer.appendChild(searchResultItem);

      // Add click event listener to the search result item
      searchResultItem.addEventListener("click", () => {
        // Show detail view for the clicked search result item
        showDetailView(emptyElement);
      });

      // Increment the result count
      resultCount++;
    }

    // Set opacity based on whether a match is found and if any search input is provided
    if (atomicNumberValue === "" && elementValue === "" && elementSymbolValue === "") {
      resetEmptyElementsOpacity();
    } else {
      emptyElement.style.opacity = matchFound ? "1" : "0.3";
    }
  });
}

export function resetEmptyElementsOpacity() {
  const periodicTable = document.querySelector(".periodic-table");
  const emptyElements = periodicTable.querySelectorAll(".empty-element");
  emptyElements.forEach((emptyElement) => {
    emptyElement.style.opacity = "1";
  });
}





// Function to reset the display of all empty elements
export function resetEmptyElementsDisplay() {
  const periodicTable = document.querySelector(".periodic-table");
  const emptyElements = periodicTable.querySelectorAll(".empty-element");
  emptyElements.forEach((emptyElement) => {
    emptyElement.style.display = "flex";
    emptyElement.classList.remove("search-result-item-disabled");
  });
}

// Function to perform search on atomic number, element name or element symbol
export function performSearch() {
  const atomicNumberInput = document.getElementById("atomic-number");
  const elementInput = document.getElementById("element");
  const elementSymbolInput = document.getElementById("element-symbol");

  const atomicNumberValue = atomicNumberInput.value.trim();
  const elementValue = elementInput.value.trim().toLowerCase();
  const elementSymbolValue = elementSymbolInput.value.trim();

    const searchResultsContainer = document.querySelector(".search-results-container");
    searchResultsContainer.innerHTML = "";

  // If no input provided, return
  if (atomicNumberValue === "" && elementValue === "" && elementSymbolValue === "") {
    return;
  }

  // Get all empty elements in the periodic table
  const periodicTable = document.querySelector(".periodic-table");
  const emptyElements = periodicTable.querySelectorAll(".empty-element");

  // Loop through empty elements and hide/show them based on input
  emptyElements.forEach((emptyElement) => {
    const elementName = emptyElement.querySelector(".element-name-main-view").textContent;
    const elementNumber = emptyElement.querySelector(".element-number-main-view").textContent;
    const elementSymbol = emptyElement.querySelector(".element-symbol-main-view").textContent;

    if (elementValue !== "" && !elementName.toLowerCase().includes(elementValue)) {
      emptyElement.style.display = "none";
    } else if (atomicNumberValue !== "" && elementNumber !== atomicNumberValue) {
      emptyElement.style.display = "none";
    } else if (elementSymbolValue !== "" && elementSymbol !== elementSymbolValue) {
      emptyElement.style.display = "none";
    } else {
      emptyElement.style.display = "flex";
    }
  });
}
export function createFilterBoxes() {
  const filterContainer = document.createElement("div");
  filterContainer.classList.add("filter-container");

  const categories = [
    { name: "Lanthanide", className: "lanthanide" },
    { name: "Actinide", className: "actinide" },
    { name: "Diatomic Nonmetal", className: "diatomic-nonmetal" },
    { name: "Noble Gas", className: "noble-gas" },
    { name: "Alkaline Earth Metal", className: "alkaline-earth-metal" },
    { name: "Metalloid", className: "metalloid" },
    { name: "Polyatomic Nonmetal", className: "polyatomic-nonmetal" },
    { name: "Alkali Metal", className: "alkali-metal" },
    { name: "Post-Transition Metal", className: "post-transition-metal" },
    { name: "Unknown", className: "unknown" },
    { name: "Probably Transition Metal", className: "probably-transition-metal" },
    { name: "Transition Metal", className: "transition-metal" },
  ];

  let checkedCategories = [];

  for (const category of categories) {
    const filterLabel = document.createElement("label");
    filterLabel.textContent = category.name;
    filterLabel.classList.add("filter-item");

    const filterCheckbox = document.createElement("input");
    filterCheckbox.type = "checkbox";
    filterCheckbox.classList.add("filter-checkbox");
    filterCheckbox.dataset.categoryClass = category.className;

    filterLabel.appendChild(filterCheckbox);
    filterContainer.appendChild(filterLabel);

    filterCheckbox.addEventListener("change", (event) => {
      const categoryClass = event.target.dataset.categoryClass;

      if (event.target.checked) {
        checkedCategories.push(categoryClass);

        for (const element of document.querySelectorAll(`.${categoryClass}`)) {
          element.style.display = "grid";
        }

        for (const uncheckedCategory of categories.filter(c => !checkedCategories.includes(c.className))) {
          for (const element of document.querySelectorAll(`.${uncheckedCategory.className}`)) {
            element.style.display = "none";
          }
        }
      } else {
        checkedCategories = checkedCategories.filter(c => c !== categoryClass);

        if (checkedCategories.length === 0) {
          for (const category of categories) {
            for (const element of document.querySelectorAll(`.${category.className}`)) {
              element.style.display = "grid";
            }
          }
        } else {
          for (const element of document.querySelectorAll(`.${categoryClass}`)) {
            element.style.display = "none";
          }
        }
      }
    });
  }

  document.body.appendChild(filterContainer);
}


function toggleCategoryVisibility(checkbox) {
  const categoryClass = checkbox.dataset.categoryClass;
  const elements = document.querySelectorAll(`.${categoryClass}`);
  const allElements = document.querySelectorAll(".element");

  if (checkbox.checked) {
    for (const element of allElements) {
      if (!element.classList.contains(categoryClass)) {
        element.style.display = "none";
      }
    }
    for (const element of elements) {
      element.style.display = "grid";
    }
  } else {
    for (const element of allElements) {
      element.style.display = "grid";
    }
  }
}
