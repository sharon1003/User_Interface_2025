import { loadOrders } from './orders_model.js';
import Bartender_view from './bartender_view.js';

class Bartender_controller {
    constructor() {
        this.orders = [];
        this.view = new Bartender_view(this); // Initialize OrdersView

        this.undoStack = [];
        this.redoStack = [];
    }

    async init() {
        const allOrders = await loadOrders(); // Load all orders

        const localOrders = JSON.parse(localStorage.getItem("orders")) || [];
        localOrders.forEach(localOrder => {
            if (!allOrders.some(order => order.orderId === localOrder.orderId)) {
                allOrders.push(localOrder);
            }
        });
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
                this.checkoutOrder(orderId); // Goes to payment
            }
        });
        //Undo redo buttons 
        document.getElementById("undo-btn").addEventListener("click", () => this.undo());
        document.getElementById("redo-btn").addEventListener("click", () => this.redo());
    }


    confirmOrder(orderId) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (order && order.status === "Pending") {
            order.status = "Taken"; // Change status

            // Update UI
            this.view.renderOrderTabs(this.orders);
            this.view.renderOrders(this.orders);

            this.updateLocalStorage();
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
            //Update Local Storage
            this.updateLocalStorage();
        }
    }
     //add orders to localstorage
     updateLocalStorage() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    checkoutOrder(orderId){
        const order = this.orders.find(order => order.orderId === orderId);
        if (order) {
            order.status = "Completed"; // Change status
            this.updateLocalStorage();
            window.location.href = "payment.html?orderId="+orderId;
        }
    }

}
// Initialize controller when page loads
document.addEventListener("DOMContentLoaded", () => {
    const controller = new Bartender_controller();
    controller.init();
});