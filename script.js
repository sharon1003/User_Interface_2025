// === MODEL: Data Storage ===
let availableBeverages = DB.slice(0, 10); //only 10 first items to keep it simple
let orderList = [];

//Undo & redo: lists of action objects, that store execute(), unexecute(), and reexecute() functions
let undoStack = [];
let redoStack = [];

// === VIEW: Update UI ===
function updateView() {
    console.log("Updating view");
    // Display available beverages
    let beverageContainer = document.getElementById("beverage-container"); // Get the beverage container and turn it into a div with the class beverage card and id beverage-(index)
    beverageContainer.innerHTML = availableBeverages.map((beverage, index) =>
        `<div id="beverage-${index}" class="beverage-card" draggable="true"
              data-name="${beverage.name}" data-price="${beverage.priceinclvat}"
              ondragstart="drag(event)">
            <h2>${beverage.name}</h2>
            <p><strong>Price:</strong> ${beverage.priceinclvat} SEK</p>
        </div>`
    ).join('');

    // Display order list
    let orderContainer = document.getElementById("order-list"); // Get the order list
    orderContainer.innerHTML = orderList.map(beverage => // for each element in orderList make a li element
        `<li><strong>${beverage.name}</strong> - ${beverage.priceinclvat} SEK</li>`
    ).join('');
}

// === CONTROLLER ===

// Handle Undo & Redo 
function doit(action) {
    action.execute();
    undoStack.push(action);
    redoStack = [];   
}

function undoit() {
    action = undoStack.pop();
    action.unexecute();
    redoStack.push(action);
}

function redoit() {
    action = redoStack.pop();
    action.reexecute();
    undoStack.push(action);
}

// Handle Drag & Drop
function allowDrop(ev) {
    ev.preventDefault(); //Stop drop from working so we can implement it ourselves
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id); //Saves ID from dragged object in the dataTransfer
    console.log("drag");
}

function drop(ev) {
    ev.preventDefault(); // prevents default drop from working
    
    let beverageId = ev.dataTransfer.getData("text"); //
    let beverageIndex = beverageId.split('-')[1]; // Extract index from id
    console.log(beverageId, beverageIndex);

    if (beverageIndex !== undefined && availableBeverages[beverageIndex]) {
        let selectedBeverage = availableBeverages[beverageIndex];

        let action = {
            execute: function() {
                orderList.push(selectedBeverage);
                updateView();
            },
            unexecute: function () { 
                orderList.pop(); //removes last order
                updateView();
            },
        
            reexecute: function () { 
                orderList.push(selectedBeverage);
                updateView();
            }
        };
        // add item to order
        doit(action);
    }
}

// === INIT === set eventlisteners 
document.addEventListener("DOMContentLoaded", updateView);
document.getElementById("undo-button").addEventListener("click", undoit);
document.getElementById("redo-button").addEventListener("click", redoit);