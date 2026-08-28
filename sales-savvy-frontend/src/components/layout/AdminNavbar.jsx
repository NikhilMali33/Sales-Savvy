import { useEffect, useRef, useState } from "react";
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

    const profileButtonRef = useRef(null);
    const profileMenuRef = useRef(null);

    const isActive = (path) => {
        return location.pathname === path ||
            location.pathname.startsWith(path + "/");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        setProfileOpen(false);

        navigate("/");
    };

    const toggleProfile = () => {
        setProfileOpen((prev) => !prev);
    };

    useEffect(() => {

        const handleEscape = (event) => {

            if (event.key === "Escape" && profileOpen) {
                setProfileOpen(false);
                profileButtonRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };

    }, [profileOpen]);

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                profileOpen &&
                profileMenuRef.current &&
                profileButtonRef.current &&
                !profileMenuRef.current.contains(event.target) &&
                !profileButtonRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [profileOpen]);

    return (
        <nav
            className="admin-navbar"
            aria-label="Admin navigation"
        >

            <Link
                to="/admin/dashboard"
                className="admin-navbar-logo"
                aria-label="SalesSavvy Admin Dashboard"
            >
                SalesSavvy
                <span>Admin</span>
            </Link>

            <div className="admin-navbar-links">

                <Link
                    to="/admin/dashboard"
                    className={
                        isActive("/admin/dashboard")
                            ? "admin-nav-link active"
                            : "admin-nav-link"
                    }
                    aria-current={
                        isActive("/admin/dashboard")
                            ? "page"
                            : undefined
                    }
                >
                    <LayoutDashboard
                        size={19}
                        aria-hidden="true"
                    />
                    <span>Dashboard</span>
                </Link>

                <Link
                    to="/admin/products"
                    className={
                        isActive("/admin/products")
                            ? "admin-nav-link active"
                            : "admin-nav-link"
                    }
                    aria-current={
                        isActive("/admin/products")
                            ? "page"
                            : undefined
                    }
                >
                    <Package
                        size={19}
                        aria-hidden="true"
                    />
                    <span>Products</span>
                </Link>

                <Link
                    to="/admin/categories"
                    className={
                        isActive("/admin/categories")
                            ? "admin-nav-link active"
                            : "admin-nav-link"
                    }
                    aria-current={
                        isActive("/admin/categories")
                            ? "page"
                            : undefined
                    }
                >
                    <Tags
                        size={19}
                        aria-hidden="true"
                    />
                    <span>Categories</span>
                </Link>

                <Link
                    to="/admin/orders"
                    className={
                        isActive("/admin/orders")
                            ? "admin-nav-link active"
                            : "admin-nav-link"
                    }
                    aria-current={
                        isActive("/admin/orders")
                            ? "page"
                            : undefined
                    }
                >
                    <ShoppingCart
                        size={19}
                        aria-hidden="true"
                    />
                    <span>Orders</span>
                </Link>

                <Link
                    to="/admin/users"
                    className={
                        isActive("/admin/users")
                            ? "admin-nav-link active"
                            : "admin-nav-link"
                    }
                    aria-current={
                        isActive("/admin/users")
                            ? "page"
                            : undefined
                    }
                >
                    <Users
                        size={19}
                        aria-hidden="true"
                    />
                    <span>Users</span>
                </Link>

            </div>

            <div className="admin-profile-wrapper">

                <button
                    ref={profileButtonRef}
                    className={
                        profileOpen
                            ? "admin-profile-btn active"
                            : "admin-profile-btn"
                    }
                    onClick={toggleProfile}
                    type="button"
                    aria-label={
                        profileOpen
                            ? "Close admin profile menu"
                            : "Open admin profile menu"
                    }
                    aria-expanded={profileOpen}
                    aria-haspopup="menu"
                    aria-controls="admin-profile-menu"
                >
                    <UserCircle
                        size={25}
                        aria-hidden="true"
                    />
                </button>

                {profileOpen && (
                    <div
                        ref={profileMenuRef}
                        id="admin-profile-menu"
                        className="admin-profile-dropdown"
                        role="menu"
                        aria-label="Admin profile menu"
                    >

                        <div className="admin-profile-header">

                            <div
                                className="admin-profile-avatar"
                                aria-hidden="true"
                            >
                                <User size={20} />
                            </div>

                            <div>
                                <strong>Admin</strong>
                                <span>Administrator</span>
                            </div>

                        </div>

                        <div
                            className="admin-profile-divider"
                            aria-hidden="true"
                        />

                        <Link
                            to="/admin/profile"
                            className="admin-profile-menu-item"
                            onClick={() => setProfileOpen(false)}
                            role="menuitem"
                        >
                            <User
                                size={18}
                                aria-hidden="true"
                            />
                            <span>My Profile</span>
                        </Link>

                        <button
                            className="admin-profile-menu-item admin-profile-logout"
                            onClick={handleLogout}
                            type="button"
                            role="menuitem"
                        >
                            <LogOut
                                size={18}
                                aria-hidden="true"
                            />
                            <span>Logout</span>
                        </button>

                    </div>
                )}

            </div>

        </nav>
    );
}

export default AdminNavbar;