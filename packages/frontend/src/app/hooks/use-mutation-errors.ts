"use client";

import { useState, useCallback } from "react";
import { toApiError } from "@/app/lib/errors/api-error";

interface MutationErrorState {
    messages: string[];
    getFieldError: (field: string) => string | undefined;
    clear: () => void;
    handle: (error: unknown) => void;
}

export function useMutationErrors(): MutationErrorState {
    const [messages, setMessages] = useState<string[]>([]);

    const clear = useCallback(() => setMessages([]), []);

    const handle = useCallback((error: unknown) => {
        const apiError = toApiError(error);

        if (apiError?.isValidation || apiError?.isConflict) {
            setMessages(apiError.messages);
            return;
        }

        if (!apiError) {
            setMessages(["An unexpected error occurred."]);
        }
    }, []);

    const getFieldError = useCallback(
        (field: string) =>
            messages.find((msg) =>
                msg.toLowerCase().includes(field.toLowerCase()),
            ),
        [messages],
    );

    return { messages, getFieldError, clear, handle };
}
