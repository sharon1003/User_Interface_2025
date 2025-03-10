export default class Model {
    constructor() {
        this.categoryItems = {
            Wine: [],
            Beer: [],
            Spirit: [],
            Cocktail: [],
            Food: []
        };
        this.orders = JSON.parse(sessionStorage.getItem("orders")) || [];
        // this.stock
        this.undoStack = [];
        this.redoStack = [];
    }

    async loadData() {
        try {
            const [drinksData, foods] = await Promise.all([
                fetch('../data/Beverages_eng.json').then(res => res.json()),
                fetch('../data/food_menu.json').then(res => res.json())
            ]);

            this.categoryItems.Wine = drinksData.filter(item => item.category === 'Wine');
            this.categoryItems.Beer = drinksData.filter(item => item.category === 'Beer');
            this.categoryItems.Spirit = drinksData.filter(item => item.category === 'Spirit');
            this.categoryItems.Cocktail = drinksData.filter(item => item.category === 'Cocktail');
            this.categoryItems.Food = foods;
        } catch (error) {
            console.error("Error loading: ", error);
        }
    }

    // Add order
    addOrder(order) {
        let existingItem = this.orders.find(item => item.name === order.name);
        const prevOrders = JSON.stringify(this.orders);

        if (existingItem) {
            existingItem.quantity += order.quantity;
        } else {
            this.orders.push(order);
        }
        this.undoStack.push(prevOrders);
        this.redoStack = [];
        this.saveOrders();
    }

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

    removeOrder(name) {
        const prevOrders = JSON.stringify(this.orders);
        this.orders = this.orders.filter(item => item.name !== name);
        this.undoStack.push(prevOrders);
        this.redoStack = [];
        this.saveOrders();
    }

    getTotalAmount() {
        console.log("model", this.orders);
        return this.orders.reduce((total, item) => total + item.priceinclvat * item.quantity, 0);
    }

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

    saveUndoState() {
        this.undoStack.push(JSON.stringify(this.orders));
        this.redoStack = [];
    }
}