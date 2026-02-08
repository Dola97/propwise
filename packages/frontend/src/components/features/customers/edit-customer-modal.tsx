'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/modal'
import { CustomerForm, type CustomerFormData } from './customer-form'
import { useUpdateCustomer } from '@/app/hooks/use-customers'
import type { Customer } from '@/types/customer'
import { isInternalCustomer } from '@/types/customer'

interface EditCustomerModalProps {
  open: boolean
  onClose: () => void
  customer: Customer
}

export function EditCustomerModal({
  open,
  onClose,
  customer,
}: EditCustomerModalProps) {
  const updateCustomer = useUpdateCustomer()

  const initialData: CustomerFormData = {
    full_name: customer.full_name,
    email: customer.email,
    phone_number: customer.phone_number,
    national_id: isInternalCustomer(customer)
      ? (customer.national_id ?? '')
      : '',
    internal_notes: isInternalCustomer(customer)
      ? (customer.internal_notes ?? '')
      : '',
  }

  const handleSubmit = useCallback(
    (data: CustomerFormData) => {
      updateCustomer.mutate(
        { id: customer.id, body: data },
        {
          onSuccess: (updatedCustomer) => {
            toast.success(`Customer updated: ${updatedCustomer.full_name}`, {
              id: `customer-updated-${updatedCustomer.id}`,
            })
            onClose()
          },
          onError: () => {
            toast.error('Failed to update customer')
          },
        },
      )
    },
    [updateCustomer, customer.id, onClose],
  )

  return (
    <Modal open={open} onClose={onClose} title="Edit Customer">
      <CustomerForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isPending={updateCustomer.isPending}
        submitLabel="Save Changes"
      />
    </Modal>
  )
}
