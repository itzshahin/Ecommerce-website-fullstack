import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderDetails.css";

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const userEmail = localStorage.getItem("email");

    useEffect(() => {
        async function fetchUserOrders() {
            try {

                const response = await axios.get(`http://localhost:4000/api/user/getUserOrdersByEmail/${userEmail}`);
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching user orders:", error);
            }
        }
        fetchUserOrders();
    }, [userEmail]);


    const handleDeleteOrder = async (orderId) => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/user/deleteOrder/${orderId}`);
            alert(response.data.message);
            setOrders(orders.filter(order => order._id !== orderId));
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("Failed to delete the order");
        }
    };

    const handleTrackOrder = (orderId) => {
        alert(`Tracking order: ${orderId}`);
    };

    return (
        <div className="orders-page">
            <h1>Your Orders</h1>
            {orders.length > 0 ? (
                orders.map(order => (
                    <div key={order._id} className="order">
                        <h3>Order Date: {new Date(order.order_date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        })}</h3>
                        <p>Total Amount: ₹{order.totalAmount}</p>
                        <p>Payment Mode: {order.paymentMethod}</p>
                        <p>Status: {order.status}</p>
                        <div className="order-items">
                            {order.orderItems.map(item => (
                                <div key={item.product_id} className="order-item">
                                    <img src={item.image} alt={item.name} />
                                    <p>{item.name}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ₹{item.price}</p>
                                </div>
                            ))}
                        </div>
                        <div className="order-actions">
                            <button onClick={() => handleDeleteOrder(order._id)} className="delete-order-btn">Delete Order</button>
                        </div>
                    </div>
                ))
            ) : (
                <h2>No orders found</h2>
            )}
        </div>
    );
};

export default UserOrders;
