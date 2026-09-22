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
// CORS
// ==========================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://e-commerce-store-a7zh-dh2zrc815-waqar-e-commerce.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Handle preflight requests
app.options("*", cors());

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ==========================================
// MONGODB CONNECTION
// ==========================================

let mongoConnection = null;

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  if (!mongoConnection) {
    mongoConnection = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });
  }

  try {
    await mongoConnection;

    console.log("MongoDB Connected Successfully ✅");

    return mongoose.connection;
  } catch (error) {
    mongoConnection = null;

    console.error("MongoDB Connection Failed ❌");
    console.error(error.message);

    throw error;
  }
}

// ==========================================
// DATABASE MIDDLEWARE
// ==========================================

app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("Database Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-Commerce Store Backend is Running 🚀"
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/admin", adminRoutes);

// ==========================================
// HTML ROUTES
// ==========================================

app.get("/products", (req, res) => {
  res.sendFile(__dirname + "/products.html");
});

app.get("/product-details", (req, res) => {
  res.sendFile(__dirname + "/product-details.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/profile", (req, res) => {
  res.sendFile(__dirname + "/profile.html");
});

app.get("/cart", (req, res) => {
  res.sendFile(__dirname + "/cart.html");
});

app.get("/checkout", (req, res) => {
  res.sendFile(__dirname + "/checkout.html");
});

app.get("/orders", (req, res) => {
  res.sendFile(__dirname + "/orders.html");
});

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/admin.html");
});

app.get("/admin/orders", (req, res) => {
  res.sendFile(__dirname + "/admin-orders.html");
});

// ==========================================
// 404 ROUTE
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// ==========================================
// LOCAL SERVER
// ==========================================

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  connectDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Unable to start server:", error.message);
      process.exit(1);
    });
}

// ==========================================
// VERCEL
// ==========================================

module.exports = app;