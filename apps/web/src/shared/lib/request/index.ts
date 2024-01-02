import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const request = axios.create({
  baseURL: BACKEND_URL,
});

request.interceptors.request.use(function (config) {
  config.headers.Authorization = localStorage.getItem("token");

  return config;
});
