import axios from "axios";

const API = "http://localhost:8080/api/cart";

export const getCart = () =>
    axios.get(API, {
        withCredentials: true
    });

export const addToCart = (productId, quantity) =>
    axios.post(
        `${API}/add`,
        {
            productId,
            quantity
        },
        {
            withCredentials: true
        }
    );

export const updateCartItem = (cartItemId, quantity) =>
    axios.put(
        `${API}/items/${cartItemId}`,
        {
            quantity
        },
        {
            withCredentials: true
        }
    );

export const removeCartItem = (cartItemId) =>
    axios.delete(
        `${API}/items/${cartItemId}`,
        {
            withCredentials: true
        }
    );

export const clearCart = () =>
    axios.delete(API, {
        withCredentials: true
    });