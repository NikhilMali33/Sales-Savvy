import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    ShoppingBag,
    Lock,
    Eye,
    EyeOff
} from "lucide-react";

import loginIllustration from "../../assets/images/login.svg";
import "../../styles/authstyle/auth.css";
import { resetPassword } from "../../services/authService";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";

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

    const [dialog, setDialog] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "error"
    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


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

        if (formData.newPassword !== formData.confirmPassword) {

            setDialog({
                isOpen: true,
                title: "Password mismatch",
                message: "The passwords you entered do not match. Please check both fields and try again.",
                type: "error"
            });

            return;
        }


        try {

            const response = await resetPassword({
                email,
                newPassword: formData.newPassword,
            });


            setDialog({
                isOpen: true,
                title: "Password reset successful",
                message:
                    response.data.message ||
                    "Your password has been reset successfully.",
                type: "success"
            });


        } catch (error) {

            setDialog({
                isOpen: true,
                title: "Password reset failed",
                message:
                    error.response?.data?.message ||
                    "Failed to reset password. Please try again.",
                type: "error"
            });

        }

    };


    const handleDialogConfirm = () => {

        closeDialog();

        if (dialog.type === "success") {
            navigate("/");
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
                    aria-labelledby="reset-password-title"
                >

                    <h1 id="reset-password-title">
                        Reset Password
                    </h1>

                    <p className="subtitle">
                        Create your new password.
                    </p>


                    <form
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        {/* NEW PASSWORD */}

                        <div className="form-field">

                            <label htmlFor="new-password">
                                New Password
                            </label>

                            <div className="input-box">

                                <Lock
                                    size={18}
                                    aria-hidden="true"
                                />

                                <input
                                    id="new-password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                    aria-required="true"
                                />

                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide new password"
                                            : "Show new password"
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


                        {/* CONFIRM PASSWORD */}

                        <div className="form-field">

                            <label htmlFor="confirm-password">
                                Confirm Password
                            </label>

                            <div className="input-box">

                                <Lock
                                    size={18}
                                    aria-hidden="true"
                                />

                                <input
                                    id="confirm-password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                    aria-required="true"
                                />

                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                    aria-pressed={
                                        showConfirmPassword
                                    }
                                >

                                    {showConfirmPassword ? (
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
                        >
                            Reset Password
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

export default ResetPassword;