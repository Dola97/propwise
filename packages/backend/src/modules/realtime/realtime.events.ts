export enum CustomerEvent {
  CREATED = 'customer.created',
  UPDATED = 'customer.updated',
  DELETED = 'customer.deleted',
  BULK_DELETED = 'customers.bulk_deleted',
}

/**
 * Socket payloads are ALWAYS non-sensitive.
 * Clients must refetch via HTTP (with or without x-internal)
 * to get full data.
 */
export interface CustomerEventPayload {
  id: string;
  full_name: string;
  email: string;
}

export interface BulkDeleteEventPayload {
  ids: string[];
}
