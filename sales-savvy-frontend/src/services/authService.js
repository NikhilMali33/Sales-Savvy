import axios from "axios";

const API = "http://localhost:8080/api";

export const login = (data) =>
    axios.post(`${API}/auth/login`, data);

export const verifyOtp = (data) =>
    axios.post(
        `${API}/auth/verify-otp`,
        data,
        {
            withCredentials: true
        }
    );

export const register = (data) =>
    axios.post(`${API}/users/register`, data);

export const forgotPassword = (email) => {

    return axios.post(
        `${API}/auth/forgot-password`,
        { email },
        {
            withCredentials: true
        }
    );

};


export const verifyResetOtp = (data) => {

    return axios.post(
        `${API}/auth/verify-reset-otp`,
        data,
        {
            withCredentials: true,
        }
    );

};

export const resetPassword = (data) => {

    return axios.post(
        `${API}/auth/reset-password`,
        data,
        {
            withCredentials: true,
        }
    );

};