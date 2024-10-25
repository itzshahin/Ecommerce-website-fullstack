import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./PaymentPage.css";
import cardSwipeVideo from "../components/assets/card-swipe.mp4";
import { myContext } from "./Context";
import { FaPaypal, FaCcVisa, FaCcMastercard, FaApplePay } from "react-icons/fa";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { cartItems, setCartItems } = useContext(myContext);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
    upiId: "",
    bankName: "",
    accountNumber: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [loading, setLoading] = useState(false);
  const userEmail = localStorage.getItem("email");
  console.log("User Email:", userEmail); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (buyNowProduct) => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.zipCode) {
      alert("Please fill in all the required billing information.");
      return;
    }

    if (paymentMethod === "Credit Card" && (!formData.cardNumber || !formData.expiryDate || !formData.cvv)) {
      alert("Please fill in all the required credit card information.");
      return;
    }

    if (paymentMethod === "UPI" && !formData.upiId) {
      alert("Please provide your UPI ID.");
      return;
    }

    if (paymentMethod === "NetBanking" && (!formData.bankName || !formData.accountNumber)) {
      alert("Please provide your bank details.");
      return;
    }

    if (paymentMethod === "Cash on Delivery") {
      setIsCompleted(true);
      alert("Order placed successfully! Please prepare cash for delivery.");
      handlePlaceOrder(buyNowProduct); 
      navigate("/orders"); 
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);

      setTimeout(() => {
        alert("Payment successful! Thank you for your purchase.");
        handlePlaceOrder(buyNowProduct); 
        navigate("/orders"); 
      }, 2000);
    }, 3000);
  };

  const handlePlaceOrder = async (buyNowProduct) => {
    if (!userEmail) {
      alert("User email is missing.");
      return;
    }

    try {
      setLoading(true);

      const orderItems = buyNowProduct ? [buyNowProduct] : cartItems;

      const response = await axios.post(`http://localhost:4000/api/user/placeOrder/${userEmail}`, {
        items: orderItems,
        orderDetails: {
          paymentMethod,
          address: { ...formData }
        }
      });

      if (response.status === 200) {
        await Promise.all(
          orderItems.map(async (item) => {
            await axios.patch(`http://localhost:4000/api/product/updateStock/${item.product_id}`, {
              stock: item.stock - item.quantity
            });
          })
        );

        setCartItems([]); 
        alert("Order placed successfully!");
        navigate("/orders");
      } else {
        console.error("Failed to place order", response.data);
      }
    } catch (error) {
      console.error("Error placing order", error);
    } finally {
      setLoading(false);
    }
  };

  const buyNowProduct = location.state?.buyNowProduct;

  return (
    <div className="payment-page">
      <h1>Complete Your Payment</h1>
      {!isProcessing && !isCompleted && (
        <div className="payment-form">
          <div className="payment-section">
            <h2>Billing Information</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
          </div>
          {paymentMethod === "Credit Card" && (
            <div className="payment-section">
              <h2>Payment Information</h2>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="expiryDate"
                placeholder="Expiry Date (MM/YY)"
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={handleChange}
                required
              />
            </div>
          )}
          {paymentMethod === "UPI" && (
            <div className="payment-section">
              <h2>UPI Payment Information</h2>
              <input
                type="text"
                name="upiId"
                placeholder="UPI ID"
                value={formData.upiId}
                onChange={handleChange}
                required
              />
            </div>
          )}
          {paymentMethod === "NetBanking" && (
            <div className="payment-section">
              <h2>NetBanking Information</h2>
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                value={formData.bankName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="payment-methods">
            <h2>Select Payment Method</h2>
            <div className="brands">
              <FaCcVisa className="brand-iicon" />
              <FaCcMastercard className="brand-iicon" />
              <FaApplePay className="brand-iicon" />
              <FaPaypal className="brand-iicon" />
            </div>
            <div className="payment-methods-radio">
              <label>
                <input
                  type="radio"
                  value="Credit Card"
                  checked={paymentMethod === "Credit Card"}
                  onChange={() => setPaymentMethod("Credit Card")}
                />
                Credit Card
              </label>
              <label>
                <input
                  type="radio"
                  value="UPI"
                  checked={paymentMethod === "UPI"}
                  onChange={() => setPaymentMethod("UPI")}
                />
                UPI
              </label>
              <label>
                <input
                  type="radio"
                  value="Apple Pay"
                  checked={paymentMethod === "Apple Pay"}
                  onChange={() => setPaymentMethod("Apple Pay")}
                />
                Apple Pay
              </label>
              <label>
                <input
                  type="radio"
                  value="NetBanking"
                  checked={paymentMethod === "NetBanking"}
                  onChange={() => setPaymentMethod("NetBanking")}
                />
                NetBanking
              </label>
              <label>
                <input
                  type="radio"
                  value="Cash on Delivery"
                  checked={paymentMethod === "Cash on Delivery"}
                  onChange={() => setPaymentMethod("Cash on Delivery")}
                />
                Cash on Delivery
              </label>
            </div>
          </div>
          <button onClick={() => handlePayment(buyNowProduct)} className="pay-button">
            Complete Payment
          </button>
        </div>
      )}
      {isProcessing && (
        <div className="processing-animation">
          <video src={cardSwipeVideo} autoPlay loop muted />
          <p>Processing Payment...</p>
        </div>
      )}
      {isCompleted && (
        <div className="payment-success">
          <p>Payment Completed Successfully!</p>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
