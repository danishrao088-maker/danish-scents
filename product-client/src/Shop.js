import React, { useEffect, useState } from "react";
import "./Shop.css"; 

const Shop = () => {
  const [products, setProducts] = useState([]);

  // --- 1. SPECIAL FEATURED PRODUCT DATA (Ye zaroori hai) ---
  const featuredProduct = {
    id: 999, 
    name: "Royal Oud Edition",
    price: "150.00",
    description: "Exclusive premium fragrance with notes of agarwood and sandalwood. Limited time offer.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop"
  };
  // ----------------------------------------

  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const jsonData = await response.json();
      setProducts(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === product.id);
    
    if (existingItem) {
      alert(`${product.name} is already in your cart!`);
    } else {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.name} added to cart successfully!`);
    }
  };

  return (
    <div className="shop-container">
      
      {/* --- HERO BANNER (Dark Premium) --- */}
      <div className="hero-banner-premium">
        <div className="hero-content">
          <span className="badge">Featured Product</span>
          <h1>{featuredProduct.name}</h1>
          <p>{featuredProduct.description}</p>
          <h2 className="hero-price">${featuredProduct.price}</h2>
          
          <button 
            onClick={() => addToCart(featuredProduct)} 
            className="hero-btn"
          >
            Add to Cart 🛒
          </button>
        </div>
        
        <div className="hero-image-container">
          <img 
            src={featuredProduct.image} 
            alt="Featured Product" 
            className="hero-img"
          />
        </div>
      </div>
      {/* ----------------------------------- */}

      <h1 className="section-title">Latest Arrivals</h1>
      
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img 
              src={`http://localhost:5000/uploads/${product.image}`} 
              alt={product.name}
              onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150"; }}
            />
            <h3>{product.name}</h3>
            <p className="desc-text">{product.description}</p>
            <p className="price">${product.price}</p>
            <button onClick={() => addToCart(product)} className="buy-btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;