import axios from "axios";
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
import ConfirmationDialog from "../../components/common/ConfirmationDialog";

import {
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../../services/cartService";

import { createPaymentOrder } from "../../services/paymentService";

import "../../styles/customer/Cart.css";

function Cart() {

    const [cart, setCart] = useState({
        items: [],
        totalItems: 0,
        totalAmount: 0
    });

    const [loading, setLoading] = useState(true);
    const [updatingItem, setUpdatingItem] = useState(null);

    const [statusMessage, setStatusMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [clearCartDialogOpen, setClearCartDialogOpen] = useState(false);

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

            setErrorMessage(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to load your cart."
            );

        } finally {

            setLoading(false);
        }
    };

    const notifyCartUpdated = () => {

        window.dispatchEvent(
            new Event("cartUpdated")
        );
    };

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

            setErrorMessage("");
            setStatusMessage("");
            setUpdatingItem(cartItemId);

            const response =
                await updateCartItem(
                    cartItemId,
                    newQuantity
                );

            setCart(response.data);

            notifyCartUpdated();

            setStatusMessage(
                "Cart quantity updated."
            );

        } catch (error) {

            console.error(
                "Unable to update quantity:",
                error
            );

            setErrorMessage(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to update quantity."
            );

        } finally {

            setUpdatingItem(null);
        }
    };

    const handleRemove = async (
        cartItemId,
        productName
    ) => {

        try {

            setErrorMessage("");
            setStatusMessage("");
            setUpdatingItem(cartItemId);

            await removeCartItem(cartItemId);

            await fetchCart();

            notifyCartUpdated();

            setStatusMessage(
                `${productName} was removed from your cart.`
            );

        } catch (error) {

            console.error(
                "Unable to remove product:",
                error
            );

            setErrorMessage(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to remove product."
            );

        } finally {

            setUpdatingItem(null);
        }
    };

    const openClearCartDialog = () => {

        setErrorMessage("");
        setStatusMessage("");

        setClearCartDialogOpen(true);
    };

    const handleClearCart = async () => {

        setClearCartDialogOpen(false);

        try {

            setErrorMessage("");
            setStatusMessage("");

            await clearCart();

            await fetchCart();

            notifyCartUpdated();

            setStatusMessage(
                "Your cart has been cleared."
            );

        } catch (error) {

            console.error(
                "Unable to clear cart:",
                error
            );

            setErrorMessage(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to clear cart."
            );
        }
    };

    const handleCheckout = async () => {

        try {

            setErrorMessage("");
            setStatusMessage("");

            const orderResponse = await axios.post(
                "http://localhost:8080/api/orders",
                {},
                {
                    withCredentials: true
                }
            );

            const salesSavvyOrder =
                orderResponse.data;

            console.log(
                "Sales Savvy Order:",
                salesSavvyOrder
            );

            const paymentResponse =
                await createPaymentOrder(
                    salesSavvyOrder.orderId
                );

            const paymentData =
                paymentResponse.data;

            console.log(
                "Razorpay Order:",
                paymentData
            );

            if (!window.Razorpay) {

                setErrorMessage(
                    "Razorpay Checkout is not loaded. Please refresh the page."
                );

                return;
            }

            const options = {

                key: paymentData.keyId,

                amount: paymentData.amount,

                currency: paymentData.currency,

                name: "Sales Savvy",

                description:
                    `Payment for Order ${salesSavvyOrder.orderId}`,

                order_id:
                    paymentData.razorpayOrderId,

                handler: async function (response) {

                    console.log(
                        "Razorpay Payment Response:",
                        response
                    );

                    try {

                        await axios.post(
                            "http://localhost:8080/api/payment/verify",
                            {
                                orderId:
                                    salesSavvyOrder.orderId,

                                razorpayOrderId:
                                    response.razorpay_order_id,

                                razorpayPaymentId:
                                    response.razorpay_payment_id,

                                razorpaySignature:
                                    response.razorpay_signature
                            },
                            {
                                withCredentials: true
                            }
                        );

                        setStatusMessage(
                            "Payment successful! Your order has been confirmed."
                        );

                        await fetchCart();

                        notifyCartUpdated();

                    } catch (error) {

                        console.error(
                            "Payment verification failed:",
                            error
                        );

                        setErrorMessage(
                            error.response?.data?.message ||
                            error.response?.data?.error ||
                            "Payment verification failed."
                        );
                    }
                },

                prefill: {
                    name: "",
                    email: ""
                },

                theme: {
                    color: "#3399cc"
                }
            };

            const razorpay =
                new window.Razorpay(options);

            razorpay.open();

        } catch (error) {

            console.error(
                "Checkout Error:",
                error
            );

            setErrorMessage(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to start checkout."
            );
        }
    };

    if (loading) {

        return (
            <>
                <Navbar />

                <main
                    className="cart-loading"
                    aria-busy="true"
                    aria-live="polite"
                >
                    <ShoppingCart
                        size={42}
                        aria-hidden="true"
                    />

                    <h1>
                        Loading your cart...
                    </h1>
                </main>
            </>
        );
    }

    if (!cart.items || cart.items.length === 0) {

        return (
            <>
                <Navbar />

                <main className="empty-cart">

                    <div
                        className="empty-cart-icon"
                        aria-hidden="true"
                    >
                        <ShoppingCart size={70} />
                    </div>

                    <h1>
                        Your Cart is Empty
                    </h1>

                    <p>
                        Looks like you haven't added
                        anything to your cart yet.
                    </p>

                    {errorMessage && (
                        <div
                            className="cart-error-message"
                            role="alert"
                        >
                            {errorMessage}
                        </div>
                    )}

                    {statusMessage && (
                        <div
                            className="cart-status-message"
                            role="status"
                            aria-live="polite"
                        >
                            {statusMessage}
                        </div>
                    )}

                    <Link
                        to="/products"
                        className="continue-shopping-btn"
                    >
                        <ShoppingBag
                            size={20}
                            aria-hidden="true"
                        />

                        Continue Shopping
                    </Link>

                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="cart-page">

                <div className="cart-header">

                    <div>

                        <h1>
                            Shopping Cart
                        </h1>

                        <p id="cart-item-count">
                            {cart.totalItems}{" "}
                            {cart.totalItems === 1
                                ? "item"
                                : "items"}{" "}
                            in your cart
                        </p>

                    </div>

                    <button
                        className="clear-cart-btn"
                        type="button"
                        onClick={openClearCartDialog}
                        aria-label="Clear all items from your cart"
                    >
                        <Trash2
                            size={18}
                            aria-hidden="true"
                        />

                        Clear Cart
                    </button>

                </div>

                {errorMessage && (
                    <div
                        className="cart-error-message"
                        role="alert"
                        aria-live="assertive"
                    >
                        {errorMessage}
                    </div>
                )}

                {statusMessage && (
                    <div
                        className="cart-status-message"
                        role="status"
                        aria-live="polite"
                    >
                        {statusMessage}
                    </div>
                )}

                <div className="cart-layout">

                    <section
                        className="cart-items-section"
                        aria-labelledby="cart-items-heading"
                    >

                        <h2
                            id="cart-items-heading"
                            className="visually-hidden"
                        >
                            Cart items
                        </h2>

                        {cart.items.map((item) => {

                            const hasDiscount =
                                item.discountPrice &&
                                Number(item.discountPrice) <
                                Number(item.price);

                            const unitPrice =
                                hasDiscount
                                    ? Number(item.discountPrice)
                                    : Number(item.price);

                            const isUpdating =
                                updatingItem ===
                                item.cartItemId;

                            return (
                                <article
                                    className="cart-item"
                                    key={item.cartItemId}
                                    aria-label={`Cart item: ${item.productName}`}
                                >

                                    <div className="cart-item-image-container">

                                        <img
                                            src={item.imageUrl}
                                            alt=""
                                            className="cart-item-image"
                                        />

                                    </div>

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
                                                <span
                                                    className="original-price"
                                                    aria-label={`Original price ₹${Number(
                                                        item.price
                                                    ).toLocaleString("en-IN")}`}
                                                >
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

                                    <div className="quantity-section">

                                        <span
                                            className="quantity-label"
                                            id={`quantity-label-${item.cartItemId}`}
                                        >
                                            Quantity
                                        </span>

                                        <div
                                            className="quantity-control"
                                            role="group"
                                            aria-labelledby={`quantity-label-${item.cartItemId}`}
                                        >

                                            <button
                                                type="button"
                                                aria-label={`Decrease quantity of ${item.productName}`}
                                                aria-disabled={
                                                    item.quantity <= 1 ||
                                                    isUpdating
                                                }
                                                disabled={
                                                    item.quantity <= 1 ||
                                                    isUpdating
                                                }
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.cartItemId,
                                                        item.quantity,
                                                        -1
                                                    )
                                                }
                                            >
                                                <Minus
                                                    size={18}
                                                    aria-hidden="true"
                                                />
                                            </button>

                                            <span
                                                aria-live="polite"
                                                aria-atomic="true"
                                                aria-label={`Quantity ${item.quantity}`}
                                            >
                                                {item.quantity}
                                            </span>

                                            <button
                                                type="button"
                                                aria-label={`Increase quantity of ${item.productName}`}
                                                aria-disabled={isUpdating}
                                                disabled={isUpdating}
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.cartItemId,
                                                        item.quantity,
                                                        1
                                                    )
                                                }
                                            >
                                                <Plus
                                                    size={18}
                                                    aria-hidden="true"
                                                />
                                            </button>

                                        </div>

                                    </div>

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

                                    <button
                                        type="button"
                                        className="remove-item-btn"
                                        aria-label={`Remove ${item.productName} from cart`}
                                        disabled={isUpdating}
                                        onClick={() =>
                                            handleRemove(
                                                item.cartItemId,
                                                item.productName
                                            )
                                        }
                                    >
                                        <Trash2
                                            size={19}
                                            aria-hidden="true"
                                        />
                                    </button>

                                </article>
                            );
                        })}

                    </section>

                    <aside
                        className="cart-summary"
                        aria-labelledby="order-summary-heading"
                    >

                        <h2 id="order-summary-heading">
                            Order Summary
                        </h2>

                        <div className="summary-row">
                            <span>Items</span>

                            <span>
                                {cart.totalItems}
                            </span>
                        </div>

                        <div className="summary-row">
                            <span>Subtotal</span>

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

                        <div
                            className="summary-divider"
                            aria-hidden="true"
                        />

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
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </button>

                        <Link
                            to="/products"
                            className="back-shopping-link"
                        >
                            <ArrowLeft
                                size={18}
                                aria-hidden="true"
                            />

                            Continue Shopping
                        </Link>

                    </aside>

                </div>

            </main>

            <ConfirmationDialog
                isOpen={clearCartDialogOpen}
                title="Clear your cart?"
                message="Are you sure you want to remove all items from your cart? This action cannot be undone."
                confirmText="Clear Cart"
                cancelText="Cancel"
                onConfirm={handleClearCart}
                onCancel={() => setClearCartDialogOpen(false)}
                danger
            />

        </>
    );
}

export default Cart;