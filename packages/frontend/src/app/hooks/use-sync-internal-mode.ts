"use client";

import { useEffect } from "react";
import { useInternalMode } from "./use-internal-mode";
import { setApiInternalMode } from "@/app/lib/api";

/**
 * Syncs InternalMode context state to the axios interceptor.
 * Must be rendered inside InternalModeProvider.
 */
export function useSyncInternalMode() {
    const { state } = useInternalMode();

    useEffect(() => {
        setApiInternalMode(state.isInternal);
    }, [state.isInternal]);
}
