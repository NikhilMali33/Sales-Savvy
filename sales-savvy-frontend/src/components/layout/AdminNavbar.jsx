import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    Package,
    Tags,
    ShoppingCart,
    Users,
    LogOut,
    UserCircle,
    User
} from "lucide-react";

import "../../styles/admin/AdminNavbar.css";

function AdminNavbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [profileOpen, setProfileOpen] = useState(false);

    /*
     * ============================================================
     * ACTIVE NAVIGATION
     * ============================================================
     */

    const isActive = (path) => {
        return location.pathname === path ||
               location.pathname.startsWith(path + "/");
    };


    /*
     * ============================================================
     * LOGOUT
     * ============================================================
     */

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        setProfileOpen(false);

        navigate("/");
    };


    /*
     * ============================================================
     * PROFILE TOGGLE
     * ============================================================
     */

    const toggleProfile = () => {

        setProfileOpen((prev) => !prev);
    };


    return (

        <nav className="admin-navbar">

            {/* =====================================================
                LOGO
            ====================================================== */}

            <Link
                to="/admin/dashboard"
                className="admin-navbar-logo"
            >
                SalesSavvy
                <span>Admin</span>
            </Link>


            {/* =====================================================
                NAVIGATION LINKS
            ====================================================== */}

            <div className="admin-navbar-links">

                {/* Dashboard */}

                <Link
                    to="/admin/dashboard"
                    className={
                        isActive("/admin/dashboard")
                            ? "admin-nav-link active"
                            : "admin-nav-link"
                    }
                >
                    <LayoutDashboard size={19} />
                    <span>Dashboard</span>
                </Link>


                {/* Products */}

                <Link
                    to="/admin/products"
                    className={
                        isActive("/admin/products")
                            ? "admin-nav-link active"
                            : "admin-nav-link"
                    }
                >
                    <Package size={19} />
                    <span>Products</span>
                </Link>


                {/* Categories */}

                <Link
                    to="/admin/categories"
                    className={
                        isActive("/admin/categories")
                            ? "admin-nav-link active"
                            : "admin-nav-link"
                    }
                >
                    <Tags size={19} />
                    <span>Categories</span>
                </Link>


                {/* Orders */}

                <Link
                    to="/admin/orders"
                    className={
                        isActive("/admin/orders")
                            ? "admin-nav-link active"
                            : "admin-nav-link"
                    }
                >
                    <ShoppingCart size={19} />
                    <span>Orders</span>
                </Link>


                {/* Users */}

                <Link
                    to="/admin/users"
                    className={
                        isActive("/admin/users")
                            ? "admin-nav-link active"
                            : "admin-nav-link"
                    }
                >
                    <Users size={19} />
                    <span>Users</span>
                </Link>

            </div>


            {/* =====================================================
                PROFILE SECTION
            ====================================================== */}

            <div className="admin-profile-wrapper">

                <button
                    className={
                        profileOpen
                            ? "admin-profile-btn active"
                            : "admin-profile-btn"
                    }
                    onClick={toggleProfile}
                    type="button"
                >
                    <UserCircle size={25} />
                </button>


                {/* =================================================
                    PROFILE DROPDOWN
                ================================================== */}

                {profileOpen && (

                    <div className="admin-profile-dropdown">

                        {/* Profile Header */}

                        <div className="admin-profile-header">

                            <div className="admin-profile-avatar">
                                <User size={20} />
                            </div>

                            <div>
                                <strong>Admin</strong>
                                <span>Administrator</span>
                            </div>

                        </div>


                        <div className="admin-profile-divider"></div>


                        {/* My Profile */}

                        <Link
                            to="/admin/profile"
                            className="admin-profile-menu-item"
                            onClick={() => setProfileOpen(false)}
                        >
                            <User size={18} />

                            <span>My Profile</span>
                        </Link>


                        {/* Logout */}

                        <button
                            className="admin-profile-menu-item admin-profile-logout"
                            onClick={handleLogout}
                            type="button"
                        >
                            <LogOut size={18} />

                            <span>Logout</span>
                        </button>

                    </div>

                )}

            </div>

        </nav>
    );
}

export default AdminNavbar;