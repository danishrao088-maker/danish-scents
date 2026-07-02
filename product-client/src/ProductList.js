import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import "./Admin.css"; // <-- New CSS file import ki

const ProductList = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  // --- Login Function ---
  const handleLogin = () => {
    if (passwordInput === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Access Denied!");
    }
  };

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
    if (isAuthenticated) {
      getProducts();
    }
  }, [isAuthenticated]);

  const deleteProduct = async (id) => {
    if(!window.confirm("Delete this product?")) return;
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const editProduct = (product) => {
    setProductToEdit(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSubmit = () => {
    getProducts();
    setProductToEdit(null);
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="admin-container" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div className="admin-card" style={{textAlign: "center", width: "100%", maxWidth: "400px"}}>
          <h2 className="dashboard-title">Admin Portal</h2>
          <p style={{color: "#aaa", marginBottom: "20px"}}>Restricted Access</p>
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="admin-input"
            style={{marginBottom: "20px"}}
          />
          <button onClick={handleLogin} className="admin-btn">Login</button>
        </div>
      </div>
    );
  }

  // --- DASHBOARD SCREEN ---
  return (
    <div className="admin-container">
      
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <button onClick={() => setIsAuthenticated(false)} className="logout-btn">
          Logout
        </button>
      </div>

      {/* Product Form (Create/Edit) */}
      <div className="admin-card">
        <ProductForm productToEdit={productToEdit} onFormSubmit={handleFormSubmit} />
      </div>

      {/* Inventory Table */}
      <h2 style={{ textAlign: "center", color: "#ffd700", marginBottom: "20px" }}>Product Inventory</h2>
      
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  {product.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${product.image}`}
                      alt={product.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                    />
                  ) : <span style={{color:"#666"}}>No IMG</span>}
                </td>
                <td><strong>{product.name}</strong></td>
                <td>${product.price}</td>
                <td>{product.description.substring(0, 40)}...</td>
                <td>
                  <button onClick={() => editProduct(product)} className="action-btn edit-btn">Edit</button>
                  <button onClick={() => deleteProduct(product.id)} className="action-btn delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;