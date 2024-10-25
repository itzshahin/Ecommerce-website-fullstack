import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoHeartSharp } from "react-icons/io5";
import { FaShoppingBag } from "react-icons/fa";
import { SiZara, SiDior, SiNewbalance, SiUnderarmour, SiHugo } from "react-icons/si";
import { CgChanel } from "react-icons/cg";
import axios from "axios";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import "./shop.css";
import { myContext } from "../Context";
import Footer from "./Footer";
import logo from './logo.jpg';

export const Shop = () => {
  const { products, setProducts, cartItems, setCartItems, liked, setLiked, filterSearch, setFilterSearch, selectedPaymentMethod, userAddress } = useContext(myContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLargeLogo, setShowLargeLogo] = useState(true);

  const userEmail = localStorage.getItem("email");
  const userToken = localStorage.getItem("userToken");
  const nav = useNavigate();

  const handleLikeDislike = async (product) => {
    try {
      const response = await axios.post("http://localhost:4000/api/user/toggleWishlist", {
        userEmail: userEmail,
        product: {
          product_id: product._id,
          name: product.name,
          image: product.image,
          price: product.price
        }
      });

      if (response.status === 200) {
        const updatedWishlist = response.data.wishlist;

        if (liked.some(item => item._id === product._id)) {
          setLiked(liked.filter(item => item._id !== product._id)); 
          alert("Item removed from Wishlist");
        } else {
          setLiked([...liked, product]); 
          alert("Item added to Wishlist");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("You are banned from modifying your wishlist.");
      } else {
        console.error("Error:", error);
        alert("An error occurred while modifying the wishlist.");
      }
    }
  };

  const handleAddtoCart = async (productId) => {
    if (!userToken) {
      alert("Please Login First");
    } else {
      try {
        const response = await axios.post("http://localhost:4000/api/user/addToCart", {
          productId: productId,
          userEmail: userEmail,
        });
        setCartItems(response.data);
        alert("Your Product is added to the Cart");
      } catch (error) {
        if (error.response) {
          if (error.response.status === 403) {
            alert("You are Banned from adding items to the Cart.");
          } else if (error.response.status === 409) {
            alert("This Item is Already in your cart");
          } else {
            console.error("Error response:", error.response);
            alert(`Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
          }
        } else {
          console.error("Error:", error.message);
          alert("An error occurred while adding the product.");
        }
      }
    }
  };

  const handleBuyNow = async (productId) => {
    if (!userToken) {
      alert("Please Login First");
      return;
    }
    
    try {
      const response = await axios.post(`http://localhost:4000/api/user/buyNow/${userEmail}`, {
        productId,
        quantity: 1,
        address: userAddress || "Default Address", 
        paymentMethod: selectedPaymentMethod || "Credit Card", 
      });

      if (response.status === 200) {
        nav("/payment", { state: { buyNowProduct: response.data } }); 
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error(error); 
      alert("Failed to place order. Please try again.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const result = products.filter(item => {
      const { name, price } = item;
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        price.toString().includes(searchQuery)
      );
    });
    setFilterSearch(result);
  }, [searchQuery, products, setFilterSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLargeLogo(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/product/getproduct");
      setProducts(response.data);
      setFilterSearch(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="shop-wrapper">
      {showLargeLogo && (
        <div className="large-logo-container">
          <img src={logo} alt="Logo" className="large-logo" />
        </div>
      )}
      <div className="shop">
        <div className="shopTitle"></div>
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <Carousel className="custom-carousel" showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
          <div>
            <img src="https://marketplace.canva.com/EAFwLNg_Ekk/1/0/1600w/canva-black-white-bold-fashion-product-promotion-landscape-banner-1_Jng4lDecU.jpg" />
          </div>
          <div>
            <img src="https://marketplace.canva.com/EAFM2bxPsnU/1/0/1600w/canva-black-and-neon-green-bold-sporty-outfit-banner-zxjh7yfj3zE.jpg" />
          </div>
          <div>
            <img src="https://images.jackjones.com/media/c1ibxdz4/bestseller-carousel-2-en-us.jpg?v=daecbacc-3c67-4b27-bddb-cf9e9e50cc2d&format=webp&width=640&quality=80&key=3-4-3" alt="Carousel Image 3" />
          </div>
          <div>
            <img src="https://marketplace.canva.com/EAF3fxiMgHY/1/0/1600w/canva-black-white-bold-simple-fashion-product-promotion-landscape-banner-V-clBpZoamE.jpg" />
          </div>
        </Carousel>
        <div className="brands-section">
          <h2>Popular Brands</h2>
          <div className="brands">
            <SiZara className="brand-icon" />
            <SiDior className="brand-icon" />
            <CgChanel className="brand-icon" />
            <SiNewbalance className="brand-icon" />
            <SiUnderarmour className="brand-icon" />
            <SiHugo className="brand-icon" />
          </div>
        </div>

        <div className="new-arrivals">
          <h2>/// NEW ARRIVALS</h2>
        </div>

        <div className="products">
          {filterSearch.length > 0 ? (
            filterSearch.map((product) => (
              <div className="product" key={product._id} onClick={() => nav(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>
                <div className="product-img-container">
                  <img src={product.image} alt={product.name} className="product-img-front" />
                  {product.hoverImage && <img src={product.hoverImage} alt={`${product.name} Hover`} className="product-img-back" />}
                </div>
                <div className="description">
                  <p><b>{product.name}</b></p>
                  <p><b>{product.category}</b></p>
                  <p>₹{product.price}</p>
                  <p>
                    {product.stock > 5 ? (
                      <span className="in-stock">In Stock</span>
                    ) : product.stock > 0 ? (
                      <span className="low-stock">Hurry! Only {product.stock} left!</span>
                    ) : (
                      <span className="stock-out">Out Of Stock </span>
                    )}
                  </p>
                </div>
                <div className="button-container">
                  <button
                    className={`addToCartBttn ${cartItems.some(item => item._id === product._id) ? 'in-cart' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleAddtoCart(product._id); }}
                    disabled={product.stock === 0}
                  >
                    <FaShoppingBag />
                  </button>
                  {/* <button
                    className="buyNowBttn"
                    onClick={(e) => { e.stopPropagation(); handleBuyNow(product._id); }}
                    disabled={product.stock === 0}
                  >
                    Buy Now
                  </button> */}
                  <button
                    className={`addToWishlistBttn ${liked.some(item => item._id === product._id) ? 'in-wishlist' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleLikeDislike(product); }}
                  >
                    {liked.some(item => item._id === product._id) ? <IoHeartSharp style={{ color: "red" }} /> : <IoHeartSharp />}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No products found matching your search.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
