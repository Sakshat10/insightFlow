import axios from "axios";
import { env } from "@/config/env";
import { onRequest, onRequestError, onResponse, onResponseError } from "./interceptors";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(onRequest, onRequestError);
apiClient.interceptors.response.use(onResponse, onResponseError);
