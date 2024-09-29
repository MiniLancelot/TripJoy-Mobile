import axios from "axios";

const instance = axios.create({
    baseURL: "http://192.168.1.11:2100/api/v1",
    headers: {
        "Content-Type": "application/json",
        "Allow-Control-Allow-Origin": "*",
        "Allow-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    },
    responseType: "json",
    withCredentials: true,
});

export default instance;
