"use strict";

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

  // Create the sidebar
  createSidebar();
}

// Asynchronously retrieve the element data from the Firebase database
async function getElementData() {
  const response = await fetch(`${endpoint}/elements.json`);
  const data = await response.json();
  // Prepare the element data by adding an ID for each element
  const elements = prepareElementData(data);
  return elements;
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

// Add an empty element to the periodic table for the given element
function addEmptyElement(element) {
  // Retrieve the periodic table element
  const periodicTable = document.querySelector('.periodic-table');
  // Create a new empty element box for the given element
  const emptyElementBox = document.createElement('div');
  emptyElementBox.classList.add('empty-element');
  emptyElementBox.dataset.atomicNumber = element.number;
  emptyElementBox.innerHTML = `
    <div class="atomic-number">${element.number}</div>
  `;
  // Append the new empty element box to the periodic table
  periodicTable.appendChild(emptyElementBox);

  // Add a click event listener to the new empty element box
  emptyElementBox.addEventListener("click", clickElement);

  // Define the function to execute when the empty element box is clicked
  function clickElement() {
    console.log("clicked");
    // Show the form view for the given element
    showFormView(element);
  }
}

// Show the form view for the given element
function showFormView(element) {
  // Retrieve the dialog element
  const dialog = document.querySelector("dialog");
  // Clear the contents of the dialog element
  dialog.innerHTML = "";
  console.log(element);

  // Show the dialog element
  dialog.showModal(element);

  // Create input elements for the element name, symbol, and mass
  const inputName = createInputElement("text", "element-name", "Enter the element name");
  const divElementNumber = createDivElement("element-number", element.number);
  const inputSymbol = createInputElement("text", "element-symbol", "Enter the element symbol");
  const divElementMass = createDivElement("element-mass", element.atomic_mass);
  const buttonAddElement = createButtonElement("btn-add-element", "⍻");

  // Append the input elements and button to the dialog element
  dialog.appendChild(inputName);
  dialog.appendChild(divElementNumber);
  dialog.appendChild(inputSymbol);
  dialog.appendChild(divElementMass);
  dialog.appendChild(buttonAddElement);

  // Close the dialog when the user clicks outside of it
  closeDialog();
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

// Function to close dialog when clicked outside of it
function closeDialog() {
const dialog = document.querySelector("dialog");

dialog.addEventListener("click", (event) => {
if (event.target === dialog) {
dialog.close();
}
});
}

// Function to create a sidebar with input fields and search button
function createSidebar() {
// Create sidebar container
const sidebar = document.createElement("div");
sidebar.classList.add("sidebar");

// Create input fields
const atomicNumberInput = createInputElement("text", "atomic-number", "Atomic Number");
const elementInput = createInputElement("text", "element", "Element");
const elementNumberInput = createInputElement("text", "element-number", "Element Number");

// Create search button
const searchButton = createButtonElement("search-button", "Search");

// Add input fields and search button to sidebar container
sidebar.appendChild(atomicNumberInput);
sidebar.appendChild(elementInput);
sidebar.appendChild(elementNumberInput);
sidebar.appendChild(searchButton);

// Create toggle button to show/hide sidebar
const toggleButton = document.createElement("button");
toggleButton.classList.add("toggle-button");
const arrow = document.createElement("span");
arrow.classList.add("arrow");
toggleButton.appendChild(arrow);
document.body.appendChild(toggleButton);

// Add event listener to toggle button
toggleButton.addEventListener("click", () => {
sidebar.classList.toggle("show");
arrow.classList.toggle("up");
});

// Add sidebar container and search button event listener to body
document.body.appendChild(sidebar);
searchButton.addEventListener("click", () => {
// Get input field values
const atomicNumberValue = atomicNumberInput.value;
const elementValue = elementInput.value;
const elementNumberValue = elementNumberInput.value;


// Perform search logic here

// Get all empty elements in periodic table
    const periodicTable = document.querySelector(".periodic-table");
    const emptyElements = periodicTable.querySelectorAll(".empty-element");

    // Loop through empty elements and hide/show them based on search criteria
    emptyElements.forEach((emptyElement) => {
      const atomicNumber = emptyElement.dataset.atomicNumber;
      const elementName = emptyElement.querySelector(".element-name").textContent;
      const elementNumber = emptyElement.querySelector(".element-number").textContent;

      if (
        (atomicNumberValue && atomicNumberValue !== atomicNumber) ||
        (elementValue && !elementName.toLowerCase().includes(elementValue.toLowerCase())) ||
        (elementNumberValue && elementNumberValue !== elementNumber)
      ) {
        emptyElement.style.display = "none";
      } else {
        emptyElement.style.display = "flex";
      }
    });
  });

// This function creates a new HTML input element with a specified type, id and placeholder
function createInputElement(type, id, placeholder) {

  // create a new input element
  const input = document.createElement("input"); 

  // set the input element's type to the provided type argument
  input.type = type; 

  // set the input element's id to the provided id argument
  input.id = id; 

  // set the input element's placeholder to the provided placeholder argument
  input.placeholder = placeholder;

  // return the newly created input element
  return input; 
}

// This function creates a new HTML button element with a specified id and text content
function createButtonElement(id, textContent) {

  // create a new button element
  const button = document.createElement("button"); 

  // set the button element's id to the provided id argument
  button.id = id; 

  // set the button element's text content to the provided textContent argument
  button.textContent = textContent;

  // return the newly created button element
  return button; 
}
}