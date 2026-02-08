"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { type CustomerFormData } from "@/app/lib/schemas/customer.schema";
import { useCreateCustomer } from "@/app/hooks/use-customers";
import { CustomerForm } from "./customer-form";
import { useMutationErrors } from "@/app/hooks/use-mutation-errors";

interface CreateCustomerModalProps {
    open: boolean;
    onClose: () => void;
}

export function CreateCustomerModal({
    open,
    onClose,
}: CreateCustomerModalProps) {
    const createCustomer = useCreateCustomer();
    const { handle, clear, messages } = useMutationErrors();

    const handleSubmit = useCallback(
        (data: CustomerFormData) => {
            clear();
            createCustomer.mutate(data, {
                onSuccess: (customer) => {
                    toast.success("Customer created", {
                        id: `customer-created-${customer.id}`,
                    });
                    onClose();
                },
                onError: handle,
            });
        },
        [createCustomer, onClose, handle, clear],
    );

    return (
        <Modal open={open} onClose={onClose} title="Create Customer">
            <CustomerForm
                onSubmit={handleSubmit}
                onCancel={onClose}
                isPending={createCustomer.isPending}
                submitLabel="Create"
                serverErrors={messages}
            />
        </Modal>
    );
}
