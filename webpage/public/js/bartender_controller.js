import { loadOrders } from './orders_model.js';
import BartenderView from './bartender_view.js';

class BartenderController {
    constructor() {
        this.orders = [];
        this.view = new BartenderView(this);

        this.undoStack = [];
        this.redoStack = [];
    }

    // Init
    async init() {
        const allOrders = await loadOrders();
        this.loadOrdersFromLocalStorage(allOrders);
        this.view.renderOrderTabs(this.getActiveOrders());
        this.view.renderOrders(this.getActiveOrders());
        this.setupEventListeners();
    }

    loadOrdersFromLocalStorage(allOrders) {
        const localOrders = JSON.parse(localStorage.getItem("orders")) || [];
        localOrders.forEach(localOrder => {
            if (!allOrders.some(order => order.orderId === localOrder.orderId)) {
                allOrders.push(localOrder);
            }
        });
        this.orders = allOrders;
    }

    updateLocalStorage() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    getActiveOrders() {
        return this.orders.filter(order => order.status === "Pending" || order.status === "Taken");
    }

    // Event listeners
    setupEventListeners() {
        this.view.orderContainer.addEventListener("click", (event) => {
            const orderId = event.target.dataset.id;
            if (!orderId) return;

            if (event.target.classList.contains("confirm-btn")) {
                this.confirmOrder(orderId);
            } else if (event.target.classList.contains("reject-btn")) {
                this.rejectOrder(orderId);
            } else if (event.target.classList.contains("checkout-btn")) {
                this.showPaymentModal(orderId);
            }
        });

        document.getElementById("close-modal").addEventListener("click", () => this.view.hidePaymentModal());
        window.addEventListener("click", (event) => {
            if (event.target.classList.contains("modal")) {
                this.view.hidePaymentModal();
            }
        });

        document.getElementById("undo-btn").addEventListener("click", () => this.undo());
        document.getElementById("redo-btn").addEventListener("click", () => this.redo());
    }

    // Order Actions (Confirm, reject, pay)
    confirmOrder(orderId) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (order && order.status === "Pending") {
            order.status = "Taken";
            this.updateUI();
        }
    }

    rejectOrder(orderId) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (order) {
            order.status = "Rejected";
            this.updateUI();
        }
    }

    completePayment(orderId, method) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (order) {
            order.status = "Done";
            this.updateUI();
            this.view.hidePaymentModal();
            alert(`Order #${orderId} paid with ${method}`);
        }
    }

    updateUI() {
        this.updateLocalStorage();
        this.view.renderOrderTabs(this.getActiveOrders());
        this.view.renderOrders(this.getActiveOrders());
    }

    // Order Display Functions
    displayAllOrders() {
        this.view.renderOrders(this.getActiveOrders());
    }

    displaySingleOrder(orderId) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (order) {
            this.view.renderOrders([order]);
        }
    }

    // Payment Pop-up
    showPaymentModal(orderId) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (order) {
            this.view.showPaymentModal(order);
        }
    }
}

// Initialize Controller on Page Load
document.addEventListener("DOMContentLoaded", () => {
    const controller = new BartenderController();
    controller.init();
});