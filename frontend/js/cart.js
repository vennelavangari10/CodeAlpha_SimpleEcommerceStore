const CART_API_URL = "http://localhost:5000/api";

// ===============================
// Load Cart
// ===============================

const loadCart = async () => {

    const cartContainer =
        document.getElementById("cart-container");

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add some products to your cart.
                </p>

                <a
                    href="index.html"
                    class="primary-button"
                >
                    Continue Shopping
                </a>

            </div>
        `;

        return;
    }

    cartContainer.innerHTML =
        "<p>Loading cart...</p>";

    try {

        const response = await fetch(
            `${CART_API_URL}/products`
        );

        const data = await response.json();

        if (!data.success) {

            cartContainer.innerHTML =
                "<p>Failed to load products.</p>";

            return;
        }

        let totalAmount = 0;

        let cartHTML = `
            <div class="cart-items">
        `;

        const validCart = [];

        for (const cartItem of cart) {

            const product = data.products.find(
                (item) =>
                    item._id === cartItem.product
            );

            // Product no longer exists
            if (!product) {
                continue;
            }

            // Keep quantity within available stock
            if (cartItem.quantity > product.stock) {
                cartItem.quantity = product.stock;
            }

            // Remove product if stock is zero
            if (product.stock === 0) {
                continue;
            }

            validCart.push(cartItem);

            const itemTotal =
                product.price * cartItem.quantity;

            totalAmount += itemTotal;

            cartHTML += `

                <div class="cart-item">

                    <img
                        src="${
                            product.image ||
                            "https://via.placeholder.com/150"
                        }"
                        alt="${product.name}"
                    >

                    <div class="cart-item-info">

                        <h3>
                            ${product.name}
                        </h3>

                        <p>
                            Price:
                            ₹${product.price}
                        </p>

                        <p>
                            Available Stock:
                            ${product.stock}
                        </p>

                        <div class="quantity-controls">

                            <button
                                onclick="decreaseQuantity('${product._id}')"
                            >
                                -
                            </button>

                            <span>
                                ${cartItem.quantity}
                            </span>

                            <button
                                onclick="increaseQuantity('${product._id}', ${product.stock})"
                                ${
                                    cartItem.quantity >= product.stock
                                        ? "disabled"
                                        : ""
                                }
                            >
                                +
                            </button>

                        </div>

                        <p>
                            Item Total:
                            <strong>
                                ₹${itemTotal}
                            </strong>
                        </p>

                        <button
                            class="danger-button"
                            onclick="removeFromCart('${product._id}')"
                        >
                            Remove
                        </button>

                    </div>

                </div>
            `;
        }


        // ===============================
        // Handle Invalid / Empty Cart
        // ===============================

        if (validCart.length === 0) {

            cartContainer.innerHTML = `
                <div class="empty-cart">

                    <h3>
                        Your cart is empty
                    </h3>

                    <p>
                        The products in your cart are no longer available.
                    </p>

                    <a
                        href="index.html"
                        class="primary-button"
                    >
                        Continue Shopping
                    </a>

                </div>
            `;

            localStorage.removeItem("cart");

            if (
                typeof updateCartCount ===
                "function"
            ) {
                updateCartCount();
            }

            return;
        }


        // ===============================
        // Cart Summary
        // ===============================

        cartHTML += `
            </div>

            <div class="cart-summary">

                <h3>
                    Total:
                    ₹${totalAmount}
                </h3>

                <button
                    class="primary-button"
                    onclick="placeOrder()"
                >
                    Place Order
                </button>

            </div>
        `;


        cartContainer.innerHTML =
            cartHTML;


        // Save corrected cart
        localStorage.setItem(
            "cart",
            JSON.stringify(validCart)
        );


        // Update navbar cart count
        if (
            typeof updateCartCount ===
            "function"
        ) {
            updateCartCount();
        }

    } catch (error) {

        console.error(
            "Error loading cart:",
            error
        );

        cartContainer.innerHTML =
            "<p>Unable to connect to the server.</p>";
    }
};


// ===============================
// Increase Quantity
// ===============================

const increaseQuantity = (
    productId,
    stock
) => {

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const item = cart.find(
        (cartItem) =>
            cartItem.product === productId
    );

    if (item) {

        if (item.quantity < stock) {

            item.quantity += 1;

        } else {

            alert(
                "You cannot add more than the available stock."
            );
        }
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    loadCart();
};


// ===============================
// Decrease Quantity
// ===============================

const decreaseQuantity = (productId) => {

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const item = cart.find(
        (cartItem) =>
            cartItem.product === productId
    );

    if (item) {

        item.quantity -= 1;

        if (item.quantity <= 0) {

            cart = cart.filter(
                (cartItem) =>
                    cartItem.product !== productId
            );
        }
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    loadCart();
};


// ===============================
// Remove From Cart
// ===============================

const removeFromCart = (productId) => {

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    cart = cart.filter(
        (cartItem) =>
            cartItem.product !== productId
    );

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    loadCart();
};


// ===============================
// Place Order
// ===============================

const placeOrder = async () => {

    const token =
        localStorage.getItem("token");

    if (!token) {

        alert(
            "Please login before placing an order."
        );

        window.location.href =
            "login.html";

        return;
    }

    const cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }

    try {

        const response = await fetch(
            `${CART_API_URL}/orders`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    items: cart
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Failed to place order."
            );

            return;
        }

        alert(
            "Order placed successfully!"
        );

        localStorage.removeItem("cart");

        window.location.href =
            "orders.html";

    } catch (error) {

        console.error(
            "Order error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
};


// ===============================
// Start
// ===============================

loadCart();