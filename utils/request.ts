import axios from "axios";
import { baseURL } from "@/utils/baseUrl";

const createAxiosInstance = (servicePath: string) => {
    return axios.create({
        baseURL: `${baseURL}/${servicePath}`,
        headers: {
            "Content-Type": "application/json",
            "Allow-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        },
        responseType: "json",
        withCredentials: true,
    });
};

const identity = createAxiosInstance('identity-service'); 
const user = createAxiosInstance('useraccess-service');
const location = createAxiosInstance('locationattraction-service');
const plan = createAxiosInstance('travelplan-service');

export { identity, user, location, plan };