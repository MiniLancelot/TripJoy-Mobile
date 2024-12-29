import axios from 'axios';
import { baseURL, aiUrl } from "@/utils/baseUrl";

const createAxiosInstance = (servicePath: string) => {
  return axios.create({
    baseURL: `${baseURL}/${servicePath}`,
    responseType: "json",
    withCredentials: true,
  });
};

const createAIAxiosInstance = (servicePath: string) => {
  return axios.create({
    baseURL: `${aiUrl}/${servicePath}`,
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
const ai = createAIAxiosInstance('api');

export { identity, user, location, plan, chat, post, ai };