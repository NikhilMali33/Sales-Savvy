import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    ShoppingCart,
    UserCircle,
    LogOut,
    User
} from "lucide-react";

import "../../styles/layout/Navbar.css";


function Navbar() {

    const navigate = useNavigate();

    const [cartCount, setCartCount] = useState(0);
    const [profileOpen, setProfileOpen] = useState(false);

    const profileRef = useRef(null);


    // ============================================================
    // LOAD CART COUNT
    // ============================================================

    const loadCartCount = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/api/cart",
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            setCartCount(data.totalItems || 0);

        } catch (error) {

            console.error(
                "Failed to load cart count:",
                error
            );

        }
    };


    // ============================================================
    // LOAD CART + LISTEN FOR CART CHANGES
    // ============================================================

    useEffect(() => {

        loadCartCount();


        const handleCartUpdate = () => {
            loadCartCount();
        };


        window.addEventListener(
            "cartUpdated",
            handleCartUpdate
        );


        return () => {

            window.removeEventListener(
                "cartUpdated",
                handleCartUpdate
            );

        };

    }, []);


    // ============================================================
    // CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
    // ============================================================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {

                setProfileOpen(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // ============================================================
    // LOGOUT
    // ============================================================

    const handleLogout = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/logout",
                {
                    method: "POST",
                    credentials: "include",
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Logout failed"
                );

            }


            // Close dropdown
            setProfileOpen(false);


            // Redirect to login
            navigate("/products");

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

            alert(
                "Unable to logout. Please try again."
            );

        }

    };


    // ============================================================
    // NAVBAR
    // ============================================================

    return (

        <nav className="navbar">

            {/* ====================================================
                LOGO
            ==================================================== */}

            <Link
                to="/products"
                className="navbar-logo"
            >
                🛍 SalesSavvy
            </Link>


            {/* ====================================================
                RIGHT SIDE
            ==================================================== */}

            <div className="navbar-right">


                {/* =================================================
                    MY ORDERS
                ================================================= */}

                <Link
                    to="/orders"
                    className="navbar-link"
                >

                    <span className="navbar-link-icon">
                        📦
                    </span>

                    <span>
                        My Orders
                    </span>

                </Link>


                {/* =================================================
                    PROFILE
                ================================================= */}

                <div
                    className="profile-container"
                    ref={profileRef}
                >

                    <button
                        type="button"
                        className="profile-button"
                        onClick={() =>
                            setProfileOpen(
                                previous =>
                                    !previous
                            )
                        }
                        aria-label="Open profile menu"
                        aria-expanded={profileOpen}
                    >

                        <UserCircle size={28} />

                        <span>
                            Profile
                        </span>

                    </button>


                    {/* =============================================
                        PROFILE DROPDOWN
                    ============================================= */}

                    {profileOpen && (

                        <div className="profile-dropdown">


                            {/* PROFILE */}

                            <Link
                                to="/profile"
                                className="profile-dropdown-item"
                                onClick={() =>
                                    setProfileOpen(false)
                                }
                            >

                                <User size={18} />

                                <span>
                                    My Profile
                                </span>

                            </Link>


                            {/* LOGOUT */}

                            <button
                                type="button"
                                className="profile-dropdown-item logout-item"
                                onClick={handleLogout}
                            >

                                <LogOut size={18} />

                                <span>
                                    Logout
                                </span>

                            </button>


                        </div>

                    )}

                </div>


                {/* =================================================
                    CART
                ================================================= */}

                <Link
                    to="/cart"
                    className="cart-link"
                >

                    <div className="cart-icon-wrapper">

                        <ShoppingCart size={28} />

                        {cartCount > 0 && (

                            <span className="cart-badge">
                                {cartCount}
                            </span>

                        )}

                    </div>

                    <span>
                        Cart
                    </span>

                </Link>


            </div>

        </nav>

    );

}


export default Navbar;