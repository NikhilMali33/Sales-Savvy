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
        <div className="sidebar">

            <h2 className="logo">SalesSavvy</h2>

            <nav>

                <NavLink to="/admin/dashboard">
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>

                <NavLink to="/admin/products">
                    <Package size={20} />
                    Products
                </NavLink>

                <NavLink to="/admin/categories">
                    <Shapes size={20} />
                    Categories
                </NavLink>

                <NavLink to="/admin/orders">
                    <ShoppingCart size={20} />
                    Orders
                </NavLink>

                <NavLink to="/admin/users">
                    <Users size={20} />
                    Users
                </NavLink>

            </nav>

            <button className="logout-btn">
                <LogOut size={20} />
                Logout
            </button>

        </div>
    );
}

export default Sidebar;