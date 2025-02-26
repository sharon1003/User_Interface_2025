// 模擬菜單資料
const menuItems = [
    { name: "IPA Beer", type: "drink", alcohol: 5.4, allergy: "gluten", stock: 6, img: "../public/images/drinks/ipa.png" },
    { name: "Merlot Wine", type: "drink", alcohol: 12.5, allergy: "none", stock: 4, img: "../public/images/drinks/wine.png" },
    { name: "Margarita", type: "drink", alcohol: 15, allergy: "none", stock: 10, img: "../public/images/drinks/cocktail.png" },
    { name: "Bar Snacks", type: "food", allergy: "nuts", stock: 5, img: "../public/images/food/snacks.png" },
    { name: "Bar Snacks", type: "food", allergy: "nuts", stock: 5, img: "../public/images/food/snacks.png" },
    { name: "Ba Snacks", type: "food", allergy: "nuts", stock: 5, img: "../public/images/food/snacks.png" },
    { name: "Br Snacks", type: "food", allergy: "nuts", stock: 5, img: "../public/images/food/snacks.png" },
    { name: "Bar nacks", type: "food", allergy: "nuts", stock: 5, img: "../public/images/food/snacks.png" },
    { name: "Bar Sncks", type: "food", allergy: "nuts", stock: 5, img: "../public/images/food/snacks.png" },
    { name: "Bar Sncs", type: "food", allergy: "nuts", stock: 5, img: "../public/images/food/snacks.png" },
    { name: "Bar Snaks", type: "food", allergy: "nuts", stock: 5, img: "../public/images/food/snacks.png" },
    { name: "Bar acks", type: "food", allergy: "nuts", stock: 5, img: "../public/images/food/snacks.png" },

];

const drinkList = document.getElementById('drink-list');
const foodList = document.getElementById('food-list');

// 將菜單渲染至頁面
function renderMenu() {
    drinkList.innerHTML = '';
    foodList.innerHTML = '';

    menuItems.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('menu-item');
        if (item.stock < 5) {
            div.classList.add('low-stock');
        }
        div.setAttribute('draggable', true);
        div.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', item.name);
        });

        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>Alcohol: ${item.alcohol || 'N/A'}%</p>
            <p>Allergy: ${item.allergy}</p>
            <p>Stock: ${item.stock}</p>
            <button class="order-btn" onclick="addToOrder('${item.name}')">Add to Order</button>
        `;

        if (item.type === 'drink') {
            drinkList.appendChild(div);
        } else {
            foodList.appendChild(div);
        }
    });
}

// 訂單管理
const orderCart = document.getElementById('order-cart');
function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const itemName = event.dataTransfer.getData('text/plain');
    addToOrder(itemName);
}

function addToOrder(itemName) {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.textContent = itemName;
    orderCart.appendChild(orderItem);
}

function submitOrder() {
    const items = Array.from(orderCart.children).map(item => item.textContent);
    alert(`Order submitted: ${items.join(', ')}`);
    orderCart.innerHTML = ''; // 清空訂單
}

// 篩選功能
function applyFilter() {
    const selectedAllergy = document.getElementById('allergy').value;
    const alcoholLimit = document.getElementById('alcohol').value;
    document.getElementById('alcohol-value').textContent = `${alcoholLimit}%`;

    // 重新渲染菜單並根據篩選條件過濾
    renderMenu();

    document.querySelectorAll('.menu-item').forEach(item => {
        const alcohol = parseFloat(item.querySelector('p:nth-of-type(1)').textContent.split(': ')[1]);
        const allergy = item.querySelector('p:nth-of-type(2)').textContent.split(': ')[1];

        if ((selectedAllergy !== 'all' && allergy !== selectedAllergy) || alcohol > alcoholLimit) {
            item.style.display = 'none';
        } else {
            item.style.display = 'block';
        }
    });
}

// 初始化菜單
renderMenu();
