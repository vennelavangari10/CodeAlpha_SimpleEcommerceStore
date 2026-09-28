# CodeAlpha Simple E-Commerce Store

A full-stack e-commerce web application developed as part of the **CodeAlpha Full Stack Development Internship**.

The application allows users to browse products, view product details, manage a shopping cart, register and log in, place orders, and view or cancel their orders.

---

## Features

### User Features

- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Protected user profile and order routes
- Logout functionality

### Product Features

- Display all products
- Product details page
- Product categories
- Product prices
- Product stock information
- Add products to cart
- Stock-aware cart quantity control

### Shopping Cart

- Add products to cart
- Increase product quantity
- Decrease product quantity
- Remove products from cart
- Automatic cart total calculation
- Dynamic cart item count
- Stock validation

### Order Management

- Place orders
- Automatically calculate order total
- Automatically reduce product stock
- View user's orders
- View order status
- Cancel pending orders
- Automatically restore stock after cancellation

### Database

The application uses MongoDB to store:

- Users
- Products
- Orders

---

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- LocalStorage
- Fetch API

### Backend

- Node.js
- Express.js
- Mongoose
- MongoDB
- JWT
- bcryptjs
- CORS
- dotenv

### Development Tools

- Visual Studio Code
- MongoDB Atlas
- Postman
- Git
- GitHub
- Live Server

---

## Project Structure

```text
CodeAlpha_SimpleEcommerceStore/
│
├── backend/
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── common.js
│   │   ├── orders.js
│   │   ├── product.js
│   │   └── products.js
│   │
│   ├── cart.html
│   ├── index.html
│   ├── login.html
│   ├── orders.html
│   ├── product.html
│   └── register.html
│
└── README.md