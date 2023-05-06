import {createSidebar, performSearch, createFilterBoxes} from "./helpers.js";

// Define the Firebase database endpoint
const endpoint = "https://periodic-table-json-default-rtdb.europe-west1.firebasedatabase.app/";

// Initialize the application when the window is loaded
window.addEventListener("load", initApp);


// Asynchronously initialize the application
async function initApp() {
  console.log("initApp code is working!");
  // Retrieve the element data from the Firebase database
  const elements = await getElementData();
  // Add an empty element for each element retrieved
  for (const element of elements) {
    addEmptyElement(element);
  }

  const myElements = await getMyElementData();
  console.log(myElements)

  // Create the sidebar
  createSidebar();

  // Create filter boxes
  createFilterBoxes();

}

// Asynchronously retrieve the element data from the Firebase database
async function getElementData() {
  const response = await fetch(`${endpoint}/elements.json`);
  const data = await response.json();
  // Prepare the element data by adding an ID for each element
  const elements = prepareElementData(data);
  return elements;
}

async function getMyElementData(){
  const response = await fetch(`${endpoint}/myElements.json`);
  const data = await response.json();
  const myElements = prepareMyElementData(data);
  return myElements;
}


// Prepare the element data by adding an ID for each element
function prepareElementData(dataObject) {
  const elementDataArray = [];
  for (const key in dataObject) {
    const element = dataObject[key];
    element.id = key;
    elementDataArray.push(element);
  }

  return elementDataArray;
}

function prepareMyElementData(dataObject) {
  const myElementDataArray = [];
  for (const key in dataObject) {
    const myElement = dataObject[key];
    myElementDataArray.push(myElement);
  }
  return myElementDataArray;
}


// Add an empty element to the periodic table for the given element
function addEmptyElement(element) {
  // Retrieve the periodic table element
  const periodicTable = document.querySelector('.periodic-table');
  // Create a new empty element box for the given element
  const emptyElementBox = document.createElement('div');
  emptyElementBox.classList.add('empty-element');
  emptyElementBox.dataset.atomicNumber = element.number;

  // Replace spaces with hyphens in the category name and add it as a class name
  const categoryClassName = element.category.replace(/ /g, '-');
  emptyElementBox.classList.add(categoryClassName);

  // Add the data-group and data-period attributes
  emptyElementBox.dataset.group = element.group;
  emptyElementBox.dataset.period = element.period;

  emptyElementBox.innerHTML = `
  <div class="element-name-main-view hide">${element.name}</div>
  <div class="element-number-main-view">${element.number}</div>
  <div class="element-symbol-main-view hide">${element.symbol}</div>
  <div class="element-mass-main-view">${element.atomic_mass.toFixed(2)}</div>
  `;

  // Set the grid-row and grid-column for the element
  emptyElementBox.style.gridColumn = element.xpos;
  emptyElementBox.style.gridRow = element.ypos;

  // Append the new empty element box to the periodic table
  periodicTable.appendChild(emptyElementBox);

  // Add a click event listener to the new empty element box
  emptyElementBox.addEventListener("click", () => clickElement(emptyElementBox));

  // Define the function to execute when the empty element box is clicked
function clickElement(emptyElement) {
  console.log("clicked");

  const nameElement = emptyElement.querySelector('.element-name-main-view');

  if (nameElement.classList.contains('hide')) {
    showFormView(element, emptyElement);
  } else {
    showDetailView(element);
  }}
}

function showDetailView(element) {
  console.log("detail view")

//open dialog
  const detailView = document.getElementById("detail-view");
  detailView.showModal();

  const descriptionButton = document.getElementById("detail-view-description-button");
  const propertiesButton = document.getElementById("detail-view-properties-button");
  const notesButton = document.getElementById("detail-view-notes-button");

// insert basic element properties
  const detailViewElement = document.getElementById("detail-view-element");
  const categoryClassName = element.category.replace(/ /g, '-');
  detailViewElement.classList.add(categoryClassName);
  detailViewElement.innerHTML = `
    <h2>${element.name}</h2>
    <p>Number: ${element.number}</p>
    <p>Symbol: ${element.symbol}</p>
    <p>Atomic Mass: ${element['atomic_mass']}</p>
  `;

// add click to detail option buttons
  descriptionButton.addEventListener("click", function() {
    displayDescription(element);
  });
  propertiesButton.addEventListener("click", function() {
    displayProperties(element);
  });
  notesButton.addEventListener("click", function() {
    displayNotes(element);
  });

// add summary to description option
  function displayDescription(element) {
    const detailViewDisplay = document.getElementById("detail-view-display");
    detailViewDisplay.innerHTML = `
      <img src="${element.bohr_model_image}" alt="A Bohr model of ${element.name}">
      <p>${element.summary}</p>
    `;
  }

// add property list to properties option
  function displayProperties(element) {
    const detailViewDisplay = document.getElementById("detail-view-display");
    detailViewDisplay.innerHTML = `
      <ul>
        <li>Name: ${element.name}</li>
        <li>Symbol: ${element.symbol}</li>
        <li>Category: ${element.category}</li>
        <li>Atomic Mass: ${element.atomic_mass}</li>
        <li>Appearance: ${element.appearance}</li>
        <li>Density: ${element.density}</li>
        <li>Melting Point: ${element.melting_point}</li>
        <li>Boiling Point: ${element.boiling_point}</li>
        <li>Discovered By: ${element.discovered_by}</li>
        <li>Electronegativity (Pauling): ${element.electronegativity_pauling}</li>
        <li>Molar Heat Capacity: ${element.molar_heat}</li>
      </ul>
    `;
  }

// display note function
  function displayNotes(element) {
    const detailViewDisplay = document.getElementById("detail-view-display");
    document.querySelector("body").addEventListener("submit", saveNoteClicked)
    detailViewDisplay.innerHTML = "";
    detailViewDisplay.innerHTML = `
      <form>
        <input type="text" id="body">
        <button type="submit" id="save-button">Save</button>
      </form>
      `;
      console.log("note display")
  }
  
  function saveNoteClicked(event) {
    event.preventDefault();
    const form = event.target;
    const body = form.body.value

    createNote(body);
    console.log("whhatt?!?")
  }

  async function createNote(body) {
    console.log(element.number-1);
    const updateMyNote = { notes: body };
    const json = JSON.stringify(updateMyNote);
    const noteResponse = await fetch(`${endpoint}/myElements/${element.number-1}.json`, {
      method: "PUT",
      body: json
    });
  
    if (noteResponse.ok) {
      console.log("note created");
      displayNotes();
    }
  }


  closeDetailView();
}

function closeDetailView() {
  const detailView = document.getElementById("detail-view");
  const detailViewDisplay = document.getElementById("detail-view-display")
  detailViewDisplay.innerHTML = "";
  
  detailView.addEventListener("click", (event) => {
    if (event.target === detailView) {
      detailView.close();
    }
  });
}

// 

//


// Show the form view for the given element
function showFormView(element, emptyElement) {
  // Retrieve the dialog element
  const dialog = document.querySelector("dialog");

  // Clear the contents of the dialog element
  dialog.innerHTML = "";
  console.log(element);

  // Show the dialog element
  dialog.showModal();

  // Create input elements for the element name, symbol, and mass
  const inputName = createInputElement("text", "element-name", "Enter the element name");
  const divElementNumber = createDivElement("element-number", element.number);
  const inputSymbol = createInputElement("text", "element-symbol", "Enter the element symbol");
  const divElementMass = createDivElement("element-mass", element.atomic_mass);
  const buttonAddElement = createButtonElement("btn-add-element", "⍻");

  const errorDiv = document.createElement("div");
  errorDiv.classList.add("error-message");
  

function checkInputValues() {
  const inputNameValue = capitalizeFirstLetter(inputName.value.trim());
  const inputSymbolValue = capitalizeFirstLetter(inputSymbol.value.trim());

  errorDiv.textContent = "";

  if (inputNameValue === element.name && inputSymbolValue === element.symbol) {
    const closeDialog = document.querySelector("dialog");
    closeDialog.close();

    const nameElement = emptyElement.querySelector('.element-name-main-view');
    const symbolElement = emptyElement.querySelector('.element-symbol-main-view');

    nameElement.textContent = inputNameValue;
    symbolElement.textContent = inputSymbolValue;

    nameElement.classList.remove('hide');
    symbolElement.classList.remove('hide');
  } else if (inputNameValue !== element.name && inputSymbolValue === element.symbol) {
    errorDiv.textContent = "Name incorrect!";
    inputName.value = "";
    inputName.focus();
  } else if (inputNameValue === element.name && inputSymbolValue !== element.symbol) {
    errorDiv.textContent = "Symbol incorrect!";
    inputSymbol.value = "";
    inputSymbol.focus();
  } else if (inputNameValue !== element.name && inputSymbolValue !== element.symbol) {
    errorDiv.textContent = "Both incorrect!";
    inputName.value = "";
    inputSymbol.value = "";
    inputName.focus();
  }
}


  function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }


  buttonAddElement.addEventListener("click", checkInputValues);

  inputName.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      checkInputValues();
    }
  });

  inputSymbol.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      checkInputValues();
    }
  });

  // Append the input elements and button to the dialog element
  dialog.appendChild(inputName);
  dialog.appendChild(divElementNumber);
  dialog.appendChild(inputSymbol);
  dialog.appendChild(divElementMass);
  dialog.appendChild(buttonAddElement);
  dialog.appendChild(errorDiv);

  // Put cursor into name box, when clicking on an element
  inputName.focus();

  // Close the dialog when the user clicks outside of it
  closeDialog();
}


// Function to close dialog when clicked outside of it
function closeDialog() {
  const dialog = document.querySelector("dialog");

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}

function sortElementsAlphabetically() {
  const searchResultsContainer = document.querySelector(".search-results-container");
  const searchResultItems = Array.from(searchResultsContainer.children);

  searchResultItems.sort((a, b) => {
    const nameA = a.querySelector(".element-name-main-view").textContent;
    const nameB = b.querySelector(".element-name-main-view").textContent;

    return nameA.localeCompare(nameB);
  });

  searchResultItems.forEach((item) => {
    searchResultsContainer.appendChild(item);
  });
}

function sortElementsNumerically() {
  const searchResultsContainer = document.querySelector(".search-results-container");
  const searchResultItems = Array.from(searchResultsContainer.children);

  searchResultItems.sort((a, b) => {
    const numberA = parseInt(a.querySelector(".element-number-main-view").textContent);
    const numberB = parseInt(b.querySelector(".element-number-main-view").textContent);

    return numberA - numberB;
  });

  searchResultItems.forEach((item) => {
    searchResultsContainer.appendChild(item);
  });
}

// Function to create an input element with given type, id and placeholder attributes
function createInputElement(type, id, placeholder) {
  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.placeholder = placeholder;
  return input;
}


// Function to create a div element with given className and textContent
function createDivElement(className, textContent) {
  const div = document.createElement("div");
  div.classList.add(className);
  div.textContent = textContent;
  return div;
}


// Function to create a button element with given id and textContent
function createButtonElement(id, textContent) {
  const button = document.createElement("button");
  button.id = id;
  button.textContent = textContent;
  return button;
}

// detail view setup //

// Get references to the buttons and the detail view display section
const descriptionButton = document.getElementById("detail-view-description-button");
const propertiesButton = document.getElementById("detail-view-properties-button");
const notesButton = document.getElementById("detail-view-notes-button");
const detailViewDisplay = document.getElementById("detail-view-display");

// Add click event listeners to the buttons
descriptionButton.addEventListener("click", () => {
  // Clear the detail view display section
  detailViewDisplay.innerHTML = "";
  
  // Create a new paragraph element with the description text
  const description = document.createElement("p");
  description.textContent = element.description;
  
  // Add the description element to the detail view display section
  detailViewDisplay.appendChild(description);
});

export {createButtonElement, createInputElement, showDetailView, showFormView};