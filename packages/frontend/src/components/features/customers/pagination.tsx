'use client'

import type { PaginatedMeta } from '@/types/customer'

interface PaginationProps {
  meta: PaginatedMeta
  onPageChange: (page: number) => void
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  // Derived values — no state needed (rerender-derived-state-no-effect.md)
  const normalizedTotalPages = Math.max(meta.totalPages, 1)
  const hasRows = meta.total > 0
  const hasPrev = hasRows && meta.page > 1
  const hasNext = hasRows && meta.page < normalizedTotalPages
  const startItem = hasRows ? (meta.page - 1) * meta.limit + 1 : 0
  const endItem = hasRows ? Math.min(meta.page * meta.limit, meta.total) : 0

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
      <p className="text-sm text-gray-600">
        Showing {startItem}–{endItem} of {meta.total}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(meta.page - 1)}
          disabled={!hasPrev}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="flex items-center px-3 text-sm text-gray-600">
          {meta.page} / {normalizedTotalPages}
        </span>
        <button
          onClick={() => onPageChange(meta.page + 1)}
          disabled={!hasNext}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
