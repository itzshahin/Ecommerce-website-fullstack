import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaShoppingBag } from "react-icons/fa";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct,selectedPaymentMethod,userAddress] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const userEmail = localStorage.getItem("email");
  const userToken = localStorage.getItem("userToken");
  const nav = useNavigate();

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/product/${productId}`);
        setProduct(response.data);
        setMainImage(response.data.image);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [productId]);

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
  

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-details-wrapper">
      <div className="product-images-wrapper">
        <div className="image-container">
          <img src={mainImage} alt={product.name} className="main-product-image" />
        </div>
        <div className="thumbnail-images-wrapper">
          {product.hoverImage && (
            <img
              src={product.hoverImage}
              alt="Hover View"
              onClick={() => setMainImage(product.hoverImage)}
              className="thumbnail-image"
            />
          )}
          <img
            src={product.image}
            alt={product.name}
            onClick={() => setMainImage(product.image)}
            className="thumbnail-image"
          />
        </div>
      </div>

      <div className="product-info-wrapper">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>Price: ₹{product.price}</p>
        <p>In Stock: {product.stock > 0 ? product.stock : "Out of Stock"}</p>

        <div className="product-actions">
          <button
            className="add-to-cart-btn"
            onClick={handleAddtoCart}
            disabled={product.stock === 0}
          >
            <FaShoppingBag /> Add to Cart
          </button>
          {/* <button
                    className="buyNowBttn"
                    onClick={(e) => { e.stopPropagation(); handleBuyNow(product._id); }}
                    disabled={product.stock === 0}
                  >
                    Buy Now
                  </button> */}
        </div>

        <div className="size-options-wrapper">
          {product.sizes?.map((size, index) => (
            <button key={index} className="size-option-btn">
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
