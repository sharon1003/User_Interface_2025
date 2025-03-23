export default class Model {
    constructor() {
        this.categoryItems = {
            Wine: [],
            Beer: [],
            Spirit: [],
            Cocktail: [],
            Food: [],
            Special: []
        };
        this.orders = JSON.parse(sessionStorage.getItem("orders")) || [];
        this.undoStack = [];
        this.redoStack = [];
    }

    // load all menu data from ../data/Beverages_eng.json
    async loadData() {
        try {
            const [drinksData, foods, vip_menu] = await Promise.all([
                fetch('../data/Beverages_eng.json').then(res => res.json()),
                fetch('../data/food_menu.json').then(res => res.json()),
                fetch('../data/vip_menu.json').then(res => res.json())
            ]);

            this.categoryItems.Wine = drinksData.filter(item => item.category === 'Wine');
            this.categoryItems.Beer = drinksData.filter(item => item.category === 'Beer');
            this.categoryItems.Spirit = drinksData.filter(item => item.category === 'Spirit');
            this.categoryItems.Cocktail = drinksData.filter(item => item.category === 'Cocktail');
            this.categoryItems.Food = foods;
            this.categoryItems.Special = vip_menu;
        } catch (error) {
            console.error("Error loading: ", error);
        }
    }

    // Add new order or update quantity
    addOrder(order) {
        let existingItem = this.orders.find(item => item.name === order.name);
        const prevOrders = JSON.stringify(this.orders);

        if (!existingItem && this.orders.length >= 10) {
          alert("It is already 10 items in the Cart");
          return;  // Prevent adding more items
        }


        if (existingItem) {
            existingItem.quantity += order.quantity;
        } else {
            this.orders.push(order);
        }
        this.undoStack.push(prevOrders);
        this.redoStack = [];
        this.saveOrders();
    }

    // get item details by name
    getItemByName(name) {
        for (const category in this.categoryItems) {
            const item = this.categoryItems[category].find(i => i.name === name);
            if (item) {
                return item;
            }
        }
        return null;
    }

    // update order quantity or remove if <= 0
    updateOrder(name, quantityChange) {
        const prevOrders = JSON.stringify(this.orders);
        let item = this.orders.find(i => i.name === name);

        if (item) {
            item.quantity += quantityChange;
            if (item.quantity <= 0) {
                // Remove the item if quantity < 0
                this.orders = this.orders.filter(i => i.name !== name); 
            }
            this.undoStack.push(prevOrders);
            this.redoStack = [];
            this.saveOrders();
        }
    }

    // remove order by name
    removeOrder(name) {
        const prevOrders = JSON.stringify(this.orders);
        this.orders = this.orders.filter(item => item.name !== name);
        this.undoStack.push(prevOrders);
        this.redoStack = [];
        this.saveOrders();
    }

    // calculate total amount
    getTotalAmount() {
        console.log("model", this.orders);
        return this.orders.reduce((total, item) => total + item.priceinclvat * item.quantity, 0);
    }

    // clear all orders
    clearOrders() {
        this.orders = [];
        sessionStorage.removeItem("orders");
    }

    // save order to sessionStorage
    saveOrders() {
        sessionStorage.setItem("orders", JSON.stringify(this.orders));
    }

    // undo
    undo() {
        if(this.undoStack.length > 0) {
            console.log(this.undoStack);
            this.redoStack.push(JSON.stringify(this.orders));
            this.orders = JSON.parse(this.undoStack.pop());
            this.saveOrders();
        }
    }

    // redo
    redo() {
        if (this.redoStack.length > 0) {
            console.log(this.redoStack);
            this.undoStack.push(JSON.stringify(this.orders));
            this.orders = JSON.parse(this.redoStack.pop());
            this.saveOrders();
        }
    }

    // save current state to undo stack 
    saveUndoState() {
        this.undoStack.push(JSON.stringify(this.orders));
        this.redoStack = [];
    }
}