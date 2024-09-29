import axios from "axios";

const request = axios.create({
    baseURL: "http://192.168.189.18:2100/api/v1",
    headers: {
        "content-type": "application/json",
        "Allow-Control-Allow-Origin": "*",
        "Allow-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    },
    responseType: "json",
    withCredentials: true,
});

export default request;
