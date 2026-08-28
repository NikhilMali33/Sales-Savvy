import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ShoppingBag,
    User,
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle
} from "lucide-react";

import loginIllustration from "../../assets/images/login.svg";
import "../../styles/authstyle/auth.css";
import { login, verifyOtp } from "../../services/authService";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState("");

    // Accessible feedback states
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear previous error when user starts correcting input
        if (error) {
            setError("");
        }
    };


    const handleOtpChange = (e) => {

        const value = e.target.value;

        // Allow only numbers
        if (/^\d{0,6}$/.test(value)) {
            setOtp(value);
        }

        if (error) {
            setError("");
        }
    };


    // ============================================================
    // LOGIN
    // ============================================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setSuccessMessage("");
        setLoading(true);

        try {

            const response = await login(formData);

            setSuccessMessage(
                response.data.message ||
                "Login successful. Please enter the OTP sent to your registered email."
            );

            setShowOtp(true);

        } catch (error) {

            console.error("Login failed:", error);

            setError(
                error.response?.data?.error ||
                "Login failed. Please check your username and password and try again."
            );

        } finally {

            setLoading(false);
        }
    };


    // ============================================================
    // VERIFY OTP
    // ============================================================

    const handleVerifyOtp = async (e) => {

        e.preventDefault();

        setError("");
        setSuccessMessage("");

        if (otp.length !== 6) {

            setError(
                "Please enter the 6-digit OTP."
            );

            return;
        }

        setLoading(true);

        try {

            const response = await verifyOtp({
                username: formData.username,
                otp: Number(otp),
            });

            // Save logged-in user
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            const role = response.data.user.role;

            setSuccessMessage(
                response.data.message ||
                "OTP verified successfully."
            );

            if (role === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("/products");
            }

        } catch (error) {

            console.error("OTP verification failed:", error);

            setError(
                error.response?.data?.error ||
                "Invalid OTP. Please check the OTP and try again."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="auth-container">

            {/* ====================================================
                LEFT SIDE
            ==================================================== */}

            <div className="left-panel">

                <div className="logo">
                    <ShoppingBag
                        size={28}
                        aria-hidden="true"
                    />

                    <span>SalesSavvy</span>
                </div>


                <img
                    src={loginIllustration}
                    alt=""
                    className="login-image"
                    aria-hidden="true"
                />


                <h1>
                    Shop Smarter with AI
                </h1>


                <p className="description">
                    Smarter shopping,
                    powered by AI.
                </p>


                <div
                    className="features"
                    aria-label="SalesSavvy features"
                >

                    <div className="feature">

                        <CheckCircle
                            size={18}
                            aria-hidden="true"
                        />

                        <span>
                            Personalized AI Suggestions
                        </span>

                    </div>


                    <div className="feature">

                        <CheckCircle
                            size={18}
                            aria-hidden="true"
                        />

                        <span>
                            Compare Products Instantly
                        </span>

                    </div>


                    <div className="feature">

                        <CheckCircle
                            size={18}
                            aria-hidden="true"
                        />

                        <span>
                            Track Best Prices
                        </span>

                    </div>


                    <div className="feature">

                        <CheckCircle
                            size={18}
                            aria-hidden="true"
                        />

                        <span>
                            Secure OTP Authentication
                        </span>

                    </div>

                </div>

            </div>


            {/* ====================================================
                RIGHT SIDE
            ==================================================== */}

            <div className="right-panel">

                <div className="login-card">

                    {!showOtp ? (

                        <>
                            <h2>
                                Welcome Back
                            </h2>


                            <p className="subtitle">
                                Login to continue your shopping journey.
                            </p>


                            {/* ACCESSIBLE ERROR */}

                            {error && (

                                <div
                                    className="auth-message auth-error"
                                    role="alert"
                                    aria-live="assertive"
                                >

                                    <AlertCircle
                                        size={20}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        {error}
                                    </span>

                                </div>

                            )}


                            {/* ACCESSIBLE SUCCESS */}

                            {successMessage && (

                                <div
                                    className="auth-message auth-success"
                                    role="status"
                                    aria-live="polite"
                                >

                                    <CheckCircle
                                        size={20}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        {successMessage}
                                    </span>

                                </div>

                            )}


                            <form
                                onSubmit={handleLogin}
                                noValidate
                            >

                                {/* USERNAME */}

                                <div className="auth-field">

                                    <label htmlFor="login-username">
                                        Username
                                    </label>


                                    <div className="input-box">

                                        <User
                                            size={18}
                                            aria-hidden="true"
                                        />


                                        <input
                                            id="login-username"
                                            type="text"
                                            name="username"
                                            placeholder="Enter username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            autoComplete="username"
                                            required
                                            aria-required="true"
                                            aria-invalid={Boolean(error)}
                                        />

                                    </div>

                                </div>


                                {/* PASSWORD */}

                                <div className="auth-field">

                                    <label htmlFor="login-password">
                                        Password
                                    </label>


                                    <div className="input-box">

                                        <Lock
                                            size={18}
                                            aria-hidden="true"
                                        />


                                        <input
                                            id="login-password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            placeholder="Enter password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            autoComplete="current-password"
                                            required
                                            aria-required="true"
                                        />


                                        <button
                                            type="button"
                                            className="eye-btn"
                                            onClick={() =>
                                                setShowPassword(
                                                    (prev) => !prev
                                                )
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            aria-pressed={showPassword}
                                        >

                                            {showPassword ? (

                                                <EyeOff
                                                    size={18}
                                                    aria-hidden="true"
                                                />

                                            ) : (

                                                <Eye
                                                    size={18}
                                                    aria-hidden="true"
                                                />

                                            )}

                                        </button>

                                    </div>

                                </div>


                                <button
                                    className="login-btn"
                                    type="submit"
                                    disabled={loading}
                                    aria-disabled={loading}
                                >

                                    {loading
                                        ? "Signing in..."
                                        : "Continue"}

                                </button>

                            </form>


                            <p className="forgot-password">

                                <Link to="/forgot-password">
                                    Forgot Password?
                                </Link>

                            </p>


                            <p className="register-link">

                                Don't have an account?

                                <Link to="/register">
                                    {" "}Create Account
                                </Link>

                            </p>

                        </>

                    ) : (

                        <>
                            <h2>
                                OTP Verification
                            </h2>


                            <p className="subtitle">
                                Enter the OTP sent to your registered email.
                            </p>


                            {/* ACCESSIBLE ERROR */}

                            {error && (

                                <div
                                    className="auth-message auth-error"
                                    role="alert"
                                    aria-live="assertive"
                                >

                                    <AlertCircle
                                        size={20}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        {error}
                                    </span>

                                </div>

                            )}


                            {/* ACCESSIBLE SUCCESS */}

                            {successMessage && (

                                <div
                                    className="auth-message auth-success"
                                    role="status"
                                    aria-live="polite"
                                >

                                    <CheckCircle
                                        size={20}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        {successMessage}
                                    </span>

                                </div>

                            )}


                            <form
                                onSubmit={handleVerifyOtp}
                                noValidate
                            >

                                <div className="auth-field">

                                    <label htmlFor="login-otp">
                                        OTP
                                    </label>


                                    <div className="input-box">

                                        <input
                                            id="login-otp"
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]{6}"
                                            maxLength={6}
                                            placeholder="Enter 6-digit OTP"
                                            value={otp}
                                            onChange={handleOtpChange}
                                            autoComplete="one-time-code"
                                            required
                                            aria-required="true"
                                            aria-describedby="otp-help"
                                            aria-invalid={Boolean(error)}
                                        />

                                    </div>


                                    <span
                                        id="otp-help"
                                        className="input-help"
                                    >
                                        Enter the 6-digit OTP sent to your
                                        registered email.
                                    </span>

                                </div>


                                <button
                                    className="login-btn"
                                    type="submit"
                                    disabled={loading}
                                    aria-disabled={loading}
                                >

                                    {loading
                                        ? "Verifying..."
                                        : "Verify OTP"}

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