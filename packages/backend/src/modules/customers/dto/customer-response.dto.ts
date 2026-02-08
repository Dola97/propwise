/**
 * Public response — NEVER includes sensitive fields.
 * This is the default for all responses without x-internal.
 */
export class CustomerPublicDto {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Internal response — includes sensitive fields.
 * Only returned when x-internal: true is set.
 */
export class CustomerInternalDto extends CustomerPublicDto {
  national_id: string | null;
  internal_notes: string | null;
}
