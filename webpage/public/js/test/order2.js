// 模擬訂單項目
let orderItems = [
    { name: "Braastad XO", price: 442, quantity: 1 },
    { name: "Vanlig Vodka", price: 195, quantity: 2 },
    { name: "Dworek Vodka", price: 190, quantity: 3 }
];

// 渲染訂單清單
function renderOrder() {
    const orderList = document.getElementById('order-list');
    const totalAmountElem = document.getElementById('total-amount');
    orderList.innerHTML = '';
    let total = 0;

    orderItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';

        // 訂單描述
        const infoDiv = document.createElement('div');
        infoDiv.className = 'item-info';
        infoDiv.innerHTML = `${item.name} - $${item.price} × ${item.quantity} = $${item.price * item.quantity}`;

        // 控制按鈕（+、-、刪除）
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'item-controls';

        const increaseBtn = document.createElement('button');
        increaseBtn.className = 'item-btn';
        increaseBtn.textContent = '+';
        increaseBtn.onclick = () => adjustQuantity(index, 1);

        const decreaseBtn = document.createElement('button');
        decreaseBtn.className = 'item-btn';
        decreaseBtn.textContent = '−';
        decreaseBtn.onclick = () => adjustQuantity(index, -1);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'item-btn';
        removeBtn.textContent = '🗑️';
        removeBtn.onclick = () => removeItem(index);

        controlsDiv.append(increaseBtn, decreaseBtn, removeBtn);

        itemDiv.append(infoDiv, controlsDiv);
        orderList.appendChild(itemDiv);

        total += item.price * item.quantity;
    });

    totalAmountElem.textContent = `$${total}`;
}

// 調整數量
function adjustQuantity(index, change) {
    orderItems[index].quantity += change;
    if (orderItems[index].quantity <= 0) {
        orderItems.splice(index, 1);
    }
    renderOrder();
}

// 刪除項目
function removeItem(index) {
    orderItems.splice(index, 1);
    renderOrder();
}

// 提交訂單
function submitOrder() {
    const paymentMethod = document.getElementById('payment-method').value;
    const messageElem = document.getElementById('order-message');

    if (orderItems.length === 0) {
        messageElem.textContent = 'Order is empty!';
        messageElem.style.color = 'red';
        return;
    }

    messageElem.textContent = `Order submitted with ${paymentMethod}. Total: ${document.getElementById('total-amount').textContent}`;
    messageElem.style.color = 'green';

    // 清空訂單
    orderItems = [];
    renderOrder();
}

// 頁面載入後自動渲染
document.addEventListener('DOMContentLoaded', renderOrder);
