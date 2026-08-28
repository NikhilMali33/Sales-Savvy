import { useEffect, useState } from "react";
import {
    Users,
    ShoppingCart,
    Package,
    IndianRupee,
    AlertTriangle
} from "lucide-react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

import AdminNavBar from "../../components/layout/AdminNavbar";
import { getDashboardData } from "../../services/adminService";

import "../../styles/admin/Dashboard.css";

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getDashboardData();

                setDashboard(response.data);
            } catch (err) {
                console.error("Failed to load dashboard:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatAmount = (amount) => {
        return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
    };

    const formatChartDate = (date) => {
        if (!date) return "";

        return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short"
        });
    };

    if (loading) {
        return (
            <>
                <AdminNavBar />

                <main className="admin-dashboard-page">
                    <div className="admin-dashboard-container">
                        <div
                            className="admin-dashboard-loading"
                            role="status"
                            aria-live="polite"
                        >
                            Loading dashboard...
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <AdminNavBar />

                <main className="admin-dashboard-page">
                    <div className="admin-dashboard-container">
                        <div
                            className="admin-dashboard-error"
                            role="alert"
                        >
                            {error}
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (!dashboard) {
        return null;
    }

    return (
        <>
            <AdminNavBar />

            <main className="admin-dashboard-page">
                <div className="admin-dashboard-container">

                    {/* Header */}
                    <header className="admin-dashboard-header">
                        <h1>Dashboard</h1>

                        <p>
                            Overview of your SalesSavvy store
                        </p>
                    </header>

                    {/* Statistics */}
                    <section
                        className="dashboard-stats-grid"
                        aria-labelledby="dashboard-stats-heading"
                    >
                        <h2
                            id="dashboard-stats-heading"
                            className="sr-only"
                        >
                            Store statistics
                        </h2>

                        <article className="dashboard-stat-card">
                            <div
                                className="dashboard-stat-icon"
                                aria-hidden="true"
                            >
                                <Users size={24} />
                            </div>

                            <div>
                                <span>Total Users</span>

                                <strong>
                                    {dashboard.totalUsers}
                                </strong>
                            </div>
                        </article>

                        <article className="dashboard-stat-card">
                            <div
                                className="dashboard-stat-icon"
                                aria-hidden="true"
                            >
                                <ShoppingCart size={24} />
                            </div>

                            <div>
                                <span>Total Orders</span>

                                <strong>
                                    {dashboard.totalOrders}
                                </strong>
                            </div>
                        </article>

                        <article className="dashboard-stat-card">
                            <div
                                className="dashboard-stat-icon"
                                aria-hidden="true"
                            >
                                <IndianRupee size={24} />
                            </div>

                            <div>
                                <span>Total Revenue</span>

                                <strong>
                                    {formatAmount(
                                        dashboard.totalRevenue
                                    )}
                                </strong>
                            </div>
                        </article>

                        <article className="dashboard-stat-card">
                            <div
                                className="dashboard-stat-icon"
                                aria-hidden="true"
                            >
                                <Package size={24} />
                            </div>

                            <div>
                                <span>Total Products</span>

                                <strong>
                                    {dashboard.totalProducts}
                                </strong>
                            </div>
                        </article>
                    </section>

                    {/* Order Overview */}
                    <section
                        className="dashboard-section"
                        aria-labelledby="order-overview-heading"
                    >
                        <div className="dashboard-section-header">
                            <div>
                                <h2 id="order-overview-heading">
                                    Order Overview
                                </h2>

                                <p>
                                    Current order status breakdown
                                </p>
                            </div>
                        </div>

                        <div className="order-status-grid">
                            <article className="order-status-card">
                                <span>Placed</span>

                                <strong>
                                    {dashboard.placedOrders}
                                </strong>
                            </article>

                            <article className="order-status-card">
                                <span>Confirmed</span>

                                <strong>
                                    {dashboard.confirmedOrders}
                                </strong>
                            </article>

                            <article className="order-status-card">
                                <span>Shipped</span>

                                <strong>
                                    {dashboard.shippedOrders}
                                </strong>
                            </article>

                            <article className="order-status-card">
                                <span>Delivered</span>

                                <strong>
                                    {dashboard.deliveredOrders}
                                </strong>
                            </article>

                            <article className="order-status-card">
                                <span>Cancelled</span>

                                <strong>
                                    {dashboard.cancelledOrders}
                                </strong>
                            </article>
                        </div>
                    </section>

                    {/* Sales Overview */}
                    <section
                        className="dashboard-section dashboard-sales-section"
                        aria-labelledby="sales-overview-heading"
                    >
                        <div className="dashboard-section-header">
                            <div>
                                <h2 id="sales-overview-heading">
                                    Sales Overview
                                </h2>

                                <p>
                                    Revenue generated over the last 7 days
                                </p>
                            </div>
                        </div>

                        <div className="sales-chart-wrapper">
                            {dashboard.salesData?.length > 0 ? (
                                <>
                                    <div
                                        className="sales-chart"
                                        role="img"
                                        aria-label="Line chart showing revenue generated over the last 7 days"
                                    >
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <LineChart
                                                data={dashboard.salesData}
                                                margin={{
                                                    top: 10,
                                                    right: 20,
                                                    left: 10,
                                                    bottom: 10
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                />

                                                <XAxis
                                                    dataKey="date"
                                                    tickFormatter={
                                                        formatChartDate
                                                    }
                                                    tick={{
                                                        fontSize: 12
                                                    }}
                                                />

                                                <YAxis
                                                    tick={{
                                                        fontSize: 12
                                                    }}
                                                    tickFormatter={(value) =>
                                                        `₹${Number(
                                                            value
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}`
                                                    }
                                                />

                                                <Tooltip
                                                    formatter={(value) => [
                                                        formatAmount(value),
                                                        "Revenue"
                                                    ]}
                                                    labelFormatter={(label) =>
                                                        formatChartDate(label)
                                                    }
                                                />

                                                <Line
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    stroke="#2563eb"
                                                    strokeWidth={3}
                                                    dot={{
                                                        r: 4
                                                    }}
                                                    activeDot={{
                                                        r: 6
                                                    }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <table className="dashboard-chart-data">
                                        <caption>
                                            Revenue for the last 7 days
                                        </caption>

                                        <thead>
                                            <tr>
                                                <th scope="col">Date</th>
                                                <th scope="col">Revenue</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {dashboard.salesData.map(
                                                (sale) => (
                                                    <tr key={sale.date}>
                                                        <td>
                                                            {formatChartDate(
                                                                sale.date
                                                            )}
                                                        </td>

                                                        <td>
                                                            {formatAmount(
                                                                sale.revenue
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <div
                                    className="dashboard-empty"
                                    role="status"
                                >
                                    No sales data available.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Recent Orders and Users */}
                    <div className="dashboard-content-grid">

                        <section
                            className="dashboard-section dashboard-recent-orders"
                            aria-labelledby="recent-orders-heading"
                        >
                            <div className="dashboard-section-header">
                                <div>
                                    <h2 id="recent-orders-heading">
                                        Recent Orders
                                    </h2>

                                    <p>
                                        Latest customer orders
                                    </p>
                                </div>

                                <a
                                    href="/admin/orders"
                                    className="dashboard-view-all"
                                >
                                    View All
                                </a>
                            </div>

                            <div className="dashboard-table-wrapper">
                                <table className="dashboard-table">
                                    <caption className="sr-only">
                                        Recent customer orders
                                    </caption>

                                    <thead>
                                        <tr>
                                            <th scope="col">Order</th>
                                            <th scope="col">Customer</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {dashboard.recentOrders?.length > 0 ? (
                                            dashboard.recentOrders.map(
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

                                                            <small>
                                                                {formatDate(
                                                                    order.createdAt
                                                                )}
                                                            </small>
                                                        </td>

                                                        <td>
                                                            {
                                                                order.username
                                                            }
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                {formatAmount(
                                                                    order.totalAmount
                                                                )}
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`dashboard-badge status-${String(
                                                                    order.status
                                                                ).toLowerCase()}`}
                                                            >
                                                                {
                                                                    order.status
                                                                }
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="dashboard-empty"
                                                >
                                                    No recent orders found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section
                            className="dashboard-section dashboard-recent-users"
                            aria-labelledby="recent-users-heading"
                        >
                            <div className="dashboard-section-header">
                                <div>
                                    <h2 id="recent-users-heading">
                                        Recent Users
                                    </h2>

                                    <p>
                                        Newly registered users
                                    </p>
                                </div>

                                <a
                                    href="/admin/users"
                                    className="dashboard-view-all"
                                >
                                    View All
                                </a>
                            </div>

                            <div className="dashboard-table-wrapper">
                                <table className="dashboard-table">
                                    <caption className="sr-only">
                                        Recently registered users
                                    </caption>

                                    <thead>
                                        <tr>
                                            <th scope="col">User</th>
                                            <th scope="col">Role</th>
                                            <th scope="col">Joined</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {dashboard.recentUsers?.length > 0 ? (
                                            dashboard.recentUsers.map(
                                                (user) => (
                                                    <tr
                                                        key={
                                                            user.userId
                                                        }
                                                    >
                                                        <td>
                                                            <strong>
                                                                {
                                                                    user.username
                                                                }
                                                            </strong>

                                                            <small>
                                                                {
                                                                    user.email
                                                                }
                                                            </small>
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`dashboard-badge role-${String(
                                                                    user.role
                                                                ).toLowerCase()}`}
                                                            >
                                                                {
                                                                    user.role
                                                                }
                                                            </span>
                                                        </td>

                                                        <td>
                                                            {formatDate(
                                                                user.createdAt
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="3"
                                                    className="dashboard-empty"
                                                >
                                                    No recent users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Low Stock Products */}
                    <section
                        className="dashboard-section"
                        aria-labelledby="low-stock-heading"
                    >
                        <div className="dashboard-section-header">
                            <div>
                                <h2 id="low-stock-heading">
                                    Low Stock Products
                                </h2>

                                <p>
                                    Products that may need restocking
                                </p>
                            </div>
                        </div>

                        {dashboard.lowStockProducts?.length > 0 ? (
                            <div className="dashboard-table-wrapper">
                                <table className="dashboard-table">
                                    <caption className="sr-only">
                                        Products with low stock
                                    </caption>

                                    <thead>
                                        <tr>
                                            <th scope="col">Product</th>
                                            <th scope="col">Stock</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {dashboard.lowStockProducts.map(
                                            (product) => (
                                                <tr
                                                    key={
                                                        product.productId
                                                    }
                                                >
                                                    <td>
                                                        <strong>
                                                            {
                                                                product.name
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {
                                                            product.stock
                                                        }
                                                    </td>

                                                    <td>
                                                        {formatAmount(
                                                            product.price
                                                        )}
                                                    </td>

                                                    <td>
                                                        <span className="dashboard-low-stock-badge">
                                                            <AlertTriangle
                                                                size={14}
                                                                aria-hidden="true"
                                                            />

                                                            Low Stock
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div
                                className="dashboard-no-low-stock"
                                role="status"
                            >
                                <Package
                                    size={28}
                                    aria-hidden="true"
                                />

                                <div>
                                    <strong>
                                        All products are well stocked
                                    </strong>

                                    <p>
                                        There are currently no low-stock
                                        products.
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>

                </div>
            </main>
        </>
    );
}

export default Dashboard;