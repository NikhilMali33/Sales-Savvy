import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import loginIllustration from "../../assets/images/login.svg";
import "../../styles/authstyle/auth.css";

import { verifyResetOtp } from "../../services/authService";

const VerifyResetOtp = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleOtpChange = (e) => {

        const value = e.target.value.replace(/\D/g, "");

        setOtp(value);

        // Clear previous messages when user starts correcting the OTP
        if (error) {
            setError("");
        }

        if (status) {
            setStatus("");
        }
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setStatus("");


        // ------------------------------------------------------------
        // EMAIL CHECK
        // ------------------------------------------------------------

        if (!email) {

            setError(
                "Your password reset session has expired. Please request a new OTP."
            );

            return;
        }


        // ------------------------------------------------------------
        // OTP VALIDATION
        // ------------------------------------------------------------

        if (otp.length !== 6) {

            setError("Please enter the 6-digit OTP.");

            return;
        }


        try {

            setIsSubmitting(true);

            const response = await verifyResetOtp({
                email,
                otp: Number(otp),
            });


            setStatus(
                response.data.message ||
                "OTP verified successfully."
            );


            // Small delay allows screen readers to announce
            // the success message before navigation.
            setTimeout(() => {

                navigate("/reset-password", {
                    state: { email },
                });

            }, 300);


        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Invalid OTP. Please check the code and try again."
            );

        } finally {

            setIsSubmitting(false);
        }
    };


    return (
        <div className="auth-container">

            {/* =====================================================
                LEFT PANEL
            ===================================================== */}

            <div className="left-panel">

                <div
                    className="logo"
                    aria-label="SalesSavvy"
                >
                    <ShoppingBag
                        size={28}
                        aria-hidden="true"
                    />

                    <span>
                        SalesSavvy
                    </span>
                </div>


                <img
                    src={loginIllustration}
                    alt=""
                    className="login-image"
                    aria-hidden="true"
                />

            </div>


            {/* =====================================================
                RIGHT PANEL
            ===================================================== */}

            <div className="right-panel">

                <main
                    className="login-card"
                    aria-labelledby="otp-page-title"
                >

                    <h1 id="otp-page-title">
                        OTP Verification
                    </h1>


                    <p className="subtitle">
                        Enter the OTP sent to your email.
                    </p>


                    {/* =================================================
                        STATUS MESSAGE
                    ================================================= */}

                    {status && (
                        <div
                            className="auth-status-message"
                            role="status"
                            aria-live="polite"
                        >
                            {status}
                        </div>
                    )}


                    {/* =================================================
                        ERROR MESSAGE
                    ================================================= */}

                    {error && (
                        <div
                            className="auth-error-message"
                            role="alert"
                            aria-live="assertive"
                        >
                            {error}
                        </div>
                    )}


                    <form onSubmit={handleSubmit} noValidate>

                        {/* =================================================
                            OTP
                        ================================================= */}

                        <label
                            htmlFor="reset-otp"
                        >
                            OTP
                        </label>


                        <div
                            className={`input-box ${
                                error ? "input-error" : ""
                            }`}
                        >

                            <input
                                id="reset-otp"
                                name="otp"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]{6}"
                                maxLength={6}
                                autoComplete="one-time-code"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={handleOtpChange}
                                required
                                aria-required="true"
                                aria-invalid={error ? "true" : "false"}
                                aria-describedby={
                                    error
                                        ? "otp-error"
                                        : "otp-help"
                                }
                            />

                        </div>


                        <p
                            id="otp-help"
                            className="input-help"
                        >
                            Enter the 6-digit verification code sent to
                            your registered email address.
                        </p>


                        {error && (
                            <span
                                id="otp-error"
                                className="visually-hidden"
                            >
                                {error}
                            </span>
                        )}


                        {/* =================================================
                            SUBMIT
                        ================================================= */}

                        <button
                            className="login-btn"
                            type="submit"
                            disabled={isSubmitting}
                            aria-disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Verifying..."
                                : "Verify OTP"
                            }
                        </button>

                    </form>


                    {/* =================================================
                        BACK LINK
                    ================================================= */}

                    <p className="register-link">

                        <Link to="/forgot-password">
                            Back to Forgot Password
                        </Link>

                    </p>

                </main>

            </div>

        </div>
    );
};

export default VerifyResetOtp;