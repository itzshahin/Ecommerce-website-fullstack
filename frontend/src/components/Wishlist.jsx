import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { myContext } from './Context';
import { useNavigate } from 'react-router-dom';
import './Wishlist.css';
import { IoHeartDislikeSharp } from "react-icons/io5";

const Wishlist = () => {
  const { liked, cartItems, setCartItems, setLiked,userToken ,productId} = useContext(myContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBlurred, setIsBlurred] = useState(false); 

  const userEmail = localStorage.getItem("email");
  const nav = useNavigate();

  const handleAddtoCart = async () => {
    if (!userToken) {
      alert("Please Login First");
      return;
    }
    try {
      const response = await axios.post("http://localhost:4000/api/user/addToCart", {
        productId: productId,
        userEmail: userEmail,
      });
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
  };

  const handleDislike = async (product) => {
    try {
    const response = await axios.delete("http://localhost:4000/api/user/removeWishlist", {
    data: {
    userEmail: userEmail,
    productId: product._id,
    },
    });
    
    if (response.status === 200) {
    setLiked(liked.filter(item => item._id !== product._id));
    fetchWishlist();
    alert("Item removed from Wishlist");
    } else {
    alert("Failed to remove item from Wishlist");
    }
    } catch (error) {
    console.error("Error updating wishlist:", error);
    alert("Failed to update Wishlist");
    }
    };
  

  const fetchWishlist = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/user/getWishlist", {
        userEmail: userEmail,
      });

      if (response.status === 200) {
        setWishlist(response.data.wishlist);
        setLoading(false);
      } else {
        throw new Error("Failed to fetch wishlist");
      }
    } catch (error) {
      setError("Failed to fetch wishlist");
      setLoading(false);
      console.error("Error fetching wishlist:", error);
    }
  };

  const fetchUserStatus = async () => {
    try {
      const userResponse = await axios.get("http://localhost:4000/api/user/getuser");
      const userData = userResponse.data.users.find(user => user.email === userEmail);

      if (userData.isBanned) {
        setIsBlurred(true); 
        alert("You are Banned from accessing the Wishlist.");
        nav("/"); 
        return false; 
      }
      return true; 
    } catch (error) {
      console.error("Failed to fetch user status", error);
      alert("An error occurred while checking user status.");
      nav("/"); 
      return false; 
    }
  };

  useEffect(() => {
    const checkUserStatusAndFetchWishlist = async () => {
      const isUserAllowed = await fetchUserStatus();
      if (isUserAllowed) {
        fetchWishlist(); 
      }
    };

    checkUserStatusAndFetchWishlist();
  }, []);

  return (
    <div>
      <div className="wishlist-container">
        <h1>Your Wishlist</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : wishlist.length > 0 ? (
          <div className="wishlist-grid">
            {wishlist.map(product => (
              <div className={`wishlist-card ${isBlurred ? 'blur' : ''}`} key={product._id}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p><strong>Price:</strong> ₹{product.price}</p>
                <div className="button-container">
                  {/* <button
                    onClick={() => handleAddtoCart(product)}
                    className="icon-button">
                    {cartItems.find(cartItem => cartItem._id === product._id) ? <TiShoppingCart style={{ color: "green" }} /> : <TiShoppingCart />}
                  </button> */}
                  <button
                    onClick={() => handleDislike(product)}
                    className="icon-button">
                    <IoHeartDislikeSharp />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="wishlist-empty">
            <p>Your wishlist is empty.</p>
            <p>Move your liked products from the list of products to the Wishlist page for easy shopping.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
