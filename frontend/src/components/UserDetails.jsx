import React, { useContext, useEffect, useState } from "react";
import { myContext } from "./Context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserDetails.css";

export default function UserDetails() {
    const { user, setUser } = useContext(myContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/user/getuser`);
            setUser(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const BanUser = async (id) => {
        setLoading(true);
        setError(null);
    
        try {
            const response = await axios.put(`http://localhost:4000/api/user/banUser/${id}`);
            fetchUser(); 
        } catch (error) {
            console.error('Error banning user:', error);
            setError('Failed to ban user. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const unbanUser = async (id) => {
        setLoading(true);
        setError(null);
    
        try {
            const response = await axios.put(`http://localhost:4000/api/user/unbanUser/${id}`);
            fetchUser(); 
        } catch (error) {
            console.error('Error unbanning user:', error);
            setError('Failed to unban user. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const toggleBanStatus = (user) => {
        if (user.isBanned) {  
            unbanUser(user._id);
        } else {
            BanUser(user._id);
        }
    };

    const navigateToOrders = (userId) => {
        navigate(`/admin/orders/${userId}`); 
    };

    return (
        <div className="user-admin-container">
            <h1 className="user-title">Registered Users</h1>
            {error && <p className="error-message">{error}</p>}
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {user && user.length > 0 ? (
                        user.map((user) => (
                            <tr key={user.email}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button
                                        className={`banuser ${user.isBanned ? "unban" : "ban"}`}
                                        onClick={() => toggleBanStatus(user)}
                                        disabled={loading}
                                    >
                                        {user.isBanned ? "Unban User" : "Ban User"}
                                    </button>
                                    <button
                                        className="view-orders"
                                        onClick={() => navigateToOrders(user._id)} 
                                    >
                                        View Orders
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
