import { loadOrders } from './ordersLoader.js';
import OrdersView from './ordersView.js';

class OrdersController {
    constructor() {
        this.orders = [];
        this.view = new OrdersView(this); // Initialize OrdersView
    }

    async init() {
        const allOrders = await loadOrders(); // Load all orders
        this.orders = allOrders.filter(order => order.status === "Pending" || order.status === "Taken"); // Filter orders
        this.view.renderOrderTabs(this.orders); // Render only filtered orders
        this.view.renderOrders(this.orders);
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.view.orderContainer.addEventListener("click", (event) => {
            const orderId = event.target.dataset.id;
            if (!orderId) return;

            if (event.target.classList.contains("confirm-btn")) {
                this.confirmOrder(orderId);
            } else if (event.target.classList.contains("reject-btn")) {
                this.rejectOrder(orderId);
            } else if (event.target.classList.contains("checkout-btn")) {
                this.checkoutOrder(orderId); // New function
            }
        });
    }

    confirmOrder(orderId) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (order && order.status === "Pending") {
            order.status = "Taken"; // Change status

            // Update UI
            this.view.renderOrderTabs(this.orders);
            this.view.renderOrders(this.orders);
        }
    }

    rejectOrder(orderId) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (order) {
            order.status = "Rejected"; // Change status instead of removing

            // Re-filter the orders to exclude rejected ones
            this.orders = this.orders.filter(order => order.status === "Pending" || order.status === "Taken");

            // Update the UI with only non-rejected orders
            this.view.renderOrderTabs(this.orders);
            this.view.renderOrders(this.orders);
        }
    }

    checkoutOrder(orderId){
        window.location.href = "payment.html?orderId="+orderId;
    }
}

// Initialize controller when page loads
document.addEventListener("DOMContentLoaded", () => {
    const controller = new OrdersController();
    controller.init();
});