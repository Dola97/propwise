"use client";

import { useCallback, useState } from "react";
import { useBulkDeleteCustomers } from "@/app/hooks/use-customers";
import { toast } from "sonner";

interface BulkDeleteBarProps {
    count: number;
    ids: string[];
    onComplete: () => void;
}

export function BulkDeleteBar({ count, ids, onComplete }: BulkDeleteBarProps) {
    const [confirming, setConfirming] = useState(false);
    const bulkDelete = useBulkDeleteCustomers();

    const handleDelete = useCallback(() => {
        bulkDelete.mutate(ids, {
            onSuccess: () => {
                const sortedIds = [...ids].sort().join("-");
                toast.success(`${ids.length} customer(s) deleted`, {
                    id: `customers-bulk-deleted-${sortedIds}`,
                });
                onComplete();
            },
            onError: () => {
                toast.error("Failed to delete customers");
            },
        });
    }, [bulkDelete, ids, onComplete]);

    return (
        <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
            <p className="text-sm font-medium text-blue-900">
                {count} customer(s) selected
            </p>

            <div className="flex gap-2">
                {confirming ? (
                    <>
                        <span className="text-sm text-red-600">
                            Are you sure?
                        </span>
                        <button
                            onClick={handleDelete}
                            disabled={bulkDelete.isPending}
                            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            {bulkDelete.isPending
                                ? "Deleting..."
                                : "Confirm Delete"}
                        </button>
                        <button
                            onClick={() => setConfirming(false)}
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setConfirming(true)}
                        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Delete Selected
                    </button>
                )}
            </div>
        </div>
    );
}
