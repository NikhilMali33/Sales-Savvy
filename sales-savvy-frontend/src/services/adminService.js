import axios from "axios";

const API = "http://localhost:8080/api/admin";

export const getDashboardData = () =>
    axios.get(`${API}/dashboard`, {
        withCredentials: true
    });

export const getAllUsers = () =>
    axios.get(`${API}/users`, {
        withCredentials: true
    });

export const getUserById = (userId) =>
    axios.get(`${API}/users/${userId}`, {
        withCredentials: true
    });

export const getAllOrders = () =>
    axios.get(`${API}/orders`, {
        withCredentials: true
    });

export const getOrderById = (orderId) =>
    axios.get(`${API}/orders/${orderId}`, {
        withCredentials: true
    });

export const updateOrderStatus = (orderId, status) =>
    axios.put(
        `${API}/orders/${orderId}/status`,
        status,
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

export const getAllProducts = () =>
    axios.get(`${API}/products`, {
        withCredentials: true
    });

export const getProductById = (id) =>
    axios.get(`${API}/products/${id}`, {
        withCredentials: true
    });

export const addProduct = (formData) =>
    axios.post(`${API}/products`, formData, {
        withCredentials: true
    });

export const updateProduct = (id, formData) =>
    axios.put(`${API}/products/${id}`, formData, {
        withCredentials: true
    });

export const deleteProduct = (id) =>
    axios.delete(`${API}/products/${id}`, {
        withCredentials: true
    });

export const deleteProductImage = (productId, imageId) =>
    axios.delete(
        `${API}/products/${productId}/images/${imageId}`,
        {
            withCredentials: true
        }
    );