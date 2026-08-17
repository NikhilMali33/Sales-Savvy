import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    ArrowLeft,
    ShoppingBag
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";

import {
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../../services/cartService";

import "../../styles/customer/Cart.css";


function Cart() {

    const [cart, setCart] = useState({
        items: [],
        totalItems: 0,
        totalAmount: 0
    });

    const [loading, setLoading] = useState(true);
    const [updatingItem, setUpdatingItem] = useState(null);


    // ============================================================
    // FETCH CART
    // ============================================================

    useEffect(() => {
        fetchCart();
    }, []);


    const fetchCart = async () => {

        try {

            setLoading(true);

            const response = await getCart();

            setCart(response.data);

        } catch (error) {

            console.error("Error fetching cart:", error);

        } finally {

            setLoading(false);

        }
    };


    // ============================================================
    // NOTIFY NAVBAR
    // ============================================================

    const notifyCartUpdated = () => {

        window.dispatchEvent(
            new Event("cartUpdated")
        );

    };


    // ============================================================
    // INCREASE / DECREASE QUANTITY
    // ============================================================

    const handleQuantityChange = async (
        cartItemId,
        currentQuantity,
        change
    ) => {

        const newQuantity =
            currentQuantity + change;


        if (newQuantity < 1) {
            return;
        }


        try {

            setUpdatingItem(cartItemId);


            const response =
                await updateCartItem(
                    cartItemId,
                    newQuantity
                );


            // Update cart page immediately
            setCart(response.data);


            // Tell Navbar to update immediately
            notifyCartUpdated();


        } catch (error) {

            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to update quantity"
            );

        } finally {

            setUpdatingItem(null);

        }
    };


    // ============================================================
    // REMOVE ITEM
    // ============================================================

    const handleRemove = async (cartItemId) => {

        try {

            setUpdatingItem(cartItemId);


            await removeCartItem(cartItemId);


            // Refresh cart
            await fetchCart();


            // Tell Navbar to update immediately
            notifyCartUpdated();


        } catch (error) {

            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to remove product"
            );

        } finally {

            setUpdatingItem(null);

        }
    };


    // ============================================================
    // CLEAR CART
    // ============================================================

    const handleClearCart = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to clear your cart?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await clearCart();


            // Refresh cart
            await fetchCart();


            // Tell Navbar to update immediately
            notifyCartUpdated();


        } catch (error) {

            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to clear cart"
            );

        }
    };


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="cart-loading">

                    <ShoppingCart size={42} />

                    <h2>
                        Loading your cart...
                    </h2>

                </div>
            </>
        );
    }


    // ============================================================
    // EMPTY CART
    // ============================================================

    if (!cart.items || cart.items.length === 0) {

        return (
            <>
                <Navbar />

                <div className="empty-cart">

                    <div className="empty-cart-icon">
                        <ShoppingCart size={70} />
                    </div>

                    <h1>
                        Your Cart is Empty
                    </h1>

                    <p>
                        Looks like you haven't added
                        anything to your cart yet.
                    </p>

                    <Link
                        to="/products"
                        className="continue-shopping-btn"
                    >

                        <ShoppingBag size={20} />

                        Continue Shopping

                    </Link>

                </div>
            </>
        );
    }


    // ============================================================
    // CART PAGE
    // ============================================================

    return (
        <>
            <Navbar />

            <main className="cart-page">

                {/* HEADER */}

                <div className="cart-header">

                    <div>

                        <h1>
                            Shopping Cart
                        </h1>

                        <p>

                            {cart.totalItems}{" "}

                            {cart.totalItems === 1
                                ? "item"
                                : "items"}{" "}

                            in your cart

                        </p>

                    </div>


                    <button
                        className="clear-cart-btn"
                        onClick={handleClearCart}
                    >

                        <Trash2 size={18} />

                        Clear Cart

                    </button>

                </div>


                <div className="cart-layout">


                    {/* ================================================= */}
                    {/* CART ITEMS */}
                    {/* ================================================= */}

                    <section className="cart-items-section">

                        {cart.items.map((item) => {

                            const hasDiscount =
                                item.discountPrice &&
                                Number(item.discountPrice) <
                                Number(item.price);


                            const unitPrice =
                                hasDiscount
                                    ? Number(item.discountPrice)
                                    : Number(item.price);


                            return (

                                <article
                                    className="cart-item"
                                    key={item.cartItemId}
                                >


                                    {/* IMAGE */}

                                    <div className="cart-item-image-container">

                                        <img
                                            src={item.imageUrl}
                                            alt={item.productName}
                                            className="cart-item-image"
                                        />

                                    </div>


                                    {/* PRODUCT DETAILS */}

                                    <div className="cart-item-details">

                                        <Link
                                            to={`/products/${item.productId}`}
                                            className="cart-product-name"
                                        >
                                            {item.productName}
                                        </Link>


                                        <p className="cart-product-brand">
                                            {item.brand}
                                        </p>


                                        <div className="cart-price">

                                            <span className="current-price">

                                                ₹{" "}

                                                {unitPrice.toLocaleString(
                                                    "en-IN"
                                                )}

                                            </span>


                                            {hasDiscount && (

                                                <span className="original-price">

                                                    ₹{" "}

                                                    {Number(
                                                        item.price
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}

                                                </span>

                                            )}

                                        </div>

                                    </div>


                                    {/* QUANTITY */}

                                    <div className="quantity-section">

                                        <span className="quantity-label">
                                            Quantity
                                        </span>


                                        <div className="quantity-control">


                                            {/* MINUS */}

                                            <button
                                                type="button"
                                                aria-label={`Decrease quantity of ${item.productName}`}
                                                disabled={
                                                    item.quantity <= 1 ||
                                                    updatingItem ===
                                                    item.cartItemId
                                                }
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.cartItemId,
                                                        item.quantity,
                                                        -1
                                                    )
                                                }
                                            >

                                                <Minus size={16} />

                                            </button>


                                            {/* CURRENT QUANTITY */}

                                            <span>
                                                {item.quantity}
                                            </span>


                                            {/* PLUS */}

                                            <button
                                                type="button"
                                                aria-label={`Increase quantity of ${item.productName}`}
                                                disabled={
                                                    updatingItem ===
                                                    item.cartItemId
                                                }
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.cartItemId,
                                                        item.quantity,
                                                        1
                                                    )
                                                }
                                            >

                                                <Plus size={16} />

                                            </button>

                                        </div>

                                    </div>


                                    {/* ITEM TOTAL */}

                                    <div className="cart-item-total">

                                        <span>
                                            Item Total
                                        </span>


                                        <strong>

                                            ₹{" "}

                                            {Number(
                                                item.itemTotal
                                            ).toLocaleString(
                                                "en-IN"
                                            )}

                                        </strong>

                                    </div>


                                    {/* REMOVE */}

                                    <button
                                        type="button"
                                        className="remove-item-btn"
                                        aria-label={`Remove ${item.productName} from cart`}
                                        disabled={
                                            updatingItem ===
                                            item.cartItemId
                                        }
                                        onClick={() =>
                                            handleRemove(
                                                item.cartItemId
                                            )
                                        }
                                    >

                                        <Trash2 size={19} />

                                    </button>

                                </article>

                            );

                        })}

                    </section>


                    {/* ================================================= */}
                    {/* ORDER SUMMARY */}
                    {/* ================================================= */}

                    <aside className="cart-summary">

                        <h2>
                            Order Summary
                        </h2>


                        <div className="summary-row">

                            <span>
                                Items
                            </span>

                            <span>
                                {cart.totalItems}
                            </span>

                        </div>


                        <div className="summary-row">

                            <span>
                                Subtotal
                            </span>

                            <span>

                                ₹{" "}

                                {Number(
                                    cart.totalAmount
                                ).toLocaleString(
                                    "en-IN"
                                )}

                            </span>

                        </div>


                        <div className="summary-row">

                            <span>
                                Delivery
                            </span>

                            <span className="free-delivery">
                                FREE
                            </span>

                        </div>


                        <div className="summary-divider" />


                        <div className="summary-total">

                            <span>
                                Total
                            </span>

                            <strong>

                                ₹{" "}

                                {Number(
                                    cart.totalAmount
                                ).toLocaleString(
                                    "en-IN"
                                )}

                            </strong>

                        </div>


                        <button
                            className="checkout-btn"
                            type="button"
                            onClick={() =>
                                alert(
                                    "Checkout will be implemented next."
                                )
                            }
                        >
                            Proceed to Checkout
                        </button>


                        <Link
                            to="/products"
                            className="back-shopping-link"
                        >

                            <ArrowLeft size={18} />

                            Continue Shopping

                        </Link>

                    </aside>

                </div>

            </main>
        </>
    );
}


export default Cart;