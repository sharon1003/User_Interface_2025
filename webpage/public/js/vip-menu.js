// === MODEL: Data Storage ===

let availableBeverages = [] 
let orderList = [];

//Undo & redo: lists of action objects, that store execute(), unexecute(), and reexecute() functions
let undoStack = [];
let redoStack = [];

let categoryItems = {
    Wine: [],
    Beer: [],
    Spirit: [],
    Cocktail: [],
    Food: []
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

function switchCategory(category) {
    document.querySelectorAll(".tab-content").forEach(c => c.style.display = 'none');
    document.getElementById(category).style.display = 'flex';
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.tab-btn[data-category="${category}"]`).classList.add("active");
}



function updateView() {
    Promise.all([
        fetch('../data/Beverages_eng.js').then(res => res.json()),
        fetch('../data/food.js').then(res => res.json())
    ])
    .then(([drinks, foods]) => {

        drinks.forEach(item => {
            item.drinkType = classifyDrink(item.catgegory);
        });

        categoryItems.Wine = drinks.filter(item => item.drinkType === 'Wine'),
        categoryItems.Beer = drinks.filter(item => item.drinkType === 'Beer'),
        categoryItems.Spirit = drinks.filter(item => item.drinkType === 'Spirit'),
        categoryItems.Cocktail = drinks.filter(item => item.drinkType === 'Cocktail'),
        categoryItems.Food = foods

        console.log(categoryItems);

        Object.keys(categoryItems).forEach(cat => renderCategory(cat, categoryItems[cat]));
    });
}

function renderCategory(category, items) {
    const container = document.getElementById(category);

    container.innerHTML = items.map((item, index) =>
        `<div id="${category}-${index}" class="beverage-card" draggable="true"
             data-name="${item.name}" ondragstart="drag(event)" data-price="${item.priceinclvat}">
            <img src="${item.image || '../public/images/drinks/corona.png'}" alt="${item.name}">
            <h2>${item.name}</h2>
            <p><strong>Price:</strong> ${item.priceinclvat} SEK</p>
                <div class="quantity-selector">
                    <button class="quantity-btn decrement">-</button>
                    <span class="quantity-number">1</span>
                    <button class="quantity-btn increment">+</button>
                </div>
                <div class="card-footer">
                    <button class="add-to-cart-btn" onclick="addToCart('${item.name}', ${item.priceinclvat}, this)">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
        </div>`
    ).join('');
    attachQuantityListeners();
}

document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        switchCategory(btn.dataset.category);
    });
});


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
    updateCartTotal(total); //Cause data-i18n will effect the appear
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