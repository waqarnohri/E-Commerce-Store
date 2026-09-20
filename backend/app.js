const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();


// ==========================================
// BASIC MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================================
// HOME PAGE
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        __dirname + "/index.html"
    );

});


// ==========================================
// API ROUTES
// ==========================================

// Product API
app.use(
    "/api/products",
    productRoutes
);


// Authentication API
app.use(
    "/api/auth",
    authRoutes
);


// Cart API
app.use(
    "/api/cart",
    cartRoutes
);


// Order API
app.use(
    "/api/orders",
    orderRoutes
);


// Admin API
app.use(
    "/api/admin",
    adminRoutes
);


// ==========================================
// FRONTEND PAGES
// ==========================================

app.get("/products", (req, res) => {

    res.sendFile(
        __dirname + "/products.html"
    );

});


app.get("/product-details", (req, res) => {

    res.sendFile(
        __dirname + "/product-details.html"
    );

});


app.get("/register", (req, res) => {

    res.sendFile(
        __dirname + "/register.html"
    );

});


app.get("/login", (req, res) => {

    res.sendFile(
        __dirname + "/login.html"
    );

});


app.get("/profile", (req, res) => {

    res.sendFile(
        __dirname + "/profile.html"
    );

});


app.get("/cart", (req, res) => {

    res.sendFile(
        __dirname + "/cart.html"
    );

});


app.get("/checkout", (req, res) => {

    res.sendFile(
        __dirname + "/checkout.html"
    );

});


app.get("/orders", (req, res) => {

    res.sendFile(
        __dirname + "/orders.html"
    );

});


app.get("/admin", (req, res) => {

    res.sendFile(
        __dirname + "/admin.html"
    );

});


app.get("/admin/orders", (req, res) => {

    res.sendFile(
        __dirname + "/admin-orders.html"
    );

});


// ==========================================
// OLD ADD PRODUCT ROUTE REMOVED
// ==========================================
//
// IMPORTANT:
// Old /add-product POST route was removed.
//
// Product creation must now use:
//
// POST /api/products
//
// This API is protected by:
// authMiddleware + adminMiddleware
//
// ==========================================


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route not found"

    });

});


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
    (error, req, res, next) => {

        console.error(
            "Server Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Internal server error"

        });

    }
);


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
    .connect(
        process.env.MONGO_URI
    )

    .then(() => {

        console.log(
            "MongoDB Connected Successfully ✅"
        );


        const PORT =
            process.env.PORT || 5000;


        app.listen(
            PORT,
            () => {

                console.log(
                    `Server running on http://localhost:${PORT}`
                );

            }
        );

    })

    .catch((error) => {

        console.error(
            "MongoDB Connection Failed ❌"
        );


        console.error(
            error.message
        );

    });