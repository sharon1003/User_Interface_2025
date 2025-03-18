// vip_info.js
import UserModel from './user_model.js';
import { loadOrders } from './orders_model.js';

document.addEventListener("DOMContentLoaded", async function() {
    // Get current user
    const currentUser = UserModel.getLoggedInUser();
    
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }
    
    // Display user information
    document.getElementById("BalNum").innerHTML = currentUser.balance;
    document.getElementById("Greeting").innerHTML = currentUser.username;
    
    const showOrder = document.getElementById("show-btn");
    const orderHistoryElement = document.getElementById("OrderHistory");
    
    if (showOrder) {
        showOrder.addEventListener("click", async () => {
            console.log("click show");
            
            try {
                // Load orders from both API and localStorage
                const allOrders = await loadOrders() || [];
                const localOrders = JSON.parse(localStorage.getItem("orders")) || [];
                
                console.log("API Orders:", allOrders);
                console.log("Local Orders:", localOrders);
                
                // Combine orders
                localOrders.forEach(localOrder => {
                    if (!allOrders.some(order => order.orderId === localOrder.orderId)) {
                        allOrders.push(localOrder);
                    }
                });
                
                // Also check for VIP order history
                const vipOrderHistory = JSON.parse(localStorage.getItem(`orderHistory_${currentUser.username}`)) || [];
                console.log("VIP Order History:", vipOrderHistory);
                
                // Filter orders for current user
                const orderHistory = allOrders.filter(order => order.vip === currentUser.username);
                
                // Combine with VIP order history
                const combinedHistory = [...orderHistory, ...vipOrderHistory];
                
                console.log("Combined Order History:", combinedHistory);
                
                // If empty
                if (combinedHistory.length === 0) {
                    orderHistoryElement.innerHTML = "<p>No orders yet.</p>";
                    return;
                }
                
                // Create HTML for order history
                let orderHistoryHTML = "<div class='order-history-container'>";
                
                combinedHistory.forEach((order, index) => {
                    // Handle different order formats
                    const orderDate = order.date || "N/A";
                    const orderAmount = order.amount || order.totalAmount || calculateOrderTotal(order);
                    const orderItems = order.items || [];
                    
                    orderHistoryHTML += `
                        <div class="order-record">
                            <h3>Order #${index + 1} - ${orderDate}</h3>
                            <p><strong>Total Amount:</strong> ${orderAmount} kr</p>
                            <div class="order-items">
                                <ul>
                                    ${orderItems.map(item => `
                                        <li>${item.name} x ${item.quantity} - ${(item.priceinclvat || item.price) * item.quantity} kr</li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    `;
                });
                
                orderHistoryHTML += "</div>";
                orderHistoryElement.innerHTML = orderHistoryHTML;
            } catch (error) {
                console.error("Error loading order history:", error);
                orderHistoryElement.innerHTML = "<p>Error loading orders. Please try again.</p>";
            }
        });
    } else {
        console.error("Show order button not found!");
    }
});

// Helper function to calculate total amount
function calculateOrderTotal(order) {
    if (!order.items || !Array.isArray(order.items)) {
        return 0;
    }
    
    return order.items.reduce((total, item) => {
        const price = item.priceinclvat || item.price || 0;
        const quantity = item.quantity || 1;
        return total + (price * quantity);
    }, 0);
}
/*import UserModel from "./user_model.js";
import {loadOrders} from "./orders_model.js";

const currentUser = UserModel.getLoggedInUser();
const showOrder = document.getElementById("show-btn");

document.getElementById("BalNum").innerHTML = currentUser.balance;
document.getElementById("Greeting").innerHTML = currentUser.username;

showOrder.addEventListener("click", () => {
//function showHistory() {
    console.log("click show");
    const allOrders = loadOrders() || [];
    const localOrders = JSON.parse(localStorage.getItem("orders")) || [];

    console.log(loadOrders);

    localOrders.forEach(localOrder => {
        if (!allOrders.some(order => order.orderId === localOrder.orderId)) {
            allOrders.push(localOrder);
        }
    });
    
    const orderHistory = allOrders.filter(order => order.vip === currentUser);

    //orders.some(order => order.vip === currentUser);
    // If empty
    if (orderHistory.length === 0) {
        orderHistoryElement.innerHTML = "<p>No orders yet.</p>";
        return;
    }
    // Create HTML for order history
    let orderHistoryHTML = "<div class='order-history-container'>";
    
    orderHistory.forEach((order, index) => {
        orderHistoryHTML += `
            <div class="order-record">
                <h3>Order #${index + 1} - ${order.date}</h3>
                <p><strong>Total Amount:</strong> ${order.amount} kr</p>
                <div class="order-items">
                    <ul>
                        ${order.items.map(item => `
                            <li>${item.name} x ${item.quantity} - ${item.priceinclvat * item.quantity} kr</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    });
    
    orderHistoryHTML += "</div>";
    orderHistoryElement.innerHTML = orderHistoryHTML;

});*/

/*
class VIP_Info {
    constructor() {
        this.historyOrders = [];
    }

    async init() {
        const orders = loadOrders() || [];
        this.historyOrders = orders.filter(order => order.vip === currentUser);
    }



    displayOrderHistory() {
        const orderHistoryElement = document.getElementById("OrderHistory");
        
        if (!orderHistoryElement || !currentUser) return;
        
        // Get order history or empty array if none exists
        const orderHistory = this.historyOrders || [];
        
        if (orderHistory.length === 0) {
            orderHistoryElement.innerHTML = "<p>No orders yet.</p>";
            return;
        }
        
        // Create HTML for order history
        let orderHistoryHTML = "<div class='order-history-container'>";
        
        orderHistory.forEach((order, index) => {
            orderHistoryHTML += `
                <div class="order-record">
                    <h3>Order #${index + 1} - ${order.date}</h3>
                    <p><strong>Total Amount:</strong> ${order.amount} kr</p>
                    <div class="order-items">
                        <ul>
                            ${order.items.map(item => `
                                <li>${item.name} x ${item.quantity} - ${item.priceinclvat * item.quantity} kr</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
        });
        
        orderHistoryHTML += "</div>";
        orderHistoryElement.innerHTML = orderHistoryHTML;
    }
}*/