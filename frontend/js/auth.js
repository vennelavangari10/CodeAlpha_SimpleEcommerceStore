const AUTH_API_URL = "http://localhost:5000/api/auth";

// ===============================
// Register User
// ===============================

const registerForm = document.getElementById("register-form");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("register-message");

        try {
            const response = await fetch(
                `${AUTH_API_URL}/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                message.textContent =
                    data.message || "Registration failed.";

                return;
            }

            message.textContent =
                "Registration successful! Redirecting to login...";

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } catch (error) {
            console.error("Registration error:", error);

            message.textContent =
                "Unable to connect to the server.";
        }
    });
}


// ===============================
// Login User
// ===============================

const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document
            .getElementById("login-email")
            .value
            .trim();

        const password = document
            .getElementById("login-password")
            .value;

        const message = document.getElementById(
            "login-message"
        );

        try {
            const response = await fetch(
                `${AUTH_API_URL}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                message.textContent =
                    data.message || "Login failed.";

                return;
            }

            // Store JWT token
            localStorage.setItem(
                "token",
                data.token
            );

            // Store user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            message.textContent =
                "Login successful! Redirecting...";

            loginForm.reset();

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } catch (error) {
            console.error("Login error:", error);

            message.textContent =
                "Unable to connect to the server.";
        }
    });
}