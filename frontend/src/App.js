import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddProduct from "./components/AddProduct";
import AdminPanel from "./components/AdminPanel";
import Register from "./components/Register";
import { Shop } from "./components/shop/Shop.jsx";
import Wishlist from "./components/Wishlist.jsx";
import { Cart } from "./components/cart/cart.jsx";
import PaymentPage from "./components/PaymentPage.js"
import UserOrders from "./components/UserOrders.js";
import Orders from "./components/Orders.js"
import { Navbar } from "./components/Navbar.jsx";
import UserDetails from "./components/UserDetails.jsx";
import { myContext } from "./components/Context.js";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx"
import PrivacyPolicy from "./components/Privacypolicy.js"
import TermsAndConditions from "./components/TermsandConditions.js";
import ProductDetails from "./components/ProductDetails";

function App() {
    const [user, setUser] = useState([]);
    const [logUser, setLogUser] = useState(localStorage.getItem("email") ? { email: localStorage.getItem("email") } : null);
    const [products, setProducts] = useState([]);
    const [filterSearch, setFilterSearch] = useState(products);
    const [liked, setLiked] = useState([]);
    const [add, setAdd] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [userBan, setUserBan] = useState([]);

    const getUserbyEmail = (email) => {
        return user.find((user) => user.email === email);
    };

    const values = { liked, setLiked, add, setAdd, user, setUser, logUser, setLogUser, userBan, setUserBan, products, setProducts, cartItems, setCartItems, getUserbyEmail, filterSearch, setFilterSearch };
    
    return (
        <div className="App">
            <BrowserRouter>
                <myContext.Provider value={values}>
                    <Navbar />
                    <Routes>
                        <Route path='/' element={<Shop />} />
                        <Route path='/product/:productId' element={<ProductDetails />} />
                        <Route path='/Admin' element={<AdminPanel />} />
                        <Route path="/Addproduct" element={<AddProduct />} />
                        <Route path='/UserDetails' element={<UserDetails />} />
                        <Route path='/Register' element={<Register />} />
                        <Route path='/Login' element={<Login />} />
                        <Route path='/Forgot' element={<ForgotPassword/>} />
                        <Route path='/user/resetpassword/:id/:token' element={<ResetPassword/>} />
                        <Route path='/cart' element={<Cart />} />
                        <Route path='/payment' element={<PaymentPage />} />
                        <Route path='/orders' element={<UserOrders />} />
                        <Route path='/admin/orders/:userId' element={<Orders />} />
                        <Route path='/wishlist' element={<Wishlist />} />
                        <Route path='/privacy' element={<PrivacyPolicy />} />
                        <Route path='/terms' element={<TermsAndConditions />} />
                    </Routes>
                </myContext.Provider>
            </BrowserRouter>
        </div>
    );
}

export default App;
