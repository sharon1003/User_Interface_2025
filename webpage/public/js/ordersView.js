class OrdersView {
    constructor(controller) {
        this.controller = controller;
        this.orderContainer = document.querySelector('.order-details'); // Select the orders container
    }

    renderOrders(orders) {
        this.orderContainer.innerHTML = ""; // Clear previous content

        orders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.classList.add('order-card');

            const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

            orderCard.innerHTML = `
                <h3>#${order.orderId}</h3>
                <p>${order.date}</p>
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="order-info">
                            <p><strong>${item.name}</strong></p>
                            <p>Qty: ${item.quantity} | SEK ${item.price}</p>
                        </div>
                    </div>
                `).join('')}
                <p><strong>In Total: SEK ${totalPrice}</strong></p>
                ${this.getOrderButtons(order)}
            `;

            this.orderContainer.appendChild(orderCard);
        });
    }

    getOrderButtons(order) {
        if (order.status === "Pending") {
            return `
                <button class="reject-btn" data-id="${order.orderId}">Reject</button>
                <button class="confirm-btn" data-id="${order.orderId}">Confirm</button>
            `;
        } else {
            return `<button class="checkout-btn" data-id="${order.orderId}">Check Out</button>`;
        }
    }
}

export default OrdersView;