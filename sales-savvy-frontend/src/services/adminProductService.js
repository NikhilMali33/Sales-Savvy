import axios from "axios";

const API = "http://localhost:8080/api/admin/products";

export const getAllProducts = () =>
    axios.get(API, {
        withCredentials: true,
    });

export const getProductById = (id) =>
    axios.get(`${API}/${id}`, {
        withCredentials: true,
    });

export const addProduct = (formData) =>
    axios.post(API, formData, {
        withCredentials: true,
    });

export const updateProduct = (id, formData) =>
    axios.put(`${API}/${id}`, formData, {
        withCredentials: true,
    });

export const deleteProduct = (id) =>
    axios.delete(`${API}/${id}`, {
        withCredentials: true,
    });

export const deleteProductImage = (productId, imageId) =>
    axios.delete(
        `${API}/${productId}/images/${imageId}`,
        {
            withCredentials: true,
        }
    );