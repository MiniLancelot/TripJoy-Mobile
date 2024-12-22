import axios from 'axios';
import { baseURL } from "@/utils/baseUrl";

const createAxiosInstance = (servicePath: string) => {
  return axios.create({
    baseURL: `${baseURL}/${servicePath}`,
    responseType: "json",
    withCredentials: true,
  });
};

const identity = createAxiosInstance('identity-service'); 
const user = createAxiosInstance('useraccess-service');
const location = createAxiosInstance('locationattraction-service');
const plan = createAxiosInstance('travelplan-service');
const chat = createAxiosInstance('chat-service');
const post = createAxiosInstance('post-service');

export { identity, user, location, plan, chat, post };