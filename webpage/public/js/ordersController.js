import { loadOrders } from './ordersLoader.js'; //connects to loader

class OrdersController {
    constructor() {
        this.orderContainer = document.querySelector('.order-details'); // Select where to display orders
    }

    async init() {
        const orders = await loadOrders(); // Fetch orders from JSON
        this.displayOrders(orders); // Pass orders to the View
        this.setupEventListeners(); // Add event listeners
    }

    displayOrders(orders) {
        this.orderContainer.innerHTML = ""; // Clear existing orders

        orders
            .filter(order => order.status === "Pending" || order.status === "Taken") // Show Pending & Taken orders // Only show Pending orders
            .forEach(order => {
                const orderCard = document.createElement('div');
                orderCard.classList.add('order-card');

                // Calculate total price
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
                    ${this.getOrderButtons(order)}
                `;

                this.orderContainer.appendChild(orderCard); // Add new order card
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
    setupEventListeners() {
        this.orderContainer.addEventListener("click", (event) => {
            const orderId = event.target.dataset.id;
            if (!orderId) return;

            if (event.target.classList.contains("confirm-btn")) {
                this.confirmOrder(orderId);
            }
        });
    }

    confirmOrder(orderId) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (order && order.status === "Pending") {
            order.status = "Taken"; // Change status
            this.displayOrders(this.orders); // Refresh UI
        }
    }
}

// Initialize controller when page loads
document.addEventListener("DOMContentLoaded", () => {
    const controller = new OrdersController();
    controller.init();
});