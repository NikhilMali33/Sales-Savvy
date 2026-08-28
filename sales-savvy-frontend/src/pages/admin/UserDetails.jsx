import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    User as UserIcon,
    ArrowLeft,
    ShoppingBag,
    IndianRupee,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

import AdminNavBar from "../../components/layout/AdminNavbar";
import { getUserById } from "../../services/adminService";

import "../../styles/admin/UserDetails.css";

function UserDetails() {

    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Pagination
    const ORDERS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);

    // Load user
    useEffect(() => {

        const fetchUser = async () => {

            try {

                setLoading(true);
                setError("");
                setCurrentPage(1);

                const response = await getUserById(userId);

                setUser(response.data);

            } catch (err) {

                console.error("Failed to load user:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load user details."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchUser();

    }, [userId]);

    // Loading
    if (loading) {

        return (
            <>
                <AdminNavBar />

                <main className="admin-user-details-page">

                    <div className="admin-user-details-container">

                        <div
                            className="admin-user-details-loading"
                            role="status"
                            aria-live="polite"
                        >
                            Loading user details...
                        </div>

                    </div>

                </main>
            </>
        );
    }

    // Error
    if (error || !user) {

        return (
            <>
                <AdminNavBar />

                <main className="admin-user-details-page">

                    <div className="admin-user-details-container">

                        <div
                            className="admin-user-details-error"
                            role="alert"
                        >

                            <UserIcon
                                size={42}
                                aria-hidden="true"
                            />

                            <h1>
                                Unable to load user
                            </h1>

                            <p>
                                {error || "User not found."}
                            </p>

                            <Link
                                to="/admin/users"
                                className="back-to-users"
                            >
                                <ArrowLeft
                                    size={18}
                                    aria-hidden="true"
                                />
                                Back to Users
                            </Link>

                        </div>

                    </div>

                </main>
            </>
        );
    }

    // Helpers
    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatCurrency = (amount) => {

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    const getStatusClass = (status) => {

        return String(status || "")
            .toLowerCase()
            .replace(/\s+/g, "-");
    };

    // Order pagination
    const orders = user.orders || [];

    const totalOrders = orders.length;

    const totalPages = Math.ceil(
        totalOrders / ORDERS_PER_PAGE
    );

    const startIndex =
        (currentPage - 1) * ORDERS_PER_PAGE;

    const endIndex =
        startIndex + ORDERS_PER_PAGE;

    const currentOrders =
        orders.slice(startIndex, endIndex);

    const handlePreviousPage = () => {

        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {

        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <AdminNavBar />

            <main className="admin-user-details-page">

                <div className="admin-user-details-container">

                    {/* Back */}
                    <Link
                        to="/admin/users"
                        className="back-to-users"
                    >
                        <ArrowLeft
                            size={18}
                            aria-hidden="true"
                        />
                        Back to Users
                    </Link>

                    {/* Header */}
                    <header className="admin-user-details-header">

                        <div
                            className="user-header-icon"
                            aria-hidden="true"
                        >
                            <UserIcon size={42} />
                        </div>

                        <div>

                            <h1>
                                User Details
                            </h1>

                            <p>
                                User ID:{" "}
                                <strong>{user.userid}</strong>
                            </p>

                        </div>

                    </header>

                    {/* Account Information */}
                    <section
                        className="user-details-section"
                        aria-labelledby="account-information-heading"
                    >

                        <h2 id="account-information-heading">
                            Account Information
                        </h2>

                        <div className="user-account-grid">

                            <div className="user-info-item">
                                <span>User ID</span>
                                <strong>{user.userid}</strong>
                            </div>

                            <div className="user-info-item">
                                <span>Username</span>
                                <strong>{user.username}</strong>
                            </div>

                            <div className="user-info-item">
                                <span>Email</span>
                                <strong>{user.email}</strong>
                            </div>

                            <div className="user-info-item">
                                <span>Role</span>

                                <span
                                    className={`user-role ${getStatusClass(
                                        user.role
                                    )}`}
                                >
                                    {user.role}
                                </span>
                            </div>

                            <div className="user-info-item">
                                <span>Account Created</span>
                                <strong>
                                    {formatDate(user.createdAt)}
                                </strong>
                            </div>

                            <div className="user-info-item">
                                <span>Last Updated</span>
                                <strong>
                                    {formatDate(user.updatedAt)}
                                </strong>
                            </div>

                        </div>

                    </section>

                    {/* Order Summary */}
                    <section
                        className="user-details-section"
                        aria-labelledby="order-summary-heading"
                    >

                        <h2 id="order-summary-heading">
                            Order Summary
                        </h2>

                        <div className="user-summary-grid">

                            <div className="user-summary-card">

                                <div
                                    className="summary-icon"
                                    aria-hidden="true"
                                >
                                    <ShoppingBag size={26} />
                                </div>

                                <div>

                                    <span>
                                        Total Orders
                                    </span>

                                    <strong>
                                        {user.totalOrders}
                                    </strong>

                                </div>

                            </div>

                            <div className="user-summary-card">

                                <div
                                    className="summary-icon"
                                    aria-hidden="true"
                                >
                                    <IndianRupee size={26} />
                                </div>

                                <div>

                                    <span>
                                        Total Spent
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            user.totalSpent
                                        )}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* Order History */}
                    <section
                        className="user-details-section"
                        aria-labelledby="order-history-heading"
                    >

                        <div className="section-heading-row">

                            <h2 id="order-history-heading">
                                Order History
                            </h2>

                            <span>
                                {totalOrders} order(s)
                            </span>

                        </div>

                        {totalOrders > 0 ? (

                            <>

                                {/* Order table */}
                                <div className="user-orders-table-wrapper">

                                    <table className="user-orders-table">

                                        <caption className="sr-only">
                                            Order history for {user.username}
                                        </caption>

                                        <thead>

                                            <tr>

                                                <th scope="col">
                                                    Order ID
                                                </th>

                                                <th scope="col">
                                                    Date
                                                </th>

                                                <th scope="col">
                                                    Amount
                                                </th>

                                                <th scope="col">
                                                    Payment
                                                </th>

                                                <th scope="col">
                                                    Status
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {currentOrders.map(
                                                (order) => (

                                                    <tr
                                                        key={order.orderId}
                                                    >

                                                        <td>
                                                            <strong>
                                                                {
                                                                    order.orderId
                                                                }
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            {formatDate(
                                                                order.createdAt
                                                            )}
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                {formatCurrency(
                                                                    order.totalAmount
                                                                )}
                                                            </strong>
                                                        </td>

                                                        <td>

                                                            <span
                                                                className={`order-status payment-${getStatusClass(
                                                                    order.paymentStatus
                                                                )}`}
                                                            >
                                                                {
                                                                    order.paymentStatus
                                                                }
                                                            </span>

                                                        </td>

                                                        <td>

                                                            <span
                                                                className={`order-status status-${getStatusClass(
                                                                    order.status
                                                                )}`}
                                                            >
                                                                {
                                                                    order.status
                                                                }
                                                            </span>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (

                                    <nav
                                        className="user-orders-pagination"
                                        aria-label="Order history pagination"
                                    >

                                        <button
                                            type="button"
                                            className="pagination-btn pagination-prev"
                                            onClick={handlePreviousPage}
                                            disabled={currentPage === 1}
                                            aria-label="Go to previous page"
                                        >
                                            <ChevronLeft
                                                size={17}
                                                aria-hidden="true"
                                            />
                                            Previous
                                        </button>

                                        <div
                                            className="pagination-pages"
                                            aria-label="Order history pages"
                                        >

                                            {Array.from(
                                                {
                                                    length: totalPages
                                                },
                                                (_, index) => {

                                                    const page =
                                                        index + 1;

                                                    return (

                                                        <button
                                                            type="button"
                                                            key={page}
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
                                            className="pagination-btn pagination-next"
                                            onClick={handleNextPage}
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            aria-label="Go to next page"
                                        >
                                            Next

                                            <ChevronRight
                                                size={17}
                                                aria-hidden="true"
                                            />
                                        </button>

                                    </nav>

                                )}

                            </>

                        ) : (

                            <div className="no-user-orders">
                                This user has not placed any orders.
                            </div>

                        )}

                    </section>

                </div>

            </main>
        </>
    );
}

export default UserDetails;