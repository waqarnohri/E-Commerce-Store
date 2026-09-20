# 🛒 ShopHub — Full Stack E-Commerce Store

A professional full-stack e-commerce web application built with **Node.js, Express.js, MongoDB, Mongoose, HTML, CSS and JavaScript**.

The project includes customer authentication, product management, shopping cart, checkout, order management and an admin dashboard.

---

## 🚀 Features

### 👤 Customer Features

* User registration
* Secure login
* JWT authentication
* User profile
* Browse products
* Search products
* Category filtering
* Product details
* Add products to cart
* Update cart quantity
* Remove products from cart
* Checkout
* Cash on Delivery
* View personal orders
* Track order status
* Logout

---

### 🛡️ Admin Features

* Admin authentication
* Admin dashboard
* Product management
* Add products
* Edit products
* Delete products
* View total products
* View total customers
* View total orders
* View total sales
* Recent orders
* Low-stock products
* View all customer orders
* Update order status

---

## 🔐 Security Features

* JWT-based authentication
* Password hashing with bcrypt
* Role-based authorization
* Admin-only product management
* Admin-only order management
* Protected cart APIs
* Protected customer order APIs
* Product ID validation
* Order ID validation
* Stock validation
* Quantity validation
* Input validation
* Protected admin routes
* Authorization headers using Bearer tokens

---

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API
* Responsive Design

### Backend

* Node.js
* Express.js
* REST API
* JWT
* bcryptjs
* CORS
* dotenv

### Database

* MongoDB
* MongoDB Atlas
* Mongoose

---

## 📁 Project Structure

```text
E-Commerce-Store
│
├── backend
│   │
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── models
│   │   ├── Product.js
│   │   ├── User.js
│   │   ├── Cart.js
│   │   └── Order.js
│   │
│   ├── routes
│   │   ├── productRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── admin.html
│   ├── admin-orders.html
│   ├── register.html
│   ├── login.html
│   ├── profile.html
│   ├── cart.html
│   ├── products.html
│   ├── checkout.html
│   ├── orders.html
│   ├── product-details.html
│   ├── index.html
│   │
│   ├── app.js
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the project

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project

```bash
cd E-Commerce-Store
cd backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

**Important:** Never upload your real `.env` file or MongoDB password to GitHub.

### 5. Start the server

```bash
npm start
```

The application will run at:

```text
http://localhost:5000
```

---

## 🌐 Main Pages

| Page            | URL                              |
| --------------- | -------------------------------- |
| Home            | `/`                              |
| Products        | `/products`                      |
| Product Details | `/product-details?id=PRODUCT_ID` |
| Register        | `/register`                      |
| Login           | `/login`                         |
| Profile         | `/profile`                       |
| Cart            | `/cart`                          |
| Checkout        | `/checkout`                      |
| My Orders       | `/orders`                        |
| Admin Dashboard | `/admin`                         |
| Admin Orders    | `/admin/orders`                  |

---

## 🔌 Main API Routes

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Cart

```text
GET    /api/cart
POST   /api/cart/add
PUT    /api/cart/update
DELETE /api/cart/remove
DELETE /api/cart/clear
```

### Orders

```text
POST /api/orders/checkout
GET  /api/orders/my-orders
GET  /api/orders/:id
GET  /api/orders/admin/all
PUT  /api/orders/admin/:id/status
```

### Admin

```text
GET /api/admin/dashboard
```

---

## 📦 Order Flow

```text
Customer
   ↓
Register / Login
   ↓
Browse Products
   ↓
Product Details
   ↓
Add to Cart
   ↓
Cart
   ↓
Checkout
   ↓
Order Created
   ↓
Admin Reviews Order
   ↓
Confirmed
   ↓
Shipped
   ↓
Delivered
```

---

## 👨‍💻 Developer

**Waqar Nohri**

BS Artificial Intelligence Student

Skills demonstrated in this project:

* JavaScript
* Node.js
* Express.js
* MongoDB
* Mongoose
* REST APIs
* JWT Authentication
* Backend Development
* Frontend Development
* CRUD Operations
* Database Design
* Role-Based Authorization

---

## 📌 Project Purpose

This project was developed as a practical full-stack web development project to understand how a real e-commerce application works from frontend to backend and database.

It demonstrates authentication, authorization, REST APIs, database relationships, shopping cart functionality, checkout processing, order management and admin operations.

---

## ⚠️ Security Note

For production deployment, additional security measures such as rate limiting, HTTPS, stronger validation, secure cookies, CSRF protection where applicable, centralized logging and transactional checkout handling should be considered.

---

## 📄 License

This project is created for educational and portfolio purposes.
