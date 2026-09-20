const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const authMiddleware =
    require("../middleware/authMiddleware");


const router = express.Router();


// ==================================================
// REGISTER
// ==================================================

router.post(
    "/register",
    async (req, res) => {

        try {

            const {
                name,
                email,
                password
            } = req.body;


            // ------------------------------------------
            // Required fields
            // ------------------------------------------

            if (
                !name ||
                !email ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name, email and password are required"

                });

            }


            const cleanName =
                String(name).trim();


            const cleanEmail =
                String(email)
                    .trim()
                    .toLowerCase();


            // ------------------------------------------
            // Validate name
            // ------------------------------------------

            if (
                cleanName.length < 2
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name must contain at least 2 characters"

                });

            }


            // ------------------------------------------
            // Validate email
            // ------------------------------------------

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailRegex.test(
                    cleanEmail
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please enter a valid email address"

                });

            }


            // ------------------------------------------
            // Validate password
            // ------------------------------------------

            if (
                String(password).length < 6
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password must be at least 6 characters"

                });

            }


            // ------------------------------------------
            // Check existing user
            // ------------------------------------------

            const existingUser =
                await User.findOne({
                    email:
                        cleanEmail
                });


            if (existingUser) {

                return res.status(409).json({

                    success: false,

                    message:
                        "An account with this email already exists"

                });

            }


            // ------------------------------------------
            // Hash password
            // ------------------------------------------

            const hashedPassword =
                await bcrypt.hash(
                    String(password),
                    10
                );


            // ------------------------------------------
            // Create user
            // ------------------------------------------

            const user =
                await User.create({

                    name:
                        cleanName,

                    email:
                        cleanEmail,

                    password:
                        hashedPassword,

                    role:
                        "user"

                });


            // ------------------------------------------
            // Response
            // ------------------------------------------

            res.status(201).json({

                success: true,

                message:
                    "Registration successful",

                user: {

                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        user.role

                }

            });


        } catch (error) {

            console.error(
                "Register Error:",
                error.message
            );


            // Duplicate email protection
            if (
                error.code === 11000
            ) {

                return res.status(409).json({

                    success: false,

                    message:
                        "An account with this email already exists"

                });

            }


            res.status(500).json({

                success: false,

                message:
                    "Registration failed"

            });

        }

    }
);


// ==================================================
// LOGIN
// ==================================================

router.post(
    "/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;


            // ------------------------------------------
            // Required fields
            // ------------------------------------------

            if (
                !email ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email and password are required"

                });

            }


            const cleanEmail =
                String(email)
                    .trim()
                    .toLowerCase();


            // ------------------------------------------
            // Find user
            // ------------------------------------------

            const user =
                await User.findOne({

                    email:
                        cleanEmail

                });


            if (!user) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            // ------------------------------------------
            // Compare password
            // ------------------------------------------

            const passwordMatch =
                await bcrypt.compare(
                    String(password),
                    user.password
                );


            if (!passwordMatch) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password"

                });

            }


            // ------------------------------------------
            // JWT Secret check
            // ------------------------------------------

            if (
                !process.env.JWT_SECRET
            ) {

                console.error(
                    "JWT_SECRET is missing from .env"
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Server authentication configuration error"

                });

            }


            // ------------------------------------------
            // Create JWT
            // ------------------------------------------

            const token =
                jwt.sign(

                    {

                        userId:
                            user._id.toString(),

                        name:
                            user.name,

                        email:
                            user.email,

                        role:
                            user.role

                    },

                    process.env.JWT_SECRET,

                    {

                        expiresIn:
                            "7d"

                    }

                );


            // ------------------------------------------
            // Response
            // ------------------------------------------

            res.status(200).json({

                success: true,

                message:
                    "Login successful",

                token:

                    token,

                user: {

                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        user.role

                }

            });


        } catch (error) {

            console.error(
                "Login Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Login failed"

            });

        }

    }
);


// ==================================================
// PROFILE
// ==================================================

router.get(
    "/profile",
    authMiddleware,
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.user.userId
                ).select(
                    "-password"
                );


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found"

                });

            }


            res.status(200).json({

                success: true,

                user

            });


        } catch (error) {

            console.error(
                "Profile Error:",
                error.message
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch profile"

            });

        }

    }
);


// ==================================================
// EXPORT
// ==================================================

module.exports = router;