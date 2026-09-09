import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api/products";

export const getAllProducts = () =>
    axios.get(API);

export const getProductById = (productId) =>
    axios.get(`${API}/${productId}`);

export const searchProducts = (keyword) =>
    axios.get(`${API}/search?keyword=${keyword}`);

export const getProductsByCategory = (categoryId) =>
    axios.get(`${API}/category/${categoryId}`);