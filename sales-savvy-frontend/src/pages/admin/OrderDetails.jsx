import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

import AdminNavbar from "../../components/layout/AdminNavbar";

import {
    getOrderById,
    updateOrderStatus
} from "../../services/adminService";

import "../../styles/admin/OrderDetails.css";

const OrderDetails = () => {

    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    // Load order details
    useEffect(() => {

        const fetchOrder = async () => {

            try {

                setLoading(true);
                setError("");
                setStatusMessage("");

                const response =
                    await getOrderById(orderId);

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

        if (orderId) {
            fetchOrder();
        }

    }, [orderId]);

    // Get allowed status options
    const getAllowedStatuses = (currentStatus) => {

        switch (currentStatus) {

            case "PLACED":
                return [
                    "PLACED",
                    "CONFIRMED",
                    "CANCELLED"
                ];

            case "CONFIRMED":
                return [
                    "CONFIRMED",
                    "PROCESSING",
                    "CANCELLED"
                ];

            case "PROCESSING":
                return [
                    "PROCESSING",
                    "SHIPPED"
                ];

            case "SHIPPED":
                return [
                    "SHIPPED",
                    "DELIVERED"
                ];

            case "DELIVERED":
                return [
                    "DELIVERED"
                ];

            case "CANCELLED":
                return [
                    "CANCELLED"
                ];

            default:
                return [
                    currentStatus
                ];
        }
    };

    // Update order status
    const handleStatusChange = async (event) => {

        const newStatus =
            event.target.value;

        if (
            !newStatus ||
            !order ||
            newStatus === order.status
        ) {
            return;
        }

        try {

            setUpdatingStatus(true);
            setError("");
            setStatusMessage("");

            const response =
                await updateOrderStatus(
                    order.orderId,
                    newStatus
                );

            setOrder(response.data);

            setStatusMessage(
                `Order status updated to ${newStatus}.`
            );

        } catch (err) {

            console.error(
                "Failed to update order status:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to update order status."
            );

        } finally {

            setUpdatingStatus(false);
        }
    };

    // Loading state
    if (loading) {

        return (
            <>
                <AdminNavbar />

                <main
                    className="admin-order-details-page"
                    aria-labelledby="order-loading-title"
                >
                    <div
                        className="admin-order-details-loading"
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        <Package
                            size={42}
                            aria-hidden="true"
                        />

                        <h1 id="order-loading-title">
                            Loading order details
                        </h1>

                        <p>
                            Please wait while the order information is loaded.
                        </p>
                    </div>
                </main>
            </>
        );
    }

    // Error state
    if (error && !order) {

        return (
            <>
                <AdminNavbar />

                <main
                    className="admin-order-details-page"
                    aria-labelledby="order-error-title"
                >
                    <div
                        className="admin-order-details-error"
                        role="alert"
                        aria-live="assertive"
                        aria-atomic="true"
                    >
                        <h1 id="order-error-title">
                            Unable to load order
                        </h1>

                        <p>
                            {error}
                        </p>

                        <Link
                            to="/admin/orders"
                            className="back-orders-btn"
                        >
                            <ArrowLeft
                                size={18}
                                aria-hidden="true"
                            />

                            Back to Orders
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    if (!order) {

        return (
            <>
                <AdminNavbar />

                <main
                    className="admin-order-details-page"
                    aria-labelledby="order-not-found-title"
                >
                    <div className="admin-order-details-error">

                        <h1 id="order-not-found-title">
                            Order not found
                        </h1>

                        <p>
                            The requested order could not be found.
                        </p>

                        <Link
                            to="/admin/orders"
                            className="back-orders-btn"
                        >
                            <ArrowLeft
                                size={18}
                                aria-hidden="true"
                            />

                            Back to Orders
                        </Link>

                    </div>
                </main>
            </>
        );
    }

    const allowedStatuses =
        getAllowedStatuses(order.status);

    return (
        <>
            <AdminNavbar />

            <main
                className="admin-order-details-page"
                aria-labelledby="order-details-title"
            >

                <div className="admin-order-details-container">

                    {/* Back navigation */}

                    <Link
                        to="/admin/orders"
                        className="back-orders-link"
                    >
                        <ArrowLeft
                            size={18}
                            aria-hidden="true"
                        />

                        Back to Orders
                    </Link>

                    {/* Order header */}

                    <section
                        className="admin-order-details-header"
                        aria-labelledby="order-details-title"
                    >

                        <div>

                            <div className="admin-order-title-row">

                                <Package
                                    size={32}
                                    aria-hidden="true"
                                />

                                <h1 id="order-details-title">
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

                        {/* Status control */}

                        <div className="admin-status-control">

                            <label htmlFor="order-status">
                                Order Status
                            </label>

                            <select
                                id="order-status"
                                value={order.status}
                                onChange={handleStatusChange}
                                disabled={
                                    updatingStatus ||
                                    order.status === "DELIVERED" ||
                                    order.status === "CANCELLED"
                                }
                                aria-describedby="order-status-help"
                            >

                                {allowedStatuses.map(
                                    (status) => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </option>
                                    )
                                )}

                            </select>

                            <small id="order-status-help">
                                {order.status === "DELIVERED" ||
                                order.status === "CANCELLED"
                                    ? "This order status cannot be changed."
                                    : "Select a new status to update the order."
                                }
                            </small>

                            {updatingStatus && (
                                <span
                                    className="status-update-message"
                                    role="status"
                                    aria-live="polite"
                                    aria-atomic="true"
                                >
                                    Updating order status...
                                </span>
                            )}

                        </div>

                    </section>

                    {/* Accessible status and error messages */}

                    {statusMessage && (
                        <div
                            className="admin-order-success"
                            role="status"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {statusMessage}
                        </div>
                    )}

                    {error && (
                        <div
                            className="admin-order-error"
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                        >
                            {error}
                        </div>
                    )}

                    {/* Order summary */}

                    <section
                        className="admin-order-summary"
                        aria-label="Order summary"
                    >

                        <div className="admin-summary-card">
                            <span>Order Date</span>

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
                                    : "N/A"
                                }
                            </strong>
                        </div>

                        <div className="admin-summary-card">

                            <span>
                                Payment Status
                            </span>

                            <strong
                                className={`payment-status ${String(
                                    order.paymentStatus
                                ).toLowerCase()}`}
                            >
                                {order.paymentStatus}
                            </strong>

                        </div>

                        <div className="admin-summary-card">

                            <span>
                                Order Status
                            </span>

                            <strong
                                className={`order-status ${String(
                                    order.status
                                ).toLowerCase()}`}
                            >
                                {order.status}
                            </strong>

                        </div>

                        <div className="admin-summary-card">

                            <span>
                                Total Amount
                            </span>

                            <strong
                                aria-label={`Total amount ₹${Number(
                                    order.totalAmount
                                ).toLocaleString("en-IN")}`}
                            >
                                ₹
                                {Number(
                                    order.totalAmount
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                        </div>

                    </section>

                    {/* Order items */}

                    <section
                        className="admin-order-section"
                        aria-labelledby="order-items-title"
                    >

                        <div className="admin-section-header">

                            <h2 id="order-items-title">
                                Order Items
                            </h2>

                            <span>
                                {order.orderItems?.length || 0} item(s)
                            </span>

                        </div>

                        <div className="admin-order-items">

                            {order.orderItems?.length > 0 ? (

                                order.orderItems.map(
                                    (item) => (

                                        <article
                                            className="admin-order-item"
                                            key={item.id}
                                        >

                                            {/* Product */}

                                            <div className="admin-item-info">

                                                <strong>
                                                    {item.productName}
                                                </strong>

                                                <span>
                                                    Product ID:{" "}
                                                    {item.productId}
                                                </span>

                                            </div>

                                            {/* Quantity */}

                                            <div className="admin-item-detail">

                                                <span>
                                                    Quantity
                                                </span>

                                                <strong>
                                                    {item.quantity}
                                                </strong>

                                            </div>

                                            {/* Price */}

                                            <div className="admin-item-detail">

                                                <span>
                                                    Price
                                                </span>

                                                <strong
                                                    aria-label={`Price ₹${Number(
                                                        item.pricePerUnit
                                                    ).toLocaleString("en-IN")}`}
                                                >
                                                    ₹
                                                    {Number(
                                                        item.pricePerUnit
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>

                                            {/* Total */}

                                            <div className="admin-item-detail">

                                                <span>
                                                    Total
                                                </span>

                                                <strong
                                                    aria-label={`Item total ₹${Number(
                                                        item.totalPrice
                                                    ).toLocaleString("en-IN")}`}
                                                >
                                                    ₹
                                                    {Number(
                                                        item.totalPrice
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>

                                        </article>

                                    )
                                )

                            ) : (

                                <p className="admin-order-items-empty">
                                    No items found for this order.
                                </p>

                            )}

                        </div>

                    </section>

                    {/* Payment information */}

                    <section
                        className="admin-order-section"
                        aria-labelledby="payment-information-title"
                    >

                        <div className="admin-section-header">

                            <h2 id="payment-information-title">
                                Payment Information
                            </h2>

                        </div>

                        <div className="admin-payment-info">

                            <div>

                                <span>
                                    Payment Status
                                </span>

                                <strong
                                    className={`payment-status ${String(
                                        order.paymentStatus
                                    ).toLowerCase()}`}
                                >
                                    {order.paymentStatus}
                                </strong>

                            </div>

                        </div>

                    </section>

                    {/* Order total */}

                    <div
                        className="admin-order-total"
                        aria-label={`Order total ₹${Number(
                            order.totalAmount
                        ).toLocaleString("en-IN")}`}
                    >

                        <span>
                            Order Total
                        </span>

                        <strong>
                            ₹
                            {Number(
                                order.totalAmount
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>

                </div>

            </main>
        </>
    );
};

export default OrderDetails;