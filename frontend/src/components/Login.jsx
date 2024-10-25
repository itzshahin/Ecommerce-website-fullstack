import { useContext, useState } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { myContext } from "./Context";
import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

function Login() {
  const { setLogUser } = useContext(myContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const nav = useNavigate();

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
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must contain at least one letter, one number, and be at least 6 characters long."
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const userLoginbtn = async (e) => {
    e.preventDefault();

    if (!validateEmail() || !validatePassword()) {
      return;
    }

    try {
      const userResponse = await axios.get(
        `http://localhost:4000/api/user/getuser`
      );
      console.log("API response:", userResponse.data); 
      const users =
        userResponse.data.users ||
        userResponse.data.user ||
        userResponse.data; 
      const userData = users.find((user) => user.email === email);

      if (!userData) {
        setError("User not found.");
        return;
      }

      if (userData.isBanned) {
        setError(
          "Your account has been banned. Please contact the admin for further support."
        );
        return;
      }

      
      const response = await axios.post(
        `http://localhost:4000/api/user/loginuser`,
        { email, password }
      );
      localStorage.setItem("userToken", response.data.authToken);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("email", email);
      alert("Login Successfully!");
      nav("/");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Error logging in. Please try again later.");
      }
      console.error("Error logging in", error);
    }
  };

  const goToRegister = () => {
    nav("/Register");
  };

  const goToForgotPassword = () => {
    nav("/forgot");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1 className="login-heading">LOG IN</h1>
        <div className="login-input-group">
          <label>EMAIL</label>
          <div className="login-input-icon-container">
            <MdEmail className="login-input-icon" />
            <input
              className="login-input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {emailError && <p className="login-error-message">{emailError}</p>}
        </div>
        <div className="login-input-group">
          <label>PASSWORD</label>
         
          <div className="login-input-icon-container">
            <RiLockPasswordFill className="login-input-icon" />
            <input
              className="login-input-field"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="password-toggle-icon" onClick={toggleShowPassword}>
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </span>
          </div>
          {passwordError && <p className="login-error-message">{passwordError}</p>}
        </div>
        <button className="login-button" onClick={userLoginbtn}>
          LOG IN
        </button>
        {error && <p className="login-error-message">{error}</p>}
        <div className="login-forgot-password">
          <button onClick={goToForgotPassword} className="forgot-password-button">
            Forgot Password?
          </button>
        </div>
        <div className="login-register-link">
          <h2>Need An Account? Register First!</h2>
          <button className="register-button" onClick={goToRegister}>
            REGISTER
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
