import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Shapes,
    ShoppingCart,
    Users,
    LogOut,
} from "lucide-react";

import "../../styles/admin/Sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar" aria-label="Admin sidebar">

            <h2 className="logo">SalesSavvy</h2>

            <nav className="sidebar-nav" aria-label="Admin navigation">

                <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                        isActive ? "active" : undefined
                    }
                >
                    <LayoutDashboard size={20} aria-hidden="true" />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/admin/products"
                    className={({ isActive }) =>
                        isActive ? "active" : undefined
                    }
                >
                    <Package size={20} aria-hidden="true" />
                    <span>Products</span>
                </NavLink>

                <NavLink
                    to="/admin/categories"
                    className={({ isActive }) =>
                        isActive ? "active" : undefined
                    }
                >
                    <Shapes size={20} aria-hidden="true" />
                    <span>Categories</span>
                </NavLink>

                <NavLink
                    to="/admin/orders"
                    className={({ isActive }) =>
                        isActive ? "active" : undefined
                    }
                >
                    <ShoppingCart size={20} aria-hidden="true" />
                    <span>Orders</span>
                </NavLink>

                <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                        isActive ? "active" : undefined
                    }
                >
                    <Users size={20} aria-hidden="true" />
                    <span>Users</span>
                </NavLink>

            </nav>

            <button
                type="button"
                className="logout-btn"
                aria-label="Log out of administrator account"
            >
                <LogOut size={20} aria-hidden="true" />
                <span>Logout</span>
            </button>

        </aside>
    );
}

export default Sidebar;