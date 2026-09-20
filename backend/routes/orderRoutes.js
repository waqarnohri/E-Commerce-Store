const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");

const router = express.Router();


// ==================================================
// CHECKOUT
// ==================================================

router.post(
    "/checkout",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                shippingAddress,
                paymentMethod
            } = req.body;


            // ------------------------------------------
            // Validate shipping address
            // ------------------------------------------

            if (
                !shippingAddress ||
                !String(shippingAddress).trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Shipping address is required"

                });

            }


            // ------------------------------------------
            // Payment method
            // ------------------------------------------

            const selectedPaymentMethod =
                paymentMethod ||
                "Cash on Delivery";


            // ------------------------------------------
            // Get user's cart
            // ------------------------------------------

            const cart =
                await Cart.findOne({
                    user: req.user.userId
                }).populate(
                    "items.product"
                );


            if (!cart) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Your cart is empty"

                });

            }


            if (
                !cart.items ||
                cart.items.length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Your cart is empty"

                });

            }


            // ------------------------------------------
            // Check every cart item
            // ------------------------------------------

            const orderItems = [];

            let totalAmount = 0;


            for (
                const cartItem of cart.items
            ) {

                // Product deleted from database
                if (!cartItem.product) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "One of the products in your cart no longer exists. Please update your cart."

                    });

                }


                const product =
                    cartItem.product;


                // Check stock
                if (
                    product.stock <= 0
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            `${product.name} is out of stock`

                    });

                }


                // Check requested quantity
                if (
                    cartItem.quantity >
                    product.stock
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            `${product.name} has only ${product.stock} item(s) available`

                    });

                }


                // Validate quantity
                if (
                    !Number.isInteger(
                        cartItem.quantity
                    ) ||
                    cartItem.quantity < 1
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            `Invalid quantity for ${product.name}`

                    });

                }


                const itemTotal =
                    product.price *
                    cartItem.quantity;


                totalAmount +=
                    itemTotal;


                orderItems.push({

                    product:
                        product._id,

                    name:
                        product.name,

                    price:
                        product.price,

                    quantity:
                        cartItem.quantity

                });

            }


            // ------------------------------------------
            // Create order
            // ------------------------------------------

            const order =
                await Order.create({

                    user:
                        req.user.userId,

                    items:
                        orderItems,

                    totalAmount:
                        totalAmount,

                    shippingAddress:
                        String(
                            shippingAddress
                        ).trim(),

                    paymentMethod:
                        selectedPaymentMethod,

                    orderStatus:
                        "Pending"

                });


            // ------------------------------------------
            // Reduce stock
            // ------------------------------------------

            for (
                const cartItem of cart.items
            ) {

                const product =
                    cartItem.product;


                await Product.findOneAndUpdate(

                    {
                        _id:
                            product._id,

                        stock:
                            {
                                $gte:
                                    cartItem.quantity
                            }
                    },

                    {
                        $inc:
                            {
                                stock:
                                    -cartItem.quantity
                            }
                    }

                );

            }


            // ------------------------------------------
            // Clear cart
            // ------------------------------------------

            cart.items = [];

            await cart.save();


            // ------------------------------------------
            // Response
            // ------------------------------------------

            res.status(201).json({

                success: true,

                message:
                    "Order placed successfully",

                order

            });


        } catch (error) {

            console.error(
                "Checkout Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to place order"

            });

        }

    }
);


// ==================================================
// GET MY ORDERS
// ==================================================

router.get(
    "/my-orders",
    authMiddleware,
    async (req, res) => {

        try {

            const orders =
                await Order.find({

                    user:
                        req.user.userId

                })
                .populate(
                    "items.product"
                )
                .sort({
                    createdAt: -1
                });


            res.status(200).json({

                success: true,

                count:
                    orders.length,

                orders

            });


        } catch (error) {

            console.error(
                "My Orders Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch your orders"

            });

        }

    }
);


// ==================================================
// GET SINGLE MY ORDER
// ==================================================

router.get(
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const { id } =
                req.params;


            // Validate ID
            if (
                !mongoose.Types.ObjectId.isValid(id)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid order ID"

                });

            }


            const order =
                await Order.findOne({

                    _id:
                        id,

                    user:
                        req.user.userId

                }).populate(
                    "items.product"
                );


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found"

                });

            }


            res.status(200).json({

                success: true,

                order

            });


        } catch (error) {

            console.error(
                "Single Order Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch order"

            });

        }

    }
);


// ==================================================
// ADMIN - GET ALL ORDERS
// ==================================================

router.get(
    "/admin/all",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const orders =
                await Order.find()
                    .populate(
                        "user",
                        "name email"
                    )
                    .populate(
                        "items.product"
                    )
                    .sort({
                        createdAt: -1
                    });


            res.status(200).json({

                success: true,

                count:
                    orders.length,

                orders

            });


        } catch (error) {

            console.error(
                "Admin Orders Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch all orders"

            });

        }

    }
);


// ==================================================
// ADMIN - UPDATE ORDER STATUS
// ==================================================

router.put(
    "/admin/:id/status",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const { id } =
                req.params;


            const {
                orderStatus
            } = req.body;


            // Validate ID
            if (
                !mongoose.Types.ObjectId.isValid(id)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid order ID"

                });

            }


            // Allowed statuses
            const allowedStatuses = [

                "Pending",

                "Confirmed",

                "Shipped",

                "Delivered",

                "Cancelled"

            ];


            if (
                !allowedStatuses.includes(
                    orderStatus
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid order status"

                });

            }


            const order =
                await Order.findById(id);


            if (!order) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Order not found"

                });

            }


            // ------------------------------------------
            // Prevent changing cancelled order
            // ------------------------------------------

            if (
                order.orderStatus ===
                "Cancelled"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Cancelled order cannot be changed"

                });

            }


            // ------------------------------------------
            // Prevent changing delivered order
            // ------------------------------------------

            if (
                order.orderStatus ===
                "Delivered" &&
                orderStatus !==
                "Delivered"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Delivered order cannot be moved back"

                });

            }


            order.orderStatus =
                orderStatus;


            await order.save();


            res.status(200).json({

                success: true,

                message:
                    "Order status updated successfully",

                order

            });


        } catch (error) {

            console.error(
                "Update Order Status Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to update order status"

            });

        }

    }
);


// ==================================================
// EXPORT
// ==================================================

module.exports = router;