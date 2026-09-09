import axios from "axios";

const API =  import.meta.env.VITE_API_URL || "http://localhost:8080/api/payment";

export const createPaymentOrder = (orderId) =>
    axios.post(
        `${API}/create-order/${orderId}`,
        {},
        {
            withCredentials: true
        }
    );

export const verifyPayment = (paymentData) =>
    axios.post(
        `${API}/verify`,
        paymentData,
        {
            withCredentials: true
        }
    );