import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

import "../../styles/layout/Navbar.css";

function Navbar() {

    const [cartCount, setCartCount] = useState(0);

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

            console.error("Failed to load cart count:", error);

        }
    };


    useEffect(() => {

        // Load when Navbar appears
        loadCartCount();

        // Listen for cart changes
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


    return (

        <nav className="navbar">

            <Link to="/products" className="navbar-logo">
                🛍 SalesSavvy
            </Link>


            <Link to="/cart" className="cart-link">

                <div className="cart-icon-wrapper">

                    <ShoppingCart size={28} />

                    {cartCount > 0 && (
                        <span className="cart-badge">
                            {cartCount}
                        </span>
                    )}

                </div>

                <span>Cart</span>

            </Link>

        </nav>

    );
}

export default Navbar;