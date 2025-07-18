import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://backend:8080",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});