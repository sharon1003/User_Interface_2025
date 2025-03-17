class Bartender_view {
    constructor(controller) {
        this.controller = controller;
        this.orderContainer = document.querySelector('.order-details');
        this.orderTabsContainer = document.querySelector('.order-tabs');
    }

    renderOrderTabs(orders) {
        this.orderTabsContainer.innerHTML = ""; // Clear existing tabs
    
        // Create "All" tab
        const allTab = document.createElement("button");
        allTab.classList.add("order-tab", "active"); // Default active
        allTab.textContent = "All";
        allTab.dataset.id = "all";
    
        allTab.addEventListener("click", () => {
            document.querySelectorAll(".order-tab").forEach(tab => tab.classList.remove("active"));
            allTab.classList.add("active");
            this.renderOrders(orders); // Show all orders
        });
    
        this.orderTabsContainer.appendChild(allTab);
    
        // Create individual order tabs
        orders.forEach(order => {
            const tabButton = document.createElement("button");
            tabButton.classList.add("order-tab");
            tabButton.textContent = `#${order.orderId}`;
            tabButton.dataset.id = order.orderId;
    
            tabButton.addEventListener("click", () => {
                document.querySelectorAll(".order-tab").forEach(tab => tab.classList.remove("active"));
                tabButton.classList.add("active");
                this.renderOrders([order]); // Show only the selected order
            });
    
            this.orderTabsContainer.appendChild(tabButton);
        });
    }

    renderOrders(orders) {
        this.orderContainer.innerHTML = ""; // Clear previous content

        orders
            .forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card');

            const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

            orderCard.innerHTML = `
                <h3>#${order.orderId}</h3>
                <p>${order.date}</p>
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="order-info">
                            <p><strong>${item.name}</strong></p>
                            <p>Qty: ${item.quantity}</p>
                        </div>
                        <p class="order-price">${item.price} kr</p>
                    </div>
                `).join('')}
                <div class ="order-total">
                    <span class="total-label"><strong>In Total:</strong></span>
                    <span class="total-qty"><strong>Qty: ${totalQuantity}</strong></span>
                    <span class="total-price">SEK ${totalPrice}</span>
                </div>
                <div class="order-actions">${this.getOrderButtons(order)}</div>
            `;

            this.orderContainer.appendChild(orderCard);
        });
        // remove css border form last order item 
        document.querySelectorAll(".order-card").forEach(card => {
            let items = card.querySelectorAll(".order-item");
            if (items.length > 0) {
                items[items.length - 1].style.borderBottom = "none"; 
            }
        });
    }

    getOrderButtons(order) {
        if (order.status === "Pending") {
            return `
                <div class="order-actions">
                    <button class="reject-btn" data-id="${order.orderId}">Reject</button>
                    <button class="confirm-btn" data-id="${order.orderId}">Confirm</button>
                </div>
            `;
        } else if (order.status === "Taken") {
            return `
            <div class="order-actions">
                <button class="checkout-btn" data-id="${order.orderId}">Check Out</button>
            </div>
            `;
        }
        return "";
    }
}

export default Bartender_view;