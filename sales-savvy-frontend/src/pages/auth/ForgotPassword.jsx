import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ShoppingBag } from "lucide-react";
import loginIllustration from "../../assets/images/login.svg";
import "../../styles/authstyle/auth.css";
import { forgotPassword } from "../../services/authService";

const ForgotPassword = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await forgotPassword(email);

            alert(response.data.message);

            navigate("/verify-reset-otp", {
                state: { email }
            });

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to send OTP"
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
                alt="Forgot Password"
                className="login-image"
            />
        </div>

        <div className="right-panel">
            <div className="login-card">

                <h2>Forgot Password</h2>

                <p className="subtitle">
                    Enter your registered email to receive an OTP.
                </p>

                <form onSubmit={handleSubmit}>

                    <label>Email</label>

                    <div className="input-box">
                        <Mail size={18} />

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button className="login-btn" type="submit">
                        Send OTP
                    </button>

                </form>

                <p className="register-link">
                    <Link to="/">
                        Back to Login
                    </Link>
                </p>

            </div>
        </div>
    </div>
);
};
export default ForgotPassword;