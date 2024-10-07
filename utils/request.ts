import axios from "axios";
export const identity = axios.create({
    baseURL: "http://192.168.1.11:6200/api/v1/Account",
    headers: {
        "Content-Type": "application/json",
        "Allow-Control-Allow-Origin": "*",
        "Allow-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    },
    responseType: "json",
    withCredentials: true,
});


