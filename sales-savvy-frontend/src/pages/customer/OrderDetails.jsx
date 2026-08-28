import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Package,
    CreditCard,
    CheckCircle,
    Clock,
    XCircle,
    Ban,
    RefreshCw
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import {
    getMyOrder,
    cancelOrder
} from "../../services/orderService";

import {
    createPaymentOrder,
    verifyPayment
} from "../../services/paymentService";

import "../../styles/customer/OrderDetails.css";

const OrderDetails = () => {

    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [cancelling, setCancelling] = useState(false);
    const [retryingPayment, setRetryingPayment] = useState(false);

    useEffect(() => {

        const fetchOrder = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await getMyOrder(orderId);

                setOrder(response.data);

            } catch (err) {

                console.error(
                    "Failed to load order:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load order details."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchOrder();

    }, [orderId]);


    const handleRetryPayment = async () => {

        try {

            setRetryingPayment(true);
            setError("");

            const paymentResponse =
                await createPaymentOrder(orderId);

            const paymentData =
                paymentResponse.data;

            if (!window.Razorpay) {

                setError(
                    "Razorpay Checkout is not loaded. Please refresh the page."
                );

                setRetryingPayment(false);

                return;
            }

            const options = {

                key: paymentData.keyId,

                amount: paymentData.amount,

                currency: paymentData.currency,

                name: "Sales Savvy",

                description:
                    `Payment for Order ${orderId}`,

                order_id:
                    paymentData.razorpayOrderId,

                handler: async function (response) {

                    try {

                        await verifyPayment({

                            orderId: orderId,

                            razorpayOrderId:
                                response.razorpay_order_id,

                            razorpayPaymentId:
                                response.razorpay_payment_id,

                            razorpaySignature:
                                response.razorpay_signature
                        });

                        const updatedOrderResponse =
                            await getMyOrder(orderId);

                        setOrder(
                            updatedOrderResponse.data
                        );

                        window.dispatchEvent(
                            new Event("cartUpdated")
                        );

                        alert(
                            "Payment successful! Your order has been confirmed."
                        );

                    } catch (err) {

                        console.error(
                            "Payment verification failed:",
                            err
                        );

                        setError(
                            err.response?.data?.message ||
                            err.response?.data?.error ||
                            "Payment verification failed."
                        );

                    } finally {

                        setRetryingPayment(false);
                    }
                },

                modal: {

                    ondismiss: function () {

                        setRetryingPayment(false);

                        setError(
                            "Payment was cancelled. Your order is still pending."
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

            razorpay.on(
                "payment.failed",
                function (response) {

                    console.error(
                        "Razorpay payment failed:",
                        response
                    );

                    setRetryingPayment(false);

                    setError(
                        response.error?.description ||
                        "Payment failed. You can try again."
                    );
                }
            );

            razorpay.open();

        } catch (err) {

            console.error(
                "Retry payment failed:",
                err
            );

            setRetryingPayment(false);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to start payment. Please try again."
            );
        }
    };


    const handleCancelOrder = async () => {

        const confirmed = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setCancelling(true);
            setError("");

            await cancelOrder(orderId);

            setOrder((previousOrder) => ({
                ...previousOrder,
                status: "CANCELLED"
            }));

        } catch (err) {

            console.error(
                "Failed to cancel order:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to cancel the order."
            );

        } finally {

            setCancelling(false);
        }
    };


    if (loading) {

        return (
            <>
                <Navbar />

                <main
                    className="order-details-page"
                    aria-busy="true"
                >
                    <div
                        className="order-details-loading"
                        role="status"
                        aria-live="polite"
                    >
                        Loading order details...
                    </div>
                </main>
            </>
        );
    }


    if (error && !order) {

        return (
            <>
                <Navbar />

                <main className="order-details-page">

                    <div
                        className="order-details-error"
                        role="alert"
                    >

                        <XCircle
                            size={55}
                            aria-hidden="true"
                        />

                        <h1>
                            Order Not Found
                        </h1>

                        <p>
                            {error}
                        </p>

                        <Link
                            to="/orders"
                            className="back-orders-btn"
                        >
                            Back to Orders
                        </Link>

                    </div>

                </main>
            </>
        );
    }


    if (!order) {
        return null;
    }


    const getPaymentIcon = () => {

        if (order.paymentStatus === "SUCCESS") {

            return (
                <CheckCircle
                    size={22}
                    aria-hidden="true"
                />
            );
        }

        if (order.paymentStatus === "FAILED") {

            return (
                <XCircle
                    size={22}
                    aria-hidden="true"
                />
            );
        }

        return (
            <Clock
                size={22}
                aria-hidden="true"
            />
        );
    };


    const canCancel =
        order.status === "PLACED" &&
        order.paymentStatus !== "SUCCESS";


    const canRetryPayment =
        order.status === "PLACED" &&
        order.paymentStatus !== "SUCCESS";


    return (
        <>
            <Navbar />

            <main className="order-details-page">

                <div className="order-details-container">

                    <Link
                        to="/orders"
                        className="back-orders-link"
                    >
                        <ArrowLeft
                            size={18}
                            aria-hidden="true"
                        />

                        <span>
                            Back to My Orders
                        </span>
                    </Link>


                    <header className="order-details-header">

                        <div>

                            <div className="order-title-row">

                                <Package
                                    size={32}
                                    aria-hidden="true"
                                />

                                <h1>
                                    Order Details
                                </h1>

                            </div>

                            <p>
                                Order ID:{" "}
                                <strong>
                                    {order.orderId}
                                </strong>
                            </p>

                        </div>

                    </header>


                    {error && (

                        <div
                            className="order-action-error"
                            role="alert"
                            aria-live="assertive"
                        >
                            {error}
                        </div>

                    )}


                    <section
                        className="order-summary-card"
                        aria-labelledby="order-summary-heading"
                    >

                        <h2
                            id="order-summary-heading"
                            className="visually-hidden"
                        >
                            Order Summary
                        </h2>

                        <div className="summary-item">

                            <span>
                                Order Date
                            </span>

                            <strong>
                                {order.createdAt
                                    ? new Date(
                                        order.createdAt
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        }
                                    )
                                    : "N/A"}
                            </strong>

                        </div>


                        <div className="summary-item">

                            <span>
                                Order Status
                            </span>

                            <strong
                                className={`detail-order-status ${String(
                                    order.status
                                ).toLowerCase()}`}
                            >
                                {order.status}
                            </strong>

                        </div>


                        <div className="summary-item">

                            <span>
                                Payment Status
                            </span>

                            <strong
                                className={`detail-payment-status ${String(
                                    order.paymentStatus
                                ).toLowerCase()}`}
                            >
                                {getPaymentIcon()}

                                <span>
                                    {order.paymentStatus}
                                </span>
                            </strong>

                        </div>


                        <div className="summary-item">

                            <span>
                                Total Amount
                            </span>

                            <strong className="detail-total">
                                ₹{Number(
                                    order.totalAmount
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                        </div>

                    </section>


                    <section
                        className="order-items-card"
                        aria-labelledby="order-items-heading"
                    >

                        <div className="section-title">

                            <Package
                                size={22}
                                aria-hidden="true"
                            />

                            <h2 id="order-items-heading">
                                Items in this Order
                            </h2>

                        </div>


                        <div className="order-items-list">

                            {order.items?.map((item) => (

                                <article
                                    className="order-item"
                                    key={item.id}
                                >

                                    <div className="item-info">

                                        <h3>
                                            {item.productName}
                                        </h3>

                                        <p>
                                            Product ID:{" "}
                                            {item.productId}
                                        </p>

                                    </div>


                                    <div className="item-quantity">

                                        <span>
                                            Quantity
                                        </span>

                                        <strong>
                                            {item.quantity}
                                        </strong>

                                    </div>


                                    <div className="item-price">

                                        <span>
                                            Price / Unit
                                        </span>

                                        <strong>
                                            ₹{Number(
                                                item.pricePerUnit
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </div>


                                    <div className="item-total">

                                        <span>
                                            Total
                                        </span>

                                        <strong>
                                            ₹{Number(
                                                item.totalPrice
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </div>

                                </article>

                            ))}

                        </div>


                        <div className="order-grand-total">

                            <span>
                                Order Total
                            </span>

                            <strong>
                                ₹{Number(
                                    order.totalAmount
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                        </div>

                    </section>


                    <section
                        className="payment-info-card"
                        aria-labelledby="payment-information-heading"
                    >

                        <div className="section-title">

                            <CreditCard
                                size={22}
                                aria-hidden="true"
                            />

                            <h2 id="payment-information-heading">
                                Payment Information
                            </h2>

                        </div>

                        <div className="payment-info-content">

                            <p>
                                Payment Status
                            </p>

                            <strong
                                className={`detail-payment-status ${String(
                                    order.paymentStatus
                                ).toLowerCase()}`}
                            >
                                {order.paymentStatus}
                            </strong>

                        </div>

                    </section>


                    {canRetryPayment && (

                        <section
                            className="retry-payment-card"
                            aria-labelledby="retry-payment-heading"
                        >

                            <div>

                                <h2 id="retry-payment-heading">
                                    Payment is pending
                                </h2>

                                <p>
                                    Your order has been created,
                                    but payment has not been completed.
                                    You can retry the payment.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="retry-payment-btn"
                                onClick={handleRetryPayment}
                                disabled={retryingPayment}
                                aria-busy={retryingPayment}
                            >

                                <RefreshCw
                                    size={18}
                                    aria-hidden="true"
                                    className={
                                        retryingPayment
                                            ? "retry-spinner"
                                            : ""
                                    }
                                />

                                <span>
                                    {retryingPayment
                                        ? "Opening Payment..."
                                        : "Retry Payment"}
                                </span>

                            </button>

                        </section>

                    )}


                    {canCancel && (

                        <section
                            className="cancel-order-card"
                            aria-labelledby="cancel-order-heading"
                        >

                            <div>

                                <h2 id="cancel-order-heading">
                                    Cancel this order?
                                </h2>

                                <p>
                                    You can cancel this order
                                    because it has not been
                                    processed yet.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="cancel-order-btn"
                                onClick={handleCancelOrder}
                                disabled={
                                    cancelling ||
                                    retryingPayment
                                }
                                aria-busy={cancelling}
                            >

                                <Ban
                                    size={18}
                                    aria-hidden="true"
                                />

                                <span>
                                    {cancelling
                                        ? "Cancelling..."
                                        : "Cancel Order"}
                                </span>

                            </button>

                        </section>

                    )}

                </div>

            </main>
        </>
    );
};

export default OrderDetails;