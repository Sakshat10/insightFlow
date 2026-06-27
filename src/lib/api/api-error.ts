import axios, { AxiosError } from "axios";

export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: Record<string, string[]>;

  constructor(message: string, status?: number, code?: string, details?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    const message = data?.message || axiosError.message || "An unexpected network error occurred";
    const code = data?.code;
    const details = data?.details;

    throw new ApiError(message, status, code, details);
  }

  if (error instanceof Error) {
    throw new ApiError(error.message);
  }

  throw new ApiError("An unknown error occurred");
}
