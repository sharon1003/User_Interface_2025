import Model from './menu_model.js';
import ViewMenu from './menu_view.js';

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

        document.getElementById("pay-button").addEventListener("click", () => this.handlePayment());
        document.getElementById("undo-button").addEventListener("click", () => this.undo());
        document.getElementById("redo-button").addEventListener("click", () => this.redo());
    }

    // add to cart connect view and model(dataset)
    addToCart(name, price, quantity, img_path) {
        console.log("Adding");
        this.model.saveUndoState();
        const order = {id: Date.now(), name, priceinclvat: parseFloat(price), quantity, img_path};

        const initialCount = this.model.orders.length;
        this.model.addOrder(order);

        // If no new item was added, assume cart limit was reached
        if (this.model.orders.length === initialCount) {
          alert("It is already 10 items in the Cart");
        } else {
          this.view.renderCart(this.model.orders);
        }
        // this.model.addOrder(order);
        // this.view.renderCart(this.model.orders);
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

    handlePayment() {
      if (this.model.orders.length < 5) {
          const confirmPayment = confirm("It is less than 5 items in the Cart, do you want to continue to pay?");
          if (!confirmPayment) {
              return; // Stay on the cart page if the user cancels
          }
      }
      window.location.href = "./payment.html"; // Redirect to payment page
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
