const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");
// 1️⃣ Create express app FIRST
const app = express();

// 2️⃣ Middlewares
app.use(cors());
app.use(express.json());
// uploads folder ko public banayen taake images frontend par dikh sakein
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// --- Image Upload Setup (Multer) ---
// Batao ke image kahan save karni hai aur uska naam kya hoga
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Images 'backend/uploads' folder mein jayengi
  },
  filename: function (req, file, cb) {
    // Har file ka unique naam: timestamp + original naam
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
// Sirf image files allow karne ke liye filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
// -----------------------------------

// 3️⃣ PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "productdb",
  password: "123",
  port: 5432,
});

// 4️⃣ POST route (SAVE PRODUCT)
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    // Agar file upload hui hai to uska naam le lo, warna null
    const image = req.file ? req.file.filename : null;

    const newProduct = await pool.query(
      "INSERT INTO products (name, price, description, image) VALUES($1, $2, $3, $4) RETURNING *",
      [name, price, description, image]
    );

    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 5️⃣ GET route (FETCH PRODUCTS)
// 2. GET all Products
app.get("/api/products", async (req, res) => {
  try {
    const allProducts = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(allProducts.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// 3. GET a single Product
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    res.json(product.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).send("Error deleting product");
  }
});
app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    let image = req.body.oldImage; // Puraani image ka naam (agar nayi nahi di)

    // Agar nayi file upload ki hai, to uska naam use karo
    if (req.file) {
      image = req.file.filename;
    }

    await pool.query(
      "UPDATE products SET name = $1, price = $2, description = $3, image = $4 WHERE id = $5",
      [name, price, description, image, id]
    );

    res.json("Product was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

// 6️⃣ Start server LAST
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Error fetching products");
  }
});
