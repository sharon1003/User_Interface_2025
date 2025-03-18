import UserModel from './user_model.js';

export default class PayView {
    constructor() {
        this.orderListContainer = document.getElementById("order-list");
        this.totalAmountDisplay = document.getElementById("total-amount");
        this.payByBalance = document.getElementById("PayByBalance");
        this.patAtBar = document.getElementById("PayAtBar");

        this.payButton = document.querySelector(".payment-submit-btn");
        //this.paymentMethod = (document.getElementById("PayBeBalance"))? true : false;
        console.log("balance");
        if (this.patAtBar && this.payByBalance){
            this.patAtBar.addEventListener("click", () => this.processing());    
            this.payByBalance.addEventListener("click", () => this.processPay());
        }
        else {
            this.payButton.addEventListener("click", () => this.processing());
        }
    }


    setController(controller) {
        this.controller = controller;
        this.updateOrderSummary(this.controller.getOrders());
    }

    updateOrderSummary(orders) {
        this.orderListContainer.innerHTML = orders.map(order => `
            <li>${order.name} x ${order.quantity} - ${order.priceinclvat * order.quantity} kr</li>
        `).join('');
        console.log("update");
        const totalAmount = this.controller.getTotalAmount();
        console.log(totalAmount);
        this.totalAmountDisplay.textContent = `${totalAmount} kr`;
    }

    processing() {
        console.log("Process Pay");
        alert(`Your order is being prepared...`);
        this.controller.clearCart();

        setTimeout(() => {
            if (window.location.pathname.includes("vip")) {
                window.location.href = "vip-menu.html";
            } else {
                window.location.href = "menu.html";
            }
        }, 1500);
    }

    // Pay by balance
    processPay() {
        const currentUser = UserModel.getLoggedInUser();
        const totalAmountText = document.getElementById("total-amount").textContent;
        const totalAmount = parseFloat(totalAmountText.replace(' kr', ''));

        // Check if user has enough balance
        if (currentUser.balance < totalAmount) {
            alert("Your balance is not enough to pay for this order!");
            return;
        }

        try {
            // Update user's balance
            const newBalance = currentUser.balance - totalAmount;
            currentUser.balance = newBalance;
            
            // Save updated user to localStorage
            UserModel.setLoggedInUser(currentUser);
            
            console.log("Payment successful. New balance:", newBalance);
            
            // Show success message
            alert(`Payment successful! Your new balance is ${newBalance} kr.`);
            
            // Clear cart
            this.controller.clearCart();
            
            // Redirect to vip-menu.html
            setTimeout(() => {
                window.location.href = "vip-menu.html";
            }, 1500);
            
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("There was an error processing your payment. Please try again.");
        }

        console.log("Process Pay by Balance");
        alert(`Payment with your balance is being processed.`);
        this.controller.clearCart();

        setTimeout(() => {
            window.location.href = "vip-menu.html";
        }, 1500);
    }
}