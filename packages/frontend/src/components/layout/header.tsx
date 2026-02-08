"use client";

import { useInternalMode } from "@/app/hooks/use-internal-mode";

export function Header() {
    const { state, actions } = useInternalMode();

    return (
        <header className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                        Propwise
                    </h1>
                    <p className="text-sm text-gray-500">
                        Customer Activity Dashboard
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                        {state.isInternal ? "Internal Mode" : "Public Mode"}
                    </span>
                    <button
                        onClick={actions.toggle}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            state.isInternal
                                ? "bg-amber-500 focus:ring-amber-500"
                                : "bg-gray-200 focus:ring-gray-500"
                        }`}
                        role="switch"
                        aria-checked={state.isInternal}
                        aria-label="Toggle internal mode"
                    >
                        <span
                            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                state.isInternal
                                    ? "translate-x-5"
                                    : "translate-x-0"
                            }`}
                        />
                    </button>
                </div>
            </div>
        </header>
    );
}
