import React, { useState, useEffect } from "react";

const ProductForm = ({ productToEdit, onFormSubmit }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  // File ke liye naya state
  const [imageFile, setImageFile] = useState(null);
  const [oldImage, setOldImage] = useState(""); // Edit karte waqt purani image rakhne ke liye

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(productToEdit.price);
      setDescription(productToEdit.description);
      setOldImage(productToEdit.image || ""); // Agar pehle se image hai to uska naam
    } else {
      // Reset form for new product
      setName("");
      setPrice("");
      setDescription("");
      setImageFile(null);
      setOldImage("");
    }
  }, [productToEdit]);

  // File input change hone par chalega
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Jab file bhejni ho to FormData use karte hain, JSON nahi
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    if (imageFile) {
      // "image" wahi naam hai jo backend mein upload.single("image") mein likha tha
      formData.append("image", imageFile);
    }
    if (productToEdit && oldImage) {
        formData.append("oldImage", oldImage);
    }

    const url = productToEdit
      ? `http://localhost:5000/api/products/${productToEdit.id}`
      : "http://localhost:5000/api/products";
    const method = productToEdit ? "PUT" : "POST";

    try {
      // Note: Content-Type header hatana padta hai jab FormData bhejte hain, browser khud set karta hai
      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        onFormSubmit(); // Parent component ko batao ke kaam ho gaya
        // Reset form
        setName("");
        setPrice("");
        setDescription("");
        setImageFile(null);
        setOldImage("");
      } else {
        console.error("Failed to save product");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2 style={{ textAlign: "center" }}>{productToEdit ? "Edit Product" : "Product Registration"}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: "15px" }}>
          <label>Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        {/* --- New Image Input --- */}
        <div style={{ marginBottom: "15px" }}>
          <label>Product Image</label>
          <input
            type="file"
            accept="image/*" // Sirf image files show karega
            onChange={handleFileChange}
            style={{ width: "100%", marginTop: "5px" }}
          />
          {/* Agar edit kar rahe hain aur nayi file select nahi ki, to purani image dikhao */}
          {productToEdit && productToEdit.image && !imageFile && (
              <div style={{marginTop: "10px"}}>
                  <p>Current Image:</p>
                  <img src={`http://localhost:5000/uploads/${productToEdit.image}`} alt="current" width="100" />
              </div>
          )}
        </div>
        {/* ----------------------- */}

        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" }}>
          {productToEdit ? "Update Product" : "Register Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;