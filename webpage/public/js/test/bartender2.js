// 模擬訂單資料
let bartenderOrders = [
    { id: 1, name: "IPA Beer", quantity: 2, status: "pending" },
    { id: 2, name: "Red Wine", quantity: 1, status: "pending" },
    { id: 3, name: "Margarita", quantity: 3, status: "pending" }
];

// 渲染訂單清單
function renderBartenderOrders() {
    const orderList = document.getElementById('order-list');
    const messageElem = document.getElementById('order-message');
    orderList.innerHTML = '';
    bartenderOrders.forEach(order => {
        const item = document.createElement('div');
        item.className = 'order-item';

        const info = document.createElement('div');
        info.className = 'item-info';
        info.textContent = `${order.name} - ${order.quantity} pcs - ${order.status}`;

        const completeBtn = document.createElement('button');
        completeBtn.className = 'item-btn';
        completeBtn.textContent = 'Complete';
        completeBtn.onclick = () => {
            order.status = 'completed';
            renderBartenderOrders();
            messageElem.textContent = `Order ${order.id} completed!`;
        };

        item.appendChild(info);
        item.appendChild(completeBtn);
        orderList.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', renderBartenderOrders);
