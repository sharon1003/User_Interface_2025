// 模擬訂單資料
let orderItems = [
    { name: "Braastad XO", price: 442, quantity: 1 },
    { name: "Vanlig Vodka", price: 195, quantity: 2 }
];

// 渲染訂單摘要
function renderOrderSummary() {
    const orderList = document.getElementById('order-list');
    const totalAmountElem = document.getElementById('total-amount');
    orderList.innerHTML = '';

    let total = 0;
    orderItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price} × ${item.quantity} = $${item.price * item.quantity}`;
        orderList.appendChild(li);
        total += item.price * item.quantity;
    });

    totalAmountElem.textContent = `$${total}`;
}

// 切換信用卡欄位
function toggleCardDetails() {
    const paymentOption = document.getElementById('payment-option').value;
    const cardDetails = document.getElementById('card-details');
    cardDetails.classList.toggle('hidden', paymentOption !== 'credit');
}

// 付款處理
function processPayment() {
    const paymentMethod = document.getElementById('payment-option').value;
    const paymentMessage = document.getElementById('payment-message');

    if (paymentMethod === 'credit') {
        const cardNumber = document.getElementById('card-number').value.trim();
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value.trim();

        if (!cardNumber || !expiryDate || !cvv) {
            paymentMessage.style.color = 'red';
            paymentMessage.textContent = 'Please fill in all credit card details.';
            return;
        }
    }

    paymentMessage.style.color = 'green';
    paymentMessage.textContent = `Payment successful via ${paymentMethod}!`;
    orderItems = [];
    renderOrderSummary();
}

// 頁面加載時渲染
document.addEventListener('DOMContentLoaded', renderOrderSummary);
