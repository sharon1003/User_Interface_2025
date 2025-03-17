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

            orderCard.innerHTML = `
                <h3>#${order.orderId}</h3>
                <p>${order.date}</p>
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="order-info">
                            <p><strong>${item.name}</strong></p>
                            <p>Qty: ${item.quantity} | SEK ${item.price}</p>
                        </div>
                    </div>
                `).join('')}
                <p><strong>In Total: SEK ${totalPrice}</strong></p>
                <div class="order-actions">${this.getOrderButtons(order)}</div>
            `;

            this.orderContainer.appendChild(orderCard);
        });
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
}

export default Bartender_view;