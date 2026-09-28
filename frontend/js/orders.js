const ORDERS_API_URL = "http://localhost:5000/api";

// ===============================
// Load My Orders
// ===============================

const loadOrders = async () => {
    const ordersContainer = document.getElementById(
        "orders-container"
    );

    const token = localStorage.getItem("token");

    // Check login
    if (!token) {
        ordersContainer.innerHTML = `
            <div class="empty-orders">

                <h3>Please login to view your orders</h3>

                <a
                    href="login.html"
                    class="primary-button"
                >
                    Login
                </a>

            </div>
        `;

        return;
    }

    try {
        const response = await fetch(
            `${ORDERS_API_URL}/orders/my-orders`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            ordersContainer.innerHTML = `
                <p>
                    ${data.message || "Failed to load orders."}
                </p>
            `;

            return;
        }

        if (data.orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="empty-orders">

                    <h3>No orders yet</h3>

                    <p>
                        Your orders will appear here.
                    </p>

                    <a
                        href="index.html"
                        class="primary-button"
                    >
                        Start Shopping
                    </a>

                </div>
            `;

            return;
        }

        ordersContainer.innerHTML = "";

        data.orders.forEach((order) => {

            const orderCard =
                document.createElement("div");

            orderCard.className = "order-card";

            let itemsHTML = "";

            order.items.forEach((item) => {

                const productName =
                    item.product
                        ? item.product.name
                        : "Product";

                itemsHTML += `
                    <div class="order-item">

                        <span>
                            ${productName}
                        </span>

                        <span>
                            ${item.quantity} × ₹${item.price}
                        </span>

                    </div>
                `;
            });

            orderCard.innerHTML = `

                <div class="order-header">

                    <div>
                        <strong>Order ID:</strong>

                        <span>
                            ${order._id}
                        </span>
                    </div>

                    <span class="order-status">
                        ${order.status}
                    </span>

                </div>


                <div class="order-items">

                    ${itemsHTML}

                </div>


                <div class="order-footer">

                    <strong>
                        Total: ₹${order.totalAmount}
                    </strong>

                    ${
                        order.status === "Pending"
                            ? `
                                <button
                                    class="danger-button"
                                    onclick="cancelOrder('${order._id}')"
                                >
                                    Cancel Order
                                </button>
                            `
                            : ""
                    }

                </div>

            `;

            ordersContainer.appendChild(
                orderCard
            );
        });

    } catch (error) {

        console.error(
            "Error loading orders:",
            error
        );

        ordersContainer.innerHTML =
            "<p>Unable to connect to the server.</p>";
    }
};


// ===============================
// Cancel Order
// ===============================

const cancelOrder = async (orderId) => {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const confirmCancel = confirm(
        "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
        return;
    }

    try {

        const response = await fetch(
            `${ORDERS_API_URL}/orders/${orderId}/cancel`,
            {
                method: "PUT",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Failed to cancel order."
            );

            return;
        }

        alert(
            "Order cancelled successfully!"
        );

        loadOrders();

    } catch (error) {

        console.error(
            "Cancel order error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
};


// ===============================
// Initialize
// ===============================

loadOrders();