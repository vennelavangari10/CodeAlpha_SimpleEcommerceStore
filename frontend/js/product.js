const PRODUCT_API_URL = "http://localhost:5000/api";

// ===============================
// Get Product ID from URL
// ===============================

const urlParams = new URLSearchParams(
    window.location.search
);

const productId = urlParams.get("id");


// ===============================
// Load Product Details
// ===============================

const loadProductDetails = async () => {

    const productDetails =
        document.getElementById("product-details");

    if (!productId) {

        productDetails.innerHTML = `
            <p>
                Product not found.
            </p>

            <a
                href="index.html"
                class="primary-button"
            >
                Back to Products
            </a>
        `;

        return;
    }

    try {

        const response = await fetch(
            `${PRODUCT_API_URL}/products/${productId}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            productDetails.innerHTML = `
                <p>
                    ${data.message || "Product not found."}
                </p>

                <a
                    href="index.html"
                    class="primary-button"
                >
                    Back to Products
                </a>
            `;

            return;
        }

        const product = data.product;

        productDetails.innerHTML = `

            <div class="product-details-card">

                <div class="product-details-image">

                    <img
                        src="${
                            product.image ||
                            "https://via.placeholder.com/500"
                        }"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-details-info">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h1>
                        ${product.name}
                    </h1>

                    <p class="product-details-description">
                        ${product.description}
                    </p>

                    <div class="product-details-price">
                        ₹${product.price}
                    </div>

                    <p>
                        <strong>
                            Available Stock:
                        </strong>

                        ${product.stock}
                    </p>

                    ${
                        product.stock > 0
                            ? `
                                <button
                                    class="primary-button"
                                    onclick="addProductToCart('${product._id}', ${product.stock})"
                                >
                                    Add to Cart
                                </button>
                            `
                            : `
                                <button
                                    class="danger-button"
                                    disabled
                                >
                                    Out of Stock
                                </button>
                            `
                    }

                    <a
                        href="index.html"
                        class="back-button"
                    >
                        ← Back to Products
                    </a>

                </div>

            </div>

        `;

    } catch (error) {

        console.error(
            "Error loading product:",
            error
        );

        productDetails.innerHTML = `
            <p>
                Unable to connect to the server.
            </p>

            <a
                href="index.html"
                class="primary-button"
            >
                Back to Products
            </a>
        `;
    }
};


// ===============================
// Add Product to Cart
// ===============================

const addProductToCart = (
    productId,
    stock
) => {

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const existingProduct = cart.find(
        (item) =>
            item.product === productId
    );


    // Product already exists in cart
    if (existingProduct) {

        if (existingProduct.quantity >= stock) {

            alert(
                "You cannot add more than the available stock."
            );

            return;
        }

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


    // Update cart count
    if (
        typeof updateCartCount ===
        "function"
    ) {
        updateCartCount();
    }


    alert(
        "Product added to cart!"
    );

    window.location.href =
        "cart.html";
};


// ===============================
// Start
// ===============================

loadProductDetails();