export default class OrdersModel {
    constructor() {
        this.orders = [];
    }
    async init() {
        try {
            const loadedOrders = this.loadFromDatabase();
            this.orders = this.loadFromLocalStorage(loadedOrders);

        } catch (error) {
            console.error("Error initializing orders:", error);
            this.orders = [];
        }

    }

    //Loads orders from orders.json as a js object
    loadFromDatabase() {
        try {
            const response = fetch('/webpage/data/orders.json');
            return response.json();

        } catch (error) {
            console.error("Error loading orders.json:", error);
            return []; // Return empty array if fetch fails
        }
    }

    // Loads the orders from LocalStorage and merges with the ones that are loaded
    loadFromLocalStorage(fetchedOrders) {
        const localOrders = JSON.parse(localStorage.getItem("orders")) || [];
        localOrders.forEach(localOrder => {
            if (!fetchedOrders.some(order => order.orderId === localOrder.orderId)) {
                fetchedOrders.push(localOrder);
            }
        });
        return fetchedOrders;
    }

    // Save orders to local storage
    saveToLocalStorage() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }

    getOrderById(orderId) {
        return this.orders.find(order => order.orderId === orderId);
    }

    // Update an order's status and save
    updateOrderStatus(orderId, newStatus) {
        const order = this.getOrderById(orderId);
        if (order) {
            order.status = newStatus;
            this.saveToLocalStorage();
        }
    }

    // Get all active orders (Pending or Taken)
    getActiveOrders() {
        return this.orders.filter(order => order.status === "Pending" || order.status === "Taken");
    }

    updateLocalStorage() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }
}

// function used in vip-info to load orders.json
export async function loadOrders() {
    try {
        const response = await fetch('/webpage/data/orders.json'); // Fetch JSON file
        const orders = await response.json(); // Convert response to JavaScript object
        return orders; // Pass data to controller
    } catch (error) {
        console.error("Error loading orders:", error);
        return []; // Return empty array if fetch fails
    }
}
