import axios from "axios";

const baseUrls = [
        "http://localhost:8080",
        "http://backend:8080",
];

const selectedBaseurl = process.env.NEXT_PUBLIC_API_BASE || baseUrls[0];

export const axiosInstance = axios.create({
    baseURL: selectedBaseurl,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});