// === MODEL: Data Storage ===

let availableBeverages = [] 
let orderList = [];

//Undo & redo: lists of action objects, that store execute(), unexecute(), and reexecute() functions
let undoStack = [];
let redoStack = [];

let categoryItems = {
    // Italien: [],
    // Slovenien: [],
    // Sverige: []
    Wine: [],
    Beer: [],
    Spirit: [],
    Cocktail: []
}

function classifyDrink(category) {
    if (category.toLowerCase().includes("vin")) {
        return "Wine";
    } else if (category.toLowerCase().includes("\u00c3\u2013l") ||
               category.toLowerCase().includes("lager") ||
               category.toLowerCase().includes("ale") ||
               category.toLowerCase().includes("stout") ||
               category.toLowerCase().includes("porter") ) {
        return "Beer";
    } else if (category.toLowerCase().includes("Vodka") ||
                category.toLowerCase().includes("sprit") ||
                category.toLowerCase().includes("Tequila") ||
                category.toLowerCase().includes("Rum") ||
                category.toLowerCase().includes("Brandy") ||
                category.toLowerCase().includes("Whisky") ) {
        return "Spirit";
    } else if (category.toLowerCase().includes("cocktail") ||
                category.toLowerCase().includes("blanddryck")) {
        return "Cocktail";
    } else {
        return "Unkown";
    }
}

// 測試範例
let categories = [
    "Rött vin",
    "Vitt vin, Sött",
    "Rosévin",
    "Vin av flera typer",
    "Öl",
    "Cocktail"
];

let results = categories.map(cat => ({ category: cat, type: classifyDrink(cat) }));

console.log(results);

function switchCategory(category) {
    document.querySelectorAll(".tab-content").forEach(c => c.style.display = 'none');
    document.getElementById(category).style.display = 'flex';
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.tab-btn[data-category="${category}"]`).classList.add("active");
}

function updateView() {
    fetch('../data/Beverages_eng.js')
        .then(response => response.json())
        .then(data => {
            // categoryItems.Italien = data.filter(item => item.countryoforiginlandname === 'Italien');
            // categoryItems.Slovenien = data.filter(item => item.countryoforiginlandname === 'Slovenien');
            // categoryItems.Sverige = data.filter(item => item.countryoforiginlandname === 'Sverige');
            
            data.forEach(item => {
                item.drinkType = classifyDrink(item.catgegory);
            });
            categoryItems.Wine = data.filter(item => item.drinkType === 'Wine');
            categoryItems.Beer = data.filter(item => item.drinkType === 'Beer');
            categoryItems.Spirit = data.filter(item => item.drinkType === 'Spirit');
            categoryItems.Cocktail = data.filter(item => item.drinkType === 'Cocktail');
            console.log(categoryItems);
            Object.keys(categoryItems).forEach(cat => renderCategory(cat, categoryItems[cat]));
        });
}

function renderCategory(category, items) {
    const container = document.getElementById(category);
    container.innerHTML = items.map((item, index) =>
        `<div id="${category}-${index}" class="beverage-card" draggable="true"
             data-name="${item.name}" ondragstart="drag(event)" data-price="${item.priceinclvat}">
            <h2>${item.name}</h2>
            <p><strong>Price:</strong> ${item.priceinclvat} SEK</p>
                <div class="quantity-selector">
                    <button class="quantity-btn decrement">-</button>
                    <span class="quantity-number">1</span>
                    <button class="quantity-btn increment">+</button>
                </div>
            <button class="add-to-cart-btn" onclick="addToCart('${item.name}', ${item.priceinclvat}, this)">Add to Cart</button>
        </div>`
    ).join('');
    attachQuantityListeners();
}

document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        switchCategory(btn.dataset.category);
    });
});




// === VIEW: Update UI ===
// function updateView() {
//     console.log("Updating view");
//     let beverageContainer = document.getElementById("beverage-container"); // Get the beverage container and turn it into a div with the class beverage card and id beverage-(index)
    
//     fetch('../data/Beverages_eng.js')
//         .then((response) => response.json())
//         .then((data => {
//         availableBeverages = data.slice(0, 100);
        
//         // Display available beverages
//         beverageContainer.innerHTML = availableBeverages.map((beverage, index) =>
//             `<div id="beverage-${index}" class="beverage-card" draggable="true"
//                   data-name="${beverage.name}" data-price="${beverage.priceinclvat}"
//                   ondragstart="drag(event)">
//                 <h2>${beverage.name}</h2>
//                 <p><strong>Price:</strong> ${beverage.priceinclvat} SEK</p>
//                 <div class="quantity-selector">
//                     <button class="quantity-btn decrement">-</button>
//                     <span class="quantity-number">1</span>
//                     <button class="quantity-btn increment">+</button>
//                 </div>
//                 <div class="add-to-cart-btn">
//                     <button class="add-to-cart-btn" onclick="addToCart('${beverage.name}', ${beverage.priceinclvat}, this)">Add to Cart</button>
//                 </div>
//             </div>`
//         ).join('');

//         attachQuantityListeners();
//     }));
// }

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

// function drag(ev) {
//     console.log(ev)
//     const card = ev.target.closest(".beverage-card");
//     const quantity = parseInt(card.querySelector(".quantity-number").textContent);
//     const category = card.closest(".tab-content").id; // 取得當前 tab (Italien, Slovenien, Sverige)

//     ev.dataTransfer.setData("text/plain", JSON.stringify({
//         name: card.getAttribute("data-name"),
//         price: parseFloat(card.getAttribute("data-price")),
//         quantity: quantity,
//         category: category
//     }));
//     console.log("Dragging:", card.getAttribute("data-name"), "Qty:", quantity, "Category:", category);
// }


function drag(ev) {
    // console.log(ev)
    // ev.dataTransfer.setData("text", ev.target.id); //Saves ID from dragged object in the dataTransfer
    console.log("drag");

    const card = ev.target.closest(".beverage-card"); // 確保取得正確的卡片
    const name = card.getAttribute("data-name");
    const price = card.getAttribute("data-price");
    const category = card.closest(".tab-content").id; // 確保取得當前 tab (Italien, Slovenien, Sverige)
    ev.dataTransfer.setData("text", JSON.stringify({ name, price, category }));
    console.log("Dragging:", name, "Price:", price, "Category:", category);

}

function drop(ev) {
    ev.preventDefault(); // prevents default drop from working
    
    // let beverageId = ev.dataTransfer.getData("text"); //
    // let category = beverageId.split('-')[0];
    // let beverageIndex = beverageId.split('-')[1]; // Extract index from id

    let data = JSON.parse(ev.dataTransfer.getData("text/plain")); // 解析 JSON
    console.log("Dropped:", data);


    let { name, price, category } = data; // 取出數據

    let existingItem = categoryItems[category].find(item => item.name === name);
    console.log(existingItem);
    if (existingItem) {
        console.log("Exisit")
        let temp_name = existingItem.name;
        let temp_priceinclvat = existingItem.priceinclvat;
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

    // if (beverageIndex !== undefined && availableBeverages[beverageIndex]) {
    //     let selectedBeverage = availableBeverages[beverageIndex];
    //     let temp_name = selectedBeverage.name;
    //     let temp_priceinclvat = selectedBeverage.priceinclvat;
    //     let quantity = 1; // 預設數量為 1

    //     let action = {
    //         execute: function() {
    //             // orderList.push(selectedBeverage);
    //             let exitingItem = orderList.find(item => item.name === temp_name);
    //             if (exitingItem) {
    //                 exitingItem.quantity += quantity;
    //             } else {
    //                 orderList.push({name:temp_name, priceinclvat:temp_priceinclvat, quantity});
    //             }
    //             renderCart();
    //             // updateView();
    //         },
    //         unexecute: function () { 
    //             // orderList.pop(); //removes last order
    //             let exitingItem = orderList.find(item => item.name === temp_name);
    //             if (exitingItem) {
    //                 exitingItem.quantity -= quantity;
    //                 if (exitingItem.quantity <= 0) {
    //                     orderList = orderList.filter(item => item.name !== temp_name);
    //                 }
    //             }
    //             renderCart();
    //             // updateView();
    //         },
        
    //         reexecute: function () { 
    //             // orderList.push(selectedBeverage);
    //             let exitingItem = orderList.find(item => item.name === temp_name);
    //             if (exitingItem) {
    //                 exitingItem.quantity += quantity;
    //             } else {
    //                 orderList.push({
    //                     name: temp_name,
    //                     priceinclvat: temp_priceinclvat,
    //                     quantity: quantity
    //                 });
    //             }
    //             renderCart();
    //             // updateView();
    //         }
    //     };        
    //     // add item to order
    //     doit(action);
    // }
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
}

function renderCart() {
    const cartList = document.getElementById("cart-list");
    const totalDisplay = document.getElementById("cart-total");
    let total = 0;
    console.log(totalDisplay);
    cartList.innerHTML = orderList.slice().reverse().map(item => {
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
    updateCartTotal(total); //Cause data-i18n will effect the appearance
}

function updateCartTotal(total) {
    const totalElement = document.getElementById("cart-total");

    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    }
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
document.addEventListener("DOMContentLoaded", () => {
    switchCategory('Beer');
    updateView();
});
// document.addEventListener("DOMContentLoaded", updateView);
document.getElementById("undo-button").addEventListener("click", undoit);
document.getElementById("redo-button").addEventListener("click", redoit);