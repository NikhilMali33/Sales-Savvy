import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api/categories";

export const getAllCategories = () =>
    axios.get(API);