import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Products load nahi ho rahe.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          🛒 E-Commerce Store
        </div>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
        </div>

        <button className="cart-button">
          🛒 Cart
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-small">
            WELCOME TO OUR STORE
          </p>

          <h1>
            Shop Smart.
            <br />
            Shop Easy.
          </h1>

          <p className="hero-description">
            Discover quality products at affordable prices.
            Find everything you need in one place.
          </p>

          <a href="#products" className="shop-button">
            Shop Now
          </a>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" id="products">

        <div className="section-heading">
          <p>OUR COLLECTION</p>
          <h2>Latest Products</h2>
        </div>

        {loading && (
          <div className="message">
            <h3>Loading products...</h3>
            <p>Please wait.</p>
          </div>
        )}

        {error && (
          <div className="message error">
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <p>
              Make sure your backend is running on port 5000.
            </p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="message">
            <h3>No products available</h3>
            <p>
              Products database mein abhi add nahi hue.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="products-grid">

            {products.map((product) => (
              <div className="product-card" key={product._id}>

                <div className="product-image">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                    />
                  ) : (
                    <div className="no-image">
                      🛍️
                    </div>
                  )}
                </div>

                <div className="product-info">

                  <p className="category">
                    {product.category}
                  </p>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="description">
                    {product.description}
                  </p>

                  <div className="product-bottom">

                    <span className="price">
                      ${product.price}
                    </span>

                    <button className="add-button">
                      Add to Cart
                    </button>

                  </div>

                  <p className="stock">
                    Stock: {product.stock}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}
      </section>

      {/* About Section */}
      <section className="about-section" id="about">

        <div className="about-content">

          <p className="section-label">
            ABOUT US
          </p>

          <h2>
            Your Simple & Modern
            <br />
            Online Store
          </h2>

          <p>
            Our E-Commerce Store provides a simple and
            convenient way to discover and purchase products
            online. We are building this platform using
            modern web technologies.
          </p>

        </div>

      </section>

      {/* Footer */}
      <footer className="footer">

        <h3>
          🛒 E-Commerce Store
        </h3>

        <p>
          © 2026 E-Commerce Store. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default App;