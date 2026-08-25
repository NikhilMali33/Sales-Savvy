import { Link, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Tags,
    ShoppingCart,
    Users,
    LogOut
} from "lucide-react";

import "../../styles/admin/AdminNavbar.css";

function AdminNavbar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/");
    };

    return (
        <nav className="admin-navbar">

            {/* LOGO */}

            <Link
                to="/admin/dashboard"
                className="admin-navbar-logo"
            >
                SalesSavvy
                <span>Admin</span>
            </Link>


            {/* NAVIGATION */}

            <div className="admin-navbar-links">

                <Link to="/admin/dashboard">
                    <LayoutDashboard size={19} />
                    <span>Dashboard</span>
                </Link>


                <Link to="/admin/products">
                    <Package size={19} />
                    <span>Products</span>
                </Link>


                <Link to="/admin/categories">
                    <Tags size={19} />
                    <span>Categories</span>
                </Link>


                <Link to="/admin/orders">
                    <ShoppingCart size={19} />
                    <span>Orders</span>
                </Link>


                <Link to="/admin/users">
                    <Users size={19} />
                    <span>Users</span>
                </Link>

            </div>


            {/* LOGOUT */}

            <button
                className="admin-logout-btn"
                onClick={handleLogout}
            >
                <LogOut size={19} />
                <span>Logout</span>
            </button>

        </nav>
    );
}

export default AdminNavbar;