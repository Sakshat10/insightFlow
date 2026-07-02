import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

import { AuthStorage } from "@/lib/auth/auth-storage";

const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
];

export function onRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const url = config.url || "";
  const cleanUrl = url.split("?")[0].split("#")[0];
  const isPublic = PUBLIC_ENDPOINTS.some((endpoint) => cleanUrl.endsWith(endpoint));

  if (!isPublic) {
    const token = AuthStorage.getAccessToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  } else {
    // Ensure the Authorization header is removed if set on public endpoints
    config.headers.delete("Authorization");
  }
  return config;
}

export function onRequestError(error: AxiosError): Promise<AxiosError> {
  return Promise.reject(error);
}

export function onResponse<T>(response: AxiosResponse<T>): AxiosResponse<T> {
  return response;
}

export function onResponseError(error: AxiosError): Promise<AxiosError> {
  return Promise.reject(error);
}
