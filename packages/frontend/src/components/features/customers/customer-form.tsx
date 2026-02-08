"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInternalMode } from "@/app/hooks/use-internal-mode";
import {
    customerSchema,
    type CustomerFormData,
} from "@/app/lib/schemas/customer.schema";

interface CustomerFormProps {
    initialData?: CustomerFormData;
    onSubmit: (data: CustomerFormData) => void;
    onCancel: () => void;
    isPending: boolean;
    submitLabel: string;
    /** Backend error messages to map to fields */
    serverErrors?: string[];
}

export function CustomerForm({
    initialData,
    onSubmit,
    onCancel,
    isPending,
    submitLabel,
    serverErrors,
}: CustomerFormProps) {
    const { state } = useInternalMode();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
        defaultValues: initialData ?? {
            full_name: "",
            email: "",
            phone_number: "",
            national_id: "",
            internal_notes: "",
        },
    });

    const onValid = (data: CustomerFormData) => {
        if (!state.isInternal) {
            // Strip sensitive fields for public mode
            onSubmit({
                full_name: data.full_name,
                email: data.email,
                phone_number: data.phone_number,
            });
            return;
        }
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(onValid)} className="space-y-4">
            {/* Server-side errors (unmapped) */}
            {serverErrors && serverErrors.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <ul className="list-inside list-disc text-sm text-red-700">
                        {serverErrors.map((msg) => (
                            <li key={msg}>{msg}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Full Name */}
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name *
                </label>
                <input
                    type="text"
                    {...register("full_name")}
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 ${
                        errors.full_name
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="John Doe"
                />
                {errors.full_name && (
                    <p className="mt-1 text-xs text-red-600">
                        {errors.full_name.message}
                    </p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email *
                </label>
                <input
                    type="email"
                    {...register("email")}
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 ${
                        errors.email
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="john@example.com"
                />
                {errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Phone */}
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Phone Number *
                </label>
                <input
                    type="text"
                    {...register("phone_number")}
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 ${
                        errors.phone_number
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                    placeholder="+1234567890"
                />
                {errors.phone_number && (
                    <p className="mt-1 text-xs text-red-600">
                        {errors.phone_number.message}
                    </p>
                )}
            </div>

            {/* Internal-only fields */}
            {state.isInternal && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="mb-3 text-xs font-medium uppercase text-amber-700">
                        Internal Fields
                    </p>
                    <div className="space-y-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-amber-800">
                                National ID
                            </label>
                            <input
                                type="text"
                                {...register("national_id")}
                                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 ${
                                    errors.national_id
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                        : "border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                                }`}
                                placeholder="NID-123456"
                            />
                            {errors.national_id && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.national_id.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-amber-800">
                                Internal Notes
                            </label>
                            <textarea
                                {...register("internal_notes")}
                                rows={3}
                                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-1 ${
                                    errors.internal_notes
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                        : "border-amber-300 focus:border-amber-500 focus:ring-amber-500"
                                }`}
                                placeholder="Internal notes about this customer..."
                            />
                            {errors.internal_notes && (
                                <p className="mt-1 text-xs text-red-600">
                                    {errors.internal_notes.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isPending ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    );
}
