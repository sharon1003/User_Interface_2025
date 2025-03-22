import OrdersModel from './orders_model.js';
import BartenderView from './bartender_view.js';

class BartenderController {
    constructor() {
        this.view = new BartenderView(this);
        this.model = new OrdersModel();

        this.undoStack = [];
        this.redoStack = [];
    }

    // Init - Loads orders from orders.json and localstorage and calls the view to render them.
    async init() {
        await this.model.init();
        this.updateUI();
        this.setupEventListeners();
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
        const order = this.model.getOrderById(orderId);
        if (order && order.status === "Pending") {
            this.do(
                () => {
                    this.model.updateOrderStatus(orderId, "Taken");
                    this.updateUI();
                },
                () => {
                    this.model.updateOrderStatus(orderId, "Pending");
                    this.updateUI();
                },
                () => {
                    this.model.updateOrderStatus(orderId, "Taken");
                    this.updateUI();
                }
            );
        }
    }

    rejectOrder(orderId) {
        const order = this.model.getOrderById(orderId);
        if (order && order.status === "Pending") {
            this.do(
                () => {
                    this.model.updateOrderStatus(orderId, "Rejected");
                    this.updateUI();
                },
                () => {
                    this.model.updateOrderStatus(orderId, "Pending");
                    this.updateUI();
                },
                () => {
                    this.model.updateOrderStatus(orderId, "Rejected");
                    this.updateUI();
                }
            );
        }
    }

    // Payment - can not be undone
    completePayment(orderId, method) {
        const order = this.model.getOrderById(orderId);
        if (order) {
            this.model.updateOrderStatus(orderId, "Done");
            this.updateUI();
            this.view.hidePaymentModal();
            alert(`Order #${orderId} paid with ${method}!`);
            this.redoStack.length = 0; // clears redo stack
        }
    }

    updateUI() {
        this.model.updateLocalStorage();
        this.view.renderOrderTabs(this.model.getActiveOrders());
        this.view.renderOrders(this.model.getActiveOrders());
    }

    // Order Display Functions
    displayAllOrders() {
        this.view.renderOrders(this.model.getActiveOrders());
    }

    displaySingleOrder(orderId) {
        const order = this.model.getOrderById(orderId);
        if (order) {
            this.view.renderOrders([order]);
        }
    }

    // Payment Pop-up
    showPaymentModal(orderId) {
        const order = this.model.getOrderById(orderId);
        if (order) {
            this.view.showPaymentModal(order);
        }
    }

    // Undo and Redo functions

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

