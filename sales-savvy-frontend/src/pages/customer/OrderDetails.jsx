import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Package,
    CreditCard,
    CheckCircle,
    Clock,
    XCircle,
    Ban
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import {
    getMyOrder,
    cancelOrder
} from "../../services/orderService";

import "../../styles/customer/OrderDetails.css";


const OrderDetails = () => {

    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancelling, setCancelling] = useState(false);


    // ============================================================
    // LOAD ORDER
    // ============================================================

    useEffect(() => {

        const fetchOrder = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getMyOrder(orderId);

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


    // ============================================================
    // CANCEL ORDER
    // ============================================================

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

            // Update the page immediately
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


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="order-details-page">

                    <div className="order-details-loading">
                        Loading order details...
                    </div>

                </div>
            </>
        );
    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error && !order) {

        return (
            <>
                <Navbar />

                <div className="order-details-page">

                    <div className="order-details-error">

                        <XCircle size={55} />

                        <h2>
                            Order Not Found
                        </h2>

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

                </div>
            </>
        );
    }


    if (!order) {
        return null;
    }


    // ============================================================
    // PAYMENT ICON
    // ============================================================

    const getPaymentIcon = () => {

        if (order.paymentStatus === "SUCCESS") {

            return (
                <CheckCircle size={22} />
            );
        }

        if (order.paymentStatus === "FAILED") {

            return (
                <XCircle size={22} />
            );
        }

        return (
            <Clock size={22} />
        );
    };


    // ============================================================
    // CAN CANCEL?
    // ============================================================

    const canCancel =
        order.status === "PLACED" &&
        order.paymentStatus === "PENDING";


    // ============================================================
    // RENDER
    // ============================================================

    return (
        <>
            <Navbar />

            <div className="order-details-page">

                <div className="order-details-container">

                    {/* BACK BUTTON */}

                    <Link
                        to="/orders"
                        className="back-orders-link"
                    >
                        <ArrowLeft size={18} />

                        Back to My Orders
                    </Link>


                    {/* HEADER */}

                    <div className="order-details-header">

                        <div>

                            <div className="order-title-row">

                                <Package size={32} />

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

                    </div>


                    {/* ERROR MESSAGE */}

                    {error && (

                        <div className="order-action-error">
                            {error}
                        </div>

                    )}


                    {/* ORDER SUMMARY */}

                    <div className="order-summary-card">

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

                                {order.paymentStatus}
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

                    </div>


                    {/* PRODUCTS */}

                    <div className="order-items-card">

                        <div className="section-title">

                            <Package size={22} />

                            <h2>
                                Items in this Order
                            </h2>

                        </div>


                        <div className="order-items-list">

                            {order.items?.map((item) => (

                                <div
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

                                </div>

                            ))}

                        </div>


                        {/* TOTAL */}

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

                    </div>


                    {/* PAYMENT INFORMATION */}

                    <div className="payment-info-card">

                        <div className="section-title">

                            <CreditCard size={22} />

                            <h2>
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

                    </div>


                    {/* CANCEL ORDER */}

                    {canCancel && (

                        <div className="cancel-order-card">

                            <div>

                                <h3>
                                    Cancel this order?
                                </h3>

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
                                disabled={cancelling}
                            >

                                <Ban size={18} />

                                {cancelling
                                    ? "Cancelling..."
                                    : "Cancel Order"}

                            </button>

                        </div>

                    )}

                </div>

            </div>
        </>
    );
};


export default OrderDetails;