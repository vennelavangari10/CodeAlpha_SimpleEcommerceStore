// ===============================
// Shared Navigation
// ===============================

const updateNavigation = () => {

    const token = localStorage.getItem("token");

    const loginLink =
        document.getElementById("login-link");

    const logoutLink =
        document.getElementById("logout-link");

    if (token) {

        if (loginLink) {
            loginLink.style.display = "none";
        }

        if (logoutLink) {
            logoutLink.style.display = "inline";
        }

    } else {

        if (loginLink) {
            loginLink.style.display = "inline";
        }

        if (logoutLink) {
            logoutLink.style.display = "none";
        }
    }
};


// ===============================
// Logout
// ===============================

const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "index.html";
};


// ===============================
// Cart Count
// ===============================

const updateCartCount = () => {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }

    const cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const totalItems = cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;
};


// ===============================
// Initialize Navigation
// ===============================

updateNavigation();

updateCartCount();


// ===============================
// Logout Event
// ===============================

const logoutLink =
    document.getElementById("logout-link");

if (logoutLink) {

    logoutLink.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            logout();

        }
    );
}