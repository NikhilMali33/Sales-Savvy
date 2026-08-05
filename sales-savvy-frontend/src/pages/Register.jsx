import "../styles/Register.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import {
  ShoppingBag,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

import registerIllustration from "../assets/images/register.svg";
import { register } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const response = await register(payload);

      alert(response.data.message || "Registration Successful");

      // Later we will redirect to OTP Verification page
      // navigate("/verify-register-otp");

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.error ||
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-container">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="logo">
          <ShoppingBag size={28} />
          <span>SalesSavvy</span>
        </div>

        <img
          src={registerIllustration}
          alt="Register Illustration"
          className="login-image"
        />

        <h1>Create Your Account</h1>

        <p className="description">
          Join SalesSavvy and experience AI-powered shopping with smart
          recommendations, price comparisons and secure authentication.
        </p>

        <div className="features">
          <div className="feature">
            <CheckCircle size={18} />
            <span>AI Product Recommendations</span>
          </div>

          <div className="feature">
            <CheckCircle size={18} />
            <span>Compare Products Instantly</span>
          </div>

          <div className="feature">
            <CheckCircle size={18} />
            <span>Track Best Prices</span>
          </div>

          <div className="feature">
            <CheckCircle size={18} />
            <span>Secure OTP Verification</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="login-card">
          <h2>Create Account</h2>

          <p className="subtitle">
            Register to start your smarter shopping journey.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <label>Username</label>

            <div className="input-box">
              <User size={18} />

              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <label>Email</label>

            <div className="input-box">
              <Mail size={18} />

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <label>Password</label>

            <div className="input-box">
              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <label>Confirm Password</label>

            <div className="input-box">
              <Lock size={18} />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <button className="login-btn" type="submit">
              Create Account
            </button>
          </form>

          <p className="register-link">
            Already have an account?
            <Link to="/"> Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;