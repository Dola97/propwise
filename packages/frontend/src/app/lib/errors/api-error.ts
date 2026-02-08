export interface ApiErrorResponse {
    message: string | string[];
    error?: string;
    statusCode: number;
}

export class ApiError extends Error {
    readonly status: number;
    readonly messages: string[];
    readonly raw: ApiErrorResponse;

    constructor(status: number, data: ApiErrorResponse) {
        const messages = Array.isArray(data.message)
            ? data.message
            : [data.message];

        super(messages[0]);
        this.name = "ApiError";
        this.status = status;
        this.messages = messages;
        this.raw = data;
    }

    /** Check if this is a validation error (400) */
    get isValidation(): boolean {
        return this.status === 400;
    }

    /** Check if this is a conflict error (409 — e.g., duplicate email) */
    get isConflict(): boolean {
        return this.status === 409;
    }

    /** Check if a specific field is mentioned in error messages */
    getFieldError(field: string): string | undefined {
        return this.messages.find((msg) =>
            msg.toLowerCase().includes(field.toLowerCase()),
        );
    }
}

/**
 * Extract ApiError from an unknown catch block error.
 * Returns null if it's not an API error.
 */
export function toApiError(error: unknown): ApiError | null {
    if (error instanceof ApiError) return error;
    return null;
}
