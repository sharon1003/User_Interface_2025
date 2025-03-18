class BartenderView {
    constructor(controller) {
        this.controller = controller;
        this.orderContainer = document.querySelector('.order-details');
        this.orderTabsContainer = document.querySelector('.order-tabs');
    }

    // === Render Order Tabs ===
    renderOrderTabs(orders) {
        this.orderTabsContainer.innerHTML = ""; // Clear existing tabs

        // Create "All" tab
        this.createTab("All", "all", true, () => this.controller.displayAllOrders());

        // Create individual order tabs
        orders.forEach(order => {
            this.createTab(`#${order.orderId}`, order.orderId, false, () => this.controller.displaySingleOrder(order.orderId));
        });
    }

    createTab(label, orderId, isActive, clickHandler) {
        const tabButton = document.createElement("button");
        tabButton.classList.add("order-tab");
        if (isActive) tabButton.classList.add("active");
        tabButton.textContent = label;
        tabButton.dataset.id = orderId;

        tabButton.addEventListener("click", () => {
            document.querySelectorAll(".order-tab").forEach(tab => tab.classList.remove("active"));
            tabButton.classList.add("active");
            clickHandler();
        });

        this.orderTabsContainer.appendChild(tabButton);
    }

    // === Render Orders ===
    renderOrders(orders) {
        this.orderContainer.innerHTML = ""; // Clear previous content

        orders.forEach(order => {
            this.orderContainer.appendChild(this.createOrderCard(order));
        });

        this.removeLastItemBorder();
    }

    createOrderCard(order) {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');

        orderCard.innerHTML = `
            <h3>#${order.orderId}</h3>
            <p>${order.date}</p>
            ${order.items.map(item => this.createOrderItemHTML(item)).join('')}
            ${this.createOrderTotalHTML(order)}
            <div class="order-actions">${this.getOrderButtons(order)}</div>
        `;

        return orderCard;
    }

    createOrderItemHTML(item) {
        return `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="order-info">
                    <p><strong>${item.name}</strong></p>
                    <p>Qty: ${item.quantity}</p>
                </div>
                <p class="order-price">${item.price} kr</p>
            </div>
        `;
    }

    createOrderItemHTMLnoImg(item) {
        return `
            <div class="order-item">

                <div class="order-info">
                    <p><strong>${item.name}</strong></p>
                    <p>Qty: ${item.quantity}</p>
                </div>
                <p class="order-price">${item.price} kr</p>
            </div>
        `;
    }

    createOrderTotalHTML(order) {
        const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return `
            <div class="order-total">
                <span class="total-label"><strong>In Total:</strong></span>
                <span class="total-qty"><strong>Qty: ${totalQuantity}</strong></span>
                <span class="total-price">SEK ${totalPrice}</span>
            </div>
        `;
    }

    getOrderButtons(order) {
        if (order.status === "Pending") {
            return `
                <button class="reject-btn" data-id="${order.orderId}">Reject</button>
                <button class="confirm-btn" data-id="${order.orderId}">Confirm</button>
            `;
        } else if (order.status === "Taken") {
            return `<button class="checkout-btn" data-id="${order.orderId}">Check Out</button>`;
        }
        return "";
    }

    removeLastItemBorder() {
        document.querySelectorAll(".order-card").forEach(card => {
            let items = card.querySelectorAll(".order-item");
            if (items.length > 0) {
                items[items.length - 1].style.borderBottom = "none";
            }
        });
    }

    // === Payment Modal ===
    showPaymentModal(order) {
        const modal = document.getElementById("payment-modal");
        const orderContent = document.getElementById("modal-order-content");
        const paymentContent = document.querySelector(".modal-payment");

        orderContent.innerHTML = this.createPaymentOrderDetails(order);
        paymentContent.innerHTML = this.createPaymentOptions();

        modal.style.display = "flex";

        document.getElementById("payment-method").addEventListener("change", () => {
            document.getElementById("confirm-payment").disabled = false;
        });

        document.getElementById("confirm-payment").addEventListener("click", () => {
            const selectedMethod = document.getElementById("payment-method").value;
            this.controller.completePayment(order.orderId, selectedMethod);
        });
    }

    hidePaymentModal() {
        document.getElementById("payment-modal").style.display = "none";
    }

    createPaymentOrderDetails(order) {
        return `
            <h3>#${order.orderId}</h3>
            <p>${order.date}</p>
            ${order.items.map(item => this.createOrderItemHTMLnoImg(item)).join('')}
            
            ${this.createOrderTotalHTML(order)}
        `;
    }

    createPaymentOptions() {
        return `
            <h2>Please confirm order & Payment Method</h2>
            <select id="payment-method" class="payment-dropdown">
                <option value="" disabled selected>Select Payment Method</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="mobile">Mobile Payment</option>
            </select>
            <button class="checkout-btn" id="confirm-payment" disabled>PAY</button>
        `;
    }
}

export default BartenderView;