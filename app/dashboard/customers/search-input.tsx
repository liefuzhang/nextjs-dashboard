"use client"

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from "@/components/ui/input"

export default function SearchInput() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <Input
      placeholder="Search customers..."
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get('search')?.toString() || ''}
      className="max-w-sm"
    />
  )
}