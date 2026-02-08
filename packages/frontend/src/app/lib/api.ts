import axios from "axios";
import { toast } from "sonner";
import { ApiError } from "./errors/api-error";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Attach the x-internal header dynamically.
 * We use a mutable ref pattern so the interceptor doesn't
 * need to re-register when internal mode changes.
 */
let _isInternal = false;

export function setApiInternalMode(value: boolean) {
    _isInternal = value;
}

api.interceptors.request.use((config) => {
    if (_isInternal) {
        config.headers["x-internal"] = "true";
    } else {
        delete config.headers["x-internal"];
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (!error.response) {
            toast.error("Network error. Please check your connection.");
            return Promise.reject(error);
        }

        const { status, data } = error.response;

        const apiError = new ApiError(status, {
            message: data?.message ?? "Something went wrong",
            error: data?.error,
            statusCode: status,
        });

        if (status === 401) {
            toast.error("Session expired. Please refresh.");
        }

        if (status === 403) {
            toast.error("You don't have permission to do that.");
        }

        if (status >= 500) {
            toast.error("Server error. Please try again later.");
        }

        return Promise.reject(apiError);
    },
);

export default api;
