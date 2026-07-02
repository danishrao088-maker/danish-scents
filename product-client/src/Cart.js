import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Link import karna zaroori hai
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false); // Checkout form dikhane ke liye
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    address: "",
    city: "",
    paymentMethod: "cod" // Default Cash on Delivery
  });

  // Cart Load karna
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
  }, []);

  // Remove Item
  const removeFromCart = (id) => {
    const newCart = cartItems.filter((item) => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  // Total Price
  const totalPrice = cartItems.reduce((acc, item) => acc + Number(item.price), 0);

  // Input Handle karna
  const handleInputChange = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  // ORDER PLACE KARNA (Fake Payment Processing)
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    // Validation
    if(!orderDetails.name || !orderDetails.address || !orderDetails.city) {
        alert("Please fill in all delivery details!");
        return;
    }

    // Success Message
    alert(`Order Placed Successfully!\n\nThank you, ${orderDetails.name}.\nTotal: $${totalPrice.toFixed(2)}\nPayment: ${orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card (Processed)'}`);

    // Cart Khali karna
    setCartItems([]);
    localStorage.removeItem("cart");
    setShowCheckout(false);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="cart-container">
      
      {/* Agar cart khali hai to ye dikhao */}
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2 className="cart-title">Your Cart is Empty</h2>
          <p>Looks like you haven't added any perfumes yet.</p>
          <Link to="/" className="continue-shopping-btn">Go to Shop</Link>
        </div>
      ) : (
        <>
           {/* Agar Checkout Button nahi dabaya to Cart dikhao */}
          {!showCheckout ? (
            <div>
                <h2 className="cart-title">Your Shopping Bag ({cartItems.length})</h2>
                <div className="cart-content">
                <div className="cart-items-list">
                    {cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                        <div className="cart-img-wrapper">
                        <img 
                            src={item.image.startsWith("http") ? item.image : `http://localhost:5000/uploads/${item.image}`} 
                            alt={item.name} 
                            className="cart-img"
                        />
                        </div>
                        <div className="cart-details">
                            <h4>{item.name}</h4>
                            <p className="item-price">${item.price}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="remove-btn">Remove ✕</button>
                    </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
                    <div className="summary-row"><span>Shipping</span><span>Free</span></div>
                    <hr />
                    <div className="summary-row total"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
                    
                    <button onClick={() => setShowCheckout(true)} className="checkout-btn">
                    Proceed to Checkout
                    </button>
                </div>
                </div>
            </div>
          ) : (
            
            /* --- CHECKOUT FORM SECTION --- */
            <div className="checkout-section">
                <h2 className="cart-title">Checkout Details</h2>
                <form onSubmit={handlePlaceOrder} className="checkout-form">
                    
                    {/* Name */}
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" placeholder="Enter your name" onChange={handleInputChange} className="form-input" />
                    </div>

                    {/* Address */}
                    <div className="form-group">
                        <label>Delivery Address</label>
                        <input type="text" name="address" placeholder="House No, Street, Area" onChange={handleInputChange} className="form-input" />
                    </div>

                    {/* City */}
                    <div className="form-group">
                        <label>City</label>
                        <input type="text" name="city" placeholder="e.g. Lahore, Karachi" onChange={handleInputChange} className="form-input" />
                    </div>

                    {/* Payment Method Selection */}
                    <div className="form-group">
                        <label>Payment Method</label>
                        <select name="paymentMethod" onChange={handleInputChange} className="form-input">
                            <option value="cod">Cash on Delivery (COD)</option>
                            <option value="card">Credit / Debit Card</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="form-actions">
                        <button type="button" onClick={() => setShowCheckout(false)} className="back-btn">Back to Cart</button>
                        <button type="submit" className="confirm-btn">Confirm Order - ${totalPrice.toFixed(2)}</button>
                    </div>

                </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;