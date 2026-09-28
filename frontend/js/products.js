const API_URL = "http://localhost:5000/api";

// ===============================
// Load Products
// ===============================

const loadProducts = async () => {

    const productsContainer =
        document.getElementById("products-container");

    try {

        const response = await fetch(
            `${API_URL}/products`
        );

        const data = await response.json();

        if (!data.success) {

            productsContainer.innerHTML =
                "<p>Failed to load products.</p>";

            return;
        }

        if (data.products.length === 0) {

            productsContainer.innerHTML =
                "<p>No products available.</p>";

            return;
        }

        productsContainer.innerHTML = "";

        data.products.forEach((product) => {

            const productCard =
                document.createElement("div");

            productCard.className =
                "product-card";

            productCard.innerHTML = `

                <img
                    src="${
                        product.image ||
                        "https://via.placeholder.com/300"
                    }"
                    alt="${product.name}"
                >

                <div class="product-info">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        ${product.description}
                    </p>

                    <div class="product-price">
                        ₹${product.price}
                    </div>

                    <p>
                        Stock: ${product.stock}
                    </p>

                    <div>

                        <button
                            class="primary-button"
                            onclick="addToCart('${product._id}')"
                            ${
                                product.stock === 0
                                    ? "disabled"
                                    : ""
                            }
                        >
                            ${
                                product.stock === 0
                                    ? "Out of Stock"
                                    : "Add to Cart"
                            }
                        </button>

                        <a
                            href="product.html?id=${product._id}"
                            class="details-button"
                        >
                            View Details
                        </a>

                    </div>

                </div>
            `;

            productsContainer.appendChild(
                productCard
            );

        });

    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );

        productsContainer.innerHTML =
            "<p>Unable to connect to the server.</p>";
    }
};


// ===============================
// Add Product to Cart
// ===============================

const addToCart = (productId) => {

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const existingProduct = cart.find(
        (item) =>
            item.product === productId
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            product: productId,
            quantity: 1
        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    // updateCartCount() comes from common.js
    updateCartCount();

    alert(
        "Product added to cart!"
    );
};


// ===============================
// Start
// ===============================

loadProducts();