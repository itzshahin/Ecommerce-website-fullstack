import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { myContext } from "./Context";
import { IoLogOut, IoClose, IoMenu } from "react-icons/io5";
import { FaShoppingBag, FaHome } from "react-icons/fa";
import { IoHeartSharp } from "react-icons/io5";
import "./Navbar.css";
import { Slider, Button } from "@mui/material";

export const Navbar = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { products, setFilterSearch, logUser, setLogUser } = useContext(myContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleFilterClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    applyFilters(category, priceRange, sortOrder);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    applyFilters(selectedCategory, newValue, sortOrder);
  };

  const handleSortOrderChange = (event) => {
    const order = event.target.value;
    setSortOrder(order);
    applyFilters(selectedCategory, priceRange, order);
  };

  const applyFilters = (category, priceRange, sortOrder) => {
    const result = products
      .filter(item => {
        const { name, price, category: itemCategory } = item;
        return (
          (category === "All" || itemCategory === category) &&
          price >= priceRange[0] && price <= priceRange[1] &&
          (name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            price.toString().includes(searchQuery))
        );
      })
      .sort((a, b) => sortOrder === "asc" ? a.price - b.price : b.price - a.price);

    setFilterSearch(result);
  };

  useEffect(() => {
    applyFilters(selectedCategory, priceRange, sortOrder);
  }, [searchQuery, products, selectedCategory, priceRange, sortOrder, setFilterSearch]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setLogUser(null);
      localStorage.removeItem("email");
      localStorage.removeItem("userToken");
      nav("/Login");
      alert("You have been logged out.");
    }
  };

  return (
    <div className="navbar">
      {location.pathname === '/' && (
        <>
          <div className="filter-container">
            <Button
              onClick={handleFilterClick}
              className={`filter-button ${sidebarOpen ? 'open' : ''}`}
            >
              {sidebarOpen ? <IoClose className="filter-icon" /> : <IoMenu className="filter-icon" />}
            </Button>
          </div>
          <div className="search-container">
            <input
              className="search"
              type="text"
              placeholder="SEARCH"
              value={searchQuery}
              onChange={handleSearch}
            />
            <i className="fa fa-search search-icon" aria-hidden="true"></i>
          </div>
        </>
      )}
      <div className="links">
        {location.pathname === '/' && logUser && (
          <Link to="/" className="icon-link" onClick={handleLogout}>
            <IoLogOut className="logout-icon" />
          </Link>
        )}
        {!logUser && (
          <>
            <Link to="/Login" className="icon-link">Log In</Link>
            <Link to="/Register" className="icon-link">Register</Link>
          </>
        )}
        <Link to="/">
          <FaHome className="fa-home" />
        </Link>
        <Link to="/Wishlist">
          <IoHeartSharp className="io-heart-sharp" />
        </Link>
        <Link to="/cart">
          <FaShoppingBag className="fa-shopping-cart" />
        </Link>
        {logUser && (
          <Link to="/orders">
            <Button className="orders-button"> ORDERS</Button>
          </Link>
        )}
      </div>
      <div className={`filter-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="filter-options">
          <div className="filter-section">
            <h3>Category</h3>
            <select onChange={handleCategoryChange} value={selectedCategory}>
              <option value="All">All</option>
              <option value="SHIRT">SHIRTS</option>
              <option value="HOODIES">HOODIES</option>
              <option value="COMBO">COMBO</option>
              <option value="TEES">TEES</option>
              <option value="PANTS">PANTS</option>
            </select>
          </div>
          <div className="filter-section">
            <h3>Price Range</h3>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={100}
            />
          </div>
          <div className="filter-section">
            <h3>Sort by Price</h3>
            <select onChange={handleSortOrderChange} value={sortOrder}>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>
        <div className="filter-actions">
          <button onClick={() => setSidebarOpen(false)}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
