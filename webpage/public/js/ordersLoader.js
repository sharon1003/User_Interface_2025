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
