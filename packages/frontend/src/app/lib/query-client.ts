import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

let browserQueryClient: QueryClient | undefined;

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Data is fresh for 30 seconds — avoids refetching on every mount
                staleTime: 30 * 1000,
                // Keep unused data in cache for 5 minutes
                gcTime: 5 * 60 * 1000,
                // Don't retry on 4xx errors
                retry: (failureCount, error: unknown) => {
                    const axiosError = error as AxiosError | undefined;
                    const status = axiosError?.response?.status;

                    if (status !== undefined && status >= 400 && status < 500)
                        return false;
                    return failureCount < 2;
                },
            },
        },
    });
}

/**
 * Returns a singleton QueryClient on the browser.
 * Creates a new one per request on the server (to avoid shared state).
 */
export function getQueryClient() {
    if (typeof window === "undefined") {
        // Server: always make a new query client
        return makeQueryClient();
    }

    // Browser: reuse the same client
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}
