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


    if (loading) {

        return (
            <>
                <Navbar />

                <main className="orders-page">
                    <div
                        className="orders-loading"
                        role="status"
                        aria-live="polite"
                    >
                        Loading your orders...
                    </div>
                </main>
            </>
        );
    }


    if (error) {

        return (
            <>
                <Navbar />

                <main className="orders-page">
                    <div
                        className="orders-error"
                        role="alert"
                        aria-live="assertive"
                    >
                        {error}
                    </div>
                </main>
            </>
        );
    }


    if (orders.length === 0) {

        return (
            <>
                <Navbar />

                <main className="orders-page">

                    <section
                        className="empty-orders"
                        aria-labelledby="empty-orders-heading"
                    >

                        <ShoppingBag
                            size={70}
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />

                        <h1 id="empty-orders-heading">
                            No orders yet
                        </h1>

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

                    </section>

                </main>
            </>
        );
    }


    return (
        <>
            <Navbar />

            <main className="orders-page">

                <div className="orders-container">

                    <header className="orders-header">

                        <div>
                            <h1>
                                My Orders
                            </h1>

                            <p>
                                View and manage your orders
                            </p>
                        </div>

                        <Package
                            size={38}
                            aria-hidden="true"
                        />

                    </header>


                    <section
                        className="orders-list"
                        aria-label="Your orders"
                    >

                        {orders.map((order) => (

                            <article
                                className="order-card"
                                key={order.orderId}
                            >

                                <header className="order-card-header">

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

                                </header>


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
                                        aria-label={`View details for order ${order.orderId}`}
                                    >

                                        <Eye
                                            size={18}
                                            aria-hidden="true"
                                        />

                                        <span>
                                            View Details
                                        </span>

                                    </Link>

                                </div>

                            </article>

                        ))}

                    </section>

                </div>

            </main>
        </>
    );
};

export default Orders;