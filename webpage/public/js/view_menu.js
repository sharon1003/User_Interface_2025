import Model from "./menu_model.js";

export default class ViewMenu {
    constructor() {
        this.categoryContainers = document.querySelectorAll(".tab-content");
        this.categoryButtons = document.querySelectorAll(".tab-btn");
        this.cartContainer = document.getElementById("cart-list");

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

        // drag & drop
        document.body.addEventListener("dragstart", this.handleDragStart);
        document.body.addEventListener("dragover", this.handleDragOver);
        document.body.addEventListener("drop", this.handleDrop);
    }

    setController(controller) {
        this.controller = controller;
    }

    renderCategory(category, items) {
        const container = document.getElementById(category);
    
        container.innerHTML = items.map((item, index) =>
            `<div id="${category}-${index}" class="beverage-card" draggable="true"
                 data-name="${item.name}" data-price="${item.priceinclvat}">
                <img src="${item.image || '../public/images/drinks/corona.png'}" alt="${item.name}" draggable="true">
                <h2>${item.name}</h2>
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
            </div>`
        ).join('');

        this.attachQuantityListeners();
    }

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
        this.updateCartTotal(total); //Cause data-i18n will effect the appear
    }

    updateCartTotal(total) {
        const totalElement = document.getElementById("cart-total");
        if (totalElement) {
            totalElement.textContent = total.toFixed(2);
        }
    }

    handleAddToCart = (event) => {
        const card = event.target.closest(".beverage-card");
        const quantity = parseInt(card.querySelector(".quantity-number").textContent, 10);
        const name = card.dataset.name;
        const price = parseFloat(card.dataset.price);
        const img_path = card.querySelector("img").src;
        this.controller.addToCart(name, price, quantity, img_path);
    };

    handleQuantityChange = (event) => {
        const btn = event.target;
        const name = btn.dataset.name;
        const change = parseInt(btn.dataset.change, 10);
        // console.log(btn, name, change);
        console.log("來自:", btn.closest(".cart-item") ? "Cart 🛒" : "Card 🏷️", "商品名稱:", name, "數量變更:", change);
        this.controller.updateCartQuantity(name, change);
    }

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

    switchCategory(category) {
        this.categoryContainers.forEach(c => c.style.display = 'none');
        document.getElementById(category).style.display = 'flex';
        this.categoryButtons.forEach(btn => btn.classList.remove("active"));
        document.querySelector(`.tab-btn[data-category="${category}"]`).classList.add("active");

    }
}