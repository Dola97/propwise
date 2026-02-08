/**
 * Strips sensitive fields from input immutably.
 * Used on write operations when x-internal is not set.
 */
export const sanitizeForPublicWrite = <
  T extends { national_id?: string | null; internal_notes?: string | null },
>(
  input: T,
): Omit<T, 'national_id' | 'internal_notes'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { national_id, internal_notes, ...safe } = input;
  return safe;
};
