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

function addEmptyElement(element) {
    const periodicTable = document.querySelector('.periodic-table');
    const emptyElementBox = document.createElement('div');
    emptyElementBox.classList.add('empty-element');
    emptyElementBox.dataset.atomicNumber = element.number;
    emptyElementBox.innerHTML = `
                         <div class="atomic-number">${element.number}</div>
                        `;
    periodicTable.appendChild(emptyElementBox);
    
    emptyElementBox.addEventListener("click", clickElement);
    

    function clickElement(){
        console.log("clicked")
        showFormView(element);
    }
}


function showFormView(element) {
    const dialog = document.querySelector("dialog");
    dialog.innerHTML = "";
    console.log(element)

    dialog.showModal(element);
  
    const inputName = createInputElement("text", "element-name", "Enter the element name");
    const divElementNumber = createDivElement("element-number", element.number);
    const inputSymbol = createInputElement("text", "element-symbol", "Enter the element symbol");
    const divElementMass = createDivElement("element-mass", element.atomic_mass);
    const buttonAddElement = createButtonElement("btn-add-element", "⍻");
    
    dialog.appendChild(inputName);
    dialog.appendChild(divElementNumber);
    dialog.appendChild(inputSymbol);
    dialog.appendChild(divElementMass);
    dialog.appendChild(buttonAddElement);
    
    function createInputElement(type, id, placeholder) {
        const input = document.createElement("input");
        input.type = type;
        input.id = id;
        input.placeholder = placeholder;
        return input;
    }
    
    function createDivElement(className, textContent) {
        const div = document.createElement("div");
        div.classList.add(className);
        div.textContent = textContent;
        return div;
    }
    
    function createButtonElement(id, textContent) {
        const button = document.createElement("button");
        button.id = id;
        button.textContent = textContent;
        return button;
    }
        
    closeDialog();
}
  
function closeDialog(){
    const dialog = document.querySelector("dialog");

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
    }});
}
