import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./App.css"; // Styling hum App.css mein karenge

const Navbar = () => {
  const location = useLocation(); // Pata lagane ke liye ke hum kis page par hain

  return (
    <nav className="navbar">
      {/* 1. Brand Logo */}
      <div className="logo">
        <Link to="/">DANISH SCENTS<span style={{color:"#ffd700"}}>.</span></Link>
      </div>

      {/* 2. Navigation Links */}
      <ul className="nav-links">
        <li>
          <Link to="/" className={location.pathname === "/" ? "active-link" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/cart" className={location.pathname === "/cart" ? "active-link" : ""}>
            Cart 🛒
          </Link>
        </li>
        <li>
          <Link to="/admin" className={location.pathname === "/admin" ? "active-link" : ""}>
            Admin Panel
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;