// 模擬庫存資料
let inventory = [
    { id: 1, name: "IPA Beer", stock: 100 },
    { id: 2, name: "Red Wine", stock: 50 },
    { id: 3, name: "Margarita", stock: 30 }
];

// 渲染庫存清單
function renderInventory() {
    const inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = '';
    inventory.forEach(item => {
        const div = document.createElement('div');
        div.className = 'inventory-item';

        div.innerHTML = `
            <span>${item.name}</span>
            <input type="number" value="${item.stock}" min="0" id="stock-${item.id}">
            <button class="update-btn" onclick="updateStock(${item.id})">Update</button>
        `;
        inventoryList.appendChild(div);
    });
}

// 更新庫存
function updateStock(itemId) {
    const input = document.getElementById(`stock-${itemId}`);
    const newStock = parseInt(input.value);
    const item = inventory.find(i => i.id === itemId);
    if (item) {
        item.stock = newStock;
        alert(`${item.name} stock updated to ${newStock}`);
        renderChart();
    }
}

// 渲染銷售報告 (Chart.js)
function renderChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: inventory.map(item => item.name),
            datasets: [{
                label: 'Current Stock',
                data: inventory.map(item => item.stock),
                backgroundColor: ['#d4af37', '#5555ff', '#ff5555']
            }]
        }
    });
}

// 初始化頁面
document.addEventListener('DOMContentLoaded', () => {
    renderInventory();
    renderChart();
});
