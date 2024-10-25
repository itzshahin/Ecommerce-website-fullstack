import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { id, token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/user/userResetPassword/${id}/${token}`,
        { password: newPassword }
      );

      if (response.data.Status === "Success") {
        setMessage("Password reset successfully.");
        setError("");

        
        setTimeout(() => {
          alert("Password reset is successful"); 
          navigate("/login");
        }, 1000); 
      } else {
        setError(response.data.message || "An error occurred.");
      }
    } catch (error) {
      if (
        error.response?.status === 401 &&
        error.response?.data?.message === "The reset link has expired. Please request a new one."
      ) {
        setError("The reset link has expired. Please request a new one.");
      } else {
        setError(error.response?.data?.error || "An error occurred while resetting the password.");
      }
      setMessage("");
    }
  };

  return (
    <div className="reset-password">
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      {}
      <button className="login-button" onClick={() => navigate("/login")}>
        Go to Login
      </button>
    </div>
  );
}

export default ResetPassword;
