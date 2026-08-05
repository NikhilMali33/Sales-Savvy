import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ShoppingBag,
    User,
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
} from "lucide-react";

import loginIllustration from "../assets/images/login.svg";
import { login, verifyOtp } from "../services/authService";
import "../styles/auth.css";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await login(formData);

            alert(response.data.message);

            setShowOtp(true);
        } catch (error) {
            alert(error.response?.data?.error || "Login Failed");
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        try {
            const response = await verifyOtp({
                username: formData.username,
                otp: Number(otp),
            });

            alert(response.data.message);

            navigate("/home");
        } catch (error) {
            alert(error.response?.data?.error || "Invalid OTP");
        }
    };

    return (
        <div className="auth-container">
            {/* Left Side */}
            <div className="left-panel">
                <div className="logo">
                    <ShoppingBag size={28} />
                    <span>SalesSavvy</span>
                </div>

                <img
                    src={loginIllustration}
                    alt="Shopping Illustration"
                    className="login-image"
                />

                <h1>Shop Smarter with AI</h1>

                <p className="description">
                    Smarter shopping,
                    powered by AI.
                </p>

                <div className="features">
                    <div className="feature">
                        <CheckCircle size={18} />
                        <span>Personalized AI Suggestions</span>
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
                        <span>Secure OTP Authentication</span>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="right-panel">
                <div className="login-card">
                    {!showOtp ? (
                        <>
                            <h2>Welcome Back</h2>

                            <p className="subtitle">
                                Login to continue your shopping journey.
                            </p>

                            <form onSubmit={handleLogin}>
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

                                <button className="login-btn" type="submit">
                                    Continue
                                </button>
                            </form>

                            <p className="forgot-password">
                                <Link to="/forgot-password">
                                    Forgot Password?
                                </Link>
                            </p>

                            <p className="register-link">
                                Don't have an account?
                                <Link to="/register"> Create Account</Link>
                            </p>
                        </>
                    ) : (
                        <>
                            <h2>OTP Verification</h2>

                            <p className="subtitle">
                                Enter the OTP sent to your registered email.
                            </p>

                            <form onSubmit={handleVerifyOtp}>
                                <label>OTP</label>

                                <div className="input-box">
                                    <input
                                        type="text"
                                        maxLength={6}
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>

                                <button className="login-btn" type="submit">
                                    Verify OTP
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;