import React, { useContext, useState } from 'react';
import { myContext } from "./Context";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Register.css';
import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserSecret } from "react-icons/fa";

function Register() {
    const { user } = useContext(myContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const nav = useNavigate();
    const serverURL = 'http://localhost:4000';

    const isUserAlreadyRegistered = () => {
        return user && user.some((data) => data.email === email);
    };

    const validateEmail = () => {
        if (!email.endsWith("@gmail.com")) {
            setEmailError("Email must be a valid Gmail address.");
            return false;
        }
        setEmailError("");
        return true;
    };

    const validatePassword = () => {

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+[\]{};':",.<>?]{6,}$/;

        console.log("Password being validated:", password);
        console.log("Regex pattern:", passwordRegex);

        const trimmedPassword = password.trim();
        console.log("Trimmed password:", trimmedPassword);

        const isValid = passwordRegex.test(trimmedPassword);
        console.log("Password validation result:", isValid);

        if (!isValid) {
            setPasswordError("Password must contain at least one letter, one number, and be at least 6 characters long.");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateEmail() || !validatePassword()) {
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (isUserAlreadyRegistered()) {
            alert("User already registered. Please use a different email.");
            return;
        }

        try {
            const response = await axios.post(`${serverURL}/api/user/adduser`, {
                username,
                email,
                password
            });

            alert("User registered successfully!");
            nav("/login");
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error adding user:', error);
            if (error.response && error.response.status === 409) {
                alert("User Email is already registered.");
                console.error("User email is already registered", error);
            } else {
                alert("Error registering user. Please try again later.");
                console.error("Error registering user", error);
            }
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="register-container">
            <form onSubmit={handleRegister} className="register-form-container">
                <h1 className="register-heading">PERSONAL DETAILS</h1>
                <div className="register-input-group">
                    <label htmlFor="username">USERNAME</label>
                    <div className="login-input-icon-container">
                        <FaUserSecret className="login-input-icon" />
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="register-input-field"
                            required
                        />
                    </div>
                </div>
                <div className="register-input-group">
                    <label htmlFor="email">EMAIL</label>
                    <div className="login-input-icon-container">
                        <MdEmail className="login-input-icon" />
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="register-input-field"
                            required
                        />
                    </div>
                    {emailError && <p className="register-error-message">{emailError}</p>}
                </div>
                <div className="register-input-group">
                    <label htmlFor="password">PASSWORD</label>
                    <div className="login-input-icon-container">
                        <RiLockPasswordFill className="login-input-icon" />
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="register-input-field"
                            required
                        />
                        <span className="password-toggle-icon" onClick={toggleShowPassword}>
                            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                        </span>
                    </div>
                </div>
                <div className="register-input-group">
                    <label htmlFor="confirm-password">CONFIRM PASSWORD</label>
                    <div className="login-input-icon-container">
                        <RiLockPasswordFill className="login-input-icon" />
                        <input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="register-input-field"
                            required
                        />
                        <span className="password-toggle-icon" onClick={toggleShowConfirmPassword}>
                            {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
                        </span>
                    </div>
                </div>
                <p className="register-error-message">
                    {passwordError || "(**Password must contain at least one letter, one number, and be at least 6 characters long**)"}
                </p>
                <button type="submit" className="register-button">CREATE ACCOUNT</button>
                <div className="register-link">
                    <h2>Already have an Account?</h2>
                    <button type="button" onClick={() => nav('/login')} className="login-link">LOG IN</button>
                </div>
            </form>
        </div>
    );
}

export default Register;
