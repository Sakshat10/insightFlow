import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

import { AuthStorage } from "@/lib/auth/auth-storage";

export function onRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = AuthStorage.getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
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
