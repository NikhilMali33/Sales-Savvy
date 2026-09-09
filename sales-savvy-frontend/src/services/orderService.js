import axios from "axios";

const API = (import.meta.env.VITE_API_URL || "http://localhost:8080/api") + "/orders";

// ============================================================
// GET ALL ORDERS OF LOGGED-IN USER
// ============================================================

export const getMyOrders = () =>
    axios.get(API, {
        withCredentials: true
    });


// ============================================================
// GET SINGLE ORDER
// ============================================================

export const getMyOrder = (orderId) =>
    axios.get(`${API}/${orderId}`, {
        withCredentials: true
    });


// ============================================================
// CANCEL ORDER
// ============================================================

export const cancelOrder = (orderId) =>
    axios.delete(`${API}/${orderId}`, {
        withCredentials: true
    });