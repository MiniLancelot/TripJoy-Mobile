import axios from "axios";

const baseURL = "http://192.168.1.9:7000";

const identity = axios.create({
    baseURL: `${baseURL}/identity-service`,
    headers: {
        "Content-Type": "application/json",
        "Allow-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    },
    responseType: "json",
    withCredentials: true,
});

const user = axios.create({
    baseURL: `${baseURL}/useraccess-service`,
    headers: {
        "Content-Type": "application/json",
        "Allow-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    },
    responseType: "json",
    withCredentials: true,
});

const location = axios.create({
    baseURL: `${baseURL}/locationattraction-service`,
    headers: {
        "Content-Type": "application/json",
        "Allow-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    },
    responseType: "json",
    withCredentials: true,
});

const plan = axios.create({
    baseURL: `${baseURL}/travelplan-service`,
    headers: {
        "Content-Type": "application/json",
        "Allow-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    },
    responseType: "json",
    withCredentials: true,
});

export { identity, user, location, plan };