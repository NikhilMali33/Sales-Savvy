import { useEffect, useState } from "react";
import {
    Users,
    ShoppingCart,
    Package,
    IndianRupee,
    Eye,
    AlertTriangle
} from "lucide-react";

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

    if (loading) {
        return (
            <>
                <AdminNavBar />

                <div className="admin-dashboard-page">
                    <div className="admin-dashboard-container">
                        <div className="admin-dashboard-loading">
                            Loading dashboard...
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <AdminNavBar />

                <div className="admin-dashboard-page">
                    <div className="admin-dashboard-container">
                        <div className="admin-dashboard-error">
                            {error}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!dashboard) {
        return null;
    }

    return (
        <>
            <AdminNavBar />

            <div className="admin-dashboard-page">
                <div className="admin-dashboard-container">

                    <div className="admin-dashboard-header">
                        <div>
                            <h1>Dashboard</h1>
                            <p>
                                Overview of your SalesSavvy store
                            </p>
                        </div>
                    </div>

                    <div className="dashboard-stats-grid">

                        <div className="dashboard-stat-card">
                            <div className="dashboard-stat-icon">
                                <Users size={24} />
                            </div>

                            <div>
                                <span>Total Users</span>
                                <strong>
                                    {dashboard.totalUsers}
                                </strong>
                            </div>
                        </div>

                        <div className="dashboard-stat-card">
                            <div className="dashboard-stat-icon">
                                <ShoppingCart size={24} />
                            </div>

                            <div>
                                <span>Total Orders</span>
                                <strong>
                                    {dashboard.totalOrders}
                                </strong>
                            </div>
                        </div>

                        <div className="dashboard-stat-card">
                            <div className="dashboard-stat-icon">
                                <IndianRupee size={24} />
                            </div>

                            <div>
                                <span>Total Revenue</span>
                                <strong>
                                    {formatAmount(dashboard.totalRevenue)}
                                </strong>
                            </div>
                        </div>

                        <div className="dashboard-stat-card">
                            <div className="dashboard-stat-icon">
                                <Package size={24} />
                            </div>

                            <div>
                                <span>Total Products</span>
                                <strong>
                                    {dashboard.totalProducts}
                                </strong>
                            </div>
                        </div>

                    </div>

                    <section className="dashboard-section">
                        <div className="dashboard-section-header">
                            <div>
                                <h2>Order Overview</h2>
                                <p>
                                    Current order status breakdown
                                </p>
                            </div>
                        </div>

                        <div className="order-status-grid">

                            <div className="order-status-card">
                                <span>Placed</span>
                                <strong>
                                    {dashboard.placedOrders}
                                </strong>
                            </div>

                            <div className="order-status-card">
                                <span>Confirmed</span>
                                <strong>
                                    {dashboard.confirmedOrders}
                                </strong>
                            </div>

                            <div className="order-status-card">
                                <span>Shipped</span>
                                <strong>
                                    {dashboard.shippedOrders}
                                </strong>
                            </div>

                            <div className="order-status-card">
                                <span>Delivered</span>
                                <strong>
                                    {dashboard.deliveredOrders}
                                </strong>
                            </div>

                            <div className="order-status-card">
                                <span>Cancelled</span>
                                <strong>
                                    {dashboard.cancelledOrders}
                                </strong>
                            </div>

                        </div>
                    </section>

                    <div className="dashboard-content-grid">

                        <section className="dashboard-section dashboard-recent-orders">

                            <div className="dashboard-section-header">
                                <div>
                                    <h2>Recent Orders</h2>
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

                                    <thead>
                                        <tr>
                                            <th>Order</th>
                                            <th>Customer</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {dashboard.recentOrders?.length > 0 ? (

                                            dashboard.recentOrders.map((order) => (

                                                <tr key={order.orderId}>

                                                    <td>
                                                        <strong>
                                                            {order.orderId}
                                                        </strong>

                                                        <small>
                                                            {formatDate(
                                                                order.createdAt
                                                            )}
                                                        </small>
                                                    </td>

                                                    <td>
                                                        {order.username}
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
                                                            {order.status}
                                                        </span>
                                                    </td>

                                                </tr>

                                            ))

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

                        <section className="dashboard-section dashboard-recent-users">

                            <div className="dashboard-section-header">
                                <div>
                                    <h2>Recent Users</h2>
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

                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Role</th>
                                            <th>Joined</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {dashboard.recentUsers?.length > 0 ? (

                                            dashboard.recentUsers.map((user) => (

                                                <tr key={user.userId}>

                                                    <td>
                                                        <strong>
                                                            {user.username}
                                                        </strong>

                                                        <small>
                                                            {user.email}
                                                        </small>
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`dashboard-badge role-${String(
                                                                user.role
                                                            ).toLowerCase()}`}
                                                        >
                                                            {user.role}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            user.createdAt
                                                        )}
                                                    </td>

                                                </tr>

                                            ))

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

                    <section className="dashboard-section">

                        <div className="dashboard-section-header">
                            <div>
                                <h2>Low Stock Products</h2>
                                <p>
                                    Products that may need restocking
                                </p>
                            </div>
                        </div>

                        {dashboard.lowStockProducts?.length > 0 ? (

                            <div className="dashboard-table-wrapper">

                                <table className="dashboard-table">

                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Stock</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {dashboard.lowStockProducts.map(
                                            (product) => (

                                                <tr key={product.productId}>

                                                    <td>
                                                        <strong>
                                                            {product.name}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {product.stock}
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

                            <div className="dashboard-no-low-stock">
                                <Package size={28} />

                                <div>
                                    <strong>
                                        All products are well stocked
                                    </strong>

                                    <p>
                                        There are currently no low-stock products.
                                    </p>
                                </div>
                            </div>

                        )}

                    </section>

                </div>
            </div>
        </>
    );
}

export default Dashboard;