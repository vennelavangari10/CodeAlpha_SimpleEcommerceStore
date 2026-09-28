const Order = require("../models/Order");
const Product = require("../models/Product");

// Create Order
const createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one product"
            });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {

            if (!item.product || !item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Product and quantity are required"
                });
            }

            if (item.quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Quantity must be at least 1"
                });
            }

            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for ${product.name}`
                });
            }

            const itemTotal =
                product.price * item.quantity;

            totalAmount += itemTotal;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        const order = await Order.create({
            user: req.user.userId,
            items: orderItems,
            totalAmount
        });

        // Reduce stock after order creation
        for (const item of orderItems) {

            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message
        });
    }
};


// Get My Orders
const getMyOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            user: req.user.userId
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};


// Get Single Order
const getOrderById = async (req, res) => {
    try {

        const order = await Order.findById(req.params.id)
            .populate("items.product");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (
            order.user.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to view this order"
            });
        }

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: error.message
        });
    }
};


// Cancel Order
const cancelOrder = async (req, res) => {
    try {

        const order = await Order.findById(
            req.params.id
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (
            order.user.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to cancel this order"
            });
        }

        if (order.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending orders can be cancelled"
            });
        }

        // Restore stock
        for (const item of order.items) {

            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: item.quantity
                    }
                }
            );
        }

        order.status = "Cancelled";

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to cancel order",
            error: error.message
        });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder
};