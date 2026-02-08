"use client";

import { use } from "react";
import {
    InternalModeContext,
    type InternalModeContextValue,
} from "@/app/providers/internal-mode";

export function useInternalMode(): InternalModeContextValue {
    const context = use(InternalModeContext);

    if (!context) {
        throw new Error(
            "useInternalMode must be used within InternalModeProvider",
        );
    }

    return context;
}
