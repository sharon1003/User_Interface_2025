// === MODEL: Data Storage ===

let availableBeverages = [] 
let orderList = [];

//Undo & redo: lists of action objects, that store execute(), unexecute(), and reexecute() functions
let undoStack = [];
let redoStack = [];


// === VIEW: Update UI ===
function updateView() {
    console.log("Updating view");
    let beverageContainer = document.getElementById("beverage-container"); // Get the beverage container and turn it into a div with the class beverage card and id beverage-(index)
    
    fetch('../data/Beverages_eng.js')
        .then((response) => response.json())
        .then((data => {
        availableBeverages = data.slice(0, 100);
        
        // Display available beverages
        beverageContainer.innerHTML = availableBeverages.map((beverage, index) =>
            `<div id="beverage-${index}" class="beverage-card" draggable="true"
                  data-name="${beverage.name}" data-price="${beverage.priceinclvat}"
                  ondragstart="drag(event)">
                <h2>${beverage.name}</h2>
                <p><strong>Price:</strong> ${beverage.priceinclvat} SEK</p>
                <div class="quantity-selector">
                    <button class="quantity-btn decrement">-</button>
                    <span class="quantity-number">1</span>
                    <button class="quantity-btn increment">+</button>
                </div>
                <div class="add-to-cart-btn">
                    <button class="add-to-cart-btn" onclick="addToCart('${beverage.name}', ${beverage.priceinclvat}, this)">Add to Cart</button>
                </div>
            </div>`
        ).join('');

        attachQuantityListeners();
    }));

    // <label>Quantity: <input type="number" min="1" value="1" style="width:40px;"></label>


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
        let temp_name = selectedBeverage.name;
        let temp_priceinclvat = selectedBeverage.priceinclvat;
        let quantity = 1; // 預設數量為 1

        let action = {
            execute: function() {
                // orderList.push(selectedBeverage);
                let exitingItem = orderList.find(item => item.name === temp_name);
                if (exitingItem) {
                    exitingItem.quantity += quantity;
                } else {
                    orderList.push({name:temp_name, priceinclvat:temp_priceinclvat, quantity});
                }
                renderCart();
                // updateView();
            },
            unexecute: function () { 
                // orderList.pop(); //removes last order
                let exitingItem = orderList.find(item => item.name === temp_name);
                if (exitingItem) {
                    exitingItem.quantity -= quantity;
                    if (exitingItem.quantity <= 0) {
                        orderList = orderList.filter(item => item.name !== temp_name);
                    }
                }
                renderCart();
                // updateView();
            },
        
            reexecute: function () { 
                // orderList.push(selectedBeverage);
                let exitingItem = orderList.find(item => item.name === temp_name);
                if (exitingItem) {
                    exitingItem.quantity += quantity;
                } else {
                    orderList.push({
                        name: temp_name,
                        priceinclvat: temp_priceinclvat,
                        quantity: quantity
                    });
                }
                renderCart();
                // updateView();
            }
        };        
        // add item to order
        doit(action);
    }
}

// Add beverage to order list
function addToCart(name, price, btnElement) {    
    const card = btnElement.closest(".beverage-card");
    const quantity = parseInt(card.querySelector(".quantity-number").textContent);

    console.log(typeof name);
    console.log(name, price, quantity);
    let action = {
        execute: function () {
            let existingItem = orderList.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                orderList.push({name, priceinclvat:price, quantity});
            }
            renderCart();
        },
        unexecute: function () {
            let existingItem = orderList.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity -= quantity;
                if (existingItem.quantity <= 0) {
                    orderList = orderList.filter(item => item.name !== name);
                }
            }
            renderCart();
        },
        reexecute: function() {
            let existingItem = orderList.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                orderList.push({name, priceinclvat:price, quantity});
            }
            renderCart();
        }

    }
    doit(action);


    // const exitingItem = orderList.find(item => item.name === name);
    // if (exitingItem) {
    //     exitingItem.quantity += quantity;
    // } else {
    //     orderList.push({name, priceinclvat:price, quantity});
    // }
    // renderCart();

}

function renderCart() {
    const cartList = document.getElementById("cart-list");
    const totalDisplay = document.getElementById("cart-total");
    let total = 0;
    // console.log(orderList.priceinclvat);
    cartList.innerHTML = orderList.map(item => {
        console.log(item);
        const itemTotal = item.priceinclvat * item.quantity;
        total += itemTotal;
        return `<div class="cart-item">
                <span>${item.name}</span>
                    <div class="quantity-selector">
                        <button class="quantity-btn decrement" onclick="updateCartQuantity('${item.name}', -1)">-</button>
                        <span class="quantity-number">${item.quantity}</span>
                        <button class="quantity-btn increment" onclick="updateCartQuantity('${item.name}', 1)">+</button> 
                    </div>
                </div>`;
    }).join('');
    totalDisplay.textContent = total.toFixed(2);
}

function updateCartQuantity(name, change) {
    let item = orderList.find(i => i.name === name);
    if (item) {
        let prevQuantity = item.quantity;
        let newQuantity = item.quantity + change;
        console.log(newQuantity);
        let action = {
            execute: function () {
                item.quantity = newQuantity;
                if (item.quantity <= 0) {
                    orderList = orderList.filter(i => i.name !== name);
                }
                renderCart();
            },
            unexecute: function () {
                let existingItem = orderList.find(i => i.name === name);
                if (existingItem) {
                    existingItem.quantity = prevQuantity;
                } else {
                    orderList.push({
                        name: name,
                        priceinclvat: item.priceinclvat,
                        quantity: prevQuantity
                    });
                }
                renderCart();
            },
            reexecute: function () {
                let existingItem = orderList.find(i => i.name === name);
                if (existingItem) {
                    existingItem.quantity = newQuantity;
                    if (existingItem.quantity <= 0) {
                        orderList = orderList.filter(i => i.name !== name);
                    }
                } else {
                    orderList.push({
                        name: name,
                        priceinclvat: item.priceinclvat,
                        quantity: newQuantity
                    });
                }
                renderCart();
            }
        };
        doit(action); 

        // item.quantity += change;
        // if (item.quantity <= 0) {
        //     orderList = orderList.filter(i => i.name !== name);
        // }
    }
    renderCart();
}

// Attach event listeners to quantity buttons
function attachQuantityListeners() {
    document.querySelectorAll(".beverage-card").forEach( card => {
        let pricePerItem = parseFloat(card.getAttribute("data-price"));
        let quantity = 1;
        let quantityDisplay = card.querySelector(".quantity-number");
        let incrementBtn = card.querySelector(".increment");
        let decrementBtn = card.querySelector(".decrement");

        incrementBtn.addEventListener("click", () => {
            quantity++;
            quantityDisplay.textContent = quantity;
        });

        decrementBtn.addEventListener("click", () => {
            if (quantity > 1) {
                quantity--;
                quantityDisplay.textContent = quantity;
            }
        });

    });
}



// === INIT === set eventlisteners 
document.addEventListener("DOMContentLoaded", updateView);
document.getElementById("undo-button").addEventListener("click", undoit);
document.getElementById("redo-button").addEventListener("click", redoit);