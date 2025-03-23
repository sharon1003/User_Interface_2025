import Model from "./menu_model.js";

export default class ViewMenu {
    constructor() {
        // Select UI elements
        this.categoryContainers = document.querySelectorAll(".tab-content");
        this.categoryButtons = document.querySelectorAll(".tab-btn");
        this.cartContainer = document.getElementById("cart-list");

        // event listener for cart and undo/redo buttons
        document.body.addEventListener("click", (event) => {
            if (event.target.classList.contains("add-to-cart-btn")) {
                this.handleAddToCart(event);
            } else if (event.target.classList.contains("increment") || event.target.classList.contains("decrement")) {
                this.handleQuantityChange(event);
            } else if (event.target.id === "undo-button") {
                this.controller.undo();
            } else if (event.target.id === "redo-button") {
                this.controller.redo();
            }
        });

        this.attachFilterListener(); // filter event listeners
        this.attachCheckoutListener(); // checkout event listener


        // drag & drop
        document.body.addEventListener("dragstart", this.handleDragStart);
        document.body.addEventListener("dragover", this.handleDragOver);
        document.body.addEventListener("drop", this.handleDrop);

    }

    setController(controller) {
        this.controller = controller;
    }

    // render items under a category
    renderCategory(category, items) {
        const container = document.getElementById(category);
        console.log(category);
        container.innerHTML = items.map((item, index) => {
            let detailsHTML = ""; 
        
            // prepare detailed info per category
            if (item.category === "Wine") {
                detailsHTML = `
                    <p><strong>Year:</strong> ${item.year || "N/A"}</p>
                    <p><strong>Producer:</strong> ${item.producer || "N/A"}</p>
                    <p><strong>Grape:</strong> ${item.grape || "N/A"}</p>
                    <p><strong>Alcohol:</strong> ${item.alcohol ? item.alcohol + "%" : "N/A"}</p>
                    <p><strong>Tannins:</strong> ${item.tannins ? item.tannins + "/12" : "N/A"}</p>
                `;
            } else if (item.category === "Beer") {
                detailsHTML = `
                    <p><strong>Producer:</strong> ${item.producer || "N/A"}</p>
                    <p><strong>Type:</strong> ${item.type || "N/A"}</p>
                    <p><strong>Alcohol:</strong> ${item.alcohol ? item.alcohol + "%" : "N/A"}</p>
                    <p><strong>Allergens:</strong> ${item.allergens ? item.allergens.join(", ") : "N/A"}</p>
                `;
            } else if (item.category === "Spirit") {
                detailsHTML = `
                    <p><strong>Producer:</strong> ${item.producer || "N/A"}</p>
                    <p><strong>Alcohol:</strong> ${item.alcohol ? item.alcohol + "%" : "N/A"}</p>
                `;
            } else if (item.category === "Cocktail") {
                detailsHTML = `
                    <p><strong>Contents:</strong> ${item.contents ? item.contents.join(", ") : "N/A"}</p>
                `;
            } else if (item.category === "Food") {
                detailsHTML = `
                    <p><strong>Ingredients:</strong> ${item.ingredients ? item.ingredients.join(", ") : "N/A"}</p>
                    <p><strong>Allergens:</strong> ${item.allergens && item.allergens.length > 0 ? item.allergens.join(", ") : "None"}</p>
                `;
            }
        
            // create item card
            return `
                <div id="${category}-${index}" class="beverage-card" draggable="true"
                     data-name="${item.name}" data-price="${item.priceinclvat}">
                    <img src="${item.image || '../public/images/food/default.png'}" alt="${item.name}" draggable="true">
                    <h2>${item.name}</h2>
                    <button class="details-toggle-btn" data-name="${item.name}">
                        Details
                    </button>
                    
                    <div class="details-content" id="details-${category}-${index}" style="display: none;">
                        ${detailsHTML}
                    </div>
        
                    <p><strong>Price:</strong> ${item.priceinclvat} SEK</p>
                    <div class="quantity-selector">
                        <button class="quantity-btn decrement">-</button>
                        <span class="quantity-number">1</span>
                        <button class="quantity-btn increment">+</button>
                    </div>
                    <div class="card-footer">
                        <button class="add-to-cart-btn" data-name="${item.name}" data-price="${item.priceinclvat}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>`;
        }).join('');

        this.attachQuantityListeners(); // quantity +/- buttons
        this.attachDetailsListeners(); // show more detail
    }

    // render shopping cart
    renderCart(cart) {
        let total = 0;
        this.cartContainer.innerHTML = cart.slice().reverse().map(item => {
            console.log(item);
            const itemTotal = item.priceinclvat * item.quantity;
            total += itemTotal;
            return `<div class="cart-item" >
                    <img src="${item.img_path || '../public/images/drinks/corona.png'}" alt="${item.name}">
                    <span>${item.name}</span>
                        <div class="quantity-selector">
                            <button class="quantity-btn decrement" data-name="${item.name}" data-change="-1">-</button>
                            <span class="quantity-number">${item.quantity}</span>
                            <button class="quantity-btn increment" data-name="${item.name}" data-change="1">+</button> 
                        </div>
                    </div>`;
        }).join('');
        this.updateCartTotal(total); // update total cost
    }

    // update cart total amount from 
    updateCartTotal(total) {
        const totalElement = document.getElementById("cart-total");
        if (totalElement) {
            totalElement.textContent = total.toFixed(2);
        }
    }

    // handle "add to cart button"
    handleAddToCart = (event) => {
        const card = event.target.closest(".beverage-card");
        const quantity = parseInt(card.querySelector(".quantity-number").textContent, 10);
        const name = card.dataset.name;
        const price = parseFloat(card.dataset.price);
        const img_path = card.querySelector("img").src;
        this.controller.addToCart(name, price, quantity, img_path);
    };

    // handle quantity change in cart or card
    handleQuantityChange = (event) => {
        const btn = event.target;
        const name = btn.dataset.name;
        const change = parseInt(btn.dataset.change, 10);
        // console.log(btn, name, change);
        console.log("來自:", btn.closest(".cart-item") ? "Cart 🛒" : "Card 🏷️", "商品名稱:", name, "數量變更:", change);
        this.controller.updateCartQuantity(name, change);
    }

    // quantity +/- for item cards
    attachQuantityListeners() {
        document.querySelectorAll(".beverage-card").forEach(card => {
            let quantity = 1;
            let quantityDisplay = card.querySelector(".quantity-number");
            card.querySelector(".increment").addEventListener("click", () => {
                quantity++;
                quantityDisplay.textContent = quantity;
            });
            card.querySelector(".decrement").addEventListener("click", () => {
                if (quantity > 1) {
                    quantity--;
                    quantityDisplay.textContent = quantity;
                }
            });
        });
    }

    // listener for toggling detail view
    attachDetailsListeners() {
        document.querySelectorAll(".details-toggle-btn").forEach(button => {
            button.removeEventListener("click", this.toggleDetailsHandler);
            button.addEventListener("click", this.toggleDetailsHandler);
        });
    }

    // checkout button listener
    attachCheckoutListener() {
        const checkoutBtn = document.getElementById("checkout-button");
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", () => {
                console.log("Checkout");
                this.controller.placeOrder();
            });
        }
    }

    // allergen and ingredient filters
    attachFilterListener() {
        const allergenFilter = document.getElementById("allergen-filter");
        const ingredientFilter = document.getElementById("ingredient-filter");
    
        if (allergenFilter) {
            allergenFilter.addEventListener("change", (event) => {
                const selectedAllergen = event.target.value;
                this.controller.filterByAllergen(selectedAllergen);
            });
        }

        if (ingredientFilter) {
            ingredientFilter.addEventListener("change", (event) => {
                const selectedIngredient = event.target.value;
                this.controller.filterByIngredient(selectedIngredient);
            });
        }
    }

    
    attachCheckoutListener() {
        const checkoutBtn = document.getElementById("checkout-button");
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", () => {
                console.log("Checkout");
                this.controller.placeOrder();
            });
        }
    }
    
    // show order in progress msg
    showOrderStatus() {
        const statusMessage = document.getElementById("order-status");
        if (statusMessage) {
            statusMessage.textContent = "Your order is being prepared...";
            statusMessage.style.display = "block";
        }
    }
    
    // toggle detailed info view
    toggleDetailsView(name, item) {
        const card = document.querySelector(`[data-name="${name}"]`).closest(".beverage-card");
        const detailsSection = card.querySelector(".details-content");
    
        if (detailsSection.style.display === "none") {
            detailsSection.style.display = "block";
        } else {
            detailsSection.style.display = "none";
        }
    }

    // call controller to toggle detail state
    toggleDetailsHandler = (event) => {
        const itemName = event.target.dataset.name;
        this.controller.toggleDetails(itemName);
    };

    // Drag
    handleDragOver = (event) => {
        console.log("Drag Over");
        event.preventDefault();
    };

    handleDragStart = (event) => {
        console.log("Drag Start");
        if (event.target.classList.contains("beverage-card")) {
            const card = event.target.closest(".beverage-card"); 
            const name = event.target.dataset.name;
            const price = event.target.dataset.price;
            const quantity = parseInt(card.querySelector(".quantity-number").textContent, 10);
            const img_path = card.querySelector("img").src;
            const data = JSON.stringify({name, price, quantity, img_path});
            event.dataTransfer.setData("text/plain", data);
        }
    }

    handleDrop = (event) => {
        console.log("Drop");
        event.preventDefault();
        const data = JSON.parse(event.dataTransfer.getData("text/plain"));
        if (data.name && data.price) {
            this.controller.addToCart(data.name, data.price, data.quantity, data.img_path);
        }
    }
    
    // Switch to another menu category tab
    switchCategory(category) {
        this.categoryContainers.forEach(c => c.style.display = 'none');
        document.getElementById(category).style.display = 'flex';
        this.categoryButtons.forEach(btn => btn.classList.remove("active"));
        document.querySelector(`.tab-btn[data-category="${category}"]`).classList.add("active");
   
        const allergenFilterContainer = document.getElementById("allergen-filter-container");
        const ingredientFilterContainer = document.getElementById("ingredient-filter-container");

        if (ingredientFilterContainer) {
            if (["Beer", "Spirit", "Wine", "Cocktail"].includes(category)) {
                allergenFilterContainer.style.display = "inline-block";
                ingredientFilterContainer.style.display = "none";
            } 
            else if (category === "Food") {
                allergenFilterContainer.style.display = "none";
                ingredientFilterContainer.style.display = "inline-block";
            }
        }
    }
}