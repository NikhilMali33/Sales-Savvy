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
    const profileButtonRef = useRef(null);
    const firstDropdownItemRef = useRef(null);


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
    // CLOSE DROPDOWN WITH ESCAPE KEY
    // ============================================================

    useEffect(() => {

        const handleEscape = (event) => {

            if (event.key === "Escape" && profileOpen) {

                setProfileOpen(false);

                // Return focus to profile button
                profileButtonRef.current?.focus();

            }

        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, [profileOpen]);


    // ============================================================
    // MOVE FOCUS TO FIRST DROPDOWN ITEM
    // ============================================================

    useEffect(() => {

        if (profileOpen) {

            firstDropdownItemRef.current?.focus();

        }

    }, [profileOpen]);


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

            // Redirect to products
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
    // TOGGLE PROFILE MENU
    // ============================================================

    const handleProfileToggle = () => {

        setProfileOpen(
            previous => !previous
        );

    };


    // ============================================================
    // NAVBAR
    // ============================================================

    return (

        <nav
            className="navbar"
            aria-label="Main navigation"
        >

            {/* ====================================================
                LOGO
            ==================================================== */}

            <Link
                to="/products"
                className="navbar-logo"
                aria-label="SalesSavvy home"
            >

                <span aria-hidden="true">
                    🛍
                </span>

                <span>
                    SalesSavvy
                </span>

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

                    <span
                        className="navbar-link-icon"
                        aria-hidden="true"
                    >
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
                        ref={profileButtonRef}
                        type="button"
                        className="profile-button"
                        onClick={handleProfileToggle}
                        aria-label="Profile menu"
                        aria-expanded={profileOpen}
                        aria-controls="profile-menu"
                    >

                        <UserCircle
                            size={28}
                            aria-hidden="true"
                        />

                        <span>
                            Profile
                        </span>

                    </button>


                    {/* =============================================
                        PROFILE DROPDOWN
                    ============================================= */}

                    {profileOpen && (

                        <div
                            id="profile-menu"
                            className="profile-dropdown"
                            aria-label="Profile options"
                        >


                            {/* PROFILE */}

                            <Link
                                ref={firstDropdownItemRef}
                                to="/profile"
                                className="profile-dropdown-item"
                                onClick={() =>
                                    setProfileOpen(false)
                                }
                            >

                                <User
                                    size={18}
                                    aria-hidden="true"
                                />

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

                                <LogOut
                                    size={18}
                                    aria-hidden="true"
                                />

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
                    aria-label={
                        cartCount > 0
                            ? `Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`
                            : "Cart, empty"
                    }
                >

                    <div className="cart-icon-wrapper">

                        <ShoppingCart
                            size={28}
                            aria-hidden="true"
                        />

                        {cartCount > 0 && (

                            <span
                                className="cart-badge"
                                aria-hidden="true"
                            >
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