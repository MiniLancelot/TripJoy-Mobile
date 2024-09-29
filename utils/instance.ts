import axios from "axios";
export const instance = axios.create({
    baseURL: "http://192.168.1.13:6200/api/v1",
    headers: {
        "Content-Type": "application/json",
        "Allow-Control-Allow-Origin": "*",
        "Allow-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    },
    responseType: "json",
    withCredentials: true,
    
});

export const login = axios.create({
    baseURL: "http://192.168.1.13:6300",
    headers: {
        "Content-Type": "application/json",
        "Allow-Control-Allow-Origin": "*",
        "Allow-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    },
    responseType: "json",
    withCredentials: true,
});


