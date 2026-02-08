'use client'

import { useCustomerEvents } from '@/app/hooks/use-customer-events'

/**
 * Headless component — listens for socket events,
 * shows toasts, and invalidates queries.
 */
export function CustomerEventsListener() {
  useCustomerEvents()
  return null
}