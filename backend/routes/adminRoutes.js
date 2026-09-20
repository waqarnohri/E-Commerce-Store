const express = require("express");

const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");

const router = express.Router();


// =====================================================
// ADMIN DASHBOARD STATISTICS
// =====================================================

router.get(
    "/dashboard",
    async (req, res) => {

        try {

            // =============================
            // TOTAL PRODUCTS
            // =============================

            const totalProducts =
                await Product.countDocuments();


            // =============================
            // TOTAL USERS
            // =============================

            const totalUsers =
                await User.countDocuments();


            // =============================
            // TOTAL ORDERS
            // =============================

            const totalOrders =
                await Order.countDocuments();


            // =============================
            // PENDING ORDERS
            // =============================

            const pendingOrders =
                await Order.countDocuments({
                    orderStatus: "Pending"
                });


            // =============================
            // CONFIRMED ORDERS
            // =============================

            const confirmedOrders =
                await Order.countDocuments({
                    orderStatus: "Confirmed"
                });


            // =============================
            // SHIPPED ORDERS
            // =============================

            const shippedOrders =
                await Order.countDocuments({
                    orderStatus: "Shipped"
                });


            // =============================
            // DELIVERED ORDERS
            // =============================

            const deliveredOrders =
                await Order.countDocuments({
                    orderStatus: "Delivered"
                });


            // =============================
            // CANCELLED ORDERS
            // =============================

            const cancelledOrders =
                await Order.countDocuments({
                    orderStatus: "Cancelled"
                });


            // =============================
            // TOTAL SALES
            // =============================

            const salesResult =
                await Order.aggregate([

                    {
                        $match: {
                            orderStatus: {
                                $ne: "Cancelled"
                            }
                        }
                    },

                    {
                        $group: {

                            _id: null,

                            totalSales: {
                                $sum:
                                    "$totalAmount"
                            }

                        }
                    }

                ]);


            const totalSales =
                salesResult.length > 0
                    ? salesResult[0].totalSales
                    : 0;


            // =============================
            // RECENT ORDERS
            // =============================

            const recentOrders =
                await Order.find()
                    .populate(
                        "user",
                        "name email"
                    )
                    .sort({
                        createdAt: -1
                    })
                    .limit(5);


            // =============================
            // LOW STOCK PRODUCTS
            // =============================

            const lowStockProducts =
                await Product.find({
                    stock: {
                        $lte: 5
                    }
                })
                .sort({
                    stock: 1
                })
                .limit(5);


            // =============================
            // RESPONSE
            // =============================

            res.status(200).json({

                success: true,

                statistics: {

                    totalProducts,

                    totalUsers,

                    totalOrders,

                    pendingOrders,

                    confirmedOrders,

                    shippedOrders,

                    deliveredOrders,

                    cancelledOrders,

                    totalSales

                },

                recentOrders,

                lowStockProducts

            });


        } catch (error) {

            console.error(error);


            res.status(500).json({

                success: false,

                message:
                    "Failed to load dashboard",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;