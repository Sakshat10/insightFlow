import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

import { AuthStorage } from "@/lib/auth/auth-storage";

export function onRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const auth = AuthStorage.getAuth();
  if (auth?.accessToken) {
    config.headers.set("Authorization", `Bearer ${auth.accessToken}`);
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
