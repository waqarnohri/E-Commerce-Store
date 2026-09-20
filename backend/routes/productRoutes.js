const express = require("express");
const mongoose = require("mongoose");

const Product = require("../models/Product");

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");


const router = express.Router();


// ==================================================
// GET ALL PRODUCTS
// Public Route
// ==================================================

router.get("/", async (req, res) => {

    try {

        const products =
            await Product.find()
                .sort({
                    createdAt: -1
                });


        res.status(200).json({

            success: true,

            count: products.length,

            products

        });


    } catch (error) {

        console.error(
            "Get Products Error:",
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch products"

        });

    }

});


// ==================================================
// GET SINGLE PRODUCT
// Public Route
// ==================================================

router.get("/:id", async (req, res) => {

    try {

        const { id } =
            req.params;


        // Check MongoDB ID
        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid product ID"

            });

        }


        const product =
            await Product.findById(id);


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });

        }


        res.status(200).json({

            success: true,

            product

        });


    } catch (error) {

        console.error(
            "Get Product Error:",
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch product"

        });

    }

});


// ==================================================
// ADD PRODUCT
// Admin Only
// ==================================================

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const {
                name,
                description,
                price,
                category,
                image,
                stock
            } = req.body;


            // Required fields
            if (
                !name ||
                !description ||
                price === undefined ||
                !category
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name, description, price and category are required"

                });

            }


            // Convert values
            const productPrice =
                Number(price);


            const productStock =
                stock === undefined
                    ? 0
                    : Number(stock);


            // Validate price
            if (
                Number.isNaN(productPrice) ||
                productPrice < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Price must be a valid positive number"

                });

            }


            // Validate stock
            if (
                Number.isNaN(productStock) ||
                productStock < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Stock must be a valid positive number"

                });

            }


            const product =
                await Product.create({

                    name:
                        String(name).trim(),

                    description:
                        String(description).trim(),

                    price:
                        productPrice,

                    category:
                        String(category).trim(),

                    image:
                        image
                            ? String(image).trim()
                            : "",

                    stock:
                        productStock

                });


            res.status(201).json({

                success: true,

                message:
                    "Product added successfully",

                product

            });


        } catch (error) {

            console.error(
                "Add Product Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to add product"

            });

        }

    }
);


// ==================================================
// UPDATE PRODUCT
// Admin Only
// ==================================================

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const { id } =
                req.params;


            // Check ID
            if (
                !mongoose.Types.ObjectId.isValid(id)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid product ID"

                });

            }


            const {
                name,
                description,
                price,
                category,
                image,
                stock
            } = req.body;


            // Build update object
            const updateData = {};


            if (
                name !== undefined
            ) {

                if (
                    !String(name).trim()
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Product name cannot be empty"

                    });

                }


                updateData.name =
                    String(name).trim();

            }


            if (
                description !== undefined
            ) {

                if (
                    !String(description).trim()
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Description cannot be empty"

                    });

                }


                updateData.description =
                    String(description).trim();

            }


            if (
                category !== undefined
            ) {

                if (
                    !String(category).trim()
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Category cannot be empty"

                    });

                }


                updateData.category =
                    String(category).trim();

            }


            if (
                price !== undefined
            ) {

                const newPrice =
                    Number(price);


                if (
                    Number.isNaN(newPrice) ||
                    newPrice < 0
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Price must be a valid positive number"

                    });

                }


                updateData.price =
                    newPrice;

            }


            if (
                stock !== undefined
            ) {

                const newStock =
                    Number(stock);


                if (
                    Number.isNaN(newStock) ||
                    newStock < 0
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Stock must be a valid positive number"

                    });

                }


                updateData.stock =
                    newStock;

            }


            if (
                image !== undefined
            ) {

                updateData.image =
                    String(image).trim();

            }


            // No data
            if (
                Object.keys(updateData)
                    .length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "No product data provided"

                });

            }


            const product =
                await Product.findByIdAndUpdate(
                    id,
                    updateData,
                    {
                        new: true,
                        runValidators: true
                    }
                );


            if (!product) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found"

                });

            }


            res.status(200).json({

                success: true,

                message:
                    "Product updated successfully",

                product

            });


        } catch (error) {

            console.error(
                "Update Product Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to update product"

            });

        }

    }
);


// ==================================================
// DELETE PRODUCT
// Admin Only
// ==================================================

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {

        try {

            const { id } =
                req.params;


            // Check ID
            if (
                !mongoose.Types.ObjectId.isValid(id)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid product ID"

                });

            }


            const product =
                await Product.findByIdAndDelete(
                    id
                );


            if (!product) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found"

                });

            }


            res.status(200).json({

                success: true,

                message:
                    "Product deleted successfully"

            });


        } catch (error) {

            console.error(
                "Delete Product Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to delete product"

            });

        }

    }
);


// ==================================================
// EXPORT
// ==================================================

module.exports = router;