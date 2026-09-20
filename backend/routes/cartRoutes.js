const express = require("express");
const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Product = require("../models/Product");

const authMiddleware =
    require("../middleware/authMiddleware");


const router = express.Router();


// ==================================================
// GET MY CART
// ==================================================

router.get(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const cart =
                await Cart.findOne({
                    user: req.user.userId
                }).populate(
                    "items.product"
                );


            if (!cart) {

                return res.status(200).json({

                    success: true,

                    cart: {
                        items: []
                    }

                });

            }


            // Remove deleted products
            const validItems =
                cart.items.filter(
                    item => item.product
                );


            if (
                validItems.length !==
                cart.items.length
            ) {

                cart.items =
                    validItems;

                await cart.save();

            }


            res.status(200).json({

                success: true,

                cart

            });


        } catch (error) {

            console.error(
                "Get Cart Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch cart"

            });

        }

    }
);


// ==================================================
// ADD PRODUCT TO CART
// ==================================================

router.post(
    "/add",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                productId,
                quantity
            } = req.body;


            // Product ID required
            if (!productId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Product ID is required"

                });

            }


            // Validate MongoDB ID
            if (
                !mongoose.Types.ObjectId.isValid(
                    productId
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid product ID"

                });

            }


            // Find product
            const product =
                await Product.findById(
                    productId
                );


            if (!product) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found"

                });

            }


            // Check stock
            if (
                product.stock <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Product is out of stock"

                });

            }


            // Quantity
            const requestedQuantity =
                quantity === undefined
                    ? 1
                    : Number(quantity);


            if (
                !Number.isInteger(
                    requestedQuantity
                ) ||
                requestedQuantity < 1
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Quantity must be a positive whole number"

                });

            }


            if (
                requestedQuantity >
                product.stock
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        `Only ${product.stock} item(s) available`

                });

            }


            // Find user's cart
            let cart =
                await Cart.findOne({
                    user: req.user.userId
                });


            if (!cart) {

                cart =
                    new Cart({

                        user:
                            req.user.userId,

                        items: []

                    });

            }


            // Find existing item
            const existingItem =
                cart.items.find(
                    item =>
                        item.product.toString() ===
                        productId
                );


            if (existingItem) {

                const newQuantity =
                    existingItem.quantity +
                    requestedQuantity;


                if (
                    newQuantity >
                    product.stock
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            `Only ${product.stock} item(s) available`

                    });

                }


                existingItem.quantity =
                    newQuantity;

            } else {

                cart.items.push({

                    product:
                        productId,

                    quantity:
                        requestedQuantity

                });

            }


            await cart.save();


            const updatedCart =
                await Cart.findById(
                    cart._id
                ).populate(
                    "items.product"
                );


            res.status(200).json({

                success: true,

                message:
                    "Product added to cart successfully",

                cart:
                    updatedCart

            });


        } catch (error) {

            console.error(
                "Add Cart Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to add product to cart"

            });

        }

    }
);


// ==================================================
// UPDATE CART QUANTITY
// ==================================================

router.put(
    "/update",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                productId,
                quantity
            } = req.body;


            if (!productId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Product ID is required"

                });

            }


            if (
                !mongoose.Types.ObjectId.isValid(
                    productId
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid product ID"

                });

            }


            const newQuantity =
                Number(quantity);


            if (
                !Number.isInteger(
                    newQuantity
                ) ||
                newQuantity < 1
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Quantity must be a positive whole number"

                });

            }


            const product =
                await Product.findById(
                    productId
                );


            if (!product) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found"

                });

            }


            if (
                product.stock <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Product is out of stock"

                });

            }


            if (
                newQuantity >
                product.stock
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        `Only ${product.stock} item(s) available`

                });

            }


            const cart =
                await Cart.findOne({
                    user: req.user.userId
                });


            if (!cart) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Cart not found"

                });

            }


            const item =
                cart.items.find(
                    item =>
                        item.product.toString() ===
                        productId
                );


            if (!item) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product is not in cart"

                });

            }


            item.quantity =
                newQuantity;


            await cart.save();


            const updatedCart =
                await Cart.findById(
                    cart._id
                ).populate(
                    "items.product"
                );


            res.status(200).json({

                success: true,

                message:
                    "Cart updated successfully",

                cart:
                    updatedCart

            });


        } catch (error) {

            console.error(
                "Update Cart Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to update cart"

            });

        }

    }
);


// ==================================================
// REMOVE PRODUCT FROM CART
// ==================================================

router.delete(
    "/remove",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                productId
            } = req.body;


            if (!productId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Product ID is required"

                });

            }


            if (
                !mongoose.Types.ObjectId.isValid(
                    productId
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid product ID"

                });

            }


            const cart =
                await Cart.findOne({
                    user: req.user.userId
                });


            if (!cart) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Cart not found"

                });

            }


            const oldLength =
                cart.items.length;


            cart.items =
                cart.items.filter(
                    item =>
                        item.product.toString() !==
                        productId
                );


            if (
                cart.items.length ===
                oldLength
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product is not in cart"

                });

            }


            await cart.save();


            const updatedCart =
                await Cart.findById(
                    cart._id
                ).populate(
                    "items.product"
                );


            res.status(200).json({

                success: true,

                message:
                    "Product removed from cart",

                cart:
                    updatedCart

            });


        } catch (error) {

            console.error(
                "Remove Cart Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to remove product"

            });

        }

    }
);


// ==================================================
// CLEAR CART
// ==================================================

router.delete(
    "/clear",
    authMiddleware,
    async (req, res) => {

        try {

            const cart =
                await Cart.findOne({
                    user: req.user.userId
                });


            if (!cart) {

                return res.status(200).json({

                    success: true,

                    message:
                        "Cart is already empty"

                });

            }


            cart.items = [];


            await cart.save();


            res.status(200).json({

                success: true,

                message:
                    "Cart cleared successfully"

            });


        } catch (error) {

            console.error(
                "Clear Cart Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to clear cart"

            });

        }

    }
);


// ==================================================
// EXPORT
// ==================================================

module.exports = router;