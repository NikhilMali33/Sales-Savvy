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
    const [currentPage, setCurrentPage] = useState(1);

    const ordersPerPage = 10;

    // Load orders
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

    // Format date
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

    // Pagination
    const totalPages = Math.ceil(
        orders.length / ordersPerPage
    );

    const startIndex =
        (currentPage - 1) * ordersPerPage;

    const currentOrders = orders.slice(
        startIndex,
        startIndex + ordersPerPage
    );

    const handlePageChange = (page) => {

        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Loading state
    if (loading) {

        return (
            <>
                <AdminNavbar />

                <main
                    className="admin-orders-page"
                    aria-labelledby="orders-loading-heading"
                >
                    <div
                        className="admin-orders-loading"
                        role="status"
                        aria-live="polite"
                    >
                        <h1 id="orders-loading-heading">
                            Loading orders
                        </h1>

                        <p>
                            Please wait while the orders are loaded.
                        </p>
                    </div>
                </main>
            </>
        );
    }

    // Error state
    if (error) {

        return (
            <>
                <AdminNavbar />

                <main
                    className="admin-orders-page"
                    aria-labelledby="orders-error-heading"
                >
                    <div
                        className="admin-orders-error"
                        role="alert"
                    >
                        <h1 id="orders-error-heading">
                            Unable to load orders
                        </h1>

                        <p>
                            {error}
                        </p>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <AdminNavbar />

            <main
                className="admin-orders-page"
                aria-labelledby="orders-page-title"
            >

                <div className="admin-orders-container">

                    {/* Header */}
                    <header className="admin-orders-header">

                        <div>
                            <h1 id="orders-page-title">
                                Orders
                            </h1>

                            <p>
                                Manage customer orders
                            </p>
                        </div>

                        <Package
                            size={38}
                            aria-hidden="true"
                            focusable="false"
                        />

                    </header>

                    {/* Empty state */}
                    {orders.length === 0 ? (

                        <section
                            className="admin-orders-empty"
                            aria-labelledby="no-orders-heading"
                        >

                            <Package
                                size={60}
                                aria-hidden="true"
                                focusable="false"
                            />

                            <h2 id="no-orders-heading">
                                No orders found
                            </h2>

                            <p>
                                Customer orders will appear here.
                            </p>

                        </section>

                    ) : (

                        <>
                            {/* Order list */}
                            <section
                                className="admin-orders-list"
                                aria-label="Customer orders"
                                aria-live="polite"
                            >

                                {currentOrders.map((order) => (

                                    <article
                                        className="admin-order-card"
                                        key={order.orderId}
                                        aria-labelledby={`order-${order.orderId}`}
                                    >

                                        {/* Order header */}
                                        <header className="admin-order-header">

                                            <div>
                                                <span>
                                                    Order ID
                                                </span>

                                                <strong
                                                    id={`order-${order.orderId}`}
                                                >
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

                                        </header>

                                        {/* Customer */}
                                        <section
                                            className="admin-order-customer"
                                            aria-label={`Customer ${order.username}`}
                                        >

                                            <div
                                                className="admin-customer-icon"
                                                aria-hidden="true"
                                            >
                                                <User
                                                    size={18}
                                                    focusable="false"
                                                />
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

                                        </section>

                                        {/* Order information */}
                                        <div className="admin-order-body">

                                            {/* Total */}
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

                                            {/* Payment */}
                                            <div className="admin-order-info">

                                                <span>
                                                    Payment
                                                </span>

                                                <span
                                                    className={`payment-status ${String(
                                                        order.paymentStatus
                                                    ).toLowerCase()}`}
                                                >
                                                    <span className="sr-only">
                                                        Payment status:
                                                    </span>

                                                    {order.paymentStatus}
                                                </span>

                                            </div>

                                            {/* Order status */}
                                            <div className="admin-order-info">

                                                <span>
                                                    Status
                                                </span>

                                                <span
                                                    className={`order-status ${String(
                                                        order.status
                                                    ).toLowerCase()}`}
                                                >
                                                    <span className="sr-only">
                                                        Order status:
                                                    </span>

                                                    {order.status}
                                                </span>

                                            </div>

                                            {/* View details */}
                                            <Link
                                                to={`/admin/orders/${order.orderId}`}
                                                className="admin-view-order-btn"
                                                aria-label={`View details for order ${order.orderId}`}
                                            >

                                                <Eye
                                                    size={18}
                                                    aria-hidden="true"
                                                    focusable="false"
                                                />

                                                <span>
                                                    View Details
                                                </span>

                                            </Link>

                                        </div>

                                    </article>

                                ))}

                            </section>

                            {/* Pagination */}
                            {totalPages > 1 && (

                                <nav
                                    className="orders-pagination"
                                    aria-label="Orders pagination"
                                >

                                    <button
                                        type="button"
                                        className="pagination-btn"
                                        onClick={() =>
                                            handlePageChange(
                                                currentPage - 1
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        aria-label="Go to previous page"
                                    >
                                        Previous
                                    </button>

                                    <div
                                        className="pagination-pages"
                                        aria-label="Page selection"
                                    >

                                        {Array.from(
                                            { length: totalPages },
                                            (_, index) => {
                                                const page = index + 1;

                                                return (
                                                    <button
                                                        key={page}
                                                        type="button"
                                                        className={`pagination-page ${
                                                            currentPage === page
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            handlePageChange(
                                                                page
                                                            )
                                                        }
                                                        aria-label={`Go to page ${page}`}
                                                        aria-current={
                                                            currentPage === page
                                                                ? "page"
                                                                : undefined
                                                        }
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            }
                                        )}

                                    </div>

                                    <button
                                        type="button"
                                        className="pagination-btn"
                                        onClick={() =>
                                            handlePageChange(
                                                currentPage + 1
                                            )
                                        }
                                        disabled={
                                            currentPage === totalPages
                                        }
                                        aria-label="Go to next page"
                                    >
                                        Next
                                    </button>

                                </nav>

                            )}

                            <p
                                className="pagination-status"
                                aria-live="polite"
                            >
                                Showing orders{" "}
                                {startIndex + 1} to{" "}
                                {Math.min(
                                    startIndex + ordersPerPage,
                                    orders.length
                                )}{" "}
                                of {orders.length}
                            </p>

                        </>

                    )}

                </div>

            </main>
        </>
    );
}

export default Orders;