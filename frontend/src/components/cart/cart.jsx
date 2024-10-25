import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./cart.css";
import { myContext } from "../Context";

export const Cart = () => {
  const { cartItems, setCartItems } = useContext(myContext);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBlurred, setIsBlurred] = useState(false); 

  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const userToken = localStorage.getItem("userToken");

  async function fetchUserStatus() {
    try {
      const userResponse = await axios.get("http://localhost:4000/api/user/getuser");
      const userData = userResponse.data.users.find(user => user.email === userEmail);

      if (userData.isBanned) {
        setIsBlurred(true); 
        alert("You are Banned from accessing the Cart.");
        navigate("/"); 
        return false; 
      }
      return true; 
    } catch (error) {
      console.error("Failed to fetch user status", error);
      alert("An error occurred while checking user status.");
      navigate("/"); 
      return false; 
    }
  }

  async function fetchCart() {
    if (!userToken) {
      alert("Please Login First");
      return;
    }

    setLoading(true);
    setError(null);

    const isUserAllowed = await fetchUserStatus();
    if (!isUserAllowed) return;

    try {
      const response = await axios.post("http://localhost:4000/api/user/getCart", {
        userEmail: userEmail,
      });
      const data = response.data || [];
      setCartItems(Array.isArray(data) ? data : []);
      console.log("Cart items fetched successfully:", data);
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response);
        alert(`Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else {
        console.error('Error:', error.message);
        alert("An error occurred while fetching the cart.");
      }
      setError("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const calculateCartTotal = () => {
      return cartItems.reduce((total, item) => {
        const quantity = item.quantity || 1;
        const price = item.price || 0;
        return total + price * quantity;
      }, 0);
    };
    setCartTotal(calculateCartTotal());
  }, [cartItems]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map(item =>
      item.product_id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);

    try {
      await axios.put("http://localhost:4000/api/user/updateCartQuantity", {
        userEmail: userEmail,
        productId: productId,
        quantity: newQuantity,
      });
      console.log("Cart quantity updated successfully");
    } catch (error) {
      console.error("Failed to update cart quantity", error);
      alert("Failed to update cart quantity");
    }
  };

  const handleRemove = async (productId) => {
    const isUserAllowed = await fetchUserStatus();
    if (!isUserAllowed) return;

    try {
      const response = await axios.delete('http://localhost:4000/api/user/removeCart', {
        data: { productId: productId, userEmail: userEmail }
      });

      const data = response.data.cart || [];
      setCartItems(Array.isArray(data) ? data : []);
      alert("Your Product has been Removed from Cart...");
    } catch (error) {
      console.error("Failed to remove item from cart", error);
      alert("Failed to remove item from cart");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="cart-container">
      <h1>Your Bag Items</h1>
      <div className="cart-items">
        {cartItems.length > 0 ? cartItems.map((product) => (
          <div key={product.product_id} className={`cart-item ${isBlurred ? 'blur' : ''}`}>
            <img className="cart-item-image" src={product.image} alt={product.name} />
            <div className="description">
              <p className="product-name">{product.name || "No name available"}</p>
              <p>Price: ₹{product.price}</p>
              <div className="count-handler">
                <button onClick={() => handleQuantityChange(product.product_id, Math.max(1, (product.quantity || 1) - 1))}>-</button>
                <span>{product.quantity || 1}</span>
                <button onClick={() => handleQuantityChange(product.product_id, (product.quantity || 1) + 1)}>+</button>
                <h4 className="product-total">Product Total: ₹{(product.price || 0) * (product.quantity || 1)}/-</h4>
                <button className="remove" onClick={() => handleRemove(product.product_id)}>Remove</button>
              </div>
            </div>
          </div>
        )) : <h1>Your Shopping Bag is Empty</h1>}
      </div>

      {cartItems.length > 0 && (
        <div className="checkout">
          <p>Total: ₹{cartTotal}</p>
          <div className="checkout-buttons">
            <button onClick={() => navigate("/")}>Continue Shopping</button>
            <button onClick={() => navigate("/payment")}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};
