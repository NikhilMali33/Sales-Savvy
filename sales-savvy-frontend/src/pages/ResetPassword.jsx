import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Lock, Eye, EyeOff } from "lucide-react";
import loginIllustration from "../assets/images/login.svg";
import "../styles/auth.css";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            const response = await resetPassword({
                email,
                newPassword: formData.newPassword,
            });

            alert(response.data.message);

            navigate("/");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to reset password"
            );

        }

    };

    return (
        <div className="auth-container">

            <div className="left-panel">

                <div className="logo">
                    <ShoppingBag size={28} />
                    <span>SalesSavvy</span>
                </div>

                <img
                    src={loginIllustration}
                    alt="Reset Password"
                    className="login-image"
                />

            </div>

            <div className="right-panel">

                <div className="login-card">

                    <h2>Reset Password</h2>

                    <p className="subtitle">
                        Create your new password.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <label>New Password</label>

                        <div className="input-box">

                            <Lock size={18} />

                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="eye-btn"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                        </div>

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
                            Reset Password
                        </button>

                    </form>

                    <p className="register-link">
                        <Link to="/">Back to Login</Link>
                    </p>

                </div>

            </div>

        </div>
    );
};

export default ResetPassword;