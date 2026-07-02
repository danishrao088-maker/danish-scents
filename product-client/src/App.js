import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./ProductList";
import Shop from "./Shop";
import Cart from "./Cart";
import Navbar from "./Navbar"; // <-- Import kiya
import Footer from "./Footer"; // <-- Import kiya
import "./App.css";

function App() {
  return (
    <Router>
      {/* 1. Header sabse upar */}
      <Navbar />

      {/* 2. Main Content beech mein */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/admin" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>

      {/* 3. Footer sabse neeche */}
      <Footer />
    </Router>
  );
}

export default App;