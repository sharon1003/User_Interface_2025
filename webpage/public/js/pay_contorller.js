import Model from "./menu_model.js";
import PayView from "./pay_view.js";

export default class PayController {
    constructor() {
        this.model = new Model();
        this.payView = new PayView();
        this.payView.setController(this);
    }

    getOrders() {
        return this.model.orders;
    }

    getTotalAmount() {
        console.log("pay controller");
        return this.model.getTotalAmount();
    }

    clearCart() {
        this.model.clearOrders();
        this.payView.updateOrderSummary([]);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const payApp = new PayController();
});