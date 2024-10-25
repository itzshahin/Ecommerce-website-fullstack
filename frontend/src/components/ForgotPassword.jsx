import { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css"; 

function ForgotPassword({ toggleForgotPassword }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(`http://localhost:4000/api/user/userForgotPassword`, { email });
      setLoading(false);
      
      if (response.data.success) {
        setMessage("Password reset link sent successfully. Please check your email.");
        setError(""); 
      } else {
        setError(response.data.error || "Something went wrong.");
      }
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-modal-content">
        <h2>Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          <button type="button" onClick={toggleForgotPassword}>
            Cancel
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
