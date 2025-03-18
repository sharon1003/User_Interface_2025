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
                this.showPaymentModal(orderId); // Opens payment popup
            }
        });
        // Close modal event listeners
        document.getElementById("close-modal").addEventListener("click", () => this.hidePaymentModal());
        window.addEventListener("click", (event) => {
            if (event.target.classList.contains("modal")) {
                this.hidePaymentModal();
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

    showPaymentModal(orderId) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (!order) return;
    
        const modal = document.getElementById("payment-modal");
        const orderContent = document.getElementById("modal-order-content");
        const paymentContent = document.querySelector(".modal-payment");
    
        // Insert the order details dynamically (LEFT SIDE)
        orderContent.innerHTML = `
            <h3>#${order.orderId}</h3>
            <p>${order.date}</p>
            ${order.items.map(item => `
                <div class="order-item">
                    <div class="order-info">
                        <p><strong>${item.name}</strong></p>
                        <p>Qty: ${item.quantity}</p>
                    </div>
                    <p class="order-price">${item.price} kr</p>
                </div>
            `).join('')}
            <div class="order-total">
                <span class="total-label"><strong>In Total:</strong></span>
                <span class="total-qty"><strong>Qty: ${order.items.reduce((sum, item) => sum + item.quantity, 0)}</strong></span>
                <span class="total-price">SEK ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
            </div>
        `;
    
        // Insert the payment options dynamically (RIGHT SIDE)
        paymentContent.innerHTML = `
            <h2>Please confirm order & Payment Method</h2>
            
            <!-- Payment Method Dropdown -->
            <select id="payment-method" class="payment-dropdown">
                <option value="" disabled selected>Select Payment Method</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="mobile">Mobile Payment</option>
            </select>
    
            <!-- Pay Button (Initially Disabled) -->
            <button class="checkout-btn" id="confirm-payment" disabled>PAY</button>
        `;
    
        // Display modal
        modal.style.display = "flex";
    
        // Enable "PAY" button when a payment method is selected
        document.getElementById("payment-method").addEventListener("change", () => {
            document.getElementById("confirm-payment").disabled = false;
        });
    
        // Handle "PAY" button click
        document.getElementById("confirm-payment").addEventListener("click", () => {
            const selectedMethod = document.getElementById("payment-method").value;
            this.completePayment(orderId, selectedMethod);
        });
    }

    hidePaymentModal() {
        document.getElementById("payment-modal").style.display = "none";
    }

    completePayment(orderId, method) {
        const order = this.orders.find(order => order.orderId === orderId);
        if (order) {
            order.status = "Done";
            this.updateLocalStorage(order.orderId);
            this.orders = this.orders.filter(order => order.status !== "Done");
    

            this.view.renderOrderTabs(this.orders);
            this.view.renderOrders(this.orders);
            document.getElementById("payment-modal").style.display = "none"; // Close modal
            alert(`Order #${orderId} paid with ${method}`);
        }
    }
    // checkoutOrder(orderId){
    //     const order = this.orders.find(order => order.orderId === orderId);
    //     if (order) {
    //         order.status = "Done"; // Change status
    //         this.updateLocalStorage();
    //         this.showPaymentModal(orderId);
    //         this.updateLocalStorage();
    //     }
    // }

}
// Initialize controller when page loads
document.addEventListener("DOMContentLoaded", () => {
    const controller = new Bartender_controller();
    controller.init();
});