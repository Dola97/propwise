import type { CustomersQueryParams } from "@/types/customer";

export const customerKeys = {
    // Matches ALL customer queries regardless of params or mode
    all: () => ["customers"] as const,

    list: (params: CustomersQueryParams, isInternal: boolean) =>
        ["customers", "list", { ...params, isInternal }] as const,

    detail: (id: string, isInternal: boolean) =>
        ["customers", "detail", id, { isInternal }] as const,
};
