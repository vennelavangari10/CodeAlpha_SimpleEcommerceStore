const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new order
router.post("/", protect, createOrder);

// Get all orders of logged-in user
router.get("/my-orders", protect, getMyOrders);

// Get a single order
router.get("/:id", protect, getOrderById);

// Cancel an order
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;