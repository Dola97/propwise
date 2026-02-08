import api from "./api";
import type {
    Customer,
    CustomersQueryParams,
    PaginatedResponse,
} from "@/types/customer";
import { CustomerFormData } from "./schemas/customer.schema";

export async function fetchCustomers(
    params: CustomersQueryParams = {},
): Promise<PaginatedResponse<Customer>> {
    const { data } = await api.get<PaginatedResponse<Customer>>("/customers", {
        params,
    });
    return data;
}

export async function fetchCustomerById(id: string): Promise<Customer> {
    const { data } = await api.get<Customer>(`/customers/${id}`);
    return data;
}

export async function createCustomer(
    body: CustomerFormData,
): Promise<Customer> {
    const { data } = await api.post<Customer>("/customers", body);
    return data;
}

export async function updateCustomer(
    id: string,
    body: CustomerFormData,
): Promise<Customer> {
    const { data } = await api.put<Customer>(`/customers/${id}`, body);
    return data;
}

export async function deleteCustomer(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
}

export async function bulkDeleteCustomers(ids: string[]): Promise<void> {
    await api.delete("/customers/bulk", { data: { ids } });
}
