export interface CustomerPublic {
    id: string;
    full_name: string;
    email: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
}

export interface CustomerInternal extends CustomerPublic {
    national_id: string | null;
    internal_notes: string | null;
}

export type Customer = CustomerPublic | CustomerInternal;

export function isInternalCustomer(
    customer: Customer,
): customer is CustomerInternal {
    return "national_id" in customer;
}

export interface PaginatedMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginatedMeta;
}

export interface CustomersQueryParams {
    q?: string;
    page?: number;
    limit?: number;
    sortBy?: "created_at" | "full_name";
    sortOrder?: "ASC" | "DESC";
    createdAfter?: string;
    createdBefore?: string;
}
