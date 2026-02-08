"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useInternalMode } from "./use-internal-mode";
import { customerKeys } from "./query-keys";
import {
    fetchCustomers,
    fetchCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    bulkDeleteCustomers,
} from "@/app/lib/customers-api";
import type { CustomersQueryParams } from "@/types/customer";
import { type CustomerFormData } from "@/app/lib/schemas/customer.schema";

// --- List ---

export function useCustomers(params: CustomersQueryParams = {}) {
    const { state } = useInternalMode();

    return useQuery({
        queryKey: customerKeys.list(params, state.isInternal),
        queryFn: () => fetchCustomers(params),
    });
}

// --- Detail ---

export function useCustomer(id: string) {
    const { state } = useInternalMode();

    return useQuery({
        queryKey: customerKeys.detail(id, state.isInternal),
        queryFn: () => fetchCustomerById(id),
        enabled: !!id,
    });
}

// --- Create ---

export function useCreateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: customerKeys.all(),
            });
        },
    });
}

// --- Update ---

export function useUpdateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: CustomerFormData }) =>
            updateCustomer(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: customerKeys.all(),
            });
        },
    });
}

// --- Delete ---

export function useDeleteCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: customerKeys.all(),
            });
        },
    });
}

// --- Bulk Delete ---

export function useBulkDeleteCustomers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bulkDeleteCustomers,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: customerKeys.all(),
            });
        },
    });
}
