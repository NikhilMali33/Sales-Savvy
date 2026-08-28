import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

import loginIllustration from "../../assets/images/login.svg";
import registerIllustration from "../../assets/images/register.svg";
import "../../styles/authstyle/auth.css";
import "../../styles/authstyle/Register.css";
import { register } from "../../services/authService";

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

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous messages when user edits the form
    if (errorMessage) {
      setErrorMessage("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {

      setErrorMessage(
        "Passwords do not match. Please enter the same password in both fields."
      );

      return;
    }

    try {

      setIsSubmitting(true);

      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const response = await register(payload);

      setSuccessMessage(
        response.data.message || "Registration successful."
      );

      // Later we will redirect to OTP Verification page
      // navigate("/verify-register-otp");

      navigate("/");

    } catch (error) {

      setErrorMessage(
        error.response?.data?.error ||
        "Registration failed. Please try again."
      );

    } finally {

      setIsSubmitting(false);

    }
  };


  return (

    <main
      className="auth-container"
      aria-labelledby="register-title"
    >

      {/* ============================================================
          LEFT PANEL
          ============================================================ */}

      <section
        className="left-panel"
        aria-labelledby="register-intro-title"
      >

        <div className="logo">

          <ShoppingBag
            size={28}
            aria-hidden="true"
          />

          <span>
            SalesSavvy
          </span>

        </div>


        <img
          src={registerIllustration}
          alt=""
          className="login-image"
        />


        <h1 id="register-intro-title">
          Create Your Account
        </h1>


        <p className="description">
          Join SalesSavvy and experience AI-powered shopping with smart
          recommendations, price comparisons and secure authentication.
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
              AI Product Recommendations
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
              Secure OTP Verification
            </span>

          </div>

        </div>

      </section>


      {/* ============================================================
          RIGHT PANEL
          ============================================================ */}

      <section
        className="right-panel"
        aria-labelledby="register-title"
      >

        <div className="login-card">

          <h2 id="register-title">
            Create Account
          </h2>


          <p
            className="subtitle"
            id="register-description"
          >
            Register to start your smarter shopping journey.
          </p>


          {/* ========================================================
              ACCESSIBLE FORM MESSAGE
              ======================================================== */}

          <div
            className="register-message"
            role={errorMessage ? "alert" : "status"}
            aria-live="polite"
            aria-atomic="true"
          >

            {errorMessage && (
              <p className="register-error">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="register-success">
                {successMessage}
              </p>
            )}

          </div>


          <form
            onSubmit={handleSubmit}
            noValidate
            aria-describedby="register-description"
          >

            {/* ======================================================
                USERNAME
                ====================================================== */}

            <div className="register-field">

              <label htmlFor="register-username">
                Username
              </label>


              <div className="input-box">

                <User
                  size={18}
                  aria-hidden="true"
                  className="input-icon"
                />


                <input
                  id="register-username"
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                  aria-required="true"
                />

              </div>

            </div>


            {/* ======================================================
                EMAIL
                ====================================================== */}

            <div className="register-field">

              <label htmlFor="register-email">
                Email
              </label>


              <div className="input-box">

                <Mail
                  size={18}
                  aria-hidden="true"
                  className="input-icon"
                />


                <input
                  id="register-email"
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  aria-required="true"
                />

              </div>

            </div>


            {/* ======================================================
                PASSWORD
                ====================================================== */}

            <div className="register-field">

              <label htmlFor="register-password">
                Password
              </label>


              <div className="input-box">

                <Lock
                  size={18}
                  aria-hidden="true"
                  className="input-icon"
                />


                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  aria-required="true"
                />


                <button
                  type="button"
                  className="eye-btn"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
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


            {/* ======================================================
                CONFIRM PASSWORD
                ====================================================== */}

            <div className="register-field">

              <label htmlFor="register-confirm-password">
                Confirm Password
              </label>


              <div className="input-box">

                <Lock
                  size={18}
                  aria-hidden="true"
                  className="input-icon"
                />


                <input
                  id="register-confirm-password"
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
                  aria-invalid={
                    errorMessage &&
                    formData.confirmPassword.length > 0 &&
                    formData.password !== formData.confirmPassword
                      ? "true"
                      : "false"
                  }
                />


                <button
                  type="button"
                  className="eye-btn"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  aria-pressed={showConfirmPassword}
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


            {/* ======================================================
                SUBMIT
                ====================================================== */}

            <button
              className="login-btn"
              type="submit"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            >

              {isSubmitting
                ? "Creating Account..."
                : "Create Account"}

            </button>

          </form>


          {/* ========================================================
              LOGIN LINK
              ======================================================== */}

          <p className="register-link">

            Already have an account?

            {" "}

            <Link to="/">
              Login
            </Link>

          </p>

        </div>

      </section>

    </main>
  );
}

export default Register;