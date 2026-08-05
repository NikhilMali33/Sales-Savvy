import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import loginIllustration from "../assets/images/login.svg";
import "../styles/auth.css";
import { verifyResetOtp } from "../services/authService";

const VerifyResetOtp = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await verifyResetOtp({
                email,
                otp: Number(otp),
            });

            alert(response.data.message);

            navigate("/reset-password", {
                state: { email },
            });

        } catch (error) {

            alert(error.response?.data?.message || "Invalid OTP");

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
                    alt="OTP Verification"
                    className="login-image"
                />

            </div>

            <div className="right-panel">

                <div className="login-card">

                    <h2>OTP Verification</h2>

                    <p className="subtitle">
                        Enter the OTP sent to your email.
                    </p>

                    <form onSubmit={handleSubmit}>

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

                        <button className="login-btn">
                            Verify OTP
                        </button>

                    </form>

                    <p className="register-link">
                        <Link to="/forgot-password">
                            Back
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
};

export default VerifyResetOtp;