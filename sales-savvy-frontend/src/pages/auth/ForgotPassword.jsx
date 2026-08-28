import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ShoppingBag } from "lucide-react";

import loginIllustration from "../../assets/images/login.svg";
import "../../styles/authstyle/auth.css";

import { forgotPassword } from "../../services/authService";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";

const ForgotPassword = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [dialog, setDialog] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "error"
    });


    const closeDialog = () => {

        setDialog({
            isOpen: false,
            title: "",
            message: "",
            type: "error"
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await forgotPassword(email);

            setDialog({
                isOpen: true,
                title: "OTP sent",
                message:
                    response.data.message ||
                    "An OTP has been sent to your registered email address.",
                type: "success"
            });

        } catch (error) {

            setDialog({
                isOpen: true,
                title: "Unable to send OTP",
                message:
                    error.response?.data?.message ||
                    "Failed to send OTP. Please try again.",
                type: "error"
            });

        }

    };


    const handleDialogConfirm = () => {

        const wasSuccessful =
            dialog.type === "success";

        closeDialog();

        if (wasSuccessful) {

            navigate("/verify-reset-otp", {
                state: { email }
            });

        }

    };


    return (

        <div className="auth-container">

            {/* LEFT PANEL */}

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
                />

            </div>


            {/* RIGHT PANEL */}

            <div className="right-panel">

                <main
                    className="login-card"
                    aria-labelledby="forgot-password-title"
                >

                    <h1 id="forgot-password-title">
                        Forgot Password
                    </h1>


                    <p className="subtitle">
                        Enter your registered email to receive an OTP.
                    </p>


                    <form
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        <div className="form-field">

                            <label htmlFor="forgot-password-email">
                                Email
                            </label>


                            <div className="input-box">

                                <Mail
                                    size={18}
                                    aria-hidden="true"
                                />


                                <input
                                    id="forgot-password-email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    autoComplete="email"
                                    required
                                    aria-required="true"
                                />

                            </div>

                        </div>


                        <button
                            className="login-btn"
                            type="submit"
                        >
                            Send OTP
                        </button>

                    </form>


                    <p className="register-link">

                        <Link to="/">
                            Back to Login
                        </Link>

                    </p>

                </main>

            </div>


            {/* ACCESSIBLE FEEDBACK DIALOG */}

            <ConfirmationDialog
                isOpen={dialog.isOpen}
                title={dialog.title}
                message={dialog.message}
                confirmText="OK"
                cancelText=""
                onConfirm={handleDialogConfirm}
                onCancel={closeDialog}
                danger={dialog.type === "error"}
            />

        </div>
    );
};


export default ForgotPassword;