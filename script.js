"use strict"

const endpoint = "https://periodic-table-json-default-rtdb.europe-west1.firebasedatabase.app/"

window.addEventListener("load", initApp)

async function initApp() {
    const elements = await getElementData();
    for (const element of elements) {
      addEmptyElement(element);
    }
}
  

async function getElementData() {
    const response = await fetch(`${endpoint}/elements.json`);
    const data = await response.json();
    const elements = prepareElementData(data);
    return elements;
}

function prepareElementData(dataObject) {
    const elementDataArray = [];
    for (const key in dataObject) {
        const element = dataObject[key];
        element.id = key;
        elementDataArray.push(element);
    }
   
    return elementDataArray;
}

function addEmptyElement(elementData) {
    const periodicTable = document.querySelector('.periodic-table');
    const element = document.createElement('div');
    element.classList.add('empty-element');
    element.dataset.atomicNumber = elementData.number;
    element.innerHTML = `
                         <div class="atomic-number">${elementData.number}</div>
                        `;
    periodicTable.appendChild(element);
    
    document.querySelector(".empty-element").addEventListener("click", clickElement);
    console.log("clicked")

    function clickElement(){
        showFormView(elementData);
    }
}


function showFormView(elementData) {
    const dialog = document.querySelector("dialog");
    console.log(elementData)

    if (!dialog.open) {
        dialog.showModal(elementData);
        const existingInputs = dialog.querySelectorAll("input");
    if (existingInputs.length === 0) {

  
    const inputName = document.createElement("input");
    inputName.type = "text";
    inputName.id = "element-name";
    inputName.placeholder = "Enter the element name";

    const divElementNumber = document.createElement("div");
    divElementNumber.classList.add("element-number");
    divElementNumber.textContent = elementData.number;
  
    const inputSymbol = document.createElement("input");
    inputSymbol.type = "text";
    inputSymbol.id = "element-symbol";
    inputSymbol.placeholder = "Enter the element symbol";
  
    const divElementMass = document.createElement("div");
    divElementMass.classList.add("element-mass");
    divElementMass.textContent = elementData.atomic_mass;
  
    const buttonAddElement = document.createElement("button");
    buttonAddElement.id = "btn-add-element";
    buttonAddElement.textContent = "⍻";
  
    dialog.appendChild(inputName);
    dialog.appendChild(divElementNumber);
    dialog.appendChild(inputSymbol);
    dialog.appendChild(divElementMass);
    dialog.appendChild(buttonAddElement);

    closeDialog();
    }
}
  
  function closeDialog(){
    const dialog = document.querySelector("dialog");
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
}
}
