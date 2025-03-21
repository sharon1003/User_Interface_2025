import { loadOrders } from './orders_model.js';
import BartenderView from './bartender_view.js';

class BartenderController {
    constructor() {
        this.orders = [];
        this.view = new BartenderView(this);

        this.undoStack = [];
        this.redoStack = [];
    }

    // Init - Loads orders from orders.json and localstorage and calls the view to render them.
    async init() {
        const allOrders = await loadOrders();
        console.log(allOrders);
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
        // Confirm, reject and pay buttons
        this.view.orderContainer.addEventListener("click", (event) => {
            const orderId = event.target.dataset.id;
            if (!orderId) return;

            if (event.target.classList.contains("confirm-btn")) {
                this.confirmOrder(orderId);
            } else if (event.target.classList.contains("reject-btn")) {
                this.rejectOrder(orderId);
            } else if (event.target.classList.contains("checkout-btn")) {
                this.showPaymentModal(orderId); // Open payment pop-up
            }
        });

        // Close payment pop-up
        document.getElementById("close-modal").addEventListener("click", () => this.view.hidePaymentModal());
        window.addEventListener("click", (event) => {
            if (event.target.classList.contains("modal")) {
                this.view.hidePaymentModal();
            }
        });

        // Undo and redo buttons
        document.getElementById("undo-btn").addEventListener("click", () => this.undo());
        document.getElementById("redo-btn").addEventListener("click", () => this.redo());
    }

    // Order Actions (Confirm, reject, pay)
    confirmOrder(orderId) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (order && order.status === "Pending") {
            const oldStatus = "Pending";
            const newStatus = "Taken";
            this.do(
                () => {
                    this.updateOrderStatus(orderId, newStatus);
                    this.updateUI();
                },
                () => {
                    this.updateOrderStatus(orderId, oldStatus);
                    this.updateUI();
                },
                () => {
                    this.updateOrderStatus(orderId, newStatus);
                    this.updateUI();
                }
            );
        }
    }

    rejectOrder(orderId) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (order && order.status === "Pending") {
            const oldStatus = "Pending";
            const newStatus = "Rejected";
            this.do(
                () => {
                    this.updateOrderStatus(orderId, newStatus);
                    this.updateUI();
                },
                () => {
                    this.updateOrderStatus(orderId, oldStatus);
                    this.updateUI();
                },
                () => {
                    this.updateOrderStatus(orderId, newStatus);
                    this.updateUI();
                }
            );
        }
    }

    updateOrderStatus(orderId, status) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (order) {
            order.status = status;
        }
    }

    // Payment - can not be undone
    completePayment(orderId, method) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (order) {
            order.status = "Done";
            this.updateUI();
            this.view.hidePaymentModal();
            alert(`Order #${orderId} paid with ${method}!`);
            this.redoStack.length = 0; // clears redo stack
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

    // Undo and Redo

    // Creates an action, executes it and adds it to the undoStack
    do(execute, unexecute, reexecute) {
        const action = new Action(execute, unexecute, reexecute);
        action.execute();
        this.undoStack.push(action);
        this.redoStack.length = 0; // Clear redo stack
    }

    undo() {
        if (this.undoStack.length > 0) {
            const action = this.undoStack.pop();
            action.unexecute();
            this.redoStack.push(action);
            this.updateUI();
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            const action = this.redoStack.pop();
            action.reexecute();
            this.undoStack.push(action);
            this.updateUI();
        }
    }

}

// Action-object used in undo/redo stack
class Action {
    constructor(execute, unexecute, reexecute) {
        this.execute = execute;
        this.unexecute = unexecute;
        this.reexecute = reexecute;
    }
}

// Init controller on page-load
document.addEventListener("DOMContentLoaded", () => {
    const controller = new BartenderController();
    void controller.init();
});

