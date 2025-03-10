import Model from './menu_model.js';
import ViewMenu from './view_menu.js';

class Controller {
    constructor() {
        this.model = new Model();
        this.view = new ViewMenu();
        this.view.setController(this); // set controller to view
    }

    // initial page
    init() {
        // show all category
        this.model.loadData().then(() => {
            Object.keys(this.model.categoryItems).forEach(category => {
                this.view.renderCategory(category, this.model.categoryItems[category]);
            })
        });

        // show cart
        this.view.renderCart(this.model.orders);
        this.view.switchCategory('Beer');
        document.querySelectorAll(".tab-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                this.view.switchCategory(btn.dataset.category);
            });
        });

        document.getElementById("undo-button").addEventListener("click", () => this.undo());
        document.getElementById("redo-button").addEventListener("click", () => this.redo());
    }

    // add to cart connect view and model(dataset)
    addToCart(name, price, quantity, img_path) {
        console.log("Adding");
        this.model.saveUndoState();
        const order = {id: Date.now(), name, priceinclvat: parseFloat(price), quantity, img_path};
        this.model.addOrder(order);
        this.view.renderCart(this.model.orders);
    }
    // update cart
    updateCartQuantity(name, change) {
        console.log("Update");
        this.model.saveUndoState();
        this.model.updateOrder(name, change);
        this.view.renderCart(this.model.orders);
    }

    // remove cart
    removeFromCart(name) {
        console.log("Remove");
        this.model.removeOrder(name);
        this.view.renderCart(this.model.orders);
    }

    // payment
    getTotalAmount() {
        console.log("Get total amount");
        console.log(this.orders);
        return this.orders.reduce((total, item) => total + item.priceinclvat * item.quantity, 0);
    }

    saveOrders() {
        sessionStorage.setItem("orders", JSON.stringify(this.orders));
    }

    clearOrders() {
        this.orders = [];
        sessionStorage.removeItem("orders");
    }


    // redo & undo
    undo() {
        this.model.undo();
        this.view.renderCart(this.model.orders);
    }
    redo() {
        this.model.redo();
        this.view.renderCart(this.model.orders);
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const app = new Controller();
    app.init();
});
