"use client";

import { useCallback, useMemo, useState } from "react";
import { useCustomers, useDeleteCustomer } from "@/app/hooks/use-customers";
import { useInternalMode } from "@/app/hooks/use-internal-mode";
import { useDebounce } from "@/app/hooks/use-debounce";
import { isInternalCustomer } from "@/types/customer";
import type { Customer, CustomersQueryParams } from "@/types/customer";
import { SearchInput } from "./search-input";
import { Pagination } from "./pagination";
import { BulkDeleteBar } from "./bulk-delete-bar";
import { CreateCustomerModal } from "./create-customer-modal";
import { EditCustomerModal } from "./edit-customer-modal";
import { toast } from "sonner";
import { TableSkeleton } from "../../ui/skeleton";

export function CustomerTable() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showCreate, setShowCreate] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(
        null,
    );
    const [sortBy, setSortBy] = useState<"created_at" | "full_name">(
        "created_at",
    );
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
    const deleteMutation = useDeleteCustomer();

    const { state } = useInternalMode();
    const debouncedSearch = useDebounce(search, 300);

    const params: CustomersQueryParams = useMemo(
        () => ({
            ...(debouncedSearch ? { q: debouncedSearch } : {}),
            page,
            limit: 10,
            sortBy,
            sortOrder,
        }),
        [debouncedSearch, page, sortBy, sortOrder],
    );

    const { data, isLoading, isError } = useCustomers(params);

    const toggleSelect = useCallback((id: string) => {
        setSelectedIds((curr) => {
            const next = new Set(curr);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const toggleSelectAll = useCallback(() => {
        if (!data?.data) return;
        setSelectedIds((curr) => {
            const allIds = data.data.map((c) => c.id);
            const allSelected = allIds.every((id) => curr.has(id));
            return allSelected ? new Set() : new Set(allIds);
        });
    }, [data]);

    const clearSelection = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    const handleSearchChange = useCallback(
        (value: string) => {
            setSearch(value);
            setPage(1);
            clearSelection();
        },
        [clearSelection],
    );

    const customers = data?.data ?? [];
    const colSpan = state.isInternal ? 8 : 6;
    const allSelected =
        customers.length > 0 && customers.every((c) => selectedIds.has(c.id));

    const handleSingleDelete = useCallback(
        (customer: Customer) => {
            if (!confirm(`Delete "${customer.full_name}"?`)) return;
            deleteMutation.mutate(customer.id, {
                onSuccess: () => {
                    toast.success(`Deleted ${customer.full_name}`, {
                        id: `customer-deleted-${customer.id}`,
                    });
                },
                onError: () => {
                    toast.error("Failed to delete customer");
                },
            });
        },
        [deleteMutation],
    );

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <SearchInput value={search} onChange={handleSearchChange} />
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="ml-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    + Add Customer
                </button>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Sort by</label>
                    <select
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(
                                e.target.value as "created_at" | "full_name",
                            );
                            setPage(1);
                            clearSelection();
                        }}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="created_at">Date Created</option>
                        <option value="full_name">Name</option>
                    </select>
                </div>

                <button
                    onClick={() => {
                        setSortOrder((curr) =>
                            curr === "ASC" ? "DESC" : "ASC",
                        );
                        setPage(1);
                        clearSelection();
                    }}
                    className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                    {sortOrder === "ASC" ? "↑ Ascending" : "↓ Descending"}
                </button>
            </div>

            {/* Bulk delete bar */}
            {selectedIds.size > 0 && (
                <BulkDeleteBar
                    count={selectedIds.size}
                    ids={Array.from(selectedIds)}
                    onComplete={clearSelection}
                />
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-10 px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleSelectAll}
                                    className="rounded border-gray-300"
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Email
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Phone
                            </th>
                            {state.isInternal && (
                                <>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-amber-600">
                                        National ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-amber-600">
                                        Internal Notes
                                    </th>
                                </>
                            )}
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Created
                            </th>
                            <th className="w-16 px-4 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading && <TableSkeleton rows={5} cols={colSpan} />}

                        {isError && (
                            <tr>
                                <td
                                    colSpan={colSpan}
                                    className="px-4 py-8 text-center text-sm text-red-500"
                                >
                                    Failed to load customers.
                                </td>
                            </tr>
                        )}

                        {!isLoading && !isError && customers.length === 0 && (
                            <tr>
                                <td
                                    colSpan={colSpan}
                                    className="px-4 py-8 text-center text-sm text-gray-500"
                                >
                                    No customers found.
                                </td>
                            </tr>
                        )}

                        {customers.map((customer) => (
                            <tr
                                key={customer.id}
                                className={`hover:bg-gray-50 ${
                                    selectedIds.has(customer.id)
                                        ? "bg-blue-50"
                                        : ""
                                }`}
                            >
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(customer.id)}
                                        onChange={() =>
                                            toggleSelect(customer.id)
                                        }
                                        className="rounded border-gray-300"
                                    />
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                                    {customer.full_name}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                    {customer.email}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                    {customer.phone_number}
                                </td>
                                {state.isInternal &&
                                    isInternalCustomer(customer) && (
                                        <>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-amber-700">
                                                {customer.national_id ?? "—"}
                                            </td>
                                            <td className="max-w-xs truncate px-4 py-3 text-sm text-amber-700">
                                                {customer.internal_notes ?? "—"}
                                            </td>
                                        </>
                                    )}
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                                    {new Date(
                                        customer.created_at,
                                    ).toLocaleDateString()}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() =>
                                                setEditingCustomer(customer)
                                            }
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleSingleDelete(customer)
                                            }
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {data?.meta && (
                    <Pagination
                        meta={data.meta}
                        onPageChange={(nextPage) => {
                            setPage(nextPage);
                            clearSelection();
                        }}
                    />
                )}
            </div>

            {/* Modals */}
            <CreateCustomerModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
            />

            {editingCustomer && (
                <EditCustomerModal
                    open={!!editingCustomer}
                    onClose={() => setEditingCustomer(null)}
                    customer={editingCustomer}
                />
            )}
        </div>
    );
}
