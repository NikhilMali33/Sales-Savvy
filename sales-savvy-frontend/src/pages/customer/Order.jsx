import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Eye, ShoppingBag } from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import { getMyOrders } from "../../services/orderService";

import "../../styles/customer/Orders.css";

const Orders = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ============================================================
    // LOAD ORDERS
    // ============================================================

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getMyOrders();

                setOrders(response.data);

            } catch (err) {

                console.error(
                    "Failed to load orders:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load your orders."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchOrders();

    }, []);


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="orders-page">

                    <div className="orders-loading">
                        Loading your orders...
                    </div>

                </div>
            </>
        );
    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error) {

        return (
            <>
                <Navbar />

                <div className="orders-page">

                    <div className="orders-error">
                        {error}
                    </div>

                </div>
            </>
        );
    }


    // ============================================================
    // EMPTY ORDERS
    // ============================================================

    if (orders.length === 0) {

        return (
            <>
                <Navbar />

                <div className="orders-page">

                    <div className="empty-orders">

                        <ShoppingBag
                            size={70}
                            strokeWidth={1.5}
                        />

                        <h2>
                            No orders yet
                        </h2>

                        <p>
                            Your completed orders will
                            appear here.
                        </p>

                        <Link
                            to="/products"
                            className="continue-shopping-btn"
                        >
                            Start Shopping
                        </Link>

                    </div>

                </div>
            </>
        );
    }


    // ============================================================
    // ORDERS LIST
    // ============================================================

    return (
        <>
            <Navbar />

            <div className="orders-page">

                <div className="orders-container">

                    <div className="orders-header">

                        <div>

                            <h1>
                                My Orders
                            </h1>

                            <p>
                                View and manage your orders
                            </p>

                        </div>

                        <Package size={38} />

                    </div>


                    <div className="orders-list">

                        {orders.map((order) => (

                            <div
                                className="order-card"
                                key={order.orderId}
                            >

                                {/* ORDER HEADER */}

                                <div className="order-card-header">

                                    <div>

                                        <span className="order-label">
                                            Order ID
                                        </span>

                                        <strong>
                                            {order.orderId}
                                        </strong>

                                    </div>


                                    <div>

                                        <span className="order-label">
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

                                </div>


                                {/* ORDER DETAILS */}

                                <div className="order-card-body">

                                    <div className="order-info">

                                        <span>
                                            Total Amount
                                        </span>

                                        <strong>
                                            ₹{Number(
                                                order.totalAmount
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </div>


                                    <div className="order-info">

                                        <span>
                                            Payment
                                        </span>

                                        <span
                                            className={`payment-status ${String(
                                                order.paymentStatus
                                            ).toLowerCase()}`}
                                        >
                                            {order.paymentStatus}
                                        </span>

                                    </div>


                                    <div className="order-info">

                                        <span>
                                            Order Status
                                        </span>

                                        <span
                                            className={`order-status ${String(
                                                order.status
                                            ).toLowerCase()}`}
                                        >
                                            {order.status}
                                        </span>

                                    </div>


                                    <Link
                                        to={`/orders/${order.orderId}`}
                                        className="view-order-btn"
                                    >

                                        <Eye size={18} />

                                        View Details

                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>
        </>
    );
};

export default Orders;