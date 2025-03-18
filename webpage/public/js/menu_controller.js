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

        // switch category
        document.querySelectorAll(".tab-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                this.view.switchCategory(btn.dataset.category);
            });
        });

        document.getElementById("undo-button").addEventListener("click", () => this.undo());
        document.getElementById("redo-button").addEventListener("click", () => this.redo());

    }

    // show detail
    toggleDetails(name) {
        const item = this.model.getItemByName(name);
        if (item) {
            console.log(item);
            this.view.toggleDetailsView(name, item); 
        } else {
            console.error("Item not found:", name);
        }
    }

    filterByAllergen(allergen) {
        console.log("Filtering by allergen:", allergen);
    
        const currentCategory = document.querySelector(".tab-btn.active").dataset.category;
        let filteredItems = this.model.categoryItems[currentCategory];
    
        if (allergen) {
            filteredItems = filteredItems.filter(item => !item.allergens || !item.allergens.includes(allergen));
        }
    
        this.view.renderCategory(currentCategory, filteredItems);
    }

    filterByIngredient(ingredient) {
        console.log("Filtering by ingredient:", ingredient);
    
        const currentCategory = document.querySelector(".tab-btn.active").dataset.category;
        let filteredItems = this.model.categoryItems[currentCategory];
    
        if (ingredient && currentCategory === "Food") {
            filteredItems = filteredItems.filter(item => item.ingredients.includes(ingredient));
        }
    
        this.view.renderCategory(currentCategory, filteredItems);
    }

    placeOrder() {
        if (this.model.orders.length === 0) {
            alert("Your cart is empty!");
            return;
        }
    
        const orderId = Date.now().toString(); 
        const date = new Date().toISOString().split("T")[0];
        const vipStatus = sessionStorage.getItem("vip") || "Guest"; 
        const status = "Pending";
    
        const newOrder = {
            orderId: orderId,
            date: date,
            vip: vipStatus,
            status: status,
            items: this.model.orders.map(order => ({
                type: order.category || "food", 
                name: order.name,
                quantity: order.quantity,
                price: order.priceinclvat,
                image: order.img_path
            }))
        };
    
        console.log("Order placed:", newOrder);
    
        const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
        existingOrders.push(newOrder);
        localStorage.setItem("orders", JSON.stringify(existingOrders));
    
        // // 清空購物車
        // this.model.clearOrders();
        // console.log(newOrder);
        // this.view.renderCart(this.model.orders);
    
        // alert("Order placed successfully!");
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
