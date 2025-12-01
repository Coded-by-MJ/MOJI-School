import type { ErrorContext } from "better-auth/react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";



export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  withCredentials: true,
});

export function withAuthHeaders(cookies?: string): AxiosRequestConfig {
  const headers: Record<string, string> = {};
  if (cookies) {
    headers["Cookie"] = cookies;
  }

  return { headers };
}

function isErrorContext(error: unknown): error is ErrorContext {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    error instanceof Error
  );
}


export const renderAxiosOrAuthError = (error: unknown): string => {
  console.log(error)
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Request failed. Try again later."
    );
  }

  if (isErrorContext(error)) {
    return error.error?.message || "Authentication error occurred.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong, try again later.";
};
