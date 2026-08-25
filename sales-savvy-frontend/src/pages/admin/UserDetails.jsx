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

    // PAGINATION
    const ORDERS_PER_PAGE = 5;

    const [currentPage, setCurrentPage] = useState(1);

    // LOAD USER
    useEffect(() => {

        const fetchUser = async () => {

            try {

                setLoading(true);
                setError("");
                setCurrentPage(1);

                const response = await getUserById(userId);

                setUser(response.data);

            } catch (err) {

                console.error(
                    "Failed to load user:",
                    err
                );

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


    // LOADING
    if (loading) {

        return (
            <>
                <AdminNavBar />

                <div className="admin-user-details-page">

                    <div className="admin-user-details-container">

                        <div className="admin-user-details-loading">
                            Loading user details...
                        </div>

                    </div>

                </div>
            </>
        );
    }


    // ERROR
    if (error || !user) {

        return (
            <>
                <AdminNavBar />

                <div className="admin-user-details-page">

                    <div className="admin-user-details-container">

                        <div className="admin-user-details-error">

                            <UserIcon size={42} />

                            <h2>
                                Unable to load user
                            </h2>

                            <p>
                                {error || "User not found."}
                            </p>

                            <Link
                                to="/admin/users"
                                className="back-to-users"
                            >
                                <ArrowLeft size={18} />
                                Back to Users
                            </Link>

                        </div>

                    </div>

                </div>
            </>
        );
    }

    // HELPERS
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


    // ORDER PAGINATION
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


    // USER DETAILS PAGE
    return (
        <>
            <AdminNavBar />

            <div className="admin-user-details-page">

                <div className="admin-user-details-container">

                    {/* ====================================================
                        BACK
                    ==================================================== */}

                    <Link
                        to="/admin/users"
                        className="back-to-users"
                    >
                        <ArrowLeft size={18} />
                        Back to Users
                    </Link>


                    {/* ====================================================
                        HEADER
                    ==================================================== */}

                    <div className="admin-user-details-header">

                        <div className="user-header-icon">
                            <UserIcon size={42} />
                        </div>

                        <div>

                            <h1>
                                User Details
                            </h1>

                            <p>
                                User ID: <strong>{user.userid}</strong>
                            </p>

                        </div>

                    </div>


                    {/* ====================================================
                        ACCOUNT INFORMATION
                    ==================================================== */}

                    <section className="user-details-section">

                        <h2>
                            Account Information
                        </h2>

                        <div className="user-account-grid">

                            <div className="user-info-item">

                                <span>
                                    User ID
                                </span>

                                <strong>
                                    {user.userid}
                                </strong>

                            </div>


                            <div className="user-info-item">

                                <span>
                                    Username
                                </span>

                                <strong>
                                    {user.username}
                                </strong>

                            </div>


                            <div className="user-info-item">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {user.email}
                                </strong>

                            </div>


                            <div className="user-info-item">

                                <span>
                                    Role
                                </span>

                                <span
                                    className={`user-role ${getStatusClass(
                                        user.role
                                    )}`}
                                >
                                    {user.role}
                                </span>

                            </div>


                            <div className="user-info-item">

                                <span>
                                    Account Created
                                </span>

                                <strong>
                                    {formatDate(user.createdAt)}
                                </strong>

                            </div>


                            <div className="user-info-item">

                                <span>
                                    Last Updated
                                </span>

                                <strong>
                                    {formatDate(user.updatedAt)}
                                </strong>

                            </div>

                        </div>

                    </section>


                    {/* ====================================================
                        ORDER SUMMARY
                    ==================================================== */}

                    <section className="user-details-section">

                        <h2>
                            Order Summary
                        </h2>

                        <div className="user-summary-grid">

                            <div className="user-summary-card">

                                <div className="summary-icon">
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

                                <div className="summary-icon">
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


                    {/* ====================================================
                        ORDER HISTORY
                    ==================================================== */}

                    <section className="user-details-section">

                        <div className="section-heading-row">

                            <h2>
                                Order History
                            </h2>

                            <span>
                                {totalOrders} order(s)
                            </span>

                        </div>


                        {totalOrders > 0 ? (

                            <>

                                {/* ====================================================
                                    ORDER TABLE
                                ==================================================== */}

                                <div className="user-orders-table-wrapper">

                                    <table className="user-orders-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Order ID
                                                </th>

                                                <th>
                                                    Date
                                                </th>

                                                <th>
                                                    Amount
                                                </th>

                                                <th>
                                                    Payment
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {currentOrders.map(
                                                (order) => (

                                                    <tr
                                                        key={
                                                            order.orderId
                                                        }
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


                                {/* ====================================================
                                    PAGINATION
                                ==================================================== */}

                                {totalPages > 1 && (

                                    <div className="user-orders-pagination">

                                        <button
                                            type="button"
                                            className="pagination-btn pagination-prev"
                                            onClick={
                                                handlePreviousPage
                                            }
                                            disabled={
                                                currentPage === 1
                                            }
                                        >
                                            <ChevronLeft size={17} />
                                            Previous
                                        </button>


                                        <div className="pagination-pages">

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
                                                                currentPage ===
                                                                page
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                handlePageChange(
                                                                    page
                                                                )
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
                                            onClick={
                                                handleNextPage
                                            }
                                            disabled={
                                                currentPage ===
                                                totalPages
                                            }
                                        >
                                            Next
                                            <ChevronRight size={17} />
                                        </button>

                                    </div>

                                )}

                            </>

                        ) : (

                            <div className="no-user-orders">
                                This user has not placed any orders.
                            </div>

                        )}

                    </section>

                </div>

            </div>
        </>
    );
}

export default UserDetails;