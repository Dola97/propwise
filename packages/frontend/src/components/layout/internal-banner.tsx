"use client";

import { useInternalMode } from "@/app/hooks/use-internal-mode";

export function InternalBanner() {
    const { state } = useInternalMode();

    if (!state.isInternal) return null;

    return (
        <div className="bg-amber-500 px-4 py-1.5 text-center text-xs font-medium text-white">
            ⚠ Internal Mode — Sensitive fields are visible
        </div>
    );
}
