class OrdersModel {
    constructor() {
        this.orders = [];
    }

    async loadOrders() {
        try {
            const response = await fetch('../public/data/orders.json');
            this.orders = await response.json();
        } catch (error) {
            console.error("Error loading orders:", error);
        }
    }

    getOrders() {
        return this.orders;
    }

    getOrderById(orderId) {
        return this.orders.find(order => order.orderId === orderId);
    }
}

export default OrdersModel;