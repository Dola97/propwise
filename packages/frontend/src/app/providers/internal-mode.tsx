"use client";

import { createContext, useCallback, useState } from "react";

// --- Context Interface (state + actions) ---

interface InternalModeState {
    isInternal: boolean;
}

interface InternalModeActions {
    toggle: () => void;
    setInternal: (value: boolean) => void;
}

export interface InternalModeContextValue {
    state: InternalModeState;
    actions: InternalModeActions;
}

export const InternalModeContext =
    createContext<InternalModeContextValue | null>(null);

// --- Provider (state lives here, UI consumes the interface) ---

export function InternalModeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isInternal, setIsInternal] = useState(false);

    // Functional setState — stable callbacks, no stale closures
    const toggle = useCallback(() => {
        setIsInternal((curr) => !curr);
    }, []);

    const setInternal = useCallback((value: boolean) => {
        setIsInternal(value);
    }, []);

    return (
        <InternalModeContext
            value={{
                state: { isInternal },
                actions: { toggle, setInternal },
            }}
        >
            {children}
        </InternalModeContext>
    );
}
