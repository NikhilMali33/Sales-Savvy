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


    // LOAD ORDER
    useEffect(() => {

        const fetchOrder = async () => {

            try {

                setLoading(true);
                setError("");

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


    // GET ALLOWED STATUS OPTIONS
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


    // UPDATE ORDER STATUS
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

            const response =
                await updateOrderStatus(
                    order.orderId,
                    newStatus
                );

            setOrder(response.data);

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


    // LOADING
    if (loading) {

        return (
            <>
                <AdminNavbar />

                <div className="admin-order-details-page">

                    <div className="admin-order-details-loading">

                        Loading order details...

                    </div>

                </div>
            </>
        );
    }


    // ERROR / ORDER NOT FOUND
    if (error && !order) {

        return (
            <>
                <AdminNavbar />

                <div className="admin-order-details-page">

                    <div className="admin-order-details-error">

                        <h2>
                            Unable to load order
                        </h2>

                        <p>
                            {error}
                        </p>

                        <Link
                            to="/admin/orders"
                            className="back-orders-btn"
                        >

                            <ArrowLeft size={18} />

                            Back to Orders

                        </Link>

                    </div>

                </div>
            </>
        );
    }


    if (!order) {

        return (
            <>
                <AdminNavbar />

                <div className="admin-order-details-page">

                    <div className="admin-order-details-error">

                        <h2>
                            Order not found
                        </h2>

                        <Link
                            to="/admin/orders"
                            className="back-orders-btn"
                        >

                            <ArrowLeft size={18} />

                            Back to Orders

                        </Link>

                    </div>

                </div>
            </>
        );
    }


    // STATUS OPTIONS

    const allowedStatuses = getAllowedStatuses(order.status);

    // ORDER DETAILS

    return (
        <>
            <AdminNavbar />

            <div className="admin-order-details-page">

                <div className="admin-order-details-container">


                    {/* ==================================================
                        BACK BUTTON
                    ================================================== */}

                    <Link
                        to="/admin/orders"
                        className="back-orders-link"
                    >

                        <ArrowLeft size={18} />

                        Back to Orders

                    </Link>


                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <div className="admin-order-details-header">

                        <div>

                            <div className="admin-order-title-row">

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


                        {/* ==================================================
                            STATUS CONTROL
                        ================================================== */}

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


                            {updatingStatus && (

                                <small>
                                    Updating...
                                </small>

                            )}

                        </div>

                    </div>


                    
                    //UPDATE ERROR
                    {error && (

                        <div className="admin-order-error">

                            {error}

                        </div>

                    )}


                    {/* ==================================================
                        ORDER SUMMARY
                    ================================================== */}

                    <div className="admin-order-summary">


                        {/* ORDER DATE */}

                        <div className="admin-summary-card">

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


                        {/* PAYMENT STATUS */}

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


                        {/* ORDER STATUS */}

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


                        {/* TOTAL */}

                        <div className="admin-summary-card">

                            <span>
                                Total Amount
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


                    {/* ==================================================
                        ORDER ITEMS
                    ================================================== */}

                    <div className="admin-order-section">

                        <div className="admin-section-header">

                            <h2>
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

                                        <div
                                            className="admin-order-item"
                                            key={item.id}
                                        >


                                            {/* PRODUCT */}

                                            <div className="admin-item-info">

                                                <strong>
                                                    {item.productName}
                                                </strong>

                                                <span>
                                                    Product ID:{" "}
                                                    {item.productId}
                                                </span>

                                            </div>


                                            {/* QUANTITY */}

                                            <div className="admin-item-detail">

                                                <span>
                                                    Quantity
                                                </span>

                                                <strong>
                                                    {item.quantity}
                                                </strong>

                                            </div>


                                            {/* PRICE */}

                                            <div className="admin-item-detail">

                                                <span>
                                                    Price
                                                </span>

                                                <strong>

                                                    ₹
                                                    {Number(
                                                        item.pricePerUnit
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}

                                                </strong>

                                            </div>


                                            {/* TOTAL */}

                                            <div className="admin-item-detail">

                                                <span>
                                                    Total
                                                </span>

                                                <strong>

                                                    ₹
                                                    {Number(
                                                        item.totalPrice
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}

                                                </strong>

                                            </div>

                                        </div>

                                    )
                                )

                            ) : (

                                <div className="admin-order-items-empty">

                                    No items found for this order.

                                </div>

                            )}

                        </div>

                    </div>


                    {/* ==================================================
                        PAYMENT INFORMATION
                    ================================================== */}

                    <div className="admin-order-section">

                        <div className="admin-section-header">

                            <h2>
                                Payment Information
                            </h2>

                        </div>


                        <div className="admin-payment-info">

                            <div>

                                <span>
                                    Payment Status
                                </span>

                                <strong>
                                    {order.paymentStatus}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        ORDER TOTAL
                    ================================================== */}

                    <div className="admin-order-total">

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

            </div>
        </>
    );
};


export default OrderDetails;