import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyResetOtp from "./pages/auth/VerifyResetOtp";

import ProductList from "./pages/customer/ProductList";
import ProductDetails from "./pages/customer/ProductDetails";
import AddProduct from "./pages/admin/AddProduct";
import Cart from "./pages/customer/Cart";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProduct from "./pages/admin/EditProduct";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Authentication */}

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Customer */}

        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />

        {/* Admin */}

        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="ADMIN">
            <Dashboard />
          </ProtectedRoute>
        }
        />

        <Route path="/admin/products"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products/add"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products/edit/:id"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <EditProduct />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/categories"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <Categories />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/orders"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/users"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <Users />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;