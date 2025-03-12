export default class PayView {
    constructor() {
        this.orderListContainer = document.getElementById("order-list");
        this.totalAmountDisplay = document.getElementById("total-amount");
        this.payButton = document.querySelector(".payment-submit-btn");
        this.paymentMethod = document.getElementById("payment-option");

        this.payButton.addEventListener("click", () => this.processPay());
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

    processPay() {
        console.log("Process Pay");
        const selectedMethod = this.paymentMethod.value;
        alert(`Payment of ${this.totalAmountDisplay.textContent} using ${selectedMethod} is being processed.`);
        this.controller.clearCart();

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    }
}