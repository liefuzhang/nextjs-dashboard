"use client"

import { useState, useEffect } from 'react'
import { CustomerHeaderSkeleton, CustomerCardsSkeleton, CustomerTableSkeleton } from './customer-skeleton'

type ViewType = 'cards' | 'table'

export default function CustomerLoading() {
  const [viewType, setViewType] = useState<ViewType>('cards')

  // Load saved preference from localStorage (same as main component)
  useEffect(() => {
    const saved = localStorage.getItem('customers-view')
    if (saved === 'cards' || saved === 'table') {
      setViewType(saved)
    }
  }, [])

  return (
    <div className="container mx-auto p-8">
      {/* Search input skeleton */}
      <div className="mb-6">
        <div className="relative">
          <div className="h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm">
            <div className="flex items-center">
              <div className="h-4 w-4 mr-2 rounded bg-muted animate-pulse" />
              <div className="h-4 w-32 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Header with controls */}
      <CustomerHeaderSkeleton />

      {/* Content based on view type */}
      {viewType === 'cards' ? (
        <CustomerCardsSkeleton count={6} />
      ) : (
        <CustomerTableSkeleton rows={8} />
      )}
    </div>
  )
}