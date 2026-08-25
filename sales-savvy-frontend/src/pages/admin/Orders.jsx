import { useEffect, useState } from "react";
import { Eye, Package, User } from "lucide-react";
import { Link } from "react-router-dom";

import AdminNavbar from "../../components/layout/AdminNavbar";
import { getAllOrders } from "../../services/adminService";

import "../../styles/admin/Orders.css";

function Orders() {

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

                const response = await getAllOrders();

                setOrders(response.data);

            } catch (err) {

                console.error(
                    "Failed to load admin orders:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load orders."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchOrders();

    }, []);


    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (
            <>
                <AdminNavbar />

                <div className="admin-orders-page">

                    <div className="admin-orders-loading">
                        Loading orders...
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
                <AdminNavbar />

                <div className="admin-orders-page">

                    <div className="admin-orders-error">
                        {error}
                    </div>

                </div>
            </>
        );
    }


    // ============================================================
    // ORDERS PAGE
    // ============================================================

    return (
        <>
            <AdminNavbar />

            <div className="admin-orders-page">

                <div className="admin-orders-container">

                    {/* ====================================================
                        HEADER
                    ==================================================== */}

                    <div className="admin-orders-header">

                        <div>

                            <h1>
                                Orders
                            </h1>

                            <p>
                                Manage customer orders
                            </p>

                        </div>

                        <Package size={38} />

                    </div>


                    {/* ====================================================
                        EMPTY STATE
                    ==================================================== */}

                    {orders.length === 0 ? (

                        <div className="admin-orders-empty">

                            <Package size={60} />

                            <h2>
                                No orders found
                            </h2>

                            <p>
                                Customer orders will appear here.
                            </p>

                        </div>

                    ) : (

                        /* ==================================================
                           ORDER LIST
                        ================================================== */

                        <div className="admin-orders-list">

                            {orders.map((order) => (

                                <div
                                    className="admin-order-card"
                                    key={order.orderId}
                                >

                                    {/* ==================================================
                                        ORDER HEADER
                                    ================================================== */}

                                    <div className="admin-order-header">

                                        <div>

                                            <span>
                                                Order ID
                                            </span>

                                            <strong>
                                                {order.orderId}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Order Date
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    order.createdAt
                                                )}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* ==================================================
                                        ORDER CUSTOMER
                                    ================================================== */}

                                    <div className="admin-order-customer">

                                        <div className="admin-customer-icon">

                                            <User size={18} />

                                        </div>


                                        <div className="admin-customer-info">

                                            <span>
                                                Customer
                                            </span>

                                            <strong>
                                                {order.username}
                                            </strong>

                                            <small>
                                                {order.email}
                                            </small>

                                        </div>

                                    </div>


                                    {/* ==================================================
                                        ORDER BODY
                                    ================================================== */}

                                    <div className="admin-order-body">

                                        {/* TOTAL */}

                                        <div className="admin-order-info">

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


                                        {/* PAYMENT */}

                                        <div className="admin-order-info">

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


                                        {/* ORDER STATUS */}

                                        <div className="admin-order-info">

                                            <span>
                                                Status
                                            </span>

                                            <span
                                                className={`order-status ${String(
                                                    order.status
                                                ).toLowerCase()}`}
                                            >
                                                {order.status}
                                            </span>

                                        </div>


                                        {/* VIEW DETAILS */}

                                        <Link
                                            to={`/admin/orders/${order.orderId}`}
                                            className="admin-view-order-btn"
                                        >

                                            <Eye size={18} />

                                            View Details

                                        </Link>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>
        </>
    );
}

export default Orders;