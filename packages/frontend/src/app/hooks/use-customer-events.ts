"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "./use-socket";
import { customerKeys } from "./query-keys";
import { toast } from "sonner";

interface CustomerEventPayload {
    id: string;
    full_name: string;
    email: string;
}

interface BulkDeletePayload {
    ids: string[];
}

export function useCustomerEvents() {
    const socket = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) return;

        const invalidateAll = () => {
            queryClient.invalidateQueries({
                queryKey: customerKeys.all(),
            });
        };

        const onCreated = (payload: CustomerEventPayload) => {
            toast.success(`Customer created: ${payload.full_name}`);
            invalidateAll();
        };

        const onUpdated = (payload: CustomerEventPayload) => {
            toast.info(`Customer updated: ${payload.full_name}`);
            invalidateAll();
        };

        const onDeleted = (payload: { id: string }) => {
            toast.warning(`Customer deleted (${payload.id.slice(0, 8)}...)`);
            invalidateAll();
        };

        const onBulkDeleted = (payload: BulkDeletePayload) => {
            toast.warning(`${payload.ids.length} customer(s) deleted`);
            invalidateAll();
        };

        socket.on("customer.created", onCreated);
        socket.on("customer.updated", onUpdated);
        socket.on("customer.deleted", onDeleted);
        socket.on("customers.bulk_deleted", onBulkDeleted);

        return () => {
            socket.off("customer.created", onCreated);
            socket.off("customer.updated", onUpdated);
            socket.off("customer.deleted", onDeleted);
            socket.off("customers.bulk_deleted", onBulkDeleted);
        };
    }, [socket, queryClient]);
}
