import axios from "axios";

const request = axios.create({
    baseURL: "http://192.168.1.11:7100/api/v1",
    headers: {
        "Content-Type": "application/json",
        "Allow-Control-Allow-Origin": "*",
        "Allow-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    },
})

export default request